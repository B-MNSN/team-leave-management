import { useState, useMemo, useEffect } from "react";
import { Modal, CloseButton, Alert } from "react-bootstrap";
import api from "../api/api";
import Swal from "sweetalert2";

function LeaveModal({ show, onClose }) {

    const [type, setType] = useState("");
    const [durationType, setDurationType] = useState("");
    const [halfPeriod, setHalfPeriod] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [reason, setReason] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [leaveQuota, setLeaveQuota] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!show) return;

        const fetchQuota = async () => {
            const res = await api.get(`/leave/balance/${user.id}`);
            setLeaveQuota(res.data);
        };

        fetchQuota();
    }, [show]);

    const calculateDays = () => {

        if (!start) return 0;

        if (durationType === "half") {
            return 0.5;
        }

        if (durationType === "single") {
            const d = new Date(start).getDay();
            if (d === 0 || d === 6) return 0;
            return 1;
        }

        if (durationType === "multiple") {

            if (!end) return 0;

            let count = 0;

            const startDate = new Date(start);
            const endDate = new Date(end);
            const current = new Date(startDate);

            while (current <= endDate) {

                const day = current.getDay();

                if (day !== 0 && day !== 6) {
                    count++;
                }

                current.setDate(current.getDate() + 1);
            }

            return count;
        }

        return 0;
    };

    const days = calculateDays();

    const selectedQuota = leaveQuota.find(
        (q) => q.id === type
    );

    const remainingAfterRequest = selectedQuota
        ? selectedQuota.remaining_days - days
        : 0;

    const quotaIndicator = useMemo(() => {

        if (!selectedQuota) return "safe";

        if (remainingAfterRequest < 0) return "exceed";

        const percent = remainingAfterRequest / selectedQuota.annual_quota;

        if (percent <= 0.2) return "near";

        return "safe";

    }, [remainingAfterRequest, selectedQuota]);

    const indicatorColor = {
        safe: "text-success",
        near: "text-warning",
        exceed: "text-danger"
    };

    const error = useMemo(() => {

        const today = new Date();
        today.setHours(0,0,0,0);

        if (!type) return "Please select leave type";

        if (!durationType) return "Please select leave duration";

        if (!start) return "Please select start date";

        if (!reason.trim()) return "Please enter reason";

        const startDate = new Date(start);

        if (startDate < today) {
            return "Cannot request leave in the past";
        }

        if (durationType === "multiple" && !end) {
            return "Please select end date";
        }

        if (durationType === "half" && !halfPeriod) {
            return "Please select morning or afternoon";
        }

        if (start && end) {

            const endDate = new Date(end);

            if (endDate < startDate) {
                return "End date cannot be before start date";
            }
        }

        if (days <= 0) {
            return "Leave cannot include weekends only";
        }

        if (selectedQuota && remainingAfterRequest < 0) {
            return "Leave quota exceeded";
        }

        return "";

    }, [type, start, end, durationType, halfPeriod, days, reason, selectedQuota, remainingAfterRequest]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setSubmitted(true);

        if (error) return;

        let duration = "FULL";

        if (durationType === "half") {
            duration = halfPeriod === "morning" ? "HALF_AM" : "HALF_PM";
        }

        const payload = {
            user_id: user.id,
            leave_type_id: type,
            start_date: start,
            end_date: durationType === "multiple" ? end : start,
            duration,
            total_days: days,
            reason
        };

        try {

            await api.post("/leave/request", payload);

            Swal.fire({
                icon: "success",
                title: "Leave Request Submitted",
                text: "Your leave request has been created successfully",
                confirmButtonColor: "#111"
            });

            resetForm();
            onClose();

        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Something went wrong";

            Swal.fire({
                icon: "error",
                title: "Leave Request Failed",
                text: message,
                confirmButtonColor: "#111"
            });
            console.error(err);
        }
    };

    const resetForm = () => {

        setType("");
        setDurationType("");
        setHalfPeriod("");
        setStart("");
        setEnd("");
        setReason("");
        setSubmitted(false);
    };

    return (
        <Modal show={show} onHide={onClose} centered size="lg">

            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="m-0">Create Leave Request</h5>
                <CloseButton onClick={onClose} />
            </div>

            <Modal.Body>

                {submitted && error && (
                    <Alert variant="danger">{error}</Alert>
                )}

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

                    <div>

                        <label className="form-label">
                            Leave Type
                        </label>

                        <select
                            className="form-select"
                            value={type}
                            onChange={(e) => setType(Number(e.target.value))}
                        >

                            <option value="">Select</option>

                            {leaveQuota.map((q) => (
                                <option key={q.id} value={q.id}>
                                    {q.name} ({q.remaining_days} days left)
                                </option>
                            ))}

                        </select>

                    </div>


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
                                    onChange={(e) => setDurationType(e.target.value)}
                                />
                                Half Day
                            </label>

                            <label className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="duration"
                                    value="single"
                                    onChange={(e) => setDurationType(e.target.value)}
                                />
                                Full Day
                            </label>

                            <label className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="duration"
                                    value="multiple"
                                    onChange={(e) => setDurationType(e.target.value)}
                                />
                                Multiple Days
                            </label>

                        </div>

                    </div>


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
                                        onChange={(e) => setHalfPeriod(e.target.value)}
                                    />
                                    Morning
                                </label>

                                <label className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="half"
                                        value="afternoon"
                                        onChange={(e) => setHalfPeriod(e.target.value)}
                                    />
                                    Afternoon
                                </label>

                            </div>

                        </div>

                    )}


                    <div className="row g-2">

                        <div className="col">

                            <label className="form-label">
                                Start Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
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
                                    onChange={(e) => setEnd(e.target.value)}
                                />

                            </div>

                        )}

                    </div>


                    <div>

                        <label className="form-label">
                            Reason
                        </label>

                        <textarea
                            className="form-control"
                            rows="3"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />

                    </div>


                    {type && days > 0 && selectedQuota && (

                        <div className="bg-light rounded p-3">

                            <div className="text-dark fw-semibold mb-2">
                                Leave Summary
                            </div>

                            <div>
                                Requested: <b>{days} days</b>
                            </div>

                            <div>
                                Current quota: <b>{selectedQuota.remaining_days} days</b>
                            </div>

                            <div>
                                Remaining after request:{" "}
                                <b className={indicatorColor[quotaIndicator]}>
                                    {remainingAfterRequest} days
                                </b>
                            </div>

                            {quotaIndicator === "near" && (
                                <div className="text-warning small mt-1">
                                    Near quota limit
                                </div>
                            )}

                            {quotaIndicator === "exceed" && (
                                <div className="text-danger small mt-1">
                                    Leave request exceeds quota
                                </div>
                            )}

                        </div>

                    )}


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
                            disabled={!!error || quotaIndicator === "exceed"}
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