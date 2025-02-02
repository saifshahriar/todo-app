import { Login } from "./components/Login";
import "./App.css";
import { Create } from "./components/Create";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { Dashboard } from "./components/Dashboard";
import { Profile } from "./components/Profile";
import { Toaster } from "react-hot-toast";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Create />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/profile" element={<Profile />} />
				</Routes>
			</Router>
			<Toaster />
		</>
	);
}

export default App;
