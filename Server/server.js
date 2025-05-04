const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views')); // Folder where your .ejs files are stored
app.set('view engine', 'ejs'); // Use EJS as the templating engine

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// (CSS, JS, assets) static files from the root directory
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// session management 
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// connection to my PostgreSQL 
const dbClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'ekononovs1',
    database: 'cyber_data',
});

dbClient.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

// login page serving
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

// register page serving
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'register.html'));
});

// student dashboard(inedx.html)
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// registry acceptance 
app.post('/register', async (req, res) => {
    const { 'first-name': firstName, 'second-name': secondName, dob, email, school, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
        text: 'INSERT INTO users(first_name, second_name, dob, email, school, password, role) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        values: [firstName, secondName, dob, email, school, hashedPassword, role],
    };

    try {
        const result = await dbClient.query(query);
        res.send('Registration Successful!');
    } catch (error) {
        console.error(error);
        res.send('Error in registration');
    }
});

// log in form handling 
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const query = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
    };

    try {
        const result = await dbClient.query(query);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.id;
                req.session.role = user.role;
                req.session.email = user.email;

                if (user.role === 'teacher') {
                    res.redirect('/teacher-dashboard');
                } else {
                    res.redirect('/index.html');  // route for the students to access dashboard
                }
            } else {
                res.status(401).send('Invalid password');
            }
        } else {
            res.status(401).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login');
    }
});

// route handling
app.get('/', (req, res) => {
    res.redirect('/login');  // Redirect to the login page when in root
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Teacher dashboard route
app.get('/teacher-dashboard', async (req, res) => {
    if (!req.session.userId || req.session.role !== 'teacher') {
        return res.status(403).send('Access denied');
    }

    const teacherEmail = req.session.email; // Assuming email is stored in session
    const domain = teacherEmail.split('@')[1];

    try {
        // Querying the users table to fetch students' details along with their scores
        const result = await dbClient.query(
            `SELECT id, first_name, second_name, email, school, score
             FROM users
             WHERE email LIKE $1 AND role = 'student'`,
            [`%${domain}`]
        );
        const students = result.rows;
        res.render('teacherindex', { students });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving students');
    }
});


