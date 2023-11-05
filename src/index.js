import React from 'react';
import ReactDOM from 'react-dom/client';
import firebase from 'firebase/compat/app';
import { BrowserRouter as Router } from 'react-router-dom';
import 'firebase/compat/database';

import './main.css';

// import '../node_modules/bootstrap/dist/css/bootstrap.css';
// import './styles/custom-bootstrap.scss';

import store from './redux/store';

import App from './App';
import { Provider } from 'react-redux';
import { SocketProvider } from './context/SocketProvider';

const firebaseConfig = {
  apiKey: "AIzaSyBAlZhDSZ2X1x-v8kk9omsy6-KeqV-INHA",
  authDomain: "meet-1fa4e.firebaseapp.com",
  databaseURL: "https://meet-1fa4e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "meet-1fa4e",
  storageBucket: "meet-1fa4e.appspot.com",
  messagingSenderId: "53230852866",
  appId: "1:53230852866:web:0cdf0c213f45146efd401b",
};

const app = firebase.initializeApp(firebaseConfig);
const database = app.database();

// Verify the connection
const connectedRef = database.ref('.info/connected');

connectedRef.on('value', (snapshot) => {
  if (snapshot.val() === true) {
    // console.log('Firebase Realtime Database is connected');
  } else {
    // console.log('Firebase Realtime Database is not connected');
  }
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SocketProvider>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </SocketProvider>
);
