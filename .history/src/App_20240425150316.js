import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import axios from 'axios';

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0",
  overflow: "auto"
};

function App() {
  const [searchValues, setSearchValues] = useState({ comp1: '', comp2: '', comp3: '' });
  const [updateValues, setUpdateValues] = useState({ comp1: '', comp2: '', comp3: '' });
  const [data, setData] = useState({});

  const handleInputChange = (key, value, type) => {
    if (type === 'search') {
      setSearchValues(prev => ({ ...prev, [key]: value }));
    } else {
      setUpdateValues(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleUpdate = async (componentKey) => {
    try {
      const response = await axios.post(`http://localhost:3001/updateBySearch`, {
        searchContent: searchValues[componentKey],
        newContent: updateValues[componentKey]
      });
      setData(prev => ({ ...prev, [componentKey]: response.data }));
      alert('Data updated successfully');
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
            x: index * 320,
            y: 0,
            width: 320,
            height: 200,
          }}
        >
          <input
            type="text"
            value={searchValues[compKey]}
            onChange={e => handleInputChange(compKey, e.target.value, 'search')}
            placeholder="Search content"
          />
          <input
            type="text"
            value={updateValues[compKey]}
            onChange={e => handleInputChange(compKey, e.target.value, 'update')}
            placeholder="New content"
          />
          <button onClick={() => handleUpdate(compKey)}>Update</button>
          <div>
            <strong>Updated Data:</strong> {JSON.stringify(data[compKey])}
          </div>
        </Rnd>
      ))}
    </div>
  );
}

export default App;
