import { useState, useMemo } from "react";
import { Modal, CloseButton, Alert } from "react-bootstrap";

function LeaveModal({ show, onClose }) {
    const [type, setType] = useState("");
    const [durationType, setDurationType] = useState("");
    const [halfPeriod, setHalfPeriod] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [reason, setReason] = useState("");

    const leaveQuota = {
        annual: 10,
        sick: 30,
        personal: 6
    };

    const calculateDays = () => {
        if (!start) return 0;

        if (durationType === "half") {
            return 0.5;
        }

        if (durationType === "single") {
            return 1;
        }

        if (durationType === "multiple") {
            if (!end) return 0;

            const startDate = new Date(start);
            const endDate = new Date(end);

            const diff =
                (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;

            return diff;
        }

        return 0;
    };

    const days = calculateDays();

    const error = useMemo(() => {

        if (!type || !start) return "";

        if (durationType === "multiple" && !end) {
            return "Please select end date";
        }

        if (durationType === "half" && !halfPeriod) {
            return "Please select morning or afternoon";
        }

        if (days > leaveQuota[type]) {
            return "Leave quota exceeded";
        }

        return "";

    }, [type, start, end, durationType, halfPeriod, days]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (error) return;

        console.log({
            type,
            durationType,
            halfPeriod,
            start,
            end,
            days,
            reason
        });

        resetForm();
        onClose();
    };

    const resetForm = () => {
        setType("");
        setDurationType("");
        setHalfPeriod("");
        setStart("");
        setEnd("");
        setReason("");
    };

    return (
        <Modal show={show} onHide={onClose} centered size="lg">

            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="m-0">Create Leave Request</h5>
                <CloseButton onClick={onClose} />
            </div>

            <Modal.Body>

                {error && (
                    <Alert variant="danger">{error}</Alert>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="d-flex flex-column gap-3"
                >

                    {/* Leave Type */}

                    <div>
                        <label className="form-label">
                            Leave Type
                        </label>

                        <select
                            className="form-select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="annual">Annual Leave</option>
                            <option value="sick">Sick Leave</option>
                            <option value="personal">Personal Leave</option>
                        </select>
                    </div>

                    {/* Duration Type */}

                    <div>

                        <label className="form-label">
                            Leave Duration
                        </label>

                        <div className="d-flex gap-3 flex-wrap">

                            <label className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="duration"
                                    value="half"
                                    onChange={(e) =>
                                        setDurationType(e.target.value)
                                    }
                                />
                                Half Day
                            </label>

                            <label className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="duration"
                                    value="single"
                                    onChange={(e) =>
                                        setDurationType(e.target.value)
                                    }
                                />
                                Full Day
                            </label>

                            <label className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="duration"
                                    value="multiple"
                                    onChange={(e) =>
                                        setDurationType(e.target.value)
                                    }
                                />
                                Multiple Days
                            </label>

                        </div>

                    </div>

                    {/* Half Day Period */}

                    {durationType === "half" && (
                        <div>

                            <label className="form-label">
                                Half Day Period
                            </label>

                            <div className="d-flex gap-3">

                                <label className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="half"
                                        value="morning"
                                        onChange={(e) =>
                                            setHalfPeriod(e.target.value)
                                        }
                                    />
                                    Morning
                                </label>

                                <label className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="half"
                                        value="afternoon"
                                        onChange={(e) =>
                                            setHalfPeriod(e.target.value)
                                        }
                                    />
                                    Afternoon
                                </label>

                            </div>

                        </div>
                    )}

                    {/* Date */}

                    <div className="row g-2">

                        <div className="col">

                            <label className="form-label">
                                Start Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={start}
                                onChange={(e) =>
                                    setStart(e.target.value)
                                }
                            />

                        </div>

                        {durationType === "multiple" && (

                            <div className="col">

                                <label className="form-label">
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={end}
                                    onChange={(e) =>
                                        setEnd(e.target.value)
                                    }
                                />

                            </div>

                        )}

                    </div>

                    {/* Reason */}

                    <div>

                        <label className="form-label">
                            Reason
                        </label>

                        <textarea
                            className="form-control"
                            rows="3"
                            value={reason}
                            onChange={(e) =>
                                setReason(e.target.value)
                            }
                        />

                    </div>

                    {/* Summary */}

                    {type && days > 0 && (

                        <div className="bg-light rounded p-3">

                            <div className="small text-muted">
                                Leave Summary
                            </div>

                            <div>
                                Requested: <b>{days} days</b>
                            </div>

                            <div>
                                Remaining quota:{" "}
                                <b>
                                    {leaveQuota[type] - days} days
                                </b>
                            </div>

                        </div>

                    )}

                    {/* Buttons */}

                    <div className="d-flex justify-content-end gap-2 mt-2">

                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-dark"
                            disabled={!!error}
                        >
                            Submit Request
                        </button>

                    </div>

                </form>

            </Modal.Body>

        </Modal>
    );
}

export default LeaveModal;