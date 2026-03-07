const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

router.get('/requests/:userId', leaveController.getLeaveRequestsByUserId);
router.get('/history/:userId', leaveController.getLeaveHistoryByUserId);
router.get('/balance/:userId', leaveController.getLeaveBalanceByUserId);
router.get('/team/:managerId', leaveController.getLeaveTeam);

router.post('/request', leaveController.createLeaveRequest);

router.put('/request/:id', leaveController.updateLeaveRequest);
router.put("/approve/:id", leaveController.approveLeave);
router.put("/reject/:id", leaveController.rejectLeave);

router.patch("/request/:id/cancel", leaveController.cancelLeaveRequest);


module.exports = router;