import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
    FiHome,
    FiUsers,
    FiCalendar,
    FiBarChart2,
    FiSettings,
    FiMenu
} from "react-icons/fi";
import { IoFlash } from "react-icons/io5";


function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header">
                <div className="box-logo">
                    <IoFlash className="logo" size={28} />
                    <span className="logo-text">LM</span>
                </div>

                <button
                    className="collapse-btn"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <FiMenu />
                </button>
            </div>

            <nav className="sidebar-menu">
                <NavLink to="/" className="menu-item">
                    <FiHome />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/leave" className="menu-item">
                    <FiCalendar />
                    <span>Leave</span>
                </NavLink>

                <NavLink to="/settings" className="menu-item">
                    <FiSettings />
                    <span>Settings</span>
                </NavLink>
            </nav>
        </aside>
    );
}

export default Sidebar;