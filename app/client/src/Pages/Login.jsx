import '../Form.css';
import { useState } from 'react';
import axios from 'axios'
export default function Login(){
  const [userData, setUserData] = useState({
    credentials:'',
    password:''
  })

  const handleChange = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
  };

  

  const handleSubmit = async (event) =>{
    event.preventDefault();
    try {
    console.log(userData)
    const response = await axios({
        method: 'POST',
        url:'/users/login', 
        headers:{ 'Content-Type': 'application/json' },
        mode:'cors',
        data: JSON.stringify(userData)
        });
    console.log(response)
    const data = response.data;
    setUserData(data)
    if (data) {
      localStorage.setItem('user',JSON.stringify(data))
      localStorage.setItem('id',userData._id)
      console.log(`${data.credentials} has logged in!`);
      window.location.href = '/list';
    } else if(data.errors) {    
        console.log(data.errors);
        }
        } 
    catch(error){
      const divErr = error.response.data.errs
      console.log(divErr);

      const errorDivs = document.querySelectorAll('.error');  
      errorDivs.forEach(div => div.textContent = '');          
      for (const [field, message] of Object.entries(divErr)) {
        const errorDiv = document.querySelector(`.${field}.error`); 
        if (errorDiv) {
          errorDiv.textContent = message;                           
        }
      }
   
    }



    }

    return(
        <div className="Form">
        <form action="" method="post" className='form'>
        <h1>Login</h1>
        <label>Username or email:</label>
        <input type="text" name='credentials' onChange={handleChange}/>
        <div className="credentials error"></div>
        <label>Password:</label>
        <input type="password" name='password' onChange={handleChange}/>
        <div className="password error"></div>
        <div className="sendTo">
        Don't have an account? go <a href="/signup">signup</a>
        </div>
        <br />
        <button type='submit' onClick={handleSubmit}>Login</button>

        </form>

        </div>
    );
}
