const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "trapovejgulas",
  database: "herrmanTP",
});

connection.connect((err) => {
  if (err) {
    console.error("Nepodařilo se připojit k MySQL", err);
    return;
  }
  console.log("Připojeno k MySQL");
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this line to handle JSON data
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to check if user is logged in
function checkAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/");
  }
  next();
}

// Routes
app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/locations");
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/locations", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Locations.html"));
});

app.get("/profile", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"));
});

// API route to fetch locations
app.get("/api/locations", checkAuth, (req, res) => {
  connection.query("SELECT * FROM locations", (err, results) => {
    if (err) {
      console.error("Nepodařilo se načíst lokace", err);
      return res.status(500).send("Chyba serveru");
    }
    res.json(results);
  });
});

// API route to get the current user's username
app.get("/api/username", checkAuth, (req, res) => {
  connection.query(
    "SELECT username FROM users WHERE id = ?",
    [req.session.userId],
    (err, results) => {
      if (err) {
        console.error("Nepodařilo se načíst uživatelské jméno", err);
        return res.status(500).send("Chyba serveru");
      }
      if (results.length === 0) {
        return res.status(404).send("Uživatel nenalezen");
      }
      res.json({ username: results[0].username });
    }
  );
});

// API route to fetch user information
app.get("/api/user-info", checkAuth, (req, res) => {
  connection.query(
    "SELECT username, email, (SELECT COUNT(*) FROM locations WHERE added_by = users.username) AS locationCount FROM users WHERE id = ?",
    [req.session.userId],
    (err, results) => {
      if (err) {
        console.error("Nepodařilo se načíst uživatelské informace", err);
        return res.status(500).send("Chyba serveru");
      }
      if (results.length === 0) {
        return res.status(404).send("Uživatel nenalezen");
      }
      res.json(results[0]);
    }
  );
});

// API route to fetch user locations
app.get("/api/user-locations", checkAuth, (req, res) => {
  connection.query(
    "SELECT * FROM locations WHERE added_by = (SELECT username FROM users WHERE id = ?)",
    [req.session.userId],
    (err, results) => {
      if (err) {
        console.error("Nepodařilo se načíst lokace uživatele", err);
        return res.status(500).send("Chyba serveru");
      }
      res.json(results);
    }
  );
});

// API route to edit user information
app.post("/api/edit-user", checkAuth, async (req, res) => {
  const { username, email, password } = req.body;
  const updates = [];
  const params = [];

  if (username) {
    updates.push("username = ?");
    params.push(username);
  }
  if (email) {
    updates.push("email = ?");
    params.push(email);
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updates.push("password = ?");
    params.push(hashedPassword);
  }

  if (updates.length === 0) {
    return res.status(400).send("Žádné změny nebyly provedeny");
  }

  params.push(req.session.userId);

  connection.query(
    `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
    params,
    (err, results) => {
      if (err) {
        console.error("Edit of user's information failed", err);
        return res.status(500).send("Server error");
      }
      res.sendStatus(200);
    }
  );
});

// Add location route
app.post("/add-location", checkAuth, (req, res) => {
  const { name, address, description, iframe, added_by, rating } = req.body;

  connection.query(
    "INSERT INTO locations (name, address, description, iframe, added_by, rating) VALUES (?, ?, ?, ?, ?, ?)",
    [name, address, description, iframe, added_by, rating],
    (err, results) => {
      if (err) {
        console.error("Adding location failed", err);
        return res.status(500).send("Server error");
      }
      res.redirect("/locations");
    }
  );
});

// Registration route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  connection.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
    (err, results) => {
      if (err) {
        console.error("Registering user failed", err);
        return res.status(500).send("Server error");
      }
      req.session.userId = results.insertId;
      res.redirect("/locations");
    }
  );
});

// Login route
app.post("/login", (req, res) => {
  console.log("login started");
  const { username, password } = req.body;

  console.log("Login attempt:", { username, password }); // Log the login attempt

  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        console.error("User login failed", err);
        return res.status(500).send("Server error");
      }
      if (results.length === 0) {
        console.log("User not found");
        return res.status(400).send("Špatně zadané heslo nebo uživatelsko jméno");
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Login failed: Password mismatch");
        return res.status(402).send("Špatně zadané uživatelské jméno ne bo heslo");
      } else {
        console.log("Login successful");
      }

      req.session.userId = user.id;
      res.redirect("/locations");
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
