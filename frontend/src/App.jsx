import React, { useState, useEffect } from "react";
import './Styles/App.css';
import MapContainer from './Map';
import Navbar from "./Navbar";

function App() {

    const [steps, setSteps] = useState([]);
    const [currSteps, setCurrSteps] = useState([]);
    const [coordinates, setCoordinates] = useState({ start: null, end: null });
    const [speed, setSpeed] = useState(null);

    const handleEnter = (start, end) => {
    setCoordinates({ start, end });
    handleCurrent(start, end);
  };

    const handleSpeedEnter = (speed) => {
      setSpeed(speed);
      handleSpeed(speed);
    };

  const handleClickedMarkers = (clickedMarkers) => {
    fetch('http://localhost:8000/clicked-markers', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clickedMarkers),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      const formattedSteps = data.steps.map(step => ({
        lat: step.x, 
        lng: step.y
      }));
      setSteps(formattedSteps);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleCurrent = (start, end) => {
    fetch('http://localhost:8000/distance', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([ start, end ]),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      const formattedSteps = data.steps.map(step => ({
        lat: step.x, 
        lng: step.y
      }));
      setCurrSteps(formattedSteps);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleSpeed = (speed) => {
    fetch('http://localhost:8000/speed', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ speed }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="App">
      <MapContainer steps={steps} currSteps={currSteps} coordinates={coordinates} onMarkerClick={handleClickedMarkers} />
      <Navbar onEnter={handleEnter} onSpeed={handleSpeedEnter}/> 
    </div>
  );
}

export default App;