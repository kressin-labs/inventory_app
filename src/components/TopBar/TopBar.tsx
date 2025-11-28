import { useAuth } from "../../context/AuthContext";
import "./TopBar.css";

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <div className="topbar">
      <a href="https://fabiankressin.com" className="main-link">
        fabiankressin.com
      </a>

      {/* Title in the Center */}
      <div className="title">Inventory App</div>

      {/* User Info on the Right */}
      <div className="right">
        {user ? (
          <>
            <span className="username">{user.username} ({user.role})</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
    </div>
  );
}