import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import LeaveModal from "../components/LeaveModal";
import Table from "../components/Table";
import LeaveBalance from "../components/LeaveBalance";

function LeavePage() {

    const [tab, setTab] = useState("REQUEST");
    const [open, setOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("ALL");

    const leaves = [
        {
            id: 1,
            type: "Annual Leave",
            date: "10 - 12 Mar",
            days: 3,
            duration: "FULL",
            status: "PENDING",
            reason: "Vacation"
        },
        {
            id: 2,
            type: "Sick Leave",
            date: "20 Feb",
            days: 0.5,
            duration: "HALF_AM",
            status: "APPROVED",
            reason: "Flu"
        },
        {
            id: 3,
            type: "Personal Leave",
            date: "25 Feb",
            days: 0.5,
            duration: "HALF_PM",
            status: "REJECTED",
            reason: "Family business"
        }
    ];

    const leaveBalance = {
        annual: 10,
        sick: 30,
        personal: 6
    };

    const getDurationLabel = (duration) => {
        if (duration === "HALF_AM") return "Morning";
        if (duration === "HALF_PM") return "Afternoon";
        return "Full Day";
    };

    const filteredLeaves = leaves.filter((leave) => {
        if (filterStatus === "ALL") return true;
        return leave.status === filterStatus;
    });

    const requestColumns = [
        { header: "Type", accessor: "type" },
        { header: "Date", accessor: "date" },
        {
            header: "Duration",
            render: (row) => getDurationLabel(row.duration)
        },
        { header: "Days", accessor: "days" },
        {
            header: "Status",
            render: (row) => (
                <span
                    className={`badge-soft
                    ${row.status === "APPROVED" && "badge-soft-success"}
                    ${row.status === "REJECTED" && "badge-soft-danger"}
                    ${row.status === "PENDING" && "badge-soft-warning"}
                    `}
                >
                    {row.status}
                </span>
            )
        }
    ];

    const historyColumns = [
        { header: "Date", accessor: "date" },
        { header: "Type", accessor: "type" },
        {
            header: "Duration",
            render: (row) => getDurationLabel(row.duration)
        },
        { header: "Days", accessor: "days" },
        {
            header: "Status",
            render: (row) => (
                <span
                    className={`badge-soft
                    ${row.status === "APPROVED" && "badge-soft-success"}
                    ${row.status === "REJECTED" && "badge-soft-danger"}
                    ${row.status === "PENDING" && "badge-soft-warning"}
                    `}
                >
                    {row.status}
                </span>
            )
        },
        { header: "Reason", accessor: "reason" }
    ];

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

                        {/* Leave Balance */}
                        <LeaveBalance balance={leaveBalance} />

                        <Table
                            columns={requestColumns}
                            data={leaves}
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

                        <Table
                            columns={historyColumns}
                            data={filteredLeaves}
                        />

                    </>
                )}

            </div>


            <LeaveModal
                show={open}
                onClose={() => setOpen(false)}
            />

        </div>
    );
}

export default LeavePage;