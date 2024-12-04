const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});

db.connect((err) => {
	if (err) {
		console.error("Error connecting to database:", err);
		return;
	}
	console.log("Connected to database");
});

app.post("/users", async (req, res) => {
	const { name, email, phone, password } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

		const query =
			"INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
		db.query(query, [name, email, phone, hashedPassword], (err, result) => {
			if (err) {
				console.error("Error inserting user:", err);
				res.status(500).json({ error: "Error creating user" });
				return;
			}
			res.status(201).json({ message: "User created successfully" });
		});
	} catch (error) {
		console.error("Error hashing password:", error);
		res.status(500).json({ error: "Error creating user" });
	}
});

// READ all users
app.get("/users", (req, res) => {
	const query = "SELECT id, name, email, phone FROM users"; // Don't select password
	db.query(query, (err, result) => {
		if (err) {
			console.error("Error fetching users:", err);
			res.status(500).json({ error: "Error fetching users" });
			return;
		}
		res.json(result);
	});
});

// READ single user
app.get("/users/:id", (req, res) => {
	const userId = req.params.id;
	const query = "SELECT id, name, email, phone FROM users WHERE id = ?";
	db.query(query, [userId], (err, result) => {
		if (err) {
			console.error("Error fetching user:", err);
			res.status(500).json({ error: "Error fetching user" });
			return;
		}
		if (result.length === 0) {
			res.status(404).json({ message: "User not found" });
		} else {
			res.json(result[0]);
		}
	});
});

// UPDATE user
app.put("/users/:id", async (req, res) => {
	const userId = req.params.id;
	const { name, email, phone, password } = req.body;

	try {
		let updateFields = [];
		let updateValues = [];

		if (name) {
			updateFields.push("name = ?");
			updateValues.push(name);
		}
		if (email) {
			updateFields.push("email = ?");
			updateValues.push(email);
		}
		if (phone) {
			updateFields.push("phone = ?");
			updateValues.push(phone);
		}
		if (password) {
			const hashedPassword = await bcrypt.hash(password, 10);
			updateFields.push("password = ?");
			updateValues.push(hashedPassword);
		}

		if (updateFields.length === 0) {
			return res.status(400).json({ error: "No fields to update provided" });
		}

		updateValues.push(userId); // Add userId for the WHERE clause

		const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;
		db.query(query, updateValues, (err, result) => {
			if (err) {
				console.error("Error updating user:", err);
				res.status(500).json({ error: "Error updating user" });
				return;
			}
			res.json({ message: "User updated successfully" });
		});
	} catch (error) {
		// Catch bcrypt errors
		console.error("Error hashing password:", error);
		res.status(500).json({ error: "Error updating user" });
	}
});

// DELETE user
app.delete("/users/:id", (req, res) => {
	const userId = req.params.id;
	const query = "DELETE FROM users WHERE id = ?";
	db.query(query, [userId], (err, result) => {
		if (err) {
			console.error("Error deleting user:", err);
			res.status(500).json({ error: "Error deleting user" });
			return;
		}
		res.json({ message: "User deleted successfully" });
	});
});

app.listen(port, (err, res) => {
	if (err) {
		console.error(`error starting the server: ${err.message}`);
		process.exit(1);
	} else {
		console.log(`server is listening on ${port}`);
	}
});
