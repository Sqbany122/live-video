import React, { createRef, useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import ReactPlayer from 'react-player'
import Controls from "./components/Controls"
import "./App.css"
import SideNav from "./components/SideNav"


const App = () => {
	const [ paused, setPaused ] = useState(false)
	const [ seeked, setSeeked ] = useState(0)
	const [ played, setPlayed ] = useState(0)
	const [ url, setUrl ] = useState(null)
	const [ playedBar, setPlayedBar ] = useState(0)
	const [ duration, setDuration ] = useState(0)
	const [ volume, setVolume ] = useState(0.5)

	const ref = useRef()
	const urlRef = useRef()
	const socketRef = useRef()

	useEffect(() => {
		socketRef.current = io.connect(process.env.REACT_APP_SOCKET_IO_URL + ":" + process.env.REACT_APP_SOCKET_IO_PORT)
		
		socketRef.current.on("seeked", (seek) => {
			setSeeked(seek)
			ref.current.seekTo(seek) 
		})

		socketRef.current.on("urlChange", (url) => {
			setUrl(url)
			setPlayed(0)
			setPlayedBar(0)
			setVolume(0)
			setPaused(false)
		})

		socketRef.current.on("paused", (paused) => {
			setPaused(paused)
		})

		return () => socketRef.current.disconnect()
	}, [ seeked, url, paused ])

 
	const pauseVideo = () => {
		setPaused(true);
		socketRef.current.emit("paused", true);
	}

	const playVideo = () => {
		setPaused(false);
		socketRef.current.emit("paused", false);
	}

	const handleSeekChange = (e) => {
		setSeeked(parseFloat(e.target.value))
		ref.current.seekTo(parseFloat(e.target.value));
		socketRef.current.emit("seeked", parseFloat(e.target.value))
	}

	const handleProgress = (e) => {
		setPlayed(e.playedSeconds);
		setPlayedBar(e.played);
	}

	const handleDuration = (duration) => {
		setDuration(duration);
	}

	const handleChangeVideo = () => {
		setUrl(urlRef.current.value);
		setPaused(false)
		socketRef.current.emit("urlChange", urlRef.current.value)
	}

	const handlePauseStop = (e) => {
		if (paused) {
			playVideo()
		} else {
			pauseVideo()
		}
	} 

	const handleVolumeChange = (e) => {
		setVolume(e.target.value);
	}

	const handleMutePlayer = () => {
		setVolume(0);
	}

	return (
		<>
			<SideNav />
			<div className="mainBox">
				<div className="videoPlayerBox">
					<ReactPlayer 
						ref={ref}
						url={url}
						className="player"  
						playing={!paused}
						style={{ pointerEvents: 'none' }}
						light={false}
						width={'100%'}
						progress={seeked}
						volume={volume}
						onDuration={handleDuration}
						onProgress={(e) => handleProgress(e)}
						config={{
							youtube: {
								playerVars: {
									autohide: 1
								},
							},
						}}
					/>
					<Controls 
						played={played} 
						paused={paused}
						playedBar={playedBar} 
						duration={duration}
						volume={volume}
						handleSeekChange={handleSeekChange}
						handlePauseStop={handlePauseStop}
						handleVolumeChange={handleVolumeChange}
						handleMutePlayer={handleMutePlayer}
					/>
				</div>
				<div className="rightBox">
					<div className="actionBox">
						<div className="videoInputLink">
							<input ref={urlRef} type="text" />
							<button onClick={handleChangeVideo}>Napoczynaj</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default App

