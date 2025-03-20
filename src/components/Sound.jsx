import React, { useEffect, useState } from "react";

const Sound = (props) => {
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        const handleVolume = (event) => {
            if (event.key == "ArrowRight") {
                setVolume(prevVol => prevVol > 99 ? 100 : prevVol + 10);
            } else if (event.key == "ArrowLeft") {
                setVolume(prevVol => prevVol < 1 ? 0 : prevVol - 10);
            }
        }

        window.addEventListener('keydown', handleVolume);

        return () => {
            window.removeEventListener('keydown', handleVolume);
        }
    }, [])
    
    return(
        <>
        <div className="sound-full">
            <div className="sound-name-wrapper">
                <img className={props.isRunning ? "sound-indicator sound-indicator-active" : "sound-indicator"} src="./active_indicator.svg"></img>
                <div className={props.isActive ? "sound-name sound-active" : "sound-name"}>{props.soundName}</div>
            </div>
            <div className={props.isActive ? "volume-changer volume-changer-active" : "volume-changer"}>
                <img className="volume-arrow" src="../public/arrow.svg"></img>
                <div className="volume">{volume}%</div>
                <img className="volume-arrow" src="../public/arrow.svg" id="volume-arrow-reverse"></img>
            </div>
        </div>

        </>
    );
}

export default Sound;