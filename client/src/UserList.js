// UserList.js
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Modal,
	Box,
	Typography,
	TextField,
} from "@mui/material";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

export default function UserList() {
	const [users, setUsers] = useState([]);
	const [open, setOpen] = React.useState(false);
	const [editUser, setEditUser] = useState(null);
	const [editFormErrors, setEditFormErrors] = useState({});

	const handleOpen = (user) => {
		setEditUser({ ...user }); 
		setOpen(true);
	};

	const handleClose = () => {
		setEditUser(null);
		setOpen(false);
		setEditFormErrors({});
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await axios.get("http://localhost:5000/users");
			setUsers(response.data);
		} catch (error) {
			console.error("Error fetching users:", error);
		}
	};

	const handleDelete = async (userId) => {
		try {
			await axios.delete(`http://localhost:5000/users/${userId}`);
			fetchUsers(); 
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	};

	const handleEditChange = (e) => {
		setEditUser({ ...editUser, [e.target.name]: e.target.value });
		setEditFormErrors({ ...editFormErrors, [e.target.name]: "" });
	};

	const validateEditForm = () => {
		let errors = {};
		if (!editUser.name.trim()) {
			errors.name = "Name is required";
		}
		if (!editUser.email.trim()) {
			errors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUser.email)) {
			errors.email = "Invalid email format";
		}
		// Add validation for phone as needed
		setEditFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		if (validateEditForm()) {
			try {
				await axios.put(`http://localhost:5000/users/${editUser.id}`, editUser);
				fetchUsers(); // Refresh user list
				handleClose();
			} catch (error) {
				console.error("Error updating user:", error);
			}
		}
	};

	return (
		<div>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Phone</TableCell>
							<TableCell>Edit</TableCell>
							<TableCell>Delete</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.phone}</TableCell>
								<TableCell>
									<Button variant="contained" onClick={() => handleOpen(user)}>
										Edit
									</Button>
									
								</TableCell>
								<TableCell>
									<Button
										variant="contained"
										color="error"
										onClick={() => handleDelete(user.id)}
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Edit User
					</Typography>
					{editUser && ( // Conditionally render the form
						<form onSubmit={handleEditSubmit}>
							<TextField
								label="Name"
								name="name"
								value={editUser.name}
								onChange={handleEditChange}
								fullWidth
								margin="normal"
								error={!!editFormErrors.name}
								helperText={editFormErrors.name}
							/>
							<TextField // Email field
								label="Email"
								name="email"
								type="email"
								value={editUser.email}
								onChange={handleEditChange}
								fullWidth
								margin="normal"
								error={!!editFormErrors.email}
								helperText={editFormErrors.email}
							/>
							<TextField // Phone field
								label="Phone"
								name="phone"
								value={editUser.phone}
								onChange={handleEditChange}
								fullWidth
								margin="normal"
								error={!!editFormErrors.phone}
								helperText={editFormErrors.phone}
							/>
							<Button type="submit" variant="contained">
								Save Changes
							</Button>
						</form>
					)}
				</Box>
			</Modal>
		</div>
	);
}
