import bycrypt from 'bcryptjs';
import generateTokenSetCookie from "../utils/generateToken.js";
import AdminSchema from '../models/adminLoginModel.js';
import getUserModelForBatch from '../models/userLogin.model.js';


// ------------Admin sign up---------- ✅
export const signUpAdmin = async (req, res) => {
    try {
        const { name, adminname, password } = req.body;
        const Admin = await AdminSchema.findOne({ adminname });

        if (Admin) {
            return res.json({ success: false, error: "Admin Already Exists" });
        }

        //Hashing the password
        const salt = await bycrypt.genSalt(10);
        const hashpassword = await bycrypt.hash(password, salt);

        const newAdmin = new AdminSchema({
            name,
            password: hashpassword,
            adminname
        })

        if (newAdmin) {
            //Generate JWT tokens
            generateTokenSetCookie(newAdmin._id, res);
            await newAdmin.save();
            console.log("New Admin Created")
            res.status(201).json({
                success: true,
                name: newAdmin.name,
                ID: adminname
            })
        }
        else {
            res.status(400).json({ success: false, message: "Invalid Admin data" });
        }

    } catch (error) {
        console.log("Error in SignUp controller", error.message);
        res.status(500).json({ success: false, message: error.message })
    }
}

// ------------Admin Login---------- ✅
export const logInAdmin = async (req, res) => {
    try {
        const { adminname, password } = req.body;
        const Admin = await AdminSchema.findOne({ adminname });
        const ispasswordCorrect = await bycrypt.compare(password, Admin?.password || "");

        if (!Admin) {
            return res.json({ success: false, message: "Invalid Adminname" });
        }

        if (!ispasswordCorrect) {
            return res.json({ success: false, message: "Invalid Password" });
        }

        generateTokenSetCookie(Admin._id, res);

        const time = getCurrentDateTime();

        console.log({ message: "Admin Loged In", time: time, Admin: adminname });
        res.status(200).json({ success: true, message: "Login Successful !", name: Admin.name, ID: Admin.adminname });

    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

// ------------Admin Logout---------- ✅
export const logOutAdmin = (req, res) => {
    try {
        console.log("Admin Log Out");
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Successfully", success: true });
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ error: "Internal Server error" })

    }
}

export const resetPOD = async (req, res) => {
    console.log("API endpoint hit: Cron job started");
    try {
        const batchNumbers = [1, 2, 3]; // Replace with your actual batch numbers
        for (const batchNumber of batchNumbers) {
          console.log(`Processing batch number: ${batchNumber}`);
          const UserModel = getUserModelForBatch(batchNumber);
          if (!UserModel) {
            console.error(`User model for batch ${batchNumber} not found`);
            continue;
          }
          const result = await UserModel.updateMany(
            { podSubmissionStatus: true },
            { $set: { podSubmissionStatus: false } }
          );
          console.log(`POD submission status reset for batch ${batchNumber}. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
        }
        // console.log("Cron job completed successfully");
        console.log("Cron job completed successfully");
        res.status(200).json({ message: 'POD submission status reset successfully', success: true });
    } catch (error) {
        console.error('Error resetting POD submission status:', error.message);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


// ---------- finding date and time at login ---------- ✅
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;


}


// --------------- update password -------------------
export const updatePassword =  async (req, res) => {
  const {adminname, oldPassword, newPassword } = req.body;
  try {
    const user = await AdminSchema.findOne({adminname});

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Check if the old password matches the stored password
    const isMatch = await bycrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: 'Old password is incorrect.',
      });
    }

    // // Validate the new password (you can add additional checks, e.g., length, strength)
    // if (newPassword.length < 6) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'New password must be at least 6 characters long.',
    //   });
    // }

    // Hash the new password before saving
    const hashedPassword = await bycrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    // Respond with success message
    res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password.',
    });
  }
};

