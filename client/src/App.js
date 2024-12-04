// App.js
import React, { useState } from "react"; 
import UserForm from "./UserForm.js";
import UserList from "./UserList.js";
import { Container, Grid } from "@mui/material";

function App() {
	const [refreshKey, setRefreshKey] = useState(0);
	const handleUserCreated = () => {
		setRefreshKey((prevKey) => prevKey + 1); 
	};

	return (
		<Container maxWidth="lg" sx={{ mt: 4 }}>
			<Grid container spacing={3} direction="column">
				<Grid item xs={12}>
					<UserForm onUserCreated={handleUserCreated} />
				</Grid>
				<Grid item xs={12}>
					<UserList key={refreshKey} /> 
				</Grid>
			</Grid>

		</Container>
	);
}

export default App;
