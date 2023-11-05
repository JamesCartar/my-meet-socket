import React from 'react';
import { HiXMark } from 'react-icons/hi2';

const CenterPopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
      <div className="relative bg-white shadow-lg w-96">
        <div className='flex items-center justify-between mb-5 text-xs'>
          <span className='ml-2 text-gray-600'>Connect Pal</span>
          <HiXMark
            onClick={onClose}
            className="text-gray-500 hover:bg-red-600 hover:text-white text-3xl p-1 transition-all"
            title='close'
          />
        </div>
        
        <div className='px-8 pb-7 pt-2'>{children}</div>
      </div>
    </div>
  );
};

export default CenterPopup;