import React, { useState, useRef, useEffect, useCallback  } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';


import { BsCalendarDate, BsCameraVideo, BsPlusLg, BsArrowUpShort } from 'react-icons/bs';

import landingPageImage from '../assets/images/landingPage.avif'

import { addRoom, emptyError, emptyState, getRoom, joinRoom } from '../redux/slices/globalSlice';
import { getGlobalState } from '../redux/slices/globalSlice';
import CenterPopup from '../components/CreatePopup';
import { useSocket } from '../context/SocketProvider';

function LandingPage() {
  const dispatch = useDispatch();
  const [ userName, setUserName ] = useState('');
  const [ roomId, setRoomId ] = useState('');
  const [isNewMeetingPopupOpen, setNewMeetingPopupOpen] = useState(false);
  const [isJoinMeetingPopupOpen, setJoinMeetingPopupOpen] = useState(false);
  const socket = useSocket();
  
  // const userData = useSelector(selectUsers);
  // console.log('user data: ', userData)

  const inputRef = useRef(null);

  const navigate = useNavigate();

  const globalData = useSelector(getGlobalState);

  useEffect(() => {
    if (isNewMeetingPopupOpen || isJoinMeetingPopupOpen) {
      inputRef.current.focus();
    }
  }, [isNewMeetingPopupOpen, isJoinMeetingPopupOpen]);


  useEffect(() => {
    if(globalData.error) {
      setTimeout(() => {
        dispatch(emptyError());
      }, 2000)
    }
  }, [globalData.error])


  const handleOpenPopup = (popup) => {
    if(popup == 'newMeeting') {
      setNewMeetingPopupOpen(true);
    } else if(popup == 'joinMeeting') {
      setJoinMeetingPopupOpen(true);
    }
    localStorage.clear();
    dispatch(emptyState());
  };

  const handleClosePopup = () => {
    setNewMeetingPopupOpen(false);
    setJoinMeetingPopupOpen(false);

    setUserName('');
    setRoomId('');
    dispatch(emptyError());
  };
  
  const handleStartMeeting = async (e) => {
    e.preventDefault();

    // Dispatch the addRoom action and wait for it to complete
    const roomDataAction = await dispatch(addRoom({ user: { name: userName, socketId: socket.id } }));


      // Check the result of the addRoom action
      if (addRoom.fulfilled.match(roomDataAction)) {
        const roomData = roomDataAction.payload;
        if (roomData) {
          setUserName('');
          setRoomId('');
          setNewMeetingPopupOpen(false);
          setJoinMeetingPopupOpen(false);

          //sending room created event to create the room in socket
          socket.emit('room:create', { user: { name: userName, socketId: socket.id }, roomId: roomData.room._id });

          navigate('/rooms/' + roomData.room._id);
        }
    }
  };

    
  const handleJoinMeeting = async (e) => {
    e.preventDefault();

    const roomDataAction = await dispatch(joinRoom({ user: { name: userName, socketId: socket.id }, roomId }));
    // Check the result of the addRoom action
    if (joinRoom.fulfilled.match(roomDataAction)) {
      const roomData = roomDataAction.payload;
      if (roomData) {
        setUserName('');
        setRoomId('');
        setNewMeetingPopupOpen(false);
        setJoinMeetingPopupOpen(false);
        
        //sending room join event to join the room in socket
        socket.emit('room:join', { user: { socketId: socket.id, name: userName } , roomId: roomData.room._id });

        navigate('/rooms/' + roomData.room._id);
      }
      
    }
    // dispatch(fetch(true))
    // const respondedRoomID = await joinRoom({ user: { name: userName, id: socket.id }, roomId });
    // dispatch(fetch(false))
    
    // if(respondedRoomID) {
    //   const roomData = await getRoomsData(respondedRoomID.roomId);
      
    //   if(roomData) {
    //     const userData = await getUsersData(roomData.admin);

    //     dispatch(addRoom(roomData));
    //     localStorage.setItem('room', JSON.stringify(roomData));
        
    //     dispatch(addUser(userData));
    //     localStorage.setItem('user', JSON.stringify(userData));

    //     setNewMeetingPopupOpen(false)
    //     setJoinMeetingPopupOpen(false)
    //     navigate('/rooms/' + respondedRoomID.roomId);
    //   }
    // }
  }

  return (
    <div className="landing-page bg-dark grid grid-cols-1 md:grid-cols-2 min-h-screen py-10 md:p-0 relative font-sans">
      <CenterPopup isOpen={isNewMeetingPopupOpen} onClose={handleClosePopup}>
        <form onSubmit={handleStartMeeting}>
          <h3 className='text-xl font-bold'>Create Meeting</h3>
          <div className='mt-5 flex flex-col gap-4'>
            <input className='border border-gray-400 rounded-md p-2 focus:outline-none' placeholder='Your Name' onChange={(e) => setUserName(e.target.value)} ref={inputRef} /> 
            {/* <input className=' border border-gray-400 rounded-md p-2 focus:outline-none disabled:bg-gray-200 disabled:text-gray-600' placeholder='Meeting Name' value="afdasdf" disabled />   */}
            { globalData.error && <span className='text-xs ml-1 text-red-500'>{globalData.error}</span> }
          </div>
          <div className='mt-5'>
            <label className='flex items-center gap-2'>
              <input type='checkbox' />
              <span className='text-xs'>Don't connect to audio</span>
            </label>
            <label className='flex items-center gap-2 mt-3'>
              <input type='checkbox' />
              <span className='text-xs'>Turn off my video</span>
            </label>
          </div>
          <div className='flex items-center justify-end gap-3 mt-4'> 
            <button className='text-sm border border-[#385A64] rounded-md px-3 py-1 bg-[#385A64] hover:bg-[#32515a] text-white disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500 font-bold cursor-auto' disabled={!userName || globalData.isLoading ? true : false} type='submit'>
              {globalData.isLoading ? 
              <svg className="animate-spin h-5 w-5 mr-3" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" d="M4 12a8 8 0 018-8V2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
              </svg>
              : 'Create'}</button>
            <button className='text-sm border border-gray-500 rounded-md px-3 py-1 hover:bg-gray-200 cursor-auto' onClick={handleClosePopup} type='button'>Cancel</button>
          </div>
        </form>
      </CenterPopup>
      <CenterPopup isOpen={isJoinMeetingPopupOpen} onClose={handleClosePopup}>
        <form onSubmit={handleJoinMeeting}>
          <h3 className='text-xl font-bold'>Join Meeting</h3>
          <div className='mt-5 flex flex-col gap-4'>
            <input className='border border-gray-400 rounded-md p-2 focus:outline-none' placeholder='Your Name' value={userName} onChange={(e) => setUserName(e.target.value)} ref={inputRef} /> 
            <input className=' border border-gray-400 rounded-md p-2 focus:outline-none' placeholder='Meeting ID' value={roomId} onChange={(e) => setRoomId(e.target.value)} />  
            { globalData.error && <span className='text-xs ml-1 text-red-500'>{globalData.error}</span> }
          </div>
          <div className='mt-5'>
            <label className='flex items-center gap-2'>
              <input type='checkbox' />
              <span className='text-xs'>Don't connect to audio</span>
            </label>
            <label className='flex items-center gap-2 mt-3'>
              <input type='checkbox' />
              <span className='text-xs'>Turn off my video</span>
            </label>
          </div>
          <div className='flex items-center justify-end gap-3 mt-4'> 
            <button className='text-sm border border-[#385A64] rounded-md px-5 py-1 bg-[#385A64] hover:bg-[#32515a] text-white disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500 font-bold cursor-auto' disabled={!userName || !roomId ? true : false} type='submit'>
              {globalData.isLoading ? 
              <svg className="animate-spin h-5 w-5 mr-3" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" d="M4 12a8 8 0 018-8V2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
              </svg>
              : 'Join'}</button>
            <button className='text-sm border border-gray-500 rounded-md px-3 py-1 hover:bg-gray-200 cursor-auto' onClick={handleClosePopup} type='button'>Cancel</button>
          </div>
        </form>
      </CenterPopup>


      <main className='flex flex-col items-center justify-center col-span-1 gap-11 md:order-1 order-2'>
        <div className='flex items-center justify-center gap-12'>
          <div>
            <button className='flex justify-center items-center w-20 h-20 bg-red-400 rounded-3xl mx-auto hover:bg-red-500 hover:bg-opacity-80 transition-all' onClick={() => handleOpenPopup('newMeeting')}>
              <BsCameraVideo className=' font-bold text-white text-4xl' />
            </button>
            <p className='text-center text-sm mt-2'>New Meeting</p>
          </div>             
          <div>
            <button className='flex justify-center items-center w-20 h-20 bg-[#385A64] rounded-3xl mx-auto hover:bg-[#33525c] hover:bg-opacity-80 transition-all' onClick={() => handleOpenPopup('joinMeeting')}>
              <BsPlusLg className=' font-bold text-white text-4xl' />
            </button>
            <p className='text-center text-sm mt-2'>Join</p>
          </div>
        </div>
        <div className='flex items-center gap-12'>
          <div>
            <button className='flex justify-center items-center w-20 h-20 bg-[#385A64] rounded-3xl mx-auto'>
              <BsCalendarDate className=' font-bold text-white text-4xl' />
            </button>
            <p className='text-center text-sm mt-2'>Schedule</p>
          </div>  
          <div>
            <button className='flex justify-center items-center w-20 h-20 bg-[#385A64] rounded-3xl mx-auto'>
              <BsArrowUpShort className=' font-bold text-white text-5xl' />
            </button>
            <p className='text-center text-sm mt-2'>Share screen</p>
          </div>
        </div>
      </main>
      <section className='flex justify-center items-center order-1 md:order-2'>
        <img src={landingPageImage} className=' img-fluid ' />
      </section>
    </div>
  );
}

export default LandingPage;
