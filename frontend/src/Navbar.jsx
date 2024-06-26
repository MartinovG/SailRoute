import { useState, useEffect } from 'react';
import './Styles/Navbar.css';

export default function Navbar(props) {
  const [totalDistance, setTotalDistance] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [speed, setSpeed] = useState('');
  const [time, setTime] = useState(null);

  const fetchTime = async () => {
    try {
      const response = await fetch('http://localhost:8000/speed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ speed: speed }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTime(data.time);
      console.log('Time: ', data.time);
    } catch (error) {
      console.log('Fetch failed: ', error);
    }
  };

  useEffect(() => {
    fetchTime();
    const eventSource = new EventSource('http://localhost:8000/totalDistance');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTotalDistance(data.totalDistance);
    };
  
    return () => {
      eventSource.close();
    };
  }, []);
  
  const handleSpeedEnter = () => {
    if (props.onSpeed) {
      props.onSpeed(speed);
      fetchTime();
    }
  };

  const handleEnter = () => {
    if (props.onEnter) {
      const startCoordinates = start.split(',').map(Number);
      const endCoordinates = end.split(',').map(Number);
  
      if (startCoordinates.length === 2 && endCoordinates.length === 2) {
        props.onEnter({ lat: startCoordinates[0], lng: startCoordinates[1] }, { lat: endCoordinates[0], lng: endCoordinates[1] });
      }
    }
  };
  
  return (
    <nav className="navbar">
      <div className='navbar-header'>
        <img id="logo" src="/Logo.png" alt="Logo" />
        <h1>SailRoute</h1>
      </div>
      <p id="distance">Total distance: {totalDistance} km</p>
      <p id="time">Time to destination: {time}</p>
      <p>Set speed for boat:</p>
      <input type="text" value={speed} onChange={e => setSpeed(e.target.value)} placeholder="Speed" />
      <button onClick={handleSpeedEnter}>Enter</button>
      <p>Set start and end coordinates for a current:</p>
      <input type="text" value={start} onChange={e => setStart(e.target.value)} placeholder="Start" />
      <input type="text" value={end} onChange={e => setEnd(e.target.value)} placeholder="End" />
      <button onClick={handleEnter}>Enter</button>
    </nav>
  );
}