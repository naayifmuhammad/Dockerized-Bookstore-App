import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  const [token, setToken] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/login' element={<Login setToken={setToken} /> } />
          <Route path='/register' element={<Register /> } />
          </Routes>
            
        </Router>
      </header>
    </div>
  );
}

export default App;
