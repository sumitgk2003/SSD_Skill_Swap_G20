import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reported: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: false },
    skill: { type: String, default: '' },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending Review', 'Resolved', 'Rejected'], default: 'Pending Review' },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

const Dispute = mongoose.model('Dispute', disputeSchema);
export default Dispute;
