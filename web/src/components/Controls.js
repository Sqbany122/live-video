import React from "react"
import Duration from "../Duration"
import { FaPause, FaPlay } from 'react-icons/fa'
import { ImVolumeMedium, ImVolumeMute2 } from 'react-icons/im'
import { RiFullscreenFill } from 'react-icons/ri'

const Controls = ({
    played, 
    paused,
    playedBar,
    duration,
    volume,
    handleSeekChange,
    handlePauseStop,
    handleVolumeChange,
    handleMutePlayer
}) => {
    return (
        <div className="controls">
            <div className="pauseStopControlls" onClick={handlePauseStop}>
                {paused ? (
                    <FaPlay />
                ) : (
                    <FaPause />
                )}
            </div>
            <div className="controllsTime">
                <Duration seconds={played} /> {"/"} <Duration seconds={duration} />
            </div>
            <div className="progressBar">
                <input
                    type='range' min={0} max={0.999999} step='any'
                    value={playedBar}
                    onChange={(e) => handleSeekChange(e)}
                />
            </div>
            <div className="controllsRight">
                <div className="controllsVolume">
                    {volume == 0 ? (
                        <ImVolumeMute2/>
                    ) : (
                        <ImVolumeMedium onClick={handleMutePlayer} />
                    )}
                    <input type="range" min={0} max={1} step={0.1} value={volume} onChange={handleVolumeChange} />
                </div>
                <RiFullscreenFill />
            </div>
        </div>
    );
}

export default Controls;