import { useEffect, useState } from "react";
import api from "../api/api";
import Table from "../components/Table";
import Swal from "sweetalert2";

import { FaClock, FaCheckCircle, FaTimesCircle, FaFilter } from "react-icons/fa";
import { MdCancelScheduleSend } from "react-icons/md";

function ManagerDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [requests, setRequests] = useState([]);
    const [status, setStatus] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const fetchData = async () => {
        try {
            const res = await api.get(`/leave/team/${user.id}`, {
                params: { status, start, end }
            });

            setRequests(res.data || []);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [status, start, end]);

    const pending = requests.filter(r => r.status === "PENDING").length;
    const approved = requests.filter(r => r.status === "APPROVED").length;
    const rejected = requests.filter(r => r.status === "REJECTED").length;
    const cancelled = requests.filter(r => r.status === "CANCELLED").length;

    const handleApprove = async (row) => {
        try {
            const { value: comment } = await Swal.fire({
                title: "Approve request",
                input: "textarea",
                inputLabel: "Comment",
                inputPlaceholder: "Add comment...",
                showCancelButton: true
            });

            if (comment === undefined) return;

            await api.put(`/leave/approve/${row.id}`, {
                managerId: user.id,
                comment
            });

            Swal.fire("Approved!", "Leave approved successfully", "success");

            fetchData();
            
        } catch (error) {
            console.error(error);
            Swal.fire(
                "Error",
                error.response?.data?.message || "Something went wrong",
                "error"
            );
        }
        
    };

    const handleReject = async (row) => {
        try {
            const { value: comment } = await Swal.fire({
                title: "Reject request",
                input: "textarea",
                inputLabel: "Reason",
                showCancelButton: true,
                inputValidator: (v) => !v && "Please enter reason"
            });

            if (!comment) return;

            await api.put(`/leave/reject/${row.id}`, {
                managerId: user.id,
                comment
            });

            fetchData();
            
        } catch (error) {
            console.error(error);
            Swal.fire(
                "Error",
                error.response?.data?.message || "Something went wrong",
                "error"
            );
        }
       
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h3>Manager Dashboard</h3>
                    <span className="text-muted">Manage your team's leave requests</span>
                </div>
            </div>

            <div className="stats-grid">
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

            <div className="filter-card">
                <div className="filter-title">
                    <FaFilter />
                    <span>Filter</span>
                </div>

                <div className="filter-controls">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>


                    <input
                        type="date"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                    />

                    <input
                        type="date"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                    />

                </div>
            </div>

            <div className="table-card">
                <Table
                    data={requests}
                    tab="MANAGER"
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            </div>

        </div>
    );
}

export default ManagerDashboard;