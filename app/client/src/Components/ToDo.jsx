import "../App.css";
import React, { useState } from "react";

import axios from "axios";
export default function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const clear = document.getElementById("clr");
  let errLabel = document.querySelector(".taskerror");
  const handleAdd= async()=> {

    if (newTask !== "") {
    errLabel.textContent = "";
    setTasks((tasks) => [...tasks, newTask]);
    setNewTask("");
    try{
    if (typeof window !== 'undefined') {

      const token = localStorage.getItem('token');
      console.log(token);
      
    const response = await axios(`http://localhost:4000/users/update/tasks/${token}`,{
    method:'PUT',
    headers:{ 'Content-Type': 'application/json' },
    mode: 'cors',
    data:{ newTask }
    }
    )
    console.log(response.data);
    
    const data = await response.data;
    setTasks([...tasks, data]); 
    console.log(tasks);
    
    setNewTask('');
  }else {
        console.error('localStorage is not available in this environment.');
      }
  }catch(error){
    if (error.response) {
    console.log(error.response);}
    
  }
      
    } else {
      errLabel.textContent = "Enter a task!";
    }
  


  }

  const handleKey = (event) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  function handleUp(index) {
    if (index > 0) {
      const uptasks = [...tasks];
      [uptasks[index], uptasks[index - 1]] = [
        uptasks[index - 1],
        uptasks[index],
      ];
      setTasks(uptasks);
    }
  }
  function handleDown(index) {
    if (index < tasks.length - 1) {
      const downtasks = [...tasks];
      [downtasks[index], downtasks[index + 1]] = [
        downtasks[index + 1],
        downtasks[index],
      ];
      setTasks(downtasks);
    }
  }

  function handleChange(event) {
    setNewTask(event.target.value);
  }  
  function handleDelete(index) {
    const updateList = (tasks) => tasks.filter((_, i) => i !== index);
    setTasks(updateList);
  }
  function clearAll() {
    clear.addEventListener("click", () => {
      errLabel.textContent = ""
      setTasks([]);
    });
  }


    

  return (
    <div className="card">
      <h1>
        <b>Tasker</b>
      </h1>
      <div className="TDL">
        <input
          type="text"
          placeholder="Add a task"
          value={newTask}
          onChange={handleChange}
          className="inputa"
          onKeyPress={handleKey}
        />

        <button onClick={handleAdd} className="addbutton" type="submit">
          <img src="addTask.png" alt=""></img>
        </button>
        <button id="clr" onClick={clearAll}>
          Clear
        </button>
      </div>
      <div className="taskerror"></div>
      <div className="tasks">
        <ol className="ol">
          {tasks.map((task, index) => (
            <li key={index}>
              <input type="checkbox" id="check" />
              <span className="text">{task}</span>
              <button id="edit" onClick={() => handleUp(index)} className="edit">
                <img src="/arrowUp.png" alt=""></img>
              </button>
              <button id="opt" onClick={() => handleDown(index)} className="edit">
                <img src="/arrowDown.png" alt=""></img>
              </button>
              <button id="delete" onClick={() => handleDelete(index)} className="edit">
                <img src="trashCen.png" alt=""></img>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
