import React, { useRef, useEffect, useState } from 'react';
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';

const socket = io('https://chit-chat-api-lilac.vercel.app', {
  transports: ['websocket'],
  secure: true
});

const CallComponent = ({ user, friend }) => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    // Get media stream for the user's video
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    }).catch(error => console.error('Error accessing media devices.', error));

    // Handle incoming call
    socket.on('callUser', ({ from, signal }) => {
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
    });

    // Handle end of call
    socket.on('endCall', () => {
      setCallEnded(true);
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    });

    // Cleanup on component unmount
    return () => {
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
      socket.off('callUser');
      socket.off('endCall');
    };
  }, []);

  const callUser = (id) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: user._id,
        name: user.name,
      });
    });

    peer.on('stream', (userStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = userStream;
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: caller });
    });

    peer.on('stream', (userStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = userStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    socket.emit('endCall', { to: caller });
  };

  return (
    <div>
      <div>
        {stream && (
          <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
        )}
      </div>
      <div>
        {callAccepted && !callEnded && (
          <video playsInline ref={userVideo} autoPlay style={{ width: '300px' }} />
        )}
      </div>
      <div>
        {receivingCall && !callAccepted ? (
          <div>
            <h1>{caller} is calling...</h1>
            <button onClick={answerCall}>Answer</button>
          </div>
        ) : (
          <button onClick={() => callUser(friend._id)}>Call {friend.name}</button>
        )}
        {callAccepted && !callEnded && (
          <button onClick={leaveCall}>End Call</button>
        )}
      </div>
    </div>
  );
};

export default CallComponent;
