const express = require('express');
const multer = require('multer');
const csv = require('csvtojson');
const cors = require('cors');
const mysql = require('mysql');
const fs = require('fs');


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'excel_upload'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const jsonArray = await csv().fromFile(filePath);

    // Log the JSON data to the terminal
    console.log(JSON.stringify(jsonArray, null, 2));

    // Insert data into the database
    jsonArray.forEach(row => {
      const { student_id, student_name, gender, subject, marks } = row;
      const query = 'INSERT INTO students (student_id, student_name, gender, subject, marks) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [student_id, student_name, gender, subject, marks], (err, result) => {
        if (err) throw err;
      });
    });

    // Send JSON data back to the frontend
    res.json(jsonArray);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

  } catch (error) {
    console.error('Error processing the file', error);
    res.status(500).send('Error processing the file');
  }
});

app.post('/update', (req, res) => {
  const { student_id, student_name, gender, subject, marks } = req.body;

  const query = 'UPDATE students SET student_name = ?, gender = ?, subject = ?, marks = ? WHERE student_id = ?';
  db.query(query, [student_name, gender, subject, marks, student_id], async (err, result) => {
    if (err) {
      console.error('Error updating the database', err);
      return res.status(500).send('Error updating the database');
    }

    // Retrieve updated data from the database
    db.query('SELECT * FROM students', (err, rows) => {
      if (err) {
        console.error('Error fetching data from database', err);
        return res.status(500).send('Error fetching data from database');
      }

      // Convert JSON data to CSV
      const csvData = json2csv(rows);
      fs.writeFileSync('uploads/updated_data.csv', csvData);

      res.send('Data updated successfully');
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
