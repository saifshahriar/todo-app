import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Todo } from "./Todo";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { CreateTodoModal } from "./CreateTodoModal";
import toast from "react-hot-toast";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

export function Profile() {
	const navigate = useNavigate();
	const username = localStorage.getItem("username");

	const [todolist, setTodoList] = useState([]);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("priority");
	const [filterByTime, setFilterByTime] = useState("all");

	async function getTodos() {
		const r = await fetch("http://3.109.211.104:8001/todos");
		const j = await r.json();
		setTodoList(j);
	}

	useEffect(() => {
		if (!username) navigate("/login");
		getTodos();
	}, [username]);

	function logoutClick() {
		localStorage.removeItem("username");
		toast.success("Logged out successfully");
		navigate("/login");
	}

	// Sorting function
	const handleSortChange = (event) => {
		setSortBy(event.target.value);
	};

	// Filtering function
	const handleFilterChange = (event) => {
		setFilterByTime(event.target.value);
	};

	// Apply sorting and filtering
	const sortedAndFilteredTodos = todolist
		.filter((todo) => {
			const deadline = new Date(todo.deadline);
			const now = new Date();

			switch (filterByTime) {
				case "24h":
					return deadline - now <= 24 * 60 * 60 * 1000; // Within 24 hours
				case "nextweek":
					return deadline - now <= 7 * 24 * 60 * 60 * 1000; // 7 days
				case "overdue":
					return deadline < now; // Overdue
				default:
					return true; // No filtering
			}
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "priority":
					return b.priority - a.priority;
				case "deadline":
					return new Date(a.deadline) - new Date(b.deadline);
				default:
					return 0; // No sorting
			}
		});

	return (
		<>
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
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<h1>Welcome, {username}!</h1>
						<div>
							<Button
								variant="outlined"
								size="large"
								color="error"
								onClick={logoutClick}
							>
								Logout
							</Button>
						</div>
					</div>

					{/* Search bar + Sorting & Filtering dropdowns */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							width: "100%",
						}}
					>
						<TextField
							fullWidth
							placeholder="Search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							style={{ flex: 3, marginRight: "10px" }}
						/>

						{/* Sorting Dropdown */}
						<FormControl
							style={{
								flex: 1,
								marginRight: "10px",
								minWidth: "16vh",
							}}
						>
							<InputLabel
								style={{
									backgroundColor: "white",
									margin: "1px",
								}}
							>
								Sort By
							</InputLabel>
							<Select value={sortBy} onChange={handleSortChange}>
								<MenuItem value="priority">Priority</MenuItem>
								<MenuItem value="deadline">Deadline</MenuItem>
							</Select>
						</FormControl>

						{/* Filtering Dropdown */}
						<FormControl style={{ flex: 1 }}>
							<InputLabel
								style={{
									backgroundColor: "white",
									margin: "1px",
								}}
							>
								Filter
							</InputLabel>
							<Select
								value={filterByTime}
								onChange={handleFilterChange}
							>
								<MenuItem value="all">All</MenuItem>
								<MenuItem value="24h">Next 24 hours</MenuItem>
								<MenuItem value="nextweek">
									Next 7 days
								</MenuItem>
								<MenuItem value="overdue">Overdue</MenuItem>
							</Select>
						</FormControl>
					</div>

					{/* Display filtered and sorted todos */}
					<div>
						{sortedAndFilteredTodos
							.filter((value) =>
								value.title
									.toLowerCase()
									.includes(search.toLowerCase())
							)
							.map((value, index) => (
								<Todo
									key={index}
									title={value.title}
									priority={value.priority}
									is_completed={value.is_completed}
									id={value.id}
									updateTodos={getTodos}
								/>
							))}
					</div>

					<br />
					<br />
					<CreateTodoModal updateTodos={getTodos} />
				</div>
			</div>
		</>
	);
}
