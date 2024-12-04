import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UserTablePage from './pages/UsersPage';


const HomePage: React.FC = () => (
  <div style={{ padding: '20px' }}>
    <h1>Welcome to My Application</h1>
    <p>This is the home page.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div
        style={{
          paddingTop: '64px', // Ensure content appears below the header
          display: 'flex',    // Enable Flexbox
          flexDirection: 'column',
          justifyContent: 'top', // Center content vertically
          alignItems: 'center',     // Center content horizontally
          minHeight: '100vh',       // Full viewport height
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserTablePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
