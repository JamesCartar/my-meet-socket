import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';

import peer from '../services/peer';
import { useSocket } from '../context/SocketProvider'
import { getRoomData } from '../services/apiService';
import { getGlobalState, getRoom } from '../redux/slices/globalSlice';

const SampleRoom = () => {
    const socket = useSocket();
    const dispatch = useDispatch();
    const [ myStream, setMyStream ] = useState(null);
    const [ remoteStream, setRemoteStream ] = useState();
    const [ isSomeoneJoin, setIsSomeoneJoin ] = useState(false);
    const { roomId } = useParams();

    const globalData = useSelector(getGlobalState);
    console.log(globalData)

    const handleJoinRoom = (data) => {
        dispatch(getRoom(roomId))

        setIsSomeoneJoin(true)
    }

    const handleCallUser = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setMyStream(stream);

        // Create an offer
        console.log('Creating for admin: ')
        const offer = await peer.getOffer();
        

        socket.emit("user:call", { to: globalData.roomData.participants[globalData.roomData.participants.length - 1], offer });

    };

    const handleIncommingCall = async ({ from, offer }) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        setMyStream(stream);

        const ans = await peer.getAnswer(offer);
        socket.emit('call:accepted', { to: from, ans });
    };

    const sendStreams = () => {
        for (const track of myStream.getTracks()) {
          peer.peer.addTrack(track, myStream);
        }
    };

    const handleCallAccepted = async ({ from, ans }) => {
        await peer.setRemoteDescription(ans);
        sendStreams();
    };

    console.log(globalData)

    const handleNegoNeeded = async () => {
        // console.log('negotiation needed: :)))))))))))))))))))))))))))))')
        const offer = await peer.getOffer();
        console.log('This is the new offer : :)))))))))))))))))))))))))))))', globalData.roomId)
        socket.emit('peer:nego:needed', { offer, to: globalData.roomId })
    };

    const handleIceCandidate = (event) => {
        if (event.candidate) {
            // Send the ICE candidate to the other peer using your signaling server
            socket.emit("ice-candidate", {
                to: globalData.roomData.participants[globalData.roomData.participants.length - 1],
                candidate: event.candidate,
            });
        }
    };

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
        // Add an event listener for ICE candidate generation
        peer.peer.onicecandidate = handleIceCandidate;
        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
            // Remove the ICE candidate event listener when the component unmounts
            peer.peer.onicecandidate = null;
        }
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = async ({ from, offer }) => {
        const ans = await peer.getAnswer(offer);
        console.log('Answering the user"s negotiation from admin: ', ans)
        socket.emit('peer:nego:done', { to: from, ans });
    };

    const handleNegoNeedFinal = async ({ from, ans }) => {
        console.log("User setting to remote desc for the final: ", ans)
        await peer.setRemoteDescription(ans);
    };

    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams[0];
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream);
        });
    }, [remoteStream, myStream]);

    console.log('This is the remote stream: ', remoteStream)
    
    useEffect(() => {
        socket.on("room:join", handleJoinRoom);
        socket.on('incomming:call', handleIncommingCall);
        socket.on('call:accepted', handleCallAccepted);
        socket.on('peer:nego:needed', handleNegoNeedIncomming);
        socket.on('peer:nego:final', handleNegoNeedFinal);

        return () => {
            socket.off("room:join", handleJoinRoom);
            socket.off("incomming:call", handleIncommingCall);
            socket.off('call:accepted', handleCallAccepted);
            socket.off('peer:nego:needed', handleNegoNeedIncomming);
            socket.off('peer:nego:final', handleNegoNeedFinal);
        };
    }, [
        socket,
        handleJoinRoom,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);


    return (
        <div>
            <h1 className=' text-4xl font-mono text-center mt-4'>{globalData.roomData.admin.name}'s Meeting</h1>
            <button onClick={handleCallUser} className='bg-blue-500 text-white px-3 py-2'>Connect</button>
            
            { myStream && <button className='bg-gray-500 text-white px-3 py-2' onClick={sendStreams}>Send Stream</button> }
            <div className='flex '>
                {
                    myStream && 
                    <div className='flex flex-col justify-center'>
                        <h1>Local Stream</h1>
                        <ReactPlayer playing muted width='500px' height='500px' url={myStream} />
                    </div> 
                }
                {
                    remoteStream && 
                    <div className='flex flex-col justify-center'>
                        <h1>Remote Stream</h1><ReactPlayer playing muted width='500px' height='500px' url={remoteStream} />                    
                    </div> 
                }
            </div>
            
        </div>
    )
}

export default SampleRoom