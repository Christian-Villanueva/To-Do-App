import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const DeleteConfirmation = ({ show, handleClose, handleConfirm, task, deleteAllType }) => {
  const renderModalBody = () => {
    if (task) {
      return <><span style={{ color: "rgb(50, 50, 50)"}}>Are you sure you want to <b>DELETE THIS TASK?</b></span><strong>{task?.task}</strong></>;
    }
    if (deleteAllType === 'pending') {
      return <><span style={{ color: "rgb(50, 50, 50)"}}>Are you sure you want to <b>DELETE ALL PENDING TASK?</b></span></>;
    }
    if (deleteAllType === 'completed') {
      return <><span style={{ color: "rgb(50, 50, 50)"}}>Are you sure you want to <b>DELETE ALL COMPLETED TASK?</b></span></>;
    }
    return null;
  };

  return (
    <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="delete-modal">DELETE CONFIRMATION!</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {renderModalBody()}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}><i className="fa fa-xmark" aria-hidden="true"></i> Close</button>
            <button type="button" className="btn btn-danger" onClick={handleConfirm}><i className="fa fa-trash-can" aria-hidden="true"></i> Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;