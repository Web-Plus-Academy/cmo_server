import Mentor from "../models/mentorAdd.model.js";  
import bcrypt from 'bcryptjs';

// ------------New User Add---------- ✅
export const newMentorAdd = async (req, res) => {
  const { mentorId, name, phoneNumber, emailId, password } = req.body;

  try {
    console.log(name)
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newMentor = new Mentor({
      mentorId,
      name,
      phoneNumber,
      emailId,
      password: hashedPassword,  // Save the hashed password
    });

    await newMentor.save();
  
    res.status(201).json({ success: true, message: 'Mentor added successfully' });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success: false, message: 'Error adding mentor', error: error.message });
  }
};

export const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find(); // Fetch all mentors from the database
    res.json({ success: true, mentors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching mentors' });
  }
}


export const updateMentees = async (req, res) => {
  const { mentorId } = req.params;
  const { menteeId } = req.body;

  try {
    // Find the mentor by ID
    const mentor = await Mentor.findOne({ mentorId });
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    // Add mentee ID to the mentees array
    if (!mentor.mentees.includes(menteeId)) {
      mentor.mentees.push(menteeId);
      await mentor.save();
      return res.json({ success: true, message: 'Mentee added successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Mentee already added' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding mentee' });
  }
}

export const removeMentees = async (req, res) => {
  const { mentorId } = req.params;
  const { menteeId } = req.body;

  try {
    // Find the mentor by ID
    const mentor = await Mentor.findOne({ mentorId });
    if (!mentor) {
      return res.status(404).json({ success: false, message: 'Mentor not found' });
    }

    // Remove the mentee ID from the mentees array
    const menteeIndex = mentor.mentees.indexOf(menteeId);
    if (menteeIndex !== -1) {
      mentor.mentees.splice(menteeIndex, 1); // Remove the mentee
      await mentor.save();
      return res.json({ success: true, message: 'Mentee removed successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Mentee not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error removing mentee' });
  }
}