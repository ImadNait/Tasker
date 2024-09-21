import './App.css';
import ToDo from './Components/ToDo';
import Form from './Components/Signup';
import Login from './Components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App(){
 return(<Router>
    <Routes>
      <Route path="/signup" element={<Form />} />
      <Route path="/" element={<Login />} />
      <Route path="/list" element={<ToDo />} />
      </Routes>
      </Router>
 );
}

export default App;
