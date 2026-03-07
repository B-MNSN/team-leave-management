import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import LeaveModal from "../components/LeaveModal";
import Table from "../components/Table";
import LeaveBalance from "../components/LeaveBalance";
import { useEffect } from "react";
import api from "../api/api";
import Swal from "sweetalert2";

function LeavePage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [tab, setTab] = useState("REQUEST");
    const [open, setOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [requests, setRequests] = useState([]);
    const [history, setHistory] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(null);

    const fetchData = async () => {
        try {
            const resRequests = await api.get(`/leave/requests/${user.id}`);
            if (resRequests.status === 200) {
                setRequests(resRequests?.data || []);
            }

            const resHistory = await api.get(`/leave/history/${user.id}`);
            if (resHistory.status === 200) {
                setHistory(resHistory?.data || []);
            }

        } catch (error) {
            console.log(error)

        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredLeaves = history?.filter((leave) => {
        if (filterStatus === "ALL") return true;
        return leave.status === filterStatus;
    });

    const handleEdit = (row) => {
        setSelectedLeave(row);
        setOpen(true);
    };

    const handleCancel = async (row) => {
        const confirm = await Swal.fire({
            title: "Cancel leave request?",
            text: "This action cannot be undone",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it"
        });

        if (!confirm.isConfirmed) return;

        try {

            await api.patch(`/leave/request/${row.id}/cancel`, {
                user_id: row.user_id
            });

            Swal.fire("Cancelled", "Leave request cancelled", "success");

            fetchLeaveRequests(); // reload table

        } catch (err) {

            Swal.fire("Error", err.response?.data?.message, "error");

        }
    };

    return (
        <div className="leave-page">

            {/* Tabs */}
            <div className="leave-tabs">

                <button
                    className={tab === "REQUEST" ? "tab active" : "tab"}
                    onClick={() => setTab("REQUEST")}
                >
                    Leave Request
                </button>

                <button
                    className={tab === "HISTORY" ? "tab active" : "tab"}
                    onClick={() => setTab("HISTORY")}
                >
                    Leave History
                </button>

            </div>


            <div className="mt-4">

                {/* REQUEST TAB */}
                {tab === "REQUEST" && (

                    <>

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h5 className="fw-semibold m-0">
                                Leave Requests
                            </h5>

                            <button
                                className="btn btn-dark btn-sm d-flex align-items-center gap-2"
                                onClick={() => setOpen(true)}
                            >
                                <FaPlus size={10} />
                                Request Leave
                            </button>

                        </div>

                        <LeaveBalance />

                        <Table 
                            data={requests}
                            tab="REQUEST" 
                            onEdit={handleEdit}
                            onCancel={handleCancel}
                        />

                    </>
                )}


                {/* HISTORY TAB */}

                {tab === "HISTORY" && (

                    <>

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h5 className="fw-semibold m-0">
                                Leave History
                            </h5>

                            <select
                                className="form-select w-auto"
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="ALL">All</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="PENDING">Pending</option>
                            </select>

                        </div>

                        <Table data={filteredLeaves} tab="HISTORY" />

                    </>
                )}

            </div>


            <LeaveModal
                show={open}
                onClose={() => {
                    setOpen(false);
                    setSelectedLeave(null);
                }}
                leaveData={selectedLeave}
                onSuccess={fetchData}
            />

        </div>
    );
}

export default LeavePage;