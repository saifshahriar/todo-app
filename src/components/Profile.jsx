import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import Avatar from "@mui/material/Avatar";
import { EditProfileModal } from "./EditProfileModal";

export function Profile() {
	const navigate = useNavigate();
	const [username, setUsername] = useState(localStorage.getItem("username"));
	const [userInfo, setUserInfo] = useState(null);

	const fetchUserInfo = async (username) => {
		try {
			const r = await fetch(
				`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/profile/${username}`
			);
			if (!r.ok) throw new Error(`Fetch failed! HTTP ${r.status}`);
			const j = await r.json();
			setUserInfo(j);
		} catch (error) {
			window.location.reload();
			toast.error(`Error fetching user's information: ${error.message}`);
		}
	};

	useEffect(() => {
		if (!username) {
			navigate("/login");
			return;
		}
		fetchUserInfo(username);
	}, [username]);

	const logoutClick = () => {
		localStorage.removeItem("username");
		setUsername(null);
		toast.success("Logged out successfully");
		navigate("/login");
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				width: "100%",
			}}
		>
			<div style={{ width: "500px" }}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<h1>Welcome, {username}!</h1>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center", // Centers content horizontally
							width: "100%",
							margin: "10px",
						}}
					>
						<EditProfileModal
							updateProfile={fetchUserInfo}
							fullWidth
							style={{
								flex: 1,
								minHeight: "100%",
								marginLeft: "100px",
							}}
						/>
						<Button
							variant="outlined"
							size="large"
							color="error"
							onClick={logoutClick}
							style={{ marginLeft: "10px" }}
						>
							Logout
						</Button>
					</div>
					<div style={{ margin: "20px", fontSize: "17px" }}>
						{userInfo && (
							<>
								<table
									style={{
										borderCollapse: "collapse",
										width: "100%",
									}}
								>
									<tbody>
										<tr>
											<th
												style={{
													textAlign: "right",
													padding: "8px",
												}}
											>
												Username
											</th>
											<td>:</td>
											<td
												style={{
													textAlign: "left",
													padding: "8px",
												}}
											>
												{userInfo.username}
											</td>
										</tr>
										<tr>
											<th
												style={{
													textAlign: "right",
													padding: "8px",
												}}
											>
												Name
											</th>
											<td>:</td>
											<td
												style={{
													textAlign: "left",
													padding: "8px",
												}}
											>
												{userInfo.name}
											</td>
										</tr>
										<tr>
											<th
												style={{
													textAlign: "right",
													padding: "8px",
												}}
											>
												Email
											</th>
											<td>:</td>
											<td
												style={{
													textAlign: "left",
													padding: "8px",
												}}
											>
												{userInfo.email}
											</td>
										</tr>
										<tr>
											<th
												style={{
													textAlign: "right",
													padding: "8px",
												}}
											>
												Phone
											</th>
											<td>:</td>
											<td
												style={{
													textAlign: "left",
													padding: "8px",
												}}
											>
												{userInfo.phone}
											</td>
										</tr>
									</tbody>
								</table>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
