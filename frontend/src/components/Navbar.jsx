import { FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const [open, setOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user")|| "{}");
    const navigate = useNavigate();

    const firstLetter = user?.username?.charAt(0).toUpperCase();

    const handleLogout = async () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="app-navbar">
            <div className="navbar-container">
                <div className="navbar-title">
                    Team Leave Management
                </div>
                <div className="user-dropdown"
                    onClick={() => setOpen(!open)}
                >
                    <div className="avatar">
                        {firstLetter}
                    </div>

                    <div className="user-info">
                        <div className="user-name">{user.username}</div>
                        <div className="user-role">{user.role}</div>
                    </div>

                    <FiChevronDown className="arrow" />

                    {open && (
                        <div className="dropdown-menu">

                            <div className="dropdown-title">
                                Account
                            </div>

                            <button className="dropdown-item">
                                <FiUser />
                                Profile
                            </button>

                            <button className="dropdown-item logout" onClick={handleLogout}>
                                <FiLogOut />
                                Sign Out
                            </button>

                        </div>
                    )}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;