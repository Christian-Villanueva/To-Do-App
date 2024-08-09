import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import LexMeet from './LexMeet.png'
import Icon from './To-Do.png'
import '@fortawesome/fontawesome-free/css/all.min.css';
import DateTimeCurrent from './Components/DateTimeCurrent'
import DateTimePicker from './Components/DateTimePicker'
import EditModal from './Components/EditModal';
import DeleteConfirmation from './Components/DeleteConfirmation';

function App() {

  const [taskName, setTaskName] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [dueDateTime, setDueDateTime] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [resetPicker, setResetPicker] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteAllModalVisible, setDeleteAllModalVisible] = useState(false);
  const [deleteAllType, setDeleteAllType] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [noPendingTasks, setNoPendingTasks] = useState(false);
  const [noCompletedTasks, setNoCompletedTasks] = useState(false);

  useState(() => {
    const taskStorage = localStorage.getItem("ITEMS");
    if (taskStorage) {
      setTaskList(JSON.parse(taskStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("ITEMS", JSON.stringify(taskList));
    setFilteredTasks(taskList);
    setNoPendingTasks(!taskList.some(task => !task.completed));
    setNoCompletedTasks(!taskList.some(task => task.completed));
  }, [taskList]);

  const getData = (event) => {
    setTaskName(event.target.value);
    console.log(event.target.value);
  };

  const addTask = () => {
    if (taskName.length === 0 || dueDateTime.length === 0) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }
    const dateTime = DateTimeCurrent(); 
    setTaskList(currentTaskList => {
        return [...currentTaskList, { id: crypto.randomUUID(), task: taskName, created: dateTime, due: dueDateTime, done: '', completed: false }];
    });
    setTaskName('');
    setDueDateTime('');
    setResetPicker(true);
    setTimeout(() => setResetPicker(false), 0);
    console.log(taskList);
  };

  function toggleTask (id, completed) {
    setTaskList(taskList => {
      return taskList.map(element => {
        if (element.id === id) {
          return {...element, completed, done: completed ? DateTimeCurrent() : "" }
        }
        return element
      })
    })
  }

  const deleteTask = (id) => {
    setTaskList(currentTaskList => {
      return currentTaskList.filter(element => element.id !== id)
    })
    setDeleteModalVisible(false);
  }

  const doneAllTask = () => {
    const dateTime = DateTimeCurrent();
    setTaskList(taskList.map(element => ({
      ...element,
      completed: true,
      done: dateTime
    })));
  };

  const undoneAllTask = () => {
    setTaskList(taskList.map(element => ({
      ...element,
      completed: false
    })));
  };

  const deletePending = () => {
    setTaskList(taskList.filter(task => task.completed));
    setDeleteAllModalVisible(false);
  };

  const deleteCompleted = () => {
    setTaskList(taskList.filter(task => !task.completed));
    setDeleteAllModalVisible(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTask();
      event.preventDefault();
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  const handleEditClick = (task) => {
    setEditTask(task);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditTask(null);
  };

  const handleModalSave = (updatedTask) => {
    setTaskList(taskList.map(task => task.id === updatedTask.id ? updatedTask : task));
    console.log(taskList);
    handleModalClose();
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    deleteTask(taskToDelete.id);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalVisible(false);
    setTaskToDelete(null);
  };

  const handleDeleteAllClick = (type) => {
    if (type === 'pending' && taskList.some(task => !task.completed)) {
      setDeleteAllType('pending');
      setDeleteAllModalVisible(true);
    } else if (type === 'completed' && taskList.some(task => task.completed)) {
      setDeleteAllType('completed');
      setDeleteAllModalVisible(true);
    } else {
      console.log(`No ${type === 'pending' ? 'pending' : 'completed'} tasks to delete.`);
    }
  };

  const handleDeleteAllConfirm = () => {
    if (deleteAllType === 'pending') {
      deletePending();
    } else if (deleteAllType === 'completed') {
      deleteCompleted();
    }
  };

  const handleDeleteAllModalClose = () => {
    setDeleteAllModalVisible(false);
    setDeleteAllType(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    filterTasks(event.target.value);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      filterTasks(searchQuery);
      event.preventDefault();
    }
  };

  const filterTasks = (query) => {
    const filtered = taskList.filter(task => task.task.toLowerCase().includes(query.toLowerCase()));
    setFilteredTasks(filtered);
  };

  return (
    <>
      <div className="App">
        {/* ALERT COMPONENT */}
          <div className={`alert ${showAlert ? 'show showAlert' : 'hide'}`}>
            <span className="fas fa-exclamation-circle"></span>
            <span className="msg">Task Name & Deadline is Required!</span>
            <div className="close-btn" onClick={() => setShowAlert(false)}>
              <span className="fas fa-times"></span>
            </div>
          </div>

        {/* HEADER */}
        <hr className="line" id="horizontal"/>
        <hr className="line" id="vertical1"/>
        <hr className="line" id="vertical2"/>
        <hr className="line" id="vertical3"/>

        {noPendingTasks && (
          <div className="no-pending">
            <i className="fa-regular fa-calendar-check"></i> NO PENDING TASK!
          </div>
        )}
        {noCompletedTasks && (
          <div className="no-completed">
            <i className="fa-regular fa-hourglass-half"></i> NO COMPLETED TASK!
          </div>
        )}

        <button className="search-button" onClick={() => filterTasks(searchQuery)}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <div className="row header">
          <div className="col align-items-center">
            <form className="well form-search" onSubmit={(e) => { e.preventDefault(); filterTasks(searchQuery); }}>
              <input type="text" className="search" placeholder="Search task . . ."
                value={searchQuery} onChange={handleSearchChange} onKeyDown={handleSearchKeyPress}
              /> 
            </form>
          </div>
          <div className="col justify-content-center align-items-center">
            <img src={Icon} alt="To-Do List" className="icon-img-resize"/>
          </div>
          <div className="col justify-content-end align-items-baseline">
            <img src={LexMeet} alt="LexMeet" className="logo-img-resize"/>
          </div>
        </div>

        {/* TASK LISK AND COMPLETED TASK LABEL */}
        <div className="row label">
          <div className="col label-only">
            <h1><b>TASK LIST!</b></h1>
            <div className="col label-input">
              <button className="all" onClick={doneAllTask}><i className="fa fa-list-check" aria-hidden="true"></i> Done All</button>
              <button className="all" onClick={() => handleDeleteAllClick('pending')}><i className="fa fa-trash-can" aria-hidden="true"></i> Delete All</button>
            </div>
          </div>
          <div className="col label-only justify-content-flex-start"><h1><b>COMPLETED TASK!</b></h1>
            <div className="col label-input">
            <button className="all" onClick={undoneAllTask}><i className="fa fa-arrow-rotate-right" aria-hidden="true"></i> Undone All</button>
              <button className="all" onClick={() => handleDeleteAllClick('completed')}><i className="fa fa-trash-can" aria-hidden="true"></i> Delete All</button>
            </div>
          </div>
        </div>

        {/* ADD TASK INPUT */}
        <div className="row label">
          <form className="col custom">
            <div className="input-group">
              <input type="text" className="taskInput" onChange={getData} onKeyDown={handleKeyPress} value={taskName} maxLength="30" placeholder="Add a task . . ."/>
              <DateTimePicker
                onDateTimeChange={setDueDateTime}
                reset={resetPicker}
                classNumber={1}
              />
              <button type="button" className="add-button" onClick={addTask}><i className="fa-solid fa-add"></i></button>
            </div>
          </form>
          <div className="col custom">
            <div className="bar-code">
              <i className="fa-solid fa-barcode"></i><i className="fa-solid fa-barcode"></i>
              <i className="fa-solid fa-barcode"></i><i className="fa-solid fa-barcode"></i>
              <i className="fa-solid fa-barcode"></i><i className="fa-solid fa-barcode"></i>
              <i className="fa-solid fa-barcode"></i><i className="fa-solid fa-barcode"></i>
              <i className="fa-solid fa-barcode"></i><i className="fa-solid fa-barcode"></i>
            </div>
          </div>
        </div>
        
        {/* PENDING AND COMPLETED TASKS LIST */}
        <div className="row content">
          {/* PENDING TASKS LIST */}
          <div className="col taskList">
            {filteredTasks.map((element) => (
              !element.completed && (
                <div className={0 % 2 === 0 ? 'taskFrame-odd': 'taskFrame-even'} key={element.id}>
                  <div className="col checkbox">
                    <input type="checkbox" className="checkbox-style" completed={element.completed}
                      onChange={e => {toggleTask(element.id, e.target.checked);
                      console.log(element.id, element.completed);
                    }}/>
                  </div>
                  <div className="taskname-due">
                    <div className="col taskName">{truncateText(element.task,30)}</div>
                    <div className="col deadline">
                      Due Date: {element.due}
                    </div>
                  </div>
                  <div className="edit-date">
                    <div className="col edit-delete">
                      <button className="modify-pending-button" onClick={() => handleEditClick(element)}>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                      </button>
                      <button className="modify-pending-button" onClick={() => handleDeleteClick(element)}>
                        <i className="fa fa-trash-can" aria-hidden="true"></i>
                      </button>
                    </div>
                    <div className="col date-created-frame">
                      <div className="date-created">
                        Date Created: {element.created}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
          
          {/* COMPLETED TASKS LIST */}
          <div className="col taskList">
            {filteredTasks.map((element) => (
              element.completed && (
                <div className={0 % 2 === 0 ? 'doneTaskFrame-odd': 'doneTaskFrame-even'} key={element.id}>
                  <div className="col checkbox">
                    <input type="checkbox" completed={element.completed} checked="checked"
                      onChange={e => {toggleTask(element.id, e.target.checked);
                      console.log(element.id, element.completed);
                    }}/>
                  </div>
                  <div className="taskname-due">
                    <div className="col taskName"><strike>{truncateText(element.task,10)}</strike></div>
                    <div className="col deadline">
                      Due Date: {element.due}
                    </div>
                  </div>
                  <div className="edit-date">
                    <div className="col edit-delete">
                      <button className="modify-completed-button" onClick={() => handleDeleteClick(element)}>
                        <i className="fa fa-trash-can" aria-hidden="true"></i>
                      </button>
                    </div>
                    <div className="col date-created-frame">
                      <div className="done-date-created">
                        Date Finished: {element.done}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* EDIT MODAL COMPONENT */}
        <EditModal
          isVisible={modalVisible}
          onClose={handleModalClose}
          task={editTask}
          onSave={handleModalSave}
        />

        {/* DELETE CONFIRMATION MODAL COMPONENT */}
        <DeleteConfirmation
          show={deleteModalVisible}
          handleClose={handleDeleteModalClose}
          handleConfirm={handleDeleteConfirm}
          task={taskToDelete}
        />
        
        {/* DELETE ALL CONFIRMATION MODAL COMPONENT */}
        <DeleteConfirmation
          show={deleteAllModalVisible}
          handleClose={handleDeleteAllModalClose}
          handleConfirm={handleDeleteAllConfirm}
          deleteAllType={deleteAllType}
        />
      </div>
    </>
  )
}

export default App
