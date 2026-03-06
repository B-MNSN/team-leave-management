const express = require('express');
const router = express.Router();
const { getLeaveRequestsByUserId, getLeaveHistoryByUserId, createLeaveRequest, getLeaveBalanceByUserId } = require('../controllers/leaveController');

router.get('/requests/:userId', getLeaveRequestsByUserId);
router.get('/history/:userId', getLeaveHistoryByUserId);
router.get('/balance/:userId', getLeaveBalanceByUserId);

router.post('/request', createLeaveRequest);

module.exports = router;