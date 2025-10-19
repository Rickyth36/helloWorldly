import './App.css';
import { Fragment } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Routes>
          {/* Landing without container */}
          <Route path="/" element={<Landing />} />

          {/* Pages inside container */}
          <Route
            path="/login"
            element={
              <section className="container">
                <Login />
              </section>
            }
          />
          <Route
            path="/register"
            element={
              <section className="container">
                <Register />
              </section>
            }
          />
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;
