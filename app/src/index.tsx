import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import client from './apolloClient';
import UserProfile from './profilePage';
import LoginPage from './loginPage';
import RegisterPage from './registerPage';
import BoatApp from './BoatComponent';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
     <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Boat" element={<BoatApp />} />
        <Route path="/Home" element={<App />} />
        <Route path="/Client" element={<App />} />

        <Route path="/user/:userId" element={<UserProfile />} />
      </Routes>
    </Router>
  </ApolloProvider>
);
