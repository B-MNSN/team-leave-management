import EmployeeDashboard from "./EmployeeDashboard";
import ManagerDashboard from "./ManagerDashboard";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user)
    console.log(user.role === "MANAGER" )

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