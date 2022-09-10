const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const csrf = require ("csurf");

const csrfProtection = csrf({ cookie: true });

const app = express();
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// db
mongoose.connect(process.env.DATABASE_LOCAL, {
    useUnifiedTopology: false,
    })
    .then(() => console.log('DataBase Connected'))
    .catch(err => {
        console.log(err);
    });

    const authRoutes = require('./routes/auth');
    const categoryRoutes = require('./routes/category');
    const enseignementRoutes = require('./routes/enseignement')
    const presentationRoutes = require('./routes/presentation')
    const contactRoutes = require('./routes/contact');
    const videosRoutes = require('./routes/videos');
    const bibleRoutes = require('./routes/bible');
    const theologieRoutes = require('./routes/theologie');
    const theologieThemeRoutes = require('./routes/theologieTheme');
    const theologieSousThemeRoutes = require('./routes/theologieSousTheme');

    const corsOptions = {
        origin: "https://basebiblique.org",
        credentials: true,
      }
// middlewares

app.use(cors(corsOptions));
app.use(express.json()) // for parsing application/json
app.use(cookieParser());
app.use(morgan('dev'));
// cors



app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', enseignementRoutes);
app.use('/api', presentationRoutes);
app.use('/api', contactRoutes);
app.use('/api', videosRoutes);
app.use('/api', bibleRoutes);
app.use('/api', theologieRoutes);
app.use('/api', theologieThemeRoutes);
app.use('/api', theologieSousThemeRoutes);

// csrf
app.use(csrfProtection);

// bring routes
app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });
// port
const port = process.env.PORT || 8001;
app.listen(port, () => {
    console.log(`Le port du serveur est ${port}`);
});