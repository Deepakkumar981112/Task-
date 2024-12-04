import * as React from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box"; 
import axios from "axios";
import { Typography } from "@mui/material";

export default function UserForm({ onUserCreated }) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
	});

	const [formErrors, setFormErrors] = useState({}); 
	const [successMessage, setSuccessMessage] = useState(""); 
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setFormErrors({ ...formErrors, [e.target.name]: "" });
	};

	const validateForm = () => {
		let errors = {};
		if (!formData.name.trim()) {
			errors.name = "Name is required";
		}
		if (!formData.email.trim()) {
			errors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = "Invalid email format";
		}
		
		setFormErrors(errors);
		return Object.keys(errors).length === 0; 
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (validateForm()) {
			
			try {
				const response = await axios.post(
					"http://localhost:5000/users",
					formData
				);
				console.log(response.data);
				setSuccessMessage("User created successfully!"); 
				setFormData({ name: "", email: "", phone: "", password: "" }); 
				setFormErrors({});

				if (onUserCreated) {
					onUserCreated();
				}
			} catch (error) {
				console.error("Error creating user:", error);
				if (
					error.response &&
					error.response.data &&
					error.response.data.error
				) {
					setSuccessMessage("");
					setFormErrors({ serverError: error.response.data.error });
				} else {
					setFormErrors({
						serverError: "An error occurred during user creation.",
					});
				}
			}
		}
	};

	return (
		<Box
			sx={{
				maxWidth: 400,
				margin: "auto",
				mt: 5,
				p: 3,
				border: "1px solid #ccc",
				borderRadius: "8px",
			}}
		>
			<Typography variant="h5" align="center" gutterBottom>
				Create User
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					fullWidth
					margin="normal"
					error={!!formErrors.name} 
					helperText={formErrors.name}
				/>
				<TextField
					label="Email"
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					fullWidth
					margin="normal"
					error={!!formErrors.email}
					helperText={formErrors.email}
				/>
				<TextField
					label="Phone"
					name="phone"
					value={formData.phone}
					onChange={handleChange}
					fullWidth
					margin="normal"
					error={!!formErrors.phone}
					helperText={formErrors.phone}
				/>
				<TextField
					label="Password"
					name="password"
					type="password"
					value={formData.password}
					onChange={handleChange}
					fullWidth
					margin="normal"
					error={!!formErrors.password}
					helperText={formErrors.password}
				/>

				{formErrors.serverError && ( 
					<Typography variant="body2" color="error" align="center" gutterBottom>
						{formErrors.serverError}
					</Typography>
				)}

				{successMessage && (
					<Typography
						variant="body2"
						color="success"
						align="center"
						gutterBottom
					>
						{successMessage}
					</Typography>
				)}

				<Button type="submit" variant="contained" fullWidth>
					Create User
				</Button>
			</form>
		</Box>
	);
}
