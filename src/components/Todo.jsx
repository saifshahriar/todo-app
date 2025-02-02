import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DoneIcon from "@mui/icons-material/Done";

// eslint-disable-next-line react/prop-types
export function Todo({ id, title, is_completed, priority, updateTodos }) {
	const [countdown, setCountdown] = useState("");
	const [deadline, setDeadline] = useState(null);

	// Reusable function to fetch the todo by ID
	const fetchTodoById = async (id) => {
		try {
			const fetchResponse = await fetch(
				"http://3.109.211.104:8001/todos"
			);
			if (!fetchResponse.ok)
				throw new Error(`Fetch failed! HTTP ${fetchResponse.status}`);
			const todos = await fetchResponse.json();
			const todo = todos.find((t) => t.id === id);
			if (!todo) throw new Error(`Todo with ID ${id} not found`);
			return todo;
		} catch (error) {
			toast.error(`Error fetching todo: ${error.message}`);
			return null;
		}
	};

	useEffect(() => {
		const getTodo = async () => {
			const todo = await fetchTodoById(id);
			if (todo) {
				setDeadline(todo.deadline);
			}
		};
		getTodo();
	}, [id]);

	// count deadline
	useEffect(() => {
		if (deadline) {
			const interval = setInterval(() => {
				const deadlineDate = new Date(deadline);
				const now = new Date();
				const timeRemaining = deadlineDate - now;

				if (timeRemaining <= 0) {
					setCountdown("Time’s up!");
					clearInterval(interval);
				} else {
					const seconds = Math.floor((timeRemaining / 1000) % 60);
					const minutes = Math.floor(
						(timeRemaining / (1000 * 60)) % 60
					);
					const hours = Math.floor(
						(timeRemaining / (1000 * 60 * 60)) % 24
					);
					const days = Math.floor(
						timeRemaining / (1000 * 60 * 60 * 24)
					);

					setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [deadline]);

	// mark as completed
	async function handleUpdate() {
		const todo = await fetchTodoById(id);
		if (!todo) return;

		const updatedTodo = {
			...todo,
			is_completed: !todo.is_completed,
		};
		try {
			const response = await fetch(
				`http://3.109.211.104:8001/todo/${id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updatedTodo),
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			is_completed
				? toast.success("Undone")
				: toast.success("Marked as completed");
			updateTodos();
		} catch (error) {
			toast.error(`Error: ${error.message}`);
		}
	}

	// delete a todo
	async function handleDelete() {
		try {
			const response = await fetch(
				`http://3.109.211.104:8001/todo/${id}`,
				{
					method: "DELETE",
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			toast.success(data.message);
			updateTodos();
		} catch (error) {
			toast.error(`Error: ${error.message}`);
		}
	}

	return (
		<div
			style={{
				padding: "20px",
				margin: "10px",
				border: "1px solid black",
				borderRadius: "10px",
				backgroundColor:
					priority > 8 ? "rgba(255,0,0,0.3)" : "rgba(0,255,0,0.3)",
			}}
		>
			<div>
				<span
					style={{
						color: !is_completed ? "goldenrod" : "green",
						fontSize: "40px",
					}}
				>
					{is_completed ? (
						<DoneIcon style={{ fontSize: "40px" }} />
					) : (
						<HourglassTopIcon style={{ fontSize: "40px" }} />
					)}
				</span>
				<span
					style={{
						fontSize: "30px",
						textDecoration: is_completed ? "line-through" : "",
					}}
				>
					{title}
				</span>
			</div>
			{is_completed ? (
				""
			) : (
				<div>
					<span style={{ fontSize: "20px", marginTop: "10px" }}>
						{countdown}
					</span>
				</div>
			)}
			<div
				style={{
					display: "flex",
					width: "100%",
					justifyContent: "end",
				}}
			>
				<Button
					variant="outlined"
					onClick={handleUpdate}
					style={{
						fontSize: "20px",
						cursor: "pointer",
						margin: "2px",
						color: is_completed ? "black" : "blue",
						backgroundColor: is_completed
							? "goldenrod"
							: "transparent",
					}}
				>
					{is_completed ? (
						<SettingsBackupRestoreIcon />
					) : (
						<CheckCircleIcon style={{ marginHorizontal: "2px" }} />
					)}
					{is_completed ? "Undo" : "Complete"}
				</Button>
				<Button
					variant="outlined"
					onClick={handleDelete}
					style={{
						fontSize: "20px",
						cursor: "pointer",
						margin: "2px",
					}}
				>
					<DeleteIcon />
				</Button>
			</div>
		</div>
	);
}
