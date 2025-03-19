import { useEffect, useState } from 'react'
import './App.css'

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



  return (
    <div className='time-wrapper'>
      <div className='time'>{formatTime}</div>

      <div className='ampm-wrapper'>
        <div className='ampm' id='am'>AM</div>
        <div className='ampm' id='pm'>PM</div>

      </div>
      
    </div>
  )
}

export default App
