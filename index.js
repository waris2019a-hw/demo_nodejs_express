const express = require('express');
const app = express();
const port = 3000; // You can specify any port you prefer

const fs = require('fs');

// Data to write to the file
const dataToWrite = 'This is some text to write to the file.';

// Serve the HTML form
app.use(express.static('public'));

app.post('/saveUserData', express.json(), (req, res) => {
  const newUserData = req.body;

  // Read existing data from the JSON file
  fs.readFile('userdata.json', 'utf8', (readErr, existingData) => {
    if (readErr) {
      console.error('Error reading user data file:', readErr);
      res.status(500).json({ error: 'Error reading user data' });
      return;
    }

    let userDataArray = [];

    try {
      // Parse the existing JSON data into an array
      userDataArray = JSON.parse(existingData);
      
      // Ensure userDataArray is an array; if not, initialize it as an empty array
      if (!Array.isArray(userDataArray)) {
        userDataArray = [];
      }
    } catch (parseError) {
      console.error('Error parsing existing user data:', parseError);
    }

    // Append the new user data to the existing array
    userDataArray.push(newUserData);

    // Write the updated data back to the JSON file
    fs.writeFile('userdata.json', JSON.stringify(userDataArray, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error saving user data:', writeErr);
        res.status(500).json({ error: 'Error saving user data' });
        return;
      }

      res.json({ message: 'User data saved successfully' });
    });
  });
});

// Handle requests to get user data
app.get('/getUserData', (req, res) => {
  fs.readFile('userdata.json', 'utf8', (readErr, data) => {
    if (readErr) {
      console.error('Error reading user data file:', readErr);
      res.status(500).json({ error: 'Error reading user data' });
      return;
    }

    let userDataArray = [];

    try {
      // Parse the JSON data into an array
      userDataArray = JSON.parse(data);
      
      // Ensure userDataArray is an array; if not, initialize it as an empty array
      if (!Array.isArray(userDataArray)) {
        userDataArray = [];
      }
    } catch (parseError) {
      console.error('Error parsing user data:', parseError);
    }

    res.json(userDataArray);
  });
});

// Define a route to serve an HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
