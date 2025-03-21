import { useEffect, useState } from "react";
import "./App.css";
import Sound from "./components/Sound";

function App() {
  const [time, setTime] = useState(new Date());
  const [formatTime, setFormatTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      const formattedTime = time
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })
        .replace(/AM|PM/, "");
      setFormatTime(formattedTime);

      if (time.getHours() > 12) {
        document.getElementById("pm").classList.add("time-active");
        document.getElementById("am").classList.remove("time-active");
      } else {
        document.getElementById("am").classList.add("time-active");
        document.getElementById("pm").classList.remove("time-active");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [sounds, setSounds] = useState([
    { sound: "Rain", volume: 0 },
    { sound: "Forest", volume: 0 },
    { sound: "Ocean", volume: 0 },
    { sound: "Fireplace", volume: 0 },
    { sound: "Wind", volume: 0 },
  ]);
  const [selectedSound, setSelectedSound] = useState(0);

  const updateVolume = (updateDirection) => {
    const newArray = [...sounds];

    if (updateDirection === "forward") {
      newArray[selectedSound].volume = Math.min(
        newArray[selectedSound].volume + 10,
        100,
      );
    } else if (updateDirection === "backward") {
      newArray[selectedSound].volume = Math.max(
        newArray[selectedSound].volume - 10,
        0,
      );
    }

    setSounds(newArray);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowUp") {
        setSelectedSound(
          (prevSound) => (prevSound - 1 + sounds.length) % sounds.length,
        );
      } else if (event.key === "ArrowDown") {
        setSelectedSound((prevSound) => (prevSound + 1) % sounds.length);
      }
    };
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const handleVolumeChange = (event) => {
      if (event.key === "ArrowRight") {
        updateVolume("forward");
      } else if (event.key === "ArrowLeft") {
        updateVolume("backward");
      }
    };
    window.addEventListener("keydown", handleVolumeChange);
    return () => {
      window.removeEventListener("keydown", handleVolumeChange);
    };
  }, [selectedSound]);

  return (
    <>
      <div className="time-wrapper">
        <div className="time">{formatTime}</div>

        <div className="ampm-wrapper">
          <div className="ampm" id="am">
            AM
          </div>
          <div className="ampm" id="pm">
            PM
          </div>
        </div>
      </div>

      <div className="sounds-wrapper">
        {sounds.map((sound, index) => (
          <Sound
            key={index}
            soundName={sound.sound}
            isActive={index === selectedSound}
            isRunning={sound.volume > 0 ? true : false}
            volume={sound.volume}
          />
        ))}
      </div>
    </>
  );
}

export default App;
