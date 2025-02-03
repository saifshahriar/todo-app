import { Button, Box } from "@mui/material";

const styles = {
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
	},
	buttonsContainer: {
		display: "flex",
		justifyContent: "center",
		marginBottom: "20px",
	},
	centeredDiv: {
		margin: "10px",
	},
	hr: {
		width: "200px",
		margin: "20px 0",
		border: "0",
		borderTop: "1px solid #ccc",
	},
	footerText: {
		marginBottom: "10px",
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
