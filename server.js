const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());
app.use(express.json());



// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'xxxxxxxx',
  database: 'proj',
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database');
    }
  });

// Create an API endpoint to fetch toilet data
app.get('/api/taiwan_toilets', (req, res) => {
  const query = 'SELECT t.name, t.address, t.type2, t.grade, t.country, t.city, t.village, t.latitude, t.longitude, t.type FROM taiwan_toilets t';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.setHeader('Content-Type', 'application/json')
      res.json(results);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.post('/api/taiwan_toilets', (req, res) => {
  const newToilet = req.body; // Assuming you're sending data in the request body

  // Set default values for fields that may be empty or missing
  const defaultValues = {
    country: null,
    city: null,
    village: null,
    admi: null,
    grade: null,
    type2: null,
    type: null,
    id: null,
    name: '無',
  };

  // Merge the newToilet data with default values
  const toiletData = { ...defaultValues, ...newToilet };

  // Handle the insertion of the new toilet data into the database
  db.query('INSERT INTO taiwan_toilets SET ?', toiletData, (err, results) => {
    if (err) {
      console.error('Error adding toilet:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Toilet added successfully');
    }
  });
});

app.delete('/api/taiwan_toilets/:toiletName', (req, res) => {
  const toiletName = req.params.toiletName;

  // Perform the deletion logic here
  const deleteQuery = 'DELETE FROM taiwan_toilets WHERE name = ?';

  db.query(deleteQuery, [toiletName], (err, results) => {
    if (err) {
      console.error('Error deleting toilet:', err);
      res.status(500).send('Internal Server Error');
    } else {
      if (results.affectedRows > 0) {
        res.status(204).send(); // Assuming a successful deletion returns a 204 (No Content) status
      } else {
        res.status(404).send('Toilet not found'); // If no rows were affected, it means the toilet with the given ID was not found
      }
    }
  });
});

