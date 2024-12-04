const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const logRoutes = require('./routes/logRoutes');  
const pyqRoutes = require('./routes/pyqRoutes');

const port = process.env.PORT || 3000;
const FrontendURL = process.env.FRONTEND_URL;

const app = express();

// Connecting to the database 
connectDB();

// Middlewares 
app.use(express.json());
app.use(cors({
  origin: '*', 
  credentials: true, 
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.SECURITY, sameSite: 'Lax' } // Change secure to true in production
}));

// Routes
app.get('/', (req, res) => {
  res.send('NoteBin Server is running ...');
});

app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/file', fileRoutes);
app.use('/api/v1/pyq', pyqRoutes);
app.use('/api/v1/log', logRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
