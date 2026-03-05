import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
    return (
        <div className="layout">
            <Sidebar />

            <div className="main-section">
                <Navbar />

                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;