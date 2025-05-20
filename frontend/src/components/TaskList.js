 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/main.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tasks');
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="task-list">
      <div className="header">
        <h1>Task Manager</h1>
        <Link to="/add" className="btn">Add New Task</Link>
      </div>
      
      {tasks.length === 0 ? (
        <p className="text-center mt-20">No tasks found. Add your first task!</p>
      ) : (
        tasks.map(task => (
          <div key={task._id} className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>
              Status: <span className={`task-status status-${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
              </span>
            </p>
            <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
            <div className="task-actions">
              <Link to={`/edit/${task._id}`} className="btn btn-secondary">Edit</Link>
              <button onClick={() => handleDelete(task._id)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;