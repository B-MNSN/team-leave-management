import { FiEdit2 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiCheck, FiX } from "react-icons/fi";

function Table({ tab, data, onEdit, onCancel, onApprove, onReject }) {

    const getDurationLabel = (duration) => {
        if (duration === "HALF_AM") return "Morning";
        if (duration === "HALF_PM") return "Afternoon";
        return "Full Day";
    };

    const formatLeaveDate = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const dayStart = startDate.getDate();
        const dayEnd = endDate.getDate();

        const monthStart = startDate.toLocaleString("en-US", { month: "short" });
        const monthEnd = endDate.toLocaleString("en-US", { month: "short" });

        const yearStart = startDate.getFullYear();
        const yearEnd = endDate.getFullYear();

        // same day
        if (startDate.toDateString() === endDate.toDateString()) {
            return `${dayStart} ${monthStart} ${yearStart}`;
        }

        // same month same year
        if (monthStart === monthEnd && yearStart === yearEnd) {
            return `${dayStart}–${dayEnd} ${monthStart} ${yearStart}`;
        }

        // different month same year
        if (yearStart === yearEnd) {
            return `${dayStart} ${monthStart} – ${dayEnd} ${monthEnd} ${yearStart}`;
        }

        // different year
        return `${dayStart} ${monthStart} ${yearStart} – ${dayEnd} ${monthEnd} ${yearEnd}`;
    };

    return (
        <table className="table table-hover leave-table">
            <thead>
                <tr>
                    <th>No.</th>
                    {tab === "MANAGER" && (
                        <th>User name</th>
                    )}
                    <th>Date</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Reason</th>
                    {((tab === "REQUEST" && (onEdit || onCancel)) || tab === "MANAGER") && (
                        <th className="text-center">Action</th>
                    )}
                </tr>
            </thead>

            <tbody>

                {data.length === 0 ? (
                    <tr>
                        <td colSpan="8" className="text-center py-4">
                            No data available
                        </td>
                    </tr>
                ) : (
                    data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>{rowIndex + 1}</td>
                            {row.employee && (
                                <td>{row.employee}</td>
                            )}
                            <td>{formatLeaveDate(row.start_date, row.end_date)}</td>
                            <td>{row.leave_type_name}</td>
                            <td>{getDurationLabel(row.duration)}</td>
                            <td>{row.total_days}</td>
                            <td>
                                <span
                                    className={`badge-soft
                                        ${row.status === "APPROVED" && "badge-soft-success"}
                                        ${row.status === "REJECTED" && "badge-soft-danger"}
                                        ${row.status === "PENDING" && "badge-soft-warning"}
                                        ${row.status === "CANCELLED" && "badge-soft-secondary"}
                                    `}
                                >
                                    {row.status}
                                </span>
                            </td>
                            <td>{row.reason}</td>
                            {tab === "REQUEST" && row.status === "PENDING" && (onEdit || onCancel) && (
                                <td className="text-center">
                                    <div className="d-flex justify-content-center align-items-center gap-3">
                                        <FiEdit2
                                            style={{ cursor: "pointer" }}
                                            onClick={() => onEdit(row)}
                                        />
                                        <FaRegTrashCan
                                            style={{ cursor: "pointer" }}
                                            className="text-danger"
                                            onClick={() => onCancel(row)}
                                        />
                                    </div>
                                </td>
                            )}
                            <td>
                                {tab === "MANAGER" && row.status === "PENDING" && (
                                    <div className="d-flex gap-2">
                                        <button
                                            className="icon-btn approve"
                                            onClick={() => onApprove(row)}
                                        >
                                            <FiCheck />
                                        </button>

                                        <button
                                            className="icon-btn reject"
                                            onClick={() => onReject(row)}
                                        >
                                            <FiX />
                                        </button>

                                    </div>
                                )}
                            </td>
                        </tr>

                    ))
                )}
            </tbody>

        </table>
    );
}

export default Table;