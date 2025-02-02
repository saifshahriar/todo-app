import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Todo } from "./Todo";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { CreateTodoModal } from "./CreateTodoModal";
import toast from "react-hot-toast";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

export function Dashboard() {
	const navigate = useNavigate();
	const username = localStorage.getItem("username");

	const [todolist, setTodoList] = useState([]);
	const [uniquePriorities, setUniquePriorities] = useState([]);
	const [search, setSearch] = useState("");
	const [sortBy, setSortBy] = useState("priority");
	const [filterByPriority, setFilterByPriority] = useState("all");

	async function getTodos() {
		const r = await fetch("http://3.109.211.104:8001/todos");
		const j = await r.json();
		setTodoList(j);
		// Extract unique priority values from the fetched todos
		const priorities = Array.from(new Set(j.map((todo) => todo.priority)));
		setUniquePriorities(priorities);
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
		setFilterByPriority(event.target.value);
	};

	// Apply sorting and filtering
	const sortedAndFilteredTodos = todolist
		.filter((todo) => {
			if (
				filterByPriority !== "all" &&
				todo.priority !== parseInt(filterByPriority)
			) {
				return false;
			}
			return true;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "priority":
					return b.priority - a.priority;
				case "created_at":
					return new Date(a.created_at) - new Date(b.created_at);
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
								<MenuItem value="created_at">
									Date Created
								</MenuItem>
								<MenuItem value="deadline">Deadline</MenuItem>
							</Select>
						</FormControl>

						{/* Filtering Dropdown */}
						<FormControl style={{ flex: 1, minWidth: "17vh" }}>
							<InputLabel
								style={{
									backgroundColor: "white",
									marginLeft: "1px",
								}}
							>
								Filter (By Priority)
							</InputLabel>
							<Select
								value={filterByPriority}
								onChange={handleFilterChange}
							>
								<MenuItem value="all">All</MenuItem>
								{uniquePriorities.map((priority, index) => (
									<MenuItem key={index} value={priority}>
										{priority}
									</MenuItem>
								))}
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
