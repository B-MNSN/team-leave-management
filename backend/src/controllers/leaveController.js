const db = require("../../config/db");

const getLeaveRequestsByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const sql = `
            SELECT lq.*, leave_types.name as leave_type_name FROM leave_requests lq
            LEFT JOIN leave_types ON lq.leave_type_id = leave_types.id
            WHERE lq.user_id = ?
            ORDER BY created_at DESC
        `;

        const [rows] = await db.query(sql, [userId]);

        res.json(rows);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching leave requests' });
    }
};


const getLeaveHistoryByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const sql = `
            SELECT lq.*, leave_types.name as leave_type_name FROM leave_requests lq
            LEFT JOIN leave_types ON lq.leave_type_id = leave_types.id
            WHERE status IN ("approved", "rejected", "cancelled") AND user_id = ?
        `;

        const [rows] = await db.query(sql, [userId]);

        res.json(rows);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching leave history' });
    }
};

const getLeaveBalanceByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const sql = `
            SELECT
                lt.id,
                lt.code,
                lt.name,
                lt.annual_quota,
                COALESCE(SUM(lr.total_days),0) AS used_days,
                (lt.annual_quota - COALESCE(SUM(lr.total_days),0)) AS remaining_days
            FROM leave_types lt
            LEFT JOIN leave_requests lr
                ON lr.leave_type_id = lt.id
                AND lr.user_id = ?
                AND lr.status = 'APPROVED'
                AND YEAR(lr.start_date) = YEAR(CURDATE())
            GROUP BY lt.id, lt.code, lt.name, lt.annual_quota;
        `;

        const [rows] = await db.query(sql, [userId]);

        const results = rows.map(row => ({
            ...row,
            annual_quota: Number(row.annual_quota),
            used_days: Number(row.used_days),
            remaining_days: Number(row.remaining_days)
        }));

        res.json(results);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching leave balance' });
    }
};

