import { useEffect, useState } from 'react'
import './App.css'
import Sound from './components/Sound';

function App() {
  const [time, setTime] = useState(new Date());
  const [formatTime, setFormatTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      const formattedTime = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).replace(/AM|PM/, '');
      setFormatTime(formattedTime);

      if (time.getHours() >= 0) {
        document.getElementById('am').classList.add('time-active');
        document.getElementById('pm').classList.remove('time-active');
      } else {
        document.getElementById('pm').classList.add('time-active');
        document.getElementById('am').classList.remove('time-active');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

const sounds = ["Rain", "Classroom", "Birds"];
const [selectedSound, setSelectedSound] = useState(0);
const [volume, setVolume] = useState(0);

useEffect(() => {
  const handleKeyPress = (event) => {
    if (event.key === 'ArrowUp') {
      setSelectedSound(prevSound => (prevSound - 1 + sounds.length) % sounds.length);
    } else if (event.key === 'ArrowDown') {
      setSelectedSound(prevSound => (prevSound + 1) % sounds.length);
    }
  };
  window.addEventListener('keydown', handleKeyPress);

  return () => {
    window.removeEventListener('keydown', handleKeyPress);
  };
}, []);

  return (
    <>
    <div className='time-wrapper'>
      <div className='time'>{formatTime}</div>

      <div className='ampm-wrapper'>
        <div className='ampm' id='am'>AM</div>
        <div className='ampm' id='pm'>PM</div>

      </div>
      
    </div>

    <div className='sounds-wrapper'>
      {sounds.map((sound, index) => (
        <Sound key={index} soundName={sound} isActive={index === selectedSound} isRunning={false}/>
      ))}
    </div>
    </>
  )
}

export default App
