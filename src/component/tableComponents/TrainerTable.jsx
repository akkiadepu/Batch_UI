
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TrainerTable.css';
import eventEmitter from './eventEmitter';

function TrainerTable() {
  const [trainers, setTrainers] = useState([]);
  const [editRowId, setEditRowId] = useState(null); 
  const [editData, setEditData] = useState({ id: '', name: '', phone: '', location: '', locationId: '' });
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [nameFilter, setNameFilter] = useState(''); 
  const [locationFilter, setLocationFilter] = useState(''); 
  const [locations, setLocations] = useState([]); 

  const fetchTrainers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/trainers`);
      setTrainers(response.data);
      setFilteredTrainers(response.data); 
      const locationResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/locations`);
      setLocations(locationResponse.data); 
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  useEffect(() => {
    fetchTrainers();
    const handleTrainerAdded = (newTrainer) => {
      setTrainers((prevTrainers) => [...prevTrainers, newTrainer]);
    };

    eventEmitter.on('trainerAdded', handleTrainerAdded);


    return () => {
      eventEmitter.off('trainerAdded', handleTrainerAdded);
    };
  }, []);

  useEffect(() => {
    const filtered = trainers.filter(trainer => {
      const matchesName = nameFilter ? trainer.name.includes(nameFilter) : true;
      const matchesLocation = locationFilter ? trainer.location.name === locationFilter : true;
      return matchesName && matchesLocation;
    });
    setFilteredTrainers(filtered);
  }, [nameFilter, locationFilter, trainers]); 

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setLocationFilter(selectedLocation);
    setNameFilter(''); 

    const filtered = trainers.filter(trainer => trainer.location.name === selectedLocation);
    setFilteredTrainers(filtered);
  };

  const handleNameChange = (e) => {
    const selectedName = e.target.value;
    setNameFilter(selectedName);
    const trainer = trainers.find(trainer => trainer.name === selectedName);
    setLocationFilter(trainer ? trainer.location.name : '');
  };



  const handleEdit = (trainer) => {
    setEditRowId(trainer.id); 
    setEditData({
      id: trainer.id,
      name: trainer.name,
      phone: trainer.phone,
      location: trainer.location.name, 
      locationId: trainer.location.id  
    });
  };

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  
  const handleSave = async (trainerId) => {
    try {
      
      const updatedTrainer = {
        id: editData.id,
        name: editData.name,
        phone: editData.phone,
        location: {
          id: editData.locationId,   
          name: editData.location    
        }
      };


      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/trainers/${trainerId}`, updatedTrainer);

      fetchTrainers();
      setEditRowId(null); 
    } catch (error) {
      console.error('Error updating trainer:', error);
    }
  };

  const handleCancel = () => {
    setEditRowId(null); 
    setEditData({ id: '', name: '', phone: '', location: '', locationId: '' }); 
  };

  // Delete function
  const handleDelete = async (trainerId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/trainers/${trainerId}`);
      console.log('Trainer deleted successfully');
      fetchTrainers(); 
    } catch (error) {
      console.error('Error deleting trainer:', error);
    }
  };

  return (
    <div >
      <h2>Trainer List</h2>
      <div className="table-responsive">
<table border="1" cellPadding="10" cellSpacing="0" className="trainer-table">
        <thead>
          <tr style={{ backgroundColor: '#08d', color: '#fff' }}>
            <th style={{ padding: '10px' }}>
              <select value={nameFilter} onChange={handleNameChange} style={{ color: '#fff', backgroundColor: '#08d', border: '1px solid #08d' }}>
                <option value="">All Names</option>
                {Array.from(new Set(filteredTrainers.map(trainer => trainer.name))).map((name, index) => (
                  <option key={index} value={name} style={{ backgroundColor: '#fff', color: 'black' }}>{name}</option>
                ))}
              </select>
            </th>
            <th>phone number</th>
            <th>
              <select value={locationFilter} onChange={handleLocationChange} style={{ color: '#fff', backgroundColor: '#08d', border: '1px solid #08d' }}>
                <option value="">All Locations</option>
                {Array.from(new Set(filteredTrainers.map(trainer => trainer.location.name))).map((location, index) => (
                  <option key={index} value={location} style={{ backgroundColor: '#fff', color: 'black' }}>{location}</option>
                ))}
              </select>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTrainers.length > 0 ? (
            filteredTrainers.map((trainer) => (
              <tr key={trainer.id} style={{ backgroundColor: '#303245', color: '#eee' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#505357'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#303245'}>
                {editRowId === trainer.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        name="name"
                        className="inputTrainer"
                        value={editData.name}
                        onChange={handleInputChange}
                        style={{
                          color: '#303245',
                          backgroundColor: '#fff',
                          border: '1px solid #08d'
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="phone"
                        className="inputTrainer"
                        value={editData.phone}
                        onChange={handleInputChange}
                        style={{
                          color: '#303245',
                          backgroundColor: '#fff',
                          border: '1px solid #08d'
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="location"
                        className="inputTrainer"
                        value={editData.location}
                        onChange={handleInputChange}
                        style={{
                          color: '#303245',
                          backgroundColor: '#fff',
                          border: '1px solid #08d'
                        }}
                      />
                      <input
                        type="hidden"
                        name="locationId"
                        className="inputTrainer"
                        value={editData.locationId}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSave(trainer.id)} className="btn btn-success" style={{ marginRight: '8px' }}>Save</button>
                      <button onClick={handleCancel} className="btn btn-secondary">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{trainer.name}</td>
                    <td>{trainer.phone}</td>
                    <td>{trainer.location.name}</td>
                    <td>
                      <button onClick={() => handleEdit(trainer)} className='btn btn-primary me-2'>Update</button>
                      {/* <button onClick={() => handleDelete(trainer.id)} className="btn btn-warning">Delete</button> */}
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No trainers available</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default TrainerTable;



