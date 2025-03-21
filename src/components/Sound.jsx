import React, { useEffect, useState } from "react";

const Sound = (props) => {
  return (
    <>
      <div className="sound-full">
        <div className="sound-name-wrapper">
          <img
            className={
              props.isRunning
                ? "sound-indicator sound-indicator-active"
                : "sound-indicator"
            }
            src="./active_indicator.svg"
          ></img>
          <div
            className={
              props.isActive ? "sound-name sound-active" : "sound-name"
            }
          >
            {props.soundName}
          </div>
        </div>
        <div
          className={
            props.isActive
              ? "volume-changer volume-changer-active"
              : "volume-changer"
          }
        >
          <img className="volume-arrow" src="../public/arrow.svg"></img>
          <div className="volume">{props.volume}%</div>
          <img
            className="volume-arrow"
            src="../public/arrow.svg"
            id="volume-arrow-reverse"
          ></img>
        </div>
      </div>
    </>
  );
};

export default Sound;
