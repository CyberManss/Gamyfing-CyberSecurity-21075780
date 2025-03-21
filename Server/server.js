const express = require('express');
const bodyParser = require('body-parser'); 
const { Client } = require('pg');  
const bcrypt = require('bcryptjs');
const path = require('path'); 

const app = express();
const port = 3000;

// middleware to form data
app.use(bodyParser.urlencoded({ extended: true }));

// push static css file
app.use(express.static(path.join(__dirname, 'public')));

// Connection to my sql database Postgresql17
const dbClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'ekononovs1',  
    database: 'cyber_data',  
});

dbClient.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

// Push the registration form
app.get('/signup', (req, res) => {
    res.sendFile(path.join('/Volumes/PRJECTCYBER/NetworkGameProject', 'register.html'));  // Correct path to register.html
});

// submission handling
app.post('/register', async (req, res) => {
    const { 'first-name': firstName, 'second-name': secondName, dob, email, school, password } = req.body;

    // Hashing the password before adding to database
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
        text: 'INSERT INTO users(first_name, second_name, dob, email, school, password) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
        values: [firstName, secondName, dob, email, school, hashedPassword],
    };

    try {
        const result = await dbClient.query(query);
        console.log(result.rows[0]);  // Logging the new user information

        res.send('Registration Successful!'); 
    } catch (error) {
        console.error(error);
        res.send('Error in registration');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
