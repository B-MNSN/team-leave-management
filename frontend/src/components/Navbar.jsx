import { FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";
import { useState } from "react";

function Navbar() {
    const [open, setOpen] = useState(false);

    const user = {
        name: "user1",
        role: "employee",
        avatar: "u"
    };

    const firstLetter = user?.name?.charAt(0).toUpperCase();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-title">
                    Leave Management
                </div>
                <div className="user-dropdown"
                    onClick={() => setOpen(!open)}
                >
                    <div className="avatar">
                        {firstLetter}
                    </div>

                    <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-role">{user.role}</div>
                    </div>

                    <FiChevronDown className="arrow" />

                    {open && (
                        <div className="dropdown-menu">

                            <div className="dropdown-header">
                                Account
                            </div>

                            <button className="dropdown-item">
                                <FiUser />
                                Profile
                            </button>

                            <button className="dropdown-item logout">
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