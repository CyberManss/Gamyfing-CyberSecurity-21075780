const express = require('express');
const bodyParser = require('body-parser'); // Corrected spelling for bodyParser
const { Client } = require('pg');  // Import the Client class, not client
const bcrypt = require('bcryptjs');
const path = require('path'); // You missed importing the path module

const app = express();
const port = 3000;

// Form data from middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static CSS file (assuming it's in a folder named 'public')
app.use(express.static(path.join(__dirname, 'public')));

// Connection to PostgreSQL database
const dbClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'ekononovs1',  // Replace with your PostgreSQL username
    database: 'cyber_data',  // Your database name
});

dbClient.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

// Serve the registration form
app.get('/signup', (req, res) => {
    res.sendFile(path.join('/Volumes/PRJECTCYBER/NetworkGameProject', 'register.html'));  // Correct path to register.html
});

// Handle form submission
app.post('/register', async (req, res) => {
    const { 'first-name': firstName, 'second-name': secondName, dob, email, school, password } = req.body;

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
        text: 'INSERT INTO users(first_name, second_name, dob, email, school, password) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
        values: [firstName, secondName, dob, email, school, hashedPassword],
    };

    try {
        const result = await dbClient.query(query);
        console.log(result.rows[0]);  // Log the new user info

        res.send('Registration Successful!');  // Or redirect to a login page, etc.
    } catch (error) {
        console.error(error);
        res.send('Error in registration');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
