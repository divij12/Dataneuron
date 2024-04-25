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

  // Handle input changes for add, search and update
  const handleInputChange = (componentKey, value, type) => {
    if (type === 'add') {
      setInputValues(prev => ({ ...prev, [componentKey]: value }));
    } else if (type === 'search') {
      setSearchValues(prev => ({ ...prev, [componentKey]: value }));
    } else if (type === 'update') {
      setUpdateValues(prev => ({ ...prev, [componentKey]: value }));
    }
  };

  // Handle add and update actions
  const handleDataChange = async (type, componentKey) => {
    try {
      let response;
      if (type === 'add') {
        response = await axios.post(`http://localhost:3001/add`, { content: inputValues[componentKey] });
      } else if (type === 'update') {
        response = await axios.post(`http://localhost:3001/updateBySearch`, {
          searchContent: searchValues[componentKey],
          newContent: updateValues[componentKey]
        });
      }
      if (response.status === 200 || response.status === 201) {
        setData(prev => ({ ...prev, [componentKey]: response.data }));
        alert('Data processed successfully');
      } else {
        throw new Error('Failed to process data');
      }
    } catch (error) {
      console.error(`Error during ${type}:`, error);
      alert(`Failed to ${type} data: ${error.message || error}`);
    }
  };

  return (
    <div className="App">
      {['comp1', 'comp2', 'comp3'].map((compKey, index) => (
        <Rnd
          key={compKey}
          style={style}
          default={{
            x: index * 340, // Slightly increased to accommodate padding
            y: 0,
            width: 320,
            height: 200,
          }}
        >
          <input
            type="text"
            value={inputValues[compKey]}
            onChange={(e) => handleInputChange(compKey, e.target.value, 'add')}
            placeholder={`Enter new data for Component ${index + 1}`}
          />
          <button onClick={() => handleDataChange('add', compKey)}>Add</button>
          <input
            type="text"
            value={searchValues[compKey]}
            onChange={(e) => handleInputChange(compKey, e.target.value, 'search')}
            placeholder="Search content to update"
          />
          <input
            type="text"
            value={updateValues[compKey]}
            onChange={(e) => handleInputChange(compKey, e.target.value, 'update')}
            placeholder="New content to update"
          />
          <button onClick={() => handleDataChange('update', compKey)}>Update</button>
          <div>
            <strong>Stored Data:</strong> {JSON.stringify(data[compKey])}
          </div>
        </Rnd>
      ))}
    </div>
  );
}

export default App;
