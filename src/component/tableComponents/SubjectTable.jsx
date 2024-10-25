
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SubjectTable.css';
import eventEmitter from './eventEmitter';

function SubjectTable() {
    const [subjects, setSubjects] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [subjectFilter, setSubjectFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [filteredSubjectNames, setFilteredSubjectNames] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [editData, setEditData] = useState({ id: '', name: '', location: '', locationId: '' });


    const fetchSubjectsAndLocations = async () => {
        try {
            const subjectResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/subjects`);
            setSubjects(subjectResponse.data);
            setFilteredSubjects(subjectResponse.data);
            setFilteredSubjectNames(subjectResponse.data.map(subject => subject.name));

            const locationResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/locations`);
            setLocations(locationResponse.data);
            setFilteredLocations(locationResponse.data.map(location => location.name));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchSubjectsAndLocations();
    }, []);

    useEffect(() => {
        const handleSubjectAdded = (newSubject) => {
            const formattedSubject = {
                ...newSubject,

            };

            setSubjects((prevSubjects) => [...prevSubjects, formattedSubject]);
            setFilteredSubjects((prevFilteredSubjects) => [...prevFilteredSubjects, formattedSubject]);
        };

        eventEmitter.on('subjectAdded', handleSubjectAdded);

        return () => {
            eventEmitter.off('subjectAdded', handleSubjectAdded);
        };
    }, []);


    const handleSubjectFilterChange = (e) => {
        const selectedSubject = e.target.value;
        setSubjectFilter(selectedSubject);
        filterBoth(selectedSubject, locationFilter);
    };

    const handleLocationFilterChange = (e) => {
        const selectedLocation = e.target.value;
        setLocationFilter(selectedLocation);
        filterBoth(subjectFilter, selectedLocation);
    };


    const filterBoth = (selectedSubject, selectedLocation) => {
        let filtered = subjects;

        if (selectedSubject) {
            filtered = filtered.filter(subject => subject.name === selectedSubject);
        }

        const locsFromFilteredSubjects = selectedSubject
            ? [...new Set(filtered.map(subject => subject.location.name))]
            : locations.map(loc => loc.name);

        setFilteredLocations(locsFromFilteredSubjects);


        filtered = filtered.filter(subject => !selectedLocation || subject.location.name === selectedLocation);


        const subsFromSelectedLocation = selectedLocation
            ? [...new Set(subjects.filter(subject => subject.location.name === selectedLocation).map(subject => subject.name))]
            : subjects.map(subject => subject.name);

        setFilteredSubjectNames(subsFromSelectedLocation);
        setFilteredSubjects(filtered);
    };

    const handleEdit = (subject) => {
        setEditRowId(subject.id);
        setEditData({
            id: subject.id,
            name: subject.name,
            location: subject.location.name,
            locationId: subject.location.id
        });
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value,
        });
    };


    const handleSave = async () => {
        try {

            const updatedSubject = {
                id: editData.id,
                name: editData.name,
                location: {
                    id: editData.locationId,
                    name: editData.location
                }
            };
            console.log("ID to update:", editRowId);
            console.log("Data being sent:", updatedSubject);

            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/subjects/${editRowId}`, updatedSubject);

            setEditRowId(null);
            fetchSubjectsAndLocations();
        } catch (error) {
            console.error('Error updating subject:', error);
        }
    };


    const handleCancel = () => {
        setEditRowId(null);
        setEditData({ id: '', name: '', location: '', locationId: '' });
    };


    const handleDelete = async (subjectId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/subjects/${subjectId}`);
            console.log('Subject deleted successfully');
            fetchSubjectsAndLocations();
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    return (
        <div>
             <div className="table-responsive1">
              <h2>Subject List</h2>
            <table border="1" cellPadding="10" cellSpacing="0" className="subject-table">
                <thead>
                    <tr style={{ backgroundColor: '#08d', color: '#fff' }}>
                        <th >
                            <select value={subjectFilter} onChange={handleSubjectFilterChange} style={{ color: '#fff', backgroundColor: '#08d', border: '1px solid #08d' }}>
                                <option value="">All Subjects</option>
                                {filteredSubjectNames.map((subjectName, index) => (
                                    <option key={index} value={subjectName} style={{ backgroundColor: '#fff', color: 'black' }}>{subjectName}</option>
                                ))}
                            </select>
                        </th>
                        <th>
                            <select value={locationFilter} onChange={handleLocationFilterChange} style={{ color: '#fff', backgroundColor: '#08d', border: '1px solid #08d' }}>
                                <option value="">All Locations</option>
                                {filteredLocations.map((location, index) => (
                                    <option key={index} value={location} style={{ backgroundColor: '#fff', color: 'black' }}>{location}</option>
                                ))}
                            </select>
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSubjects.map(subject => (
                        <tr key={subject.id} style={{ backgroundColor: '#303245', color: '#eee' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#505357'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#303245'}>
                            {editRowId === subject.id ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            name="name"
                                            className='inputSubject'
                                            value={editData.name}
                                            onChange={handleInputChange}
                                            required
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
                                            className='inputSubject'
                                            value={editData.location}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                color: '#303245',
                                                backgroundColor: '#fff',
                                                border: '1px solid #08d'
                                              }}
                                        />
                                        <input
                                            type="hidden"
                                            name="locationId"
                                            className='inputSubject'
                                            value={editData.locationId}
                                          
                                        />
                                    </td>
                                    <td>
                                        <button type="button" onClick={handleSave} className="btn btn-success" style={{ marginRight: '5px' }}>Save</button>
                                        <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{subject.name}</td>
                                    <td>{subject.location.name}</td>
                                    <td>
                                        <button onClick={() => handleEdit(subject)} className='btn btn-primary me-2'>Update</button>
                                        {/* <button onClick={() => handleDelete(subject.id)} className="btn btn-warning">Delete</button> */}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    );
}

export default SubjectTable;













