import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import ReactPlayer from 'react-player'
import "./App.css"


function App() {
	const [ paused, setPaused ] = useState(false)
	const [ seeked, setSeeked ] = useState(0)
	const ref = React.createRef()
	const siema = ref

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("paused", (paused) => {
				setPaused(paused)
			})

			socketRef.current.on("seeked", (seek) => {
				setSeeked(seek)
				siema.current.seekTo(seek)
			})
		
			return () => socketRef.current.disconnect()
		},
		[ paused, seeked ]
	)

	const pauseVideo = () => {
		setPaused(true);
		socketRef.current.emit("paused", true);
	}

	const seekTo = (seek) => {
		console.log(seek)
		setSeeked(seek)
		socketRef.current.emit("seeked", seek)
	}

	const seekNew = (seek) => {
		ref.current.seekTo(seek)
	}

	const playVideo = () => {
		setPaused(false);
		socketRef.current.emit("paused", false);
	}

	return (
		<div className="card">
			<ReactPlayer 
				ref={ref}
				url={'https://www.youtube.com/watch/CgV8omlWq2o?t=' + seeked}
				onPause={pauseVideo}  
				onPlay={playVideo}
				playing={!paused}
				muted="true"
				controls="true"
			/>
			<br />
			<button onClick={() => seekTo(30)}>123</button>
		</div>
	)
}

export default App

