import { useState, useEffect } from "react";
import LeaveBalance from "../components/LeaveBalance";
import Table from "../components/Table";
import api from "../api/api";

import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdCancelScheduleSend } from "react-icons/md";

function EmployeeDashboard() {
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


    const pending = requests.filter(r => r.status === "PENDING").length;
    const approved = requests.filter(r => r.status === "APPROVED").length;
    const rejected = requests.filter(r => r.status === "REJECTED").length;
    const cancelled = requests.filter(r => r.status === "CANCELLED").length;

    return (
        <div className="dashboard">
            <div className="dashboard-header mb-4">
                <div>
                    <h3>Employee Dashboard</h3>
                    <span className="text-muted">
                        Manage your leave requests and track leave balance
                    </span>
                </div>

            </div>

            <LeaveBalance />

            <div className="stats-grid mt-5 mb-4">
                <div className="stat-card">
                    <div className="stat-icon pending">
                        <FaClock />
                    </div>

                    <div>
                        <span>Pending</span>
                        <h2>{pending}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon approved">
                        <FaCheckCircle />
                    </div>

                    <div>
                        <span>Approved</span>
                        <h2>{approved}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon rejected">
                        <FaTimesCircle />
                    </div>

                    <div>
                        <span>Rejected</span>
                        <h2>{rejected}</h2>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon cancelled">
                        <MdCancelScheduleSend />
                    </div>

                    <div>
                        <span>Cancelled</span>
                        <h2>{cancelled}</h2>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="m-0">My Leaves</h6>
                </div>
                <div className="table-card">
                    <Table
                        data={requests}
                        tab="REQUEST"
                    />

                </div>

            </div>

        </div>

    );
}

export default EmployeeDashboard;