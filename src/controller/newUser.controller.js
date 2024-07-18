import getUserModelForBatch from "../models/userLogin.model.js";
import bcrypt from 'bcryptjs';

// ------------New User Add---------- ✅
export const newUserAdd = async (req, res) => {
  try {
    const { name, username, password, batchnumber } = req.body;

    // Validate the batchnumber
    if (!batchnumber) {
      return res.status(400).json({ success: false, message: "Batch number is required" });
    }

    // Get the User model for the specified batch
    const User = getUserModelForBatch(batchnumber);

    // Check if user already exists
    const user = await User.findOne({ username });

    if (user) {
      return res.json({ success: false, message: "User Already Exists" });
    }

    

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      batchnumber
    });

    // Save the new user to the database
    await newUser.save();
    console.log("New User Created");

    // Respond with success message
    res.status(201).json({
      success: true,
      message: `User created successfully\nID: ${username}`
    });
    
  } catch (error) {
    console.log("Error in SignUp controller", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
