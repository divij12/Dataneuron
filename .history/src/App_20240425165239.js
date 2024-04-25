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
  const [data, setData] = useState({});
  const [addCount, setAddCount] = useState(0); // Counter for add API calls
  const [updateCount, setUpdateCount] = useState(0); // Counter for update API calls

  // Handle input changes for adding new data
  const handleInputChange = (componentKey, value) => {
    setInputValues(prev => ({ ...prev, [componentKey]: value }));
  };

  // Handle adding new data
  const handleAddData = async (componentKey) => {
    try {
      const response = await axios.post('http://localhost:3001/add', { content: inputValues[componentKey] });
      if (response.status === 201) {
        setData(prev => ({ ...prev, [componentKey]: response.data }));
        setAddCount(prev => prev + 1); // Increment add counter
        alert('Data added successfully');
      } else {
        throw new Error('Failed to add data');
      }
    } catch (error) {
      console.error(`Error adding data:`, error);
      alert(`Failed to add data: ${error.message || error}`);
    }
  };

  // Handle updating data by search content
  const handleUpdateData = async (componentKey, newContent) => {
    try {
      const response = await axios.post('http://localhost:3001/updateByContent', {
        searchContent: data[componentKey]?.content,
        newContent
      });
      if (response.status === 200) {
        setData(prev => ({ ...prev, [componentKey]: response.data }));
        setUpdateCount(prev => prev + 1); // Increment update counter
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
            x: index * 360,
            y: 0,
            width: 320,
            height: 250,
          }}
        >
          <input
            type="text"
            value={inputValues[compKey]}
            onChange={e => handleInputChange(compKey, e.target.value)}
            placeholder={`Enter new data for Component ${index + 1}`}
          />
          <button onClick={() => handleAddData(compKey)}>Add</button>
          <input
            type="text"
            value={data[compKey]?.content || ''}
            placeholder="Current content to update"
            onChange={e => handleUpdateData(compKey, e.target.value)}
          />
          <div>
            <strong>Current Data:</strong>
            {data[compKey] ? JSON.stringify(data[compKey]) : 'No data yet.'}
          </div>
        </Rnd>
      ))}
      <div>
        <p>Add Calls Count: {addCount}</p>
        <p>Update Calls Count: {updateCount}</p>
      </div>
    </div>
  );
}

export default App;
