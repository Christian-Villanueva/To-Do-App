import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateTimePicker from './DateTimePicker';

const EditModal = ({ isVisible, onClose, task, onSave }) => {
  const [editedTask, setEditedTask] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [resetPicker, setResetPicker] = useState(false);

  useEffect(() => {
    if (task) {
      setEditedTask(task.task);
      setEditedDueDate(task.due);
      setResetPicker(false);
    }
  }, [task]);

  const handleSave = () => {
    onSave({ ...task, task: editedTask, due: editedDueDate });
    handleModalClose();
  };

  const handleModalClose = () => {
    onClose();
    setResetPicker(true);
    setEditedTask('');
    setEditedDueDate('');
  };

  return (
    <div className={`modal fade ${isVisible ? 'show' : ''}`}
      id="taskModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1"
      aria-labelledby="taskModalLabel" aria-hidden={!isVisible}
      style={{ display: isVisible ? 'block' : 'none' }}>

      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title">UPDATE TASK!</div>
            <button type="button" className="btn-close" onClick={handleModalClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="modal-label">NEW TASK NAME:</div>
            <input
              type="text"
              className="form-control mb-3"
              id = "edit-input"
              value={editedTask}
              maxLength="30"
              onChange={(e) => setEditedTask(e.target.value)}
              placeholder="Task Name"
            />
            <div className="modal-label-container">
              <div className="modal-label">NEW DUE DATE:</div>
              <DateTimePicker
                onDateTimeChange={setEditedDueDate}
                reset={resetPicker}
                initialDateTime={editedDueDate}
                classNumber={2}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
              <i className="fa fa-xmark" aria-hidden="true"></i> Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              <i className="fa-solid fa-floppy-disk" aria-hidden="true"></i> Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;