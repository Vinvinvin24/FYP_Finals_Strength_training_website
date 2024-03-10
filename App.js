const express = require('express');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcryptjs');

// Database connection configuration
const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'exercises'
});

// Connect to the database
dbConnection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get('/resources', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'resources.html'));
});


// Dynamic EJS route for '/rewards'
app.get('/rewards', (req, res) => {
  dbConnection.query('SELECT * FROM rewards', (err, rewards) => {
    if (err) {
      console.error('Error fetching rewards:', err);
      return res.status(500).send('Server Error');
    }
    res.render('rewards', { rewards, user: req.session.user || null });
  });
});

app.post('/redeemReward', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userId = req.session.user.id;
  const { rewardId, pointsRequired } = req.body;

  // Deduct points from the user and add reward
  const updatePointsQuery = 'UPDATE users SET points = points - ? WHERE id = ? AND points >= ?';
  const insertRewardQuery = 'INSERT INTO userrewards (userId, rewardId) VALUES (?, ?)';

  dbConnection.beginTransaction(err => {
    if (err) { throw err; }

    dbConnection.query(updatePointsQuery, [pointsRequired, userId, pointsRequired], (error, results) => {
      if (error || results.affectedRows === 0) {
        return dbConnection.rollback(() => {
          res.send('Failed to redeem reward. Not enough points or error occurred.');
        });
      }

      dbConnection.query(insertRewardQuery, [userId, rewardId], (error, results) => {
        if (error) {
          return dbConnection.rollback(() => {
            res.send('Failed to add reward to user account.');
          });
        }

        dbConnection.commit(err => {
          if (err) {
            return dbConnection.rollback(() => {
              throw err;
            });
          }
          // Update session points
          req.session.user.points -= pointsRequired;

          res.sendFile(path.join(__dirname, 'public', 'views', 'redeem-rewards.html'));
        });
      });
    });
  });
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    // User is already logged in, redirect them to their profile or another page
    res.redirect('/profile'); // Adjust '/profile' to wherever you'd like logged-in users to go
  } else {
    // User is not logged in, serve the login.html page
    res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
  }
});

// Handle signup with password hashing
app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error during password hashing.');
    }
    dbConnection.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hash, email], (error, results) => {
      if (error) {
        console.error('Error inserting new user into database:', error);
        // Consider providing a user-friendly error page or message
        res.status(500).send('An error occurred during registration.');
      } else {
        console.log('Signup successful:', results);
        // Redirect to the registration successful page
        res.redirect('/registration-success');
      }
    });
  });
});

// Handle login with password verification
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  dbConnection.query('SELECT * FROM users WHERE username = ?', [username], (err, users) => {
    if (err) throw err;
    if (users.length === 0) {
      res.send('No user found with that username.');
      return;
    }
    const user = users[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) throw err;
      if (result) {
        req.session.user = user;
        res.redirect('/rewards'); // or redirect to user's profile or another page
      } else {
        res.send('Password incorrect.');
      }
    });
  });
});


app.get('/registration-success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'registration-success.html'));
});

app.get('/exercises', (req, res) => {
  if (!req.session.user) {
    res.redirect('/login'); // Ensure the user is logged in
    return;
  }

  const query = 'SELECT * FROM workoutroutines';
  dbConnection.query(query, (err, routines) => {
    if (err) {
      console.error('Error fetching workout routines:', err);
      return res.status(500).send('Server Error');
    }
    res.render('exercises', { routines, user: req.session.user || null });
  });
});

// Handle adding a workout routine to the user's plan
app.post('/addRoutine', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Please log in to add workout routines');
  }
  const { routineId, weekStartDate } = req.body; // Ensure you have inputs for these in your form
  const completed = 0; // Assuming routine is not completed when first added
  const userId = req.session.user.id; // Assuming you store the user ID in the session upon login

  const query = 'INSERT INTO userworkoutplans (userId, routineId, weekStartDate, completed) VALUES (?, ?, ?, ?)';
  dbConnection.query(query, [userId, routineId, weekStartDate, completed], (err, result) => {
    if (err) {
      console.error('Error adding workout routine to plan:', err);
      return res.status(500).send('Error adding workout routine');
    }
    res.json('Workout routine added successfully');
  });
});

app.get('/profile', (req, res) => {
  if (!req.session.user) {
    // Redirect to login page if user is not logged in
    return res.redirect('/login');
  }

  const userId = req.session.user.id; // Assuming you store logged-in user info in session

  // Query for user's basic info and total points
  const userInfoQuery = 'SELECT username, points FROM users WHERE id = ?';

  // Query for user's workout plans
  const workoutPlansQuery = `
    SELECT wr.name, wr.description, wr.pointsAwarded, uwp.completed 
    FROM userworkoutplans uwp
    JOIN workoutroutines wr ON uwp.routineId = wr.id
    WHERE uwp.userId = ?`;

  // Query for redeemed rewards
  const redeemedRewardsQuery = `
    SELECT r.name, r.pointsRequired 
    FROM userrewards ur
    JOIN rewards r ON ur.rewardId = r.id
    WHERE ur.userId = ?`;

  // Execute these queries (consider using Promise.all for parallel execution if possible)
  // For simplicity, executing them one after another here
  dbConnection.query(userInfoQuery, [userId], (err, userInfoResults) => {
    if (err) {
      console.error('Error fetching user info:', err);
      return res.status(500).send('Server error occurred fetching user info.');
    }
    const user = userInfoResults[0]; // Assuming the query returns one result

    dbConnection.query(workoutPlansQuery, [userId], (err, workoutPlansResults) => {
      if (err) {
        console.error('Error fetching workout plans:', err);
        return res.status(500).send('Server error occurred fetching workout plans.');
      }

      dbConnection.query(redeemedRewardsQuery, [userId], (err, redeemedRewardsResults) => {
        if (err) {
          console.error('Error fetching redeemed rewards:', err);
          return res.status(500).send('Server error occurred fetching redeemed rewards.');
        }

        // Render profile.ejs with fetched data
        res.render('profile', {
          user: user,
          workoutPlans: workoutPlansResults,
          redeemedRewards: redeemedRewardsResults
        });
      });
    });
  });
});

app.post('/markCompleted', (req, res) => {
  const { planId } = req.body; // Ensure this matches the name attribute in your form's input

  const query = 'UPDATE userworkoutplans SET completed = 1 WHERE id = ?';
  dbConnection.query(query, [planId], (err, result) => {
    if (err) {
      console.error('Error marking workout as completed:', err);
      return res.status(500).send('Error updating workout status.');
    }
    console.log('Workout marked as completed successfully');
    res.redirect('/profile'); // Or send a JSON response if you're handling this via AJAX
  });
});

app.post('/logout', (req, res) => {
  if (req.session) {
    // Destroy the session and clear the user cookie
    req.session.destroy(() => {
      res.redirect('/login'); // Redirect the user back to the login page
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
