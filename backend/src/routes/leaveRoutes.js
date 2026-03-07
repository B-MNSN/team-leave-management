const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

router.get('/requests/:userId', leaveController.getLeaveRequestsByUserId);
router.get('/history/:userId', leaveController.getLeaveHistoryByUserId);
router.get('/balance/:userId', leaveController.getLeaveBalanceByUserId);

router.post('/request', leaveController.createLeaveRequest);

router.put('/request/:id', leaveController.updateLeaveRequest);


router.patch("/request/:id/cancel", leaveController.cancelLeaveRequest);
router.patch("/request/:id/approve", leaveController.approveLeaveRequest);
router.patch("/request/:id/reject", leaveController.rejectLeaveRequest);

module.exports = router;