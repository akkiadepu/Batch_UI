
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./TrainerStyle.css";
import SubjectTable from './tableComponents/SubjectTable';
import eventEmitter from './tableComponents/eventEmitter';
import Header from './Header';

function SubjectForm() {
  const [subjectData, setSubjectData] = useState({
    name: '',
    locationId: ''
  });

  const [locations, setLocations] = useState([]); 

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/locations`);
        setLocations(response.data); 
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
 
  }, []);

  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSubjectData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleLocationChange = (e) => {
    setSubjectData(prevState => ({
      ...prevState,
      locationId: e.target.value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (subjectData.name === '' || subjectData.locationId === '') {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/subjects`, {
        name: subjectData.name,
        location: {
          id: subjectData.locationId 
        }
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Subject added successfully');
      
        setSubjectData({ name: '', locationId: '' });
       
      } else {
        console.error('Failed to add subject');
      }
      eventEmitter.emit('subjectAdded', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    <Header/>
    
<div className='container'>
<div className='row'>

    <div className="col-12 col-md-6 col-lg-4 mt-5" >
      <div className="form-container p-4">
        <div className="form1">
          <h2 className="title text-center">Create Subject</h2>
          <form onSubmit={handleSubmit}>
          <div className="mb-3">
              {/* <label className="form-label" htmlFor="location"></label> */}
              <select
                className="form-select"
                id="location"
                value={subjectData.locationId}
                onChange={handleLocationChange}
                style={{
                  backgroundColor: "#303245",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px",
                }}
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              {/* <label className="form-label" htmlFor="name"></label> */}
              <input
                type="text"
                className="form-control"
                id="name"
                value={subjectData.name}
                onChange={handleChange}
                placeholder="Enter subject name"
                style={{
                  backgroundColor: "#303245",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px",
                }}
              />
            </div>

  
            <div className="text-center">
              <button className="btn btn-primary" type="submit"
              style={{
                backgroundColor: "#08d",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <style>
    {`
      .form-container {
        background-color: #15172b;
        padding: 20px;
        border-radius: 8px;
      }
      .form1 .title {
        color: white;
      }
      .form-select::placeholder,
      .form-control::placeholder {
        color: white;
      }
      input, select {
        color: white;
      }
    `}
  </style>
</div>

 
<div className='row'>
    <div className="col-12 col-md-6">
      <div className="table-container">
        <SubjectTable />
    </div>
  </div>
  </div>


</div>

    </>
  );
}

export default SubjectForm;

