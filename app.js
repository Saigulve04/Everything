import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import session from 'express-session';
import { mainPool, sellerPool, initializeDatabases } from './DATABASE/db.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import jobAuth from './ROUTES/authenRoutes.js';
import jobSeeker from './ROUTES/jobSeekerRoutes.js';
import jobCreator from './ROUTES/jobCreatorRoutes.js';
import jobProfile from './ROUTES/profileRoutes.js';
import admin from './ROUTES/adminRoutes.js';
import creatorAuth from './ROUTES/recruiterAuthenRoutes.js';
import productRoutes from './ROUTES/productRoutes.js';

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/function', express.static(path.join(__dirname, 'FUNCTION')));
app.use('/public', express.static(path.join(__dirname, 'PUBLIC')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// View Engine
app.set('views', path.join(__dirname, 'VIEWS'));
app.set('view engine', 'ejs');

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Main Routes
app.use('/jobSeeker', jobAuth);
app.use('/jobSeeker', jobSeeker);
app.use('/jobSeeker', jobProfile);
app.use('/jobCreator', creatorAuth);
app.use('/jobCreator', jobCreator);
app.use('/admin', admin);

// Seller Routes
app.use('/api/products', productRoutes);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'VIEWS', 'applicant', 'openningPage.html'));
});

app.get('/homepage', async (req, res, next) => {
  if (!mainPool) {
    return next(new Error('Database connection failed'));
  }

  try {
    const popularJobs = `
      SELECT jd.*
      FROM job_details jd
      JOIN (
        SELECT job_id, COUNT(application_id) AS application_count
        FROM job_applications
        GROUP BY job_id
        ORDER BY application_count DESC
        LIMIT 6
      ) top_jobs ON jd.job_id = top_jobs.job_id;
    `;

    const [result] = await mainPool.query(popularJobs);

    res.render('applicant/applicant_homepage', {
      r2: result,
      isLogged: req.session.loggedIn,
      toastNotification: null
    });
  } catch (err) {
    next(err);
  }
});

// Initialize databases and start server
try {
  await initializeDatabases();
  const MAIN_PORT = process.env.MAIN_PORT || 3200;
  app.listen(MAIN_PORT, () => {
    console.log(`Main server started on http://localhost:${MAIN_PORT}`);
  });
} catch (err) {
  console.error('Failed to initialize databases:', err);
  process.exit(1);
}
