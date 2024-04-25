import React from 'react';
import { Rnd } from 'react-rnd';

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0"
};

function App() {
  return (
    <div className="App">
      <Rnd
        style={style}
        default={{
          x: 0,
          y: 0,
          width: 320,
          height: 200,
        }}
      >
        Component 1
      </Rnd>
      <Rnd
        style={style}
        default={{
          x: 100,
          y: 0,
          width: 320,
          height: 200,
        }}
      >
        Component 2
      </Rnd>
      <Rnd
        style={style}
        default={{
          x: 50,
          y: 0,
          width: 320,
          height: 200,
        }}
      >
        Component 3
      </Rnd>
    </div>
  );
}

export default App;
