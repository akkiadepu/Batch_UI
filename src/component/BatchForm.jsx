
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./TrainerStyle.css";
import BatchTable from './tableComponents/BatchTable';
import eventEmitter from './tableComponents/eventEmitter';
import Header from './Header';


function BatchForm() {
  const [batchData, setBatchData] = useState({
    name: '',
    batchStartDate: '',
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
    setBatchData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleLocationChange = (e) => {
    setBatchData(prevState => ({
      ...prevState,
      locationId: e.target.value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (batchData.name === '' || batchData.batchStartDate === '' || batchData.locationId === '') {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/batches`, {
        name: batchData.name,
        startDate: batchData.batchStartDate, 
        location: {
          id: batchData.locationId 
        }
      });


      if (response.status === 200 || response.status === 201) {
        console.log('Batch added successfully');
        setBatchData({ name: '', batchStartDate: '', locationId: '' });
      } else {
        console.error('Failed to add batch');
      }
      eventEmitter.emit('batchAdded', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (


<div >
<Header/>
<div className="container" >


< div className='row'>

<div className="col-12 col-md-6 mt-5" style={{ backgroundColor: "#15172b", color: "white", padding: "20px",borderRadius: "8px" }} >
<h2 className="title m-3" style={{fontSize:"30px", color: "white" }}>Create Batch</h2>
<style>
      {`
        #name::placeholder {
          color: white; /* For all input placeholders */
        }
      `}
    </style>
        <form onSubmit={handleSubmit}>
         
          <div className="input-container ic3" style={{ marginTop: "10px" }}>
            <select
              className="input form-select"
              id="location"
              value={batchData.locationId}
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

          <div className="input-container ic1">
          <label
              htmlFor="startDate"
              style={{
                color: "white",
                paddingBottom: "10px",
                display: "block",
              }}
            >
            </label>
            <input
              type="text"
              className="input form-control"
              id="name"
              value={batchData.name}
              onChange={handleChange}
              placeholder="Enter batch name"
              style={{
                backgroundColor: "#303245",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "10px",
              }}
            
            />
          </div>

          <div className="input-container ic2">
            <label
              htmlFor="startDate"
              style={{
                color: "white",
                paddingBottom: "10px",
                display: "block",
              }}
            >
              Start date
            </label>
            <input
              type="date"
              className="input form-control"
              id="batchStartDate"
              value={batchData.batchStartDate} 
              onChange={handleChange}
              style={{
                backgroundColor: "#303245",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "10px",
              }}
            />
            
          </div>

       
          <button
            className="submit btn btn-primary mt-3"
            type="submit"
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
        </form>
      </div>

<div className="table-container table-responsive mt-4">
<BatchTable />
</div>

</div>

</div>

</div>
  );
}

export default BatchForm;

