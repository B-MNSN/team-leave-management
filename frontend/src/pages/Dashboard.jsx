import EmployeeDashboard from "./EmployeeDashboard";
import ManagerDashboard from "./ManagerDashboard";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <>
            {user.role === "MANAGER" ? (
                <ManagerDashboard />
            ) : (
                <EmployeeDashboard />
            )}
        </>
    );
}

export default Dashboard;