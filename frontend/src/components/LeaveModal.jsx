import { useState, useMemo, useEffect } from "react";
import { Modal, CloseButton, Alert } from "react-bootstrap";
import api from "../api/api";
import Swal from "sweetalert2";

const initialForm = {
    type: "",
    durationType: "",
    halfPeriod: "",
    start: "",
    end: "",
    reason: ""
};

function LeaveModal({ show, onClose, onSuccess, leaveData }) {
    const [form, setForm] = useState(initialForm);
    const [submitted, setSubmitted] = useState(false);
    const [leaveQuota, setLeaveQuota] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    const update = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const resetForm = () => {
        setForm(initialForm);
        setSubmitted(false);
    };

    const closeModal = () => {
        resetForm();
        onClose();
    };

    // fetch leave quota
    useEffect(() => {
        if (!show) return;

        const fetchQuota = async () => {
            try {
                const res = await api.get(`/leave/balance/${user.id}`);
                setLeaveQuota(res.data);

            } catch (err) {
                console.error(err);
            }
        };

        fetchQuota();
    }, [show]);

    const formatDate = (date) => {
        if (!date) return "";

        const d = new Date(date);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (!leaveData) return;
        setForm({
            type: leaveData.leave_type_id,
            start: formatDate(leaveData.start_date),
            end: leaveData.duration === "FULL" ?  "" : formatDate(leaveData.end_date),
            reason: leaveData.reason || "",
            durationType:
                leaveData.duration === "FULL"
                    ? "single"
                    : "half",
            halfPeriod:
                leaveData.duration === "HALF_AM"
                    ? "morning"
                    : leaveData.duration === "HALF_PM"
                    ? "afternoon"
                    : ""
        });

    }, [leaveData]);

    // calculate leave days
    const days = useMemo(() => {
        if (!form.start) return 0;

        if (form.durationType === "half") return 0.5;

        const startDate = new Date(form.start);

        if (form.durationType === "single") {

            const day = startDate.getDay();
            return day === 0 || day === 6 ? 0 : 1;

        }

        if (form.durationType === "multiple") {

            if (!form.end) return 0;

            let count = 0;

            const endDate = new Date(form.end);
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
    }, [form]);

    const selectedQuota = leaveQuota.find(
        (q) => q.id === form.type
    );

    const displayDays = days || leaveData?.total_days || 0;

    const remainingAfterRequest = selectedQuota
        ? selectedQuota.remaining_days - displayDays
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

        if (!form.type) return "Please select leave type";

        if (!form.durationType) return "Please select leave duration";

        if (!form.start) return "Please select start date";

        if (!form.reason.trim()) return "Please enter reason";

        const startDate = new Date(form.start);

        if (startDate < today) {
            return "Cannot request leave in the past";
        }

        if (form.durationType === "multiple" && !form.end) {
            return "Please select end date";
        }

        if (form.durationType === "half" && !form.halfPeriod) {
            return "Please select morning or afternoon";
        }

        if (form.end && new Date(form.end) < startDate) {
            return "End date cannot be before start date";
        }

        if (days <= 0) {
            return "Leave cannot include weekends only";
        }

        if (selectedQuota && remainingAfterRequest < 0) {
            return "Leave quota exceeded";
        }


        return "";

    }, [form, days, selectedQuota, remainingAfterRequest]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setSubmitted(true);

        if (error) return;

        let duration = "FULL";

        if (form.durationType === "half") {
            duration = form.halfPeriod === "morning"
                ? "HALF_AM"
                : "HALF_PM";
        }

        const payload = {
            user_id: user.id,
            leave_type_id: form.type,
            start_date: form.start,
            end_date:
                form.durationType === "multiple"
                    ? form.end
                    : form.start,
            duration,
            total_days: days,
            reason: form.reason
        };

        try {

            if (leaveData) {
                await api.put(`/leave/request/${leaveData.id}`, payload);
            } else {
                await api.post("/leave/request", payload);
            }

            Swal.fire({
                icon: "success",
                title: leaveData ? "Leave Updated" : "Leave Created",
                confirmButtonColor: "#111"
            });

            onSuccess();
            closeModal();

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

        }

    };

    return (
        <Modal show={show} onHide={closeModal} centered size="lg">

            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h5 className="m-0">
                    {leaveData ? "Edit Leave Request" : "Create Leave Request"}
                </h5>
                <CloseButton onClick={closeModal} />
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
                            value={form.type}
                            onChange={(e) => update("type", Number(e.target.value))}
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
                                    checked={form.durationType === "half"}
                                    onChange={() => update("durationType", "half")}
                                />
                                Half Day
                            </label>

                            <label className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    checked={form.durationType === "single"}
                                    onChange={() => update("durationType", "single")}
                                />
                                Full Day
                            </label>

                            <label className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    checked={form.durationType === "multiple"}
                                    onChange={() => update("durationType", "multiple")}
                                />
                                Multiple Days
                            </label>

                        </div>

                    </div>


                    {form.durationType === "half" && (

                        <div>

                            <label className="form-label">
                                Half Day Period
                            </label>

                            <div className="d-flex gap-3">

                                <label className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        checked={form.halfPeriod === "morning"}
                                        onChange={() => update("halfPeriod", "morning")}
                                    />
                                    Morning
                                </label>

                                <label className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        checked={form.halfPeriod === "afternoon"}
                                        onChange={() => update("halfPeriod", "afternoon")}
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
                                value={form.start}
                                onChange={(e) => update("start", e.target.value)}
                            />

                        </div>

                        {form.durationType === "multiple" && (

                            <div className="col">

                                <label className="form-label">
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={form.end}
                                    onChange={(e) => update("end", e.target.value)}
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
                            value={form.reason}
                            onChange={(e) => update("reason", e.target.value)}
                        />

                    </div>


                    {/* Leave Summary */}
                    {form.type && selectedQuota && form.start && (

                        <div className="bg-light rounded p-3">

                            <div className="text-dark fw-semibold mb-2">
                                Leave Summary
                            </div>

                            <div>
                                Requested: <b>{displayDays} days</b>
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
                            onClick={closeModal}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-dark"
                            disabled={quotaIndicator === "exceed"}
                        >
                            {leaveData ? "Update Request" : "Submit Request"}
                        </button>

                    </div>

                </form>

            </Modal.Body>

        </Modal>
    );
}

export default LeaveModal;