import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
    FiHome,
    FiCalendar,
    FiMenu
} from "react-icons/fi";
import { IoFlash } from "react-icons/io5";


function Sidebar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar-header">
                <div className="box-logo">
                    <IoFlash className="logo" size={28} />
                    <span className="logo-text">TLM</span>
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

                {user.role !== "MANAGER" && (
                    <NavLink to="/leave" className="menu-item">
                        <FiCalendar />
                        <span>Leave</span>
                    </NavLink>
                )}
            </nav>
        </aside>
    );
}

export default Sidebar;