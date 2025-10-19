import './App.css';
import { Fragment } from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Alert from './components/layout/Alert';

// Redux
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          {/* Alerts can be outside Routes */}
          <Alert />

          {/* Routes */}
          <Routes>
            {/* Landing without container */}
            <Route path="/" element={<Landing />} />

            {/* Pages inside container */}
            <Route
              path="/login"
              element={
                <div className="container">
                  <Login />
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div className="container">
                  <Register />
                </div>
              }
            />
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
