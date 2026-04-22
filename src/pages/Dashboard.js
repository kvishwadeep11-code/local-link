import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/add-business">Add Business</Link>
    </div>
  );
}
