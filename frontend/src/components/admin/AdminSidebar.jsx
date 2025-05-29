import { Link, useLocation } from "react-router-dom";
import { 
  FaChartBar, 
  FaUsers, 
  FaBook, 
  FaNewspaper, 
  FaBookOpen,  // Changed from FaMagazine to FaBookOpen
  FaList, 
  FaUndo, 
  FaExclamationCircle, 
  FaSignOutAlt
} from "react-icons/fa";
import "../../styles/AdminSidebar.css";

const AdminSidebar = ({ user, onLogout }) => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="admin-avatar">
          <img src="/admin-avatar.png" alt="Admin" />
        </div>
        <div className="admin-info">
          <h3>admin</h3>
          <span className="status online">Online</span>
        </div>
      </div>

      <div className="sidebar-title">Main Menu</div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className={isActive("/admin")}>
            <Link to="/admin">
              <FaChartBar /> Dashboard
            </Link>
          </li>
          <li className={isActive("/admin/users")}>
            <Link to="/admin/users">
              <FaUsers /> Members Section
            </Link>
          </li>
          <li className={isActive("/admin/books")}>
            <Link to="/admin/books">
              <FaBook /> Books Section
            </Link>
          </li>
          <li>
            <button onClick={onLogout} className="sidebar-logout">
              <FaSignOutAlt /> Exit System
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;