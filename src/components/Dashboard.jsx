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
	const [taskCount, setTaskCount] = useState(0);
	const [completedTaskCount, setCompletedTaskCount] = useState(0);

	async function getTodos() {
		const r = await fetch("http://3.109.211.104:8001/todos");
		const j = await r.json();

		setTodoList(j);
		setTaskCount(j.length);

		setCompletedTaskCount(j.filter((todo) => todo.is_completed).length);

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
					return new Date(b.created_at) - new Date(a.created_at);
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
								color="info"
								component="a"
								href="/profile"
								target="_blank"
							>
								Profile
							</Button>
						</div>
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
					<div
						style={{
							marginTop: "-20px",
							marginBottom: "10px",
						}}
					>
						<h3>
							You have{" "}
							{completedTaskCount <= 0 ? (
								`no tasks completed out of ${taskCount}`
							) : (
								<>
									<span
										style={{
											color: "green",
											backgroundColor: "#d4f4d2",
											borderRadius: "50%",
											border: "2px solid green",
											width: "30px",
											height: "30px",
											display: "inline-flex",
											alignItems: "center",
											justifyContent: "center",
											fontWeight: "bold",
											margin: "0 5px",
										}}
									>
										{completedTaskCount}
									</span>
									{` out of ${taskCount} tasks completed.`}
								</>
							)}
						</h3>
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
						/>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							width: "100%",
							margin: "10px",
							marginLeft: "-1px",
						}}
					>
						{/* Sorting Dropdown */}
						<FormControl
							style={{
								flex: 3,
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
						<FormControl
							style={{
								flex: 1,
								minWidth: "17vh",
								marginRight: "10px",
							}}
						>
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
						<CreateTodoModal
							updateTodos={getTodos}
							fullWidth
							style={{
								flex: 1,
								marginRight: "10px",
								minHeight: "100%",
							}}
						/>
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
				</div>
			</div>
		</>
	);
}
