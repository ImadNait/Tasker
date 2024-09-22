import '../Form.css';
import { useState } from 'react';
import axios from 'axios';
export default function Form(){
  const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        tasks:[]
      });
    

  const handleChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
      };


  const handleSubmit = async (event)=>{
      event.preventDefault();
      try {
        console.log(userData)
          const response = await axios({
            method: 'POST',
            url:'/users/signup',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            data: JSON.stringify(userData), 
      
            });
          console.log(response)
          const data = response.data;
          setUserData(data)
          if (response.status) {
            localStorage.setItem('user', JSON.stringify(data))
            localStorage.setItem('id',data.id)
            console.log('New user created:', data);
            window.location.href = '/list';
          } else if(data.errors) {
              console.log(data.errors)
              }

        }
      catch (error){
      const divErr = error.response.data.errors
      console.log(divErr);
      const errorDivs = document.querySelectorAll('.error');  
      errorDivs.forEach(div => div.textContent = '');        

      for (const [field, message] of Object.entries(error.response.data.errors)) {         
        const errorDiv = document.querySelector(`.${field}.error`);    
        if (errorDiv) {
          errorDiv.textContent = message;                              
          }
        } 
      
      
          }
    }
    
    return(
        <div className="Form">
        <form action="/signup" className='form' method="post">
        <h1>Sign Up</h1>
        <label>Username:</label>
        <input type="name" name='username' onChange={handleChange} className='username'/>
        <div className="username error"></div>
        <label>Email:</label>
        <input type="email" name='email' onChange={handleChange} className='email'/>
        <div className="email error"></div>
        <label>Password:</label>
        <input type="password" name='password' onChange={handleChange} className='password'/>
        <div className="password error"></div>
        <div className="sendTo">
            Already have an account? go <a href="/">login</a>  
        </div>
        <br />
        <button onClick={handleSubmit} type='submit'>Sign up</button>

        </form>

        </div>
    );
}