const createLeaveRequest = async (req, res) => {
    let conn;

    try {
        conn = await db.getConnection();

        const {
            user_id,
            leave_type_id,
            start_date,
            end_date,
            duration,
            total_days,
            reason
        } = req.body;

        if (!user_id || !leave_type_id || !start_date) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const start = new Date(start_date);
        const end = new Date(end_date);

        if (end < start) {
            return res.status(400).json({
                message: "End date cannot be before start date"
            });
        }

        await conn.beginTransaction();

        // CHECK USER
        const [user] = await conn.query(
            "SELECT id FROM users WHERE id = ?",
            [user_id]
        );

        if (user.length === 0) {
            throw new Error("User not found");
        }

        // CHECK OVERLAPPING
        const [overlap] = await conn.query(
            `
            SELECT id
            FROM leave_requests
            WHERE user_id = ?
            AND status IN ('PENDING','APPROVED')
            AND (
                start_date <= ?
                AND end_date >= ?
            )
            `,
            [user_id, end_date, start_date]
        );

        if (overlap.length > 0) {
            throw new Error("Leave request overlaps with existing request");
        }

        // GET QUOTA
        const [quota] = await conn.query(
            `
            SELECT annual_quota
            FROM leave_types
            WHERE id = ?
            `,
            [leave_type_id]
        );

        if (quota.length === 0) {
            throw new Error("Leave type not found");
        }

        const annualQuota = quota[0].annual_quota;

        // USED DAYS
        const [used] = await conn.query(
            `
            SELECT COALESCE(SUM(total_days),0) used_days
            FROM leave_requests
            WHERE user_id = ?
            AND leave_type_id = ?
            AND status = 'APPROVED'
            `,
            [user_id, leave_type_id]
        );

        const usedDays = used[0].used_days;

        const remaining = annualQuota - usedDays;

        if (total_days > remaining) {
            throw new Error("Insufficient leave balance");
        }

        // WEEKEND VALIDATION
        const startDay = start.getDay();
        const endDay = end.getDay();

        if (startDay === 0 || startDay === 6 || endDay === 0 || endDay === 6) {
            throw new Error("Weekend cannot be counted as leave day");
        }

        // INSERT REQUEST
        const [result] = await conn.query(
            `
            INSERT INTO leave_requests
            (user_id, leave_type_id, start_date, end_date, duration, total_days, reason)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                user_id,
                leave_type_id,
                start_date,
                end_date,
                duration,
                total_days,
                reason
            ]
        );

        const leaveId = result.insertId;

        // LOG
        await conn.query(
            `
            INSERT INTO leave_request_logs
            (leave_request_id, action, action_by)
            VALUES (?, 'CREATED', ?)
            `,
            [leaveId, user_id]
        );

        await conn.commit();

        res.status(201).json({
            message: "Leave request created",
            id: leaveId
        });

    } catch (error) {

        if (conn) await conn.rollback();

        res.status(400).json({
            message: error.message
        });

    } finally {
        if (conn) conn.release();
    }
};

const updateLeaveRequest = async (req, res) => {
    let conn;

    try {
        conn = await db.getConnection();

        const { id } = req.params;
        const {
            user_id,
            leave_type_id,
            start_date,
            end_date,
            duration,
            total_days,
            reason
        } = req.body;

        if (!user_id || !leave_type_id || !start_date) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        const start = new Date(start_date);
        const end = new Date(end_date);

        if (end < start) {
            return res.status(400).json({
                message: "End date cannot be before start date"
            });
        }

        await conn.beginTransaction();

        // CHECK USER
        const [user] = await conn.query(
            "SELECT id FROM users WHERE id = ?",
            [user_id]
        );

        if (user.length === 0) {
            throw new Error("User not found");
        }

        // CHECK OVERLAPPING
        const [overlap] = await conn.query(
            `
            SELECT id
            FROM leave_requests
            WHERE user_id = ?
            AND status IN ('PENDING','APPROVED')
            AND (
                start_date <= ?
                AND end_date >= ?
            )
            `,
            [user_id, end_date, start_date]
        );

        if (overlap.length > 0) {
            throw new Error("Leave request overlaps with existing request");
        }

        // GET QUOTA
        const [quota] = await conn.query(
            `
            SELECT annual_quota
            FROM leave_types
            WHERE id = ?
            `,
            [leave_type_id]
        );

        if (quota.length === 0) {
            throw new Error("Leave type not found");
        }

        const annualQuota = quota[0].annual_quota;

        // USED DAYS
        const [used] = await conn.query(
            `
            SELECT COALESCE(SUM(total_days),0) used_days
            FROM leave_requests
            WHERE user_id = ?
            AND leave_type_id = ?
            AND status = 'APPROVED'
            `,
            [user_id, leave_type_id]
        );

        const usedDays = used[0].used_days;

        const remaining = annualQuota - usedDays;

        if (total_days > remaining) {
            throw new Error("Insufficient leave balance");
        }

        // WEEKEND VALIDATION
        const startDay = start.getDay();
        const endDay = end.getDay();

        if (startDay === 0 || startDay === 6 || endDay === 0 || endDay === 6) {
            throw new Error("Weekend cannot be counted as leave day");
        }

        //update leave
        await conn.query(
            `
            UPDATE leave_requests
            SET 
                leave_type_id = ?,
                start_date = ?,
                end_date = ?,
                duration = ?,
                total_days = ?,
                reason = ?
            WHERE id = ?
            `,
            [
                leave_type_id,
                start_date,
                end_date,
                duration,
                total_days,
                reason,
                id
            ]
        );

        await conn.query(
            `
            INSERT INTO leave_request_logs
            (leave_request_id, action, action_by)
            VALUES (?, 'UPDATED', ?)
            `,
            [id, user_id]
        );

        await conn.commit();

        res.json({
            message: "Leave request updated successfully"
        });

    } catch (err) {

        if (conn) await conn.rollback();

        console.error(err);

        res.status(500).json({
            message: "Failed to update leave request"
        });

    } finally {

        if (conn) conn.release();

    }
};

const cancelLeaveRequest = async (req, res) => {
    let conn;

    try {
        conn = await db.getConnection();

        const { id } = req.params;
        const { user_id } = req.body;

        await conn.beginTransaction();

        const [leave] = await conn.query(
            `SELECT status FROM leave_requests WHERE id = ?`,
            [id]
        );

        if (leave.length === 0) {
            throw new Error("Leave request not found");
        }

        if (leave[0].status === "CANCELLED") {
            throw new Error("Leave already cancelled");
        }

        if (leave[0].status === "APPROVED") {
            throw new Error("Approved leave cannot be cancelled");
        }

        await conn.query(
            `
                UPDATE leave_requests
                SET status = 'CANCELLED'
                WHERE id = ?
            `,
            [id]
        );

        await conn.query(
            `
                INSERT INTO leave_request_logs
                (leave_request_id, action, action_by)
                VALUES (?, 'CANCELLED', ?)
            `,
            [id, user_id]
        );

        await conn.commit();

        res.json({
            message: "Leave request cancelled"
        });

    } catch (err) {

        if (conn) await conn.rollback();

        res.status(400).json({
            message: err.message
        });

    } finally {

        if (conn) conn.release();

    }
};

const approveLeave = async (req, res) => {
    try {

        const { id } = req.params;
        const { managerId, comment } = req.body;

        // check current status
        const [rows] = await db.query(
            "SELECT status FROM leave_requests WHERE id = ?",
            [id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: "Leave request not found" });
        }

        if (rows[0].status !== "PENDING") {
            return res.status(400).json({
                message: "This leave request has already been processed"
            });
        }

        await db.query(
            `
                UPDATE leave_requests
                SET status = 'APPROVED',
                    approved_by = ?,
                    manager_comment = ?
                WHERE id = ?
            `,
            [managerId, comment || null, id]
        );

        res.json({ message: "Leave approved successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const rejectLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { managerId, comment } = req.body;

        if (!comment || comment.trim() === "") {
            return res.status(400).json({
                message: "Rejection reason is required"
            });
        }

        const [rows] = await db.query(
            "SELECT status FROM leave_requests WHERE id = ?",
            [id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: "Leave request not found" });
        }

        if (rows[0].status !== "PENDING") {
            return res.status(400).json({
                message: "This leave request has already been processed"
            });
        }

        await db.query(
            `
                UPDATE leave_requests
                SET status = 'REJECTED',
                    approved_by = ?,
                    manager_comment = ?
                WHERE id = ?
            `,
            [managerId, comment, id]
        );

        res.json({ message: "Leave rejected successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getLeaveTeam = async (req, res) => {
    try {
        const { managerId } = req.params;
        const { status, start, end } = req.query;

        let query = `
            SELECT 
                lr.id,
                u.name AS employee,
                lt.name AS leave_type_name,
                lr.start_date,
                lr.end_date,
                lr.duration,
                lr.total_days,
                lr.reason,
                lr.status,
                lr.manager_comment
            FROM leave_requests lr
            JOIN users u 
                ON lr.user_id = u.id
            JOIN leave_types lt 
                ON lr.leave_type_id = lt.id
            WHERE u.manager_id = ?
        `;

        const params = [managerId];

        if (status) {
            query += ` AND lr.status = ?`;
            params.push(status);
        }

        if (start && end) {
            query += ` AND lr.start_date BETWEEN ? AND ?`;
            params.push(start, end);
        }

        query += ` ORDER BY lr.created_at DESC`;

        const [rows] = await db.query(query, params);

        res.json(rows);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching team leave requests' });
    }
};

module.exports = {
    getLeaveRequestsByUserId,
    createLeaveRequest,
    getLeaveHistoryByUserId,
    getLeaveBalanceByUserId,
    updateLeaveRequest,
    rejectLeave,
    approveLeave,
    cancelLeaveRequest,
    getLeaveTeam,
};