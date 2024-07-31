import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  // Function to handle file changes
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to handle file upload
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error uploading the file', error);
    }
  };

  // Function to handle editing student data
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData(data[index]);
  };

  // Function to handle saving edited data
  const handleSave = async () => {
    const newData = [...data];
    newData[editIndex] = editData;
    setData(newData);
    setEditIndex(null);

    try {
      await axios.put('http://localhost:5000/updateData', { data: newData });
      console.log('Changes saved:', newData);
    } catch (error) {
      console.error('Error saving changes', error);
    }
  };

  // Handle input change
  const handleInputChange = (e, field) => {
    setEditData({
      ...editData,
      [field]: e.target.value
    });
  };

  // Function to render editable fields
  const renderEditableField = (value, field) => {
    return (
      <input
        type="text"
        value={editData[field] || value}
        onChange={(e) => handleInputChange(e, field)}
      />
    );
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Gender</th>
            <th>Subject</th>
            <th>Marks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.student_id}</td>
              <td>
                {editIndex === index
                  ? renderEditableField(row.student_name, 'student_name')
                  : row.student_name}
              </td>
              <td>
                {editIndex === index
                  ? renderEditableField(row.gender, 'gender')
                  : row.gender}
              </td>
              <td>
                {editIndex === index
                  ? renderEditableField(row.subject, 'subject')
                  : row.subject}
              </td>
              <td>
                {editIndex === index
                  ? renderEditableField(row.marks, 'marks')
                  : row.marks}
              </td>
              <td>
                {editIndex === index ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditIndex(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(index)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileUpload;
