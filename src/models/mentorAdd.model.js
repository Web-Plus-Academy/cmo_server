import mongoose  from 'mongoose';

const mentorSchema = new mongoose.Schema({
  mentorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  emailId: { type: String, required: true },
  mentees: [{ type: String }]  
});

const Mentor = mongoose.model('Mentor', mentorSchema);
export default Mentor;
