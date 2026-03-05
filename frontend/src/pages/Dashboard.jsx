import LeaveBalance from "../components/LeaveBalance";

function Dashboard() {
    const leaveBalance = {
        annual: 8,
        sick: 25,
        personal: 4
    };
    return (
        <>
            <h5>Dashboard</h5>
            <LeaveBalance balance={leaveBalance} />
        </>
    );
}

export default Dashboard;