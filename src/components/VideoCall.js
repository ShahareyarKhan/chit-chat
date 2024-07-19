import React, { useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const VideoCall = () => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);

    const startCall = async (userEmail) => {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        // Create peer connection
        peerConnection.current = new RTCPeerConnection();
        stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

        // Handle ICE candidates
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice-candidate', { candidate: event.candidate, to: userEmail });
            }
        };

        // Handle remote stream
        peerConnection.current.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        // Create offer
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.emit('offer', { offer, to: userEmail });
    };

    socket.on('offer', async (data) => {
        if (!peerConnection.current) {
            peerConnection.current = new RTCPeerConnection();
            localStream.getTracks().forEach(track => peerConnection.current.addTrack(track, localStream));

            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('ice-candidate', { candidate: event.candidate, to: data.from });
                }
            };

            peerConnection.current.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
                remoteVideoRef.current.srcObject = event.streams[0];
            };
        }

        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('answer', { answer, to: data.from });
    });

    socket.on('answer', async (data) => {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on('ice-candidate', async (data) => {
        try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    });

    return (
        <div>
            <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }}></video>
            <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }}></video>
            <button onClick={() => startCall('recipient@example.com')}>Start Call</button>
        </div>
    );
};

export default VideoCall;
