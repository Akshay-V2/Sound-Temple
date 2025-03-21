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
    // Handle keyboard navigation
    const handleKeyPress = (event) => {
      if (event.key === "ArrowUp") {
        setSelectedSound(
          (prevSound) => (prevSound - 1 + sounds.length) % sounds.length,
        );
      } else if (event.key === "ArrowDown") {
        setSelectedSound((prevSound) => (prevSound + 1) % sounds.length);
      }
    };

    // Handle scroll navigation
    let lastScrollTime = 0;
    const scrollThreshold = 200; // Milliseconds between scroll events to register
    let prevScrollY = window.scrollY;

    const handleScroll = () => {
      // Throttle scroll events
      const now = Date.now();
      if (now - lastScrollTime < scrollThreshold) return;
      lastScrollTime = now;

      const currentScrollY = window.scrollY;

      // Detect scroll direction
      if (currentScrollY < prevScrollY) {
        // Scrolling up
        setSelectedSound(
          (prevSound) => (prevSound - 1 + sounds.length) % sounds.length,
        );
      } else if (currentScrollY > prevScrollY) {
        // Scrolling down
        setSelectedSound((prevSound) => (prevSound + 1) % sounds.length);
      }

      prevScrollY = currentScrollY;
    };

    // Alternative wheel event handler - often works better for precise control
    const handleWheel = (event) => {
      // Throttle wheel events
      const now = Date.now();
      if (now - lastScrollTime < scrollThreshold) return;
      lastScrollTime = now;

      if (event.deltaY < 0) {
        // Scrolling up
        setSelectedSound(
          (prevSound) => (prevSound - 1 + sounds.length) % sounds.length,
        );
      } else if (event.deltaY > 0) {
        // Scrolling down
        setSelectedSound((prevSound) => (prevSound + 1) % sounds.length);
      }
    };

    // Add event listeners
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });

    // Clean up event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [sounds.length]); // Added sounds.length as a dependency

  useEffect(() => {
    // Handle keyboard navigation for volume
    const handleVolumeChange = (event) => {
      if (event.key === "ArrowRight") {
        updateVolume("forward");
      } else if (event.key === "ArrowLeft") {
        updateVolume("backward");
      }
    };

    // Handle horizontal scroll for volume
    let lastScrollTime = 0;
    const scrollThreshold = 200; // Milliseconds between scroll events
    let prevScrollX = window.scrollX;

    // For horizontal scroll detection
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < scrollThreshold) return;
      lastScrollTime = now;

      const currentScrollX = window.scrollX;

      if (currentScrollX > prevScrollX) {
        // Scrolling right
        updateVolume("forward");
      } else if (currentScrollX < prevScrollX) {
        // Scrolling left
        updateVolume("backward");
      }

      prevScrollX = currentScrollX;
    };

    // Using wheel event for horizontal scrolling (more reliable)
    const handleWheel = (event) => {
      // Check if it's a horizontal scroll
      // Some systems use shift+scroll for horizontal scrolling
      if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        const now = Date.now();
        if (now - lastScrollTime < scrollThreshold) return;
        lastScrollTime = now;

        if (event.deltaX > 0) {
          // Scrolling right
          updateVolume("forward");
        } else if (event.deltaX < 0) {
          // Scrolling left
          updateVolume("backward");
        }
      }
    };

    // Add event listeners
    window.addEventListener("keydown", handleVolumeChange);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleVolumeChange);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [selectedSound]); // Keep selectedSound as a dependency

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
