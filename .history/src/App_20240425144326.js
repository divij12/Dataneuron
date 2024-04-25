import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import axios from 'axios';

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
  overflow: "auto" // Ensures text does not overflow the component boundaries
};

function App() {
  const [inputValues, setInputValues] = useState({ comp1: '', comp2: '', comp3: '' });
  const [data, setData] = useState({});

  // Handler for input changes
  const handleInputChange = (componentKey, value) => {
    setInputValues({ ...inputValues, [componentKey]: value });
  };

  // Function to handle adding/updating data
  const handleDataChange = async (type, componentKey) => {
    try {
      const content = { content: inputValues[componentKey] };
      const response = await axios.post(`http://localhost:3001/${type}`, content);
      if (response.status === 201 || response.status === 200) {
        setData({ ...data, [componentKey]: response.data });
        alert('Data processed successfully');
      } else {
        throw new Error('Failed to process data');
      }
    } catch (error) {
      console.error(`Error during ${type}:`, error);
      alert(`Failed to ${type} data: ${error.message || error}`);
    }
  };

  function UpdateByContentComponent() {
    const [searchContent, setSearchContent] = useState('');
    const [newContent, setNewContent] = useState('');
    const [message, setMessage] = useState('');
  
    const handleUpdate = async () => {
      try {
        const response = await axios.post('http://localhost:3001/updateByContent', {
          searchContent,
          newContent
        });
        setMessage('Update successful: ' + JSON.stringify(response.data));
      } catch (error) {
        console.error('Update failed:', error);
        setMessage('Update failed: ' + (error.response?.data?.message || error.message));
      }
    };

  return (
    <div className="App">
      {['comp1', 'comp2', 'comp3'].map((compKey, index) => (
        <Rnd
          key={compKey}
          style={style}
          default={{
            x: index * 320, // Positions each component next to each other
            y: 0,
            width: 320,
            height: 200,
          }}
        >
          <input
            type="text"
            value={inputValues[compKey]}
            onChange={(e) => handleInputChange(compKey, e.target.value)}
            placeholder={`Enter data for Component ${index + 1}`}
          />
          <button onClick={() => handleDataChange('add', compKey)}>Add</button>
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
