import React from "react";

const Sound = (props) => {
    return(
        <>
        <div className="sound-name-wrapper">
            <img className={props.isRunning ? "sound-indicator sound-indicator-active" : "sound-indicator"} src="../public/active_indicator.svg"></img>
            <div className={props.isActive ? "sound-name sound-active" : "sound-name"}>{props.soundName}</div>
        </div>
        </>
    );
}

export default Sound;