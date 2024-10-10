import './App.css';
import ToDo from './Pages/ToDo';
import Form from './Pages/Signup';
import Login from './Pages/Login';
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
