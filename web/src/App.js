import React, { createRef, useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import ReactPlayer from 'react-player'
import Duration from "./Duration"
import "./App.css"


function App() {
	const [ paused, setPaused ] = useState(false)
	const [ seeked, setSeeked ] = useState(0)
	const [ played, setPlayed ] = useState(0)
	const [ url, setUrl ] = useState(null)
	const [ playedBar, setPlayedBar ] = useState(0)
	
	const ref = useRef()
	const urlRef = useRef()
	const socketRef = useRef()
	console.log(ref.current)
	useEffect(() => {
		socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("seeked", (seek) => {
				setSeeked(seek)
			})

			socketRef.current.on("urlChange", (url) => {
				setUrl(url)
			})

			ref.current.seekTo(seeked) 
		
			return () => true
	}, [ seeked, url ])

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000")
			
			socketRef.current.on("paused", (paused) => {
				setPaused(paused)
			})
		
			return () => true
		},
		[ paused ]
	)

	const pauseVideo = () => {
		setPaused(true);
		socketRef.current.emit("paused", true);
	}

	const playVideo = () => {
		setPaused(false);
		socketRef.current.emit("paused", false);
	}

	const handleSeekChange = (e) => {
		ref.current.seekTo(parseFloat(e.target.value));
		setSeeked(parseFloat(e.target.value))
		socketRef.current.emit("seeked", parseFloat(e.target.value))
	}

	const handleProgress = (e) => {
		setPlayed(e.playedSeconds);
		setPlayedBar(e.played);
	}

	const handleChangeVideo = () => {
		console.log(urlRef.current.value)
		setUrl(urlRef.current.value);
		socketRef.current.emit("urlChange", urlRef.current.value)
	}

	return (
		<div class="videoPlayer">
			<div className="card">
				<div className="videoInputLink">
					<input ref={urlRef} type="text" />
					<button onClick={handleChangeVideo}>Odpol</button>
				</div>
				<ReactPlayer 
					ref={ref}
					url={url}
					onPause={pauseVideo}  
					onPlay={playVideo}
					playing={!paused}
					light={false}
					progress={seeked}
					width={'1280px'}
					height={'720px'}
					volume={0.5}
					onProgress={(e) => handleProgress(e)}
					config={{
						youtube: {
							playerVars: {
								autohide: 1
							},
						},
					}}
				/>
				<div className="controls">
					<Duration className="playedTime" seconds={played} /><br />
					<input
						className="timeBar" type='range' min={0} max={0.999999} step='any'
						value={playedBar}
						onChange={(e) => handleSeekChange(e)}
					/>
					<Duration className="duration" seconds={1223} />
				</div>
			</div>
		</div>
	)
}

export default App

