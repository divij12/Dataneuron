import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import axios from 'axios';

const style = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
  padding: "10px",
  overflow: "auto"
};

function App() {
  const [inputValues, setInputValues] = useState({ comp1: '', comp2: '', comp3: '' });
  const [searchValues, setSearchValues] = useState({ comp1: '', comp2: '', comp3: '' });
  const [updateValues, setUpdateValues] = useState({ comp1: '', comp2: '', comp3: '' });
  const [data, setData] = useState({});

  // Handle input changes for adding new data and updates
  const handleInputChange = (value, componentKey, type) => {
    if (type === 'add') {
      setInputValues(prev => ({ ...prev, [componentKey]: value }));
    } else if (type === 'search') {
      setSearchValues(prev => ({ ...prev, [componentKey]: value }));
    } else if (type === 'update') {
      setUpdateValues(prev => ({ ...prev, [componentKey]: value }));
    }
  };

  // Handle adding new data
  const handleAddData = async (componentKey) => {
    try {
      const response = await axios.post('http://localhost:3001/add', { content: inputValues[componentKey] });
      if (response.status === 201) {
        setData(prev => ({ ...prev, [componentKey]: response.data }));
        alert('Data added successfully');
      } else {
        throw new Error('Failed to add data');
      }
    } catch (error) {
      console.error(`Error adding data:`, error);
      alert(`Failed to add data: ${error.message || error}`);
    }
  };

  // Handle updating data based on search content
  const handleUpdateData = async (componentKey) => {
    try {
      const response = await axios.post('http://localhost:3001/updateBySearch', {
        searchContent: searchValues[componentKey],
        newContent: updateValues[componentKey]
      });
      if (response.status === 200) {
        setData(prev => ({ ...prev, [componentKey]: response.data }));
        alert('Data updated successfully');
      } else {
        throw new Error('Failed to update data');
      }
    } catch (error) {
      console.error(`Error updating data:`, error);
      alert(`Failed to update data: ${error.message || error}`);
    }
  };

  return (
    <div className="App">
      {['comp1', 'comp2', 'comp3'].map((compKey, index) => (
        <Rnd
          key={compKey}
          style={style}
          default={{
            x: index * 360, // Adjust position to prevent overlap
            y: 0,
            width: 320,
            height: 250,
          }}
        >
          <input
            type="text"
            value={inputValues[compKey]}
            onChange={e => handleInputChange(e.target.value, compKey, 'add')}
            placeholder={`Enter new data for Component ${index + 1}`}
          />
          <button onClick={() => handleAddData(compKey)}>Add</button>
          <input
            type="text"
            value={searchValues[compKey]}
            onChange={e => handleInputChange(e.target.value, compKey, 'search')}
            placeholder="Content to search for update"
          />
          <input
            type="text"
            value={updateValues[compKey]}
            onChange={e => handleInputChange(e.target.value, compKey, 'update')}
            placeholder="New content for update"
          />
          <button onClick={() => handleUpdateData(compKey)}>Update</button>
          <div>
            <strong>Current Data:</strong>
            {data[compKey] ? JSON.stringify(data[compKey]) : 'No data yet.'}
          </div>
        </Rnd>
      ))}
    </div>
  );
}

export default App;
