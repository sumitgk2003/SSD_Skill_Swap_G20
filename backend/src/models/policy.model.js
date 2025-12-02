import mongoose from 'mongoose';

const policySchema = new mongoose.Schema(
  {
    content: { type: String, default: '' }, // store HTML or markdown
  },
  { timestamps: true }
);

const SitePolicy = mongoose.model('SitePolicy', policySchema);
export default SitePolicy;
