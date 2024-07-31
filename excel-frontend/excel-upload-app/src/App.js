import React from 'react';
import './App.css';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="App">
      <h1>CSV FILE READER APPLICATION</h1>
      <p className="project-description">
          This project provides a web-based platform for uploading, managing, and editing student data.
          Users can upload CSV files containing student information, which is processed and displayed
          in an interactive table. The system allows for easy updates and modifications to the data
          directly from the frontend.
        </p>
      <FileUpload />
    </div>
  );
}

export default App;
