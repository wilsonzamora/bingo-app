import React from 'react';

interface IModal {
  isOpen: boolean
  onClose: () => void
  yesClick: () => void
  noClick: () => void
  deleteAll?: boolean
}

const Modal = (props: IModal) => {
  const {isOpen, onClose, yesClick, noClick, deleteAll} = props;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2 className="modal-title px-3">
          {deleteAll ? 'Are you sure you want to delete this card?' : 'Are you sure you want to delete your cards?'}
        </h2>
        <div className='w-[80%] flex justify-center space-x-4 mx-auto'>
          <button
            className='px-2 py-[2px] border rounded w-[90px] mt-[10px] bg-[red] hover:bg-[red]/80 text-white'
            onClick={yesClick}
          >
            Yes
          </button>
          <button
            className='px-2 py-[2px] border rounded w-[90px] mt-[10px] bg-[black] hover:bg-[black]/80 text-white'
            onClick={noClick}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;