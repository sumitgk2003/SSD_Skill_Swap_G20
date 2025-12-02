import Dispute from '../models/dispute.model.js';

export const createDispute = async (req, res) => {
  try {
    const { reportedId, matchId, skill, reason, metadata } = req.body;
    if (!reportedId || !reason) return res.status(400).json({ success: false, message: 'reportedId and reason are required' });

    const dispute = new Dispute({
      reporter: req.user?._id || req.body.reporterId || null,
      reported: reportedId,
      matchId: matchId || null,
      skill: skill || '',
      reason,
      metadata: metadata || {},
    });

    await dispute.save();

    return res.status(201).json({ success: true, data: dispute });
  } catch (err) {
    console.error('createDispute error', err);
    return res.status(500).json({ success: false, message: String(err.message || err) });
  }
};

export const getAllDisputes = async (req, res) => {
  try {
    // Admin only route in router
    const disputes = await Dispute.find().populate('reporter', 'name email').populate('reported', 'name email').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: disputes });
  } catch (err) {
    console.error('getAllDisputes error', err);
    return res.status(500).json({ success: false, message: String(err.message || err) });
  }
};

export const updateDisputeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Pending Review', 'Resolved', 'Rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    const dispute = await Dispute.findByIdAndUpdate(id, { status }, { new: true }).populate('reporter', 'name email').populate('reported', 'name email');
    if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });
    return res.status(200).json({ success: true, data: dispute });
  } catch (err) {
    console.error('updateDisputeStatus error', err);
    return res.status(500).json({ success: false, message: String(err.message || err) });
  }
};
