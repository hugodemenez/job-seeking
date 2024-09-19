import { Schema, model, models } from 'mongoose';

interface JobOffer {
  title: string;
  position: string;
  description: string;
  postedDate: Date;
}

const jobOfferSchema = new Schema<JobOffer>({
  title: { type: String, required: true },
  position: { type: String, required: true },
  description: { type: String, required: true },
  postedDate: { type: Date, required: true },
});

const JobOffer = models.JobOffer || model<JobOffer>('JobOffer', jobOfferSchema);

export default JobOffer;