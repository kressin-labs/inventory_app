import { useAuth } from "../../context/AuthContext";
import "./TopBar.css";

export default function TopBar() {
  const { user, logout } = useAuth();

  return (
    <div className="topbar">
      <div className="title">Inventory App</div>

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
