import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <h2>Local Link</h2>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/profile">My Profile</Link>
    </nav>
  );
}
