import { Button, Box } from "@mui/material";

const styles = {
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column", // Stack everything vertically after the buttons
	},
	buttonsContainer: {
		display: "flex",
		justifyContent: "center", // Center buttons horizontally
		marginBottom: "20px", // Space below the buttons
	},
	centeredDiv: {
		margin: "10px", // Spacing between the buttons
	},
	hr: {
		width: "200px", // Set the width of the line relative to the "New here?" text
		margin: "20px 0", // Space before and after the line
		border: "0",
		borderTop: "1px solid #ccc", // Horizontal line style
	},
	footerText: {
		marginBottom: "10px", // Space before the create account button
	},
};

function Home() {
	return (
		<>
			<div style={{ textAlign: "center" }}>
				<h1>Welcome to our Todo App! 🚀</h1>
				<br />
				<br />
				<br />
				<br />
				<h2>Go to:</h2>
			</div>
			<div style={styles.container}>
				{/* Buttons side by side */}
				<div style={styles.buttonsContainer}>
					<Box style={styles.centeredDiv}>
						<Button
							variant="contained"
							color="primary"
							href="/login"
						>
							Login
						</Button>
					</Box>
					<Box style={styles.centeredDiv}>
						<Button
							variant="contained"
							color="primary"
							href="/dashboard"
						>
							Dashboard
						</Button>
					</Box>
					<Box style={styles.centeredDiv}>
						<Button
							variant="contained"
							color="primary"
							href="/profile"
						>
							Profile
						</Button>
					</Box>
				</div>

				{/* Horizontal Line */}
				<hr style={styles.hr} />

				{/* Text and Create Account Button */}
				<div style={styles.footerText}>
					<p>
						<center>New here?</center>
					</p>
					<Button variant="outlined" color="secondary" href="/signup">
						Create an Account
					</Button>
				</div>
			</div>
		</>
	);
}

export { Home };
