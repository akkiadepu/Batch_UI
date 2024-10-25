
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./TrainerStyle.css";
import TrainerTable from './tableComponents/TrainerTable';
import eventEmitter from './tableComponents/eventEmitter';
import Header from './Header';

function TrainerForm() {
  const [trainerData, setTrainerData] = useState({
    name: '',
    phone: '',
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
    setTrainerData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleLocationChange = (e) => {
    setTrainerData(prevState => ({
      ...prevState,
      locationId: e.target.value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (trainerData.name === '' || trainerData.phone === '' || trainerData.locationId === '') {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/trainers`, {
        name: trainerData.name,
        phone: trainerData.phone,
        location: {
          id: trainerData.locationId 
        }
      });

      if (response.status === 200 || response.status === 201) {
        console.log('Trainer added successfully');
        setTrainerData({ name: '', phone: '', locationId: '' }); 
      } else {
        console.error('Failed to add trainer');
      }
      eventEmitter.emit('trainerAdded', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    
    <>
    
       <Header/>
     
       <div className="container mb-5">
       <style>
    {`
      .form-control::placeholder, 
      .form-select::placeholder {
        color: white; /* Set placeholder color to white */
      
      }
    `}
  </style>
      <div className="row">
        
    {/* <div className="d-flex justify-content-center"> */}
  <div className="col-12 col-md-6 mt-5" >
    <div className="t-form-container p-4" style={{backgroundColor: "#15172b",borderRadius: "8px",}}>
      <div className="form1" >
        <h2 className="title text-center" style={{ color: "white" }}>Create Trainer</h2>

        <div className="mb-3">
          {/* <label className="form-label" htmlFor="location"></label> */}
          <select
            className="form-select"
            id="location"
            value={trainerData.locationId}
            onChange={handleLocationChange}
            style={{backgroundColor: "#303245",color: "#fff",border: "none", borderRadius: "5px",padding: "10px"}}
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
          {/* <label className="form-label" htmlFor="name" style={{ color: "white" }}></label> */}
          <input
            type="text"
            className="form-control"
            id="name"
            value={trainerData.name}
            onChange={handleChange}
            placeholder="Enter trainer's name"
            style={{backgroundColor: "#303245",color: "#fff",border: "none", borderRadius: "5px",padding: "10px"}}
          />
        </div>

        <div className="mb-3">
          {/* <label className="form-label" htmlFor="phone"></label> */}
          <input
            type="text"
            className="form-control"
            id="phone"
            value={trainerData.phone}
            onChange={handleChange}
            placeholder="Enter mobile number"
            style={{backgroundColor: "#303245",color: "#fff",border: "none", borderRadius: "5px",padding: "10px"}}
          />
        </div>

        <div className="text-center">
          <button className="btn btn-primary" type="submit" onClick={handleSubmit}
          style={{ backgroundColor: "#08d",color: "#fff", border: "none",padding: "10px 20px",borderRadius: "5px",cursor: "pointer",}}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

   
<div className="d-flex justify-content-center mt-4 mt-md-0">
  <div className="col-12 col-md-12" >
    <div className="table-container">
      <TrainerTable />
    </div>
  </div>
</div>

      </div>
 
      
    </>
  );
}

export default TrainerForm;


