import { useEffect, useState } from "react";
import "./App.css";
import Sound from "./components/Sound";

import RainSound from "../public/sounds/rain.mp3";
import ForestSound from "../public/sounds/forest.mp3";
import OceanSound from "../public/sounds/ocean.mp3";
import FireplaceSound from "../public/sounds/fireplace.mp3";
import WindSound from "../public/sounds/wind.mp3";

import uichime from "../public/uichime.mp3";

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

  // Track touch positions for swipe detection
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  // Minimum distance for a swipe to be registered
  const minSwipeDistance = 30;

  useEffect(() => {
    // Handle keyboard navigation (desktop)
    const handleKeyPress = (event) => {
      if (event.key === "ArrowUp") {
        setSelectedSound(
          (prevSound) => (prevSound - 1 + sounds.length) % sounds.length,
        );
      } else if (event.key === "ArrowDown") {
        setSelectedSound((prevSound) => (prevSound + 1) % sounds.length);
      }
    };

    // Handle scroll/wheel navigation (desktop)
    let lastScrollTime = 0;
    const scrollThreshold = 200; // Milliseconds between scroll events to register

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

    // Add event listeners (desktop only)
    if (window.matchMedia("(min-width: 768px)").matches) {
      window.addEventListener("keydown", handleKeyPress);
      window.addEventListener("wheel", handleWheel, { passive: true });
    }

    // Clean up event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [sounds.length]);

  useEffect(() => {
    // Handle keyboard navigation for volume (desktop)
    const handleVolumeChange = (event) => {
      if (event.key === "ArrowRight") {
        updateVolume("forward");
      } else if (event.key === "ArrowLeft") {
        updateVolume("backward");
      }
    };

    // Using wheel event for horizontal scrolling (desktop)
    let lastScrollTime = 0;
    const scrollThreshold = 200;

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

    // Add event listeners (desktop only)
    if (window.matchMedia("(min-width: 768px)").matches) {
      window.addEventListener("keydown", handleVolumeChange);
      window.addEventListener("wheel", handleWheel, { passive: true });
    }

    // Clean up
    return () => {
      window.removeEventListener("keydown", handleVolumeChange);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [selectedSound]);

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    const horizontalDistance = touchStart.x - touchEnd.x;
    const verticalDistance = touchStart.y - touchEnd.y;

    // Determine if the swipe is primarily horizontal or vertical
    if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
      // Horizontal swipe (for volume control)
      if (Math.abs(horizontalDistance) > minSwipeDistance) {
        if (horizontalDistance > 0) {
          // Swipe left
          updateVolume("forward");
        } else {
          // Swipe right
          updateVolume("backward");
        }
      }
    } else {
      // Vertical swipe (for sound selection)
      if (Math.abs(verticalDistance) > minSwipeDistance) {
        if (verticalDistance > 0) {
          // Swipe up
          setSelectedSound(
            (prevSound) => (prevSound + 1 + sounds.length) % sounds.length,
          );
        } else {
          // Swipe down
          setSelectedSound((prevSound) => (prevSound - 1) % sounds.length);
        }
      }
    }

    // Reset touch positions
    setTouchEnd({ x: 0, y: 0 });
  };

  // Add touch event handlers to the component
  useEffect(() => {
    const element =
      document.getElementById("sound-controller") || document.body;

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [touchStart, touchEnd, sounds.length, selectedSound]);

  const [rainAudio] = useState(new Audio(RainSound));
  rainAudio.loop = true;
  const [forestAudio] = useState(new Audio(ForestSound));
  forestAudio.loop = true;
  const [oceanAudio] = useState(new Audio(OceanSound));
  oceanAudio.loop = true;
  const [fireplaceAudio] = useState(new Audio(FireplaceSound));
  fireplaceAudio.loop = true;
  const [windAudio] = useState(new Audio(WindSound));
  windAudio.loop = true;

  useEffect(() => {
    if (sounds[0].volume > 0) {
      rainAudio.play();
    } else {
      rainAudio.pause();
    }
  }, [sounds]);

  useEffect(() => {
    if (sounds[1].volume > 0) {
      forestAudio.play();
    } else {
      forestAudio.pause();
    }
  }, [sounds]);

  useEffect(() => {
    if (sounds[2].volume > 0) {
      oceanAudio.play();
    } else {
      oceanAudio.pause();
    }
  }, [sounds]);

  useEffect(() => {
    if (sounds[3].volume > 0) {
      fireplaceAudio.play();
    } else {
      fireplaceAudio.pause();
    }
  }, [sounds]);

  useEffect(() => {
    if (sounds[4].volume > 0) {
      windAudio.play();
    } else {
      windAudio.pause();
    }
  }, [sounds]);

  useEffect(() => {
    rainAudio.volume = sounds[0].volume / 100;
    forestAudio.volume = sounds[1].volume / 100;
    oceanAudio.volume = sounds[2].volume / 100;
    fireplaceAudio.volume = sounds[3].volume / 100;
    windAudio.volume = sounds[4].volume / 100;
  }, [sounds]);

  const [isInitialized, setIsInitialized] = useState(false);

  const [introChime] = useState(new Audio(uichime));

  const initializeSounds = () => {
    setIsInitialized(true);
    introChime.play();
  };

  useEffect(() => {
    const soundsWrapper = document.querySelector(".sounds-wrapper");
    const style = "translate(0px, " + selectedSound * -24 + "px)";
    soundsWrapper.style.transform = style;
  }, [selectedSound]);

  return (
    <>
      <div
        className={isInitialized ? "initializer initialized" : "initializer"}
        onClick={initializeSounds}
      >
        click to enter your own soundscape
      </div>
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
