import { useState } from "react";
import LeaveBalance from "../components/LeaveBalance";
import Table from "../components/Table";
import { useEffect } from "react";
import api from "../api/api";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [requests, setRequests] = useState([]);

    const fetchData = async () => {
        try {
            const resRequests = await api.get(`/leave/requests/${user.id}`);
            if (resRequests.status === 200) {
                setRequests(resRequests?.data || []);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <h5>Dashboard</h5>
            <LeaveBalance />

            <div className="mt-5">
                <div className="mb-3 fs-5">My Leave Requests</div>
                <Table 
                    data={requests}
                    tab="REQUEST" 
                />
            </div>
            
        </>
    );
}

export default Dashboard;