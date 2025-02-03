import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "400px",
	bgcolor: "background.paper",
	boxShadow: 24,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

// eslint-disable-next-line react/prop-types
export function EditProfileModal({ updateProfile }) {
	const username = localStorage.getItem("username");
	const [isOpen, setIsOpen] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");

	useEffect(() => {
		if (isOpen) {
			fetchUserInfo();
		}
	}, [isOpen]);

	async function fetchUserInfo() {
		if (!username) {
			toast.error("No username found in local storage");
			return;
		}
		try {
			const r = await fetch(
				`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/profile/${username}`
			);
			if (!r.ok) throw new Error(`Fetch failed! HTTP ${r.status}`);
			const j = await r.json();
			setUserInfo(j);
			setName(j.name || "");
			setEmail(j.email || "");
			setPhone(j.phone || "");
		} catch (error) {
			toast.error(`Error fetching profile: ${error.message}`);
		}
	}

	async function updateProfileClick() {
		if (!username) {
			toast.error("No username found in local storage");
			return;
		}
		const updatedProfile = {
			...userInfo,
			name,
			email,
			phone,
		};

		try {
			const r = await fetch(
				`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/profile/${username}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updatedProfile),
				}
			);
			if (!r.ok) throw new Error(`Update failed! HTTP ${r.status}`);
			const updatedData = await r.json();
			setUserInfo(updatedData);
			updateProfile(updatedData); // Ensure parent component updates
			setIsOpen(false);
			toast.success("Profile updated");
		} catch (error) {
			toast.error(`Error updating profile: ${error.message}`);
		}
	}

	return (
		<div>
			<Button
				onClick={() => setIsOpen(true)}
				variant="contained"
				size="large"
			>
				Edit Profile
			</Button>
			<Modal open={isOpen} onClose={() => setIsOpen(false)}>
				<div style={style}>
					<div style={{ backgroundColor: "white", padding: "20px" }}>
						<h1>Edit Profile</h1>
						<br />
						<TextField
							placeholder="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							fullWidth
						/>
						<br />
						<TextField
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							fullWidth
						/>
						<br />
						<TextField
							placeholder="Phone"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							fullWidth
						/>
						<br />
						<Button
							onClick={updateProfileClick}
							fullWidth
							variant="contained"
							size="large"
						>
							Update
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
