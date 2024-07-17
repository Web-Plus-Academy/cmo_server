import bycrypt from 'bcryptjs';
import generateTokenSetCookie from "../utils/generateToken.js";
import AdminSchema from '../models/adminLoginModel.js';


// ------------Admin sign up---------- ✅
export const signUpAdmin = async (req, res) => {
    try {
        const {name, adminname, password } = req.body;
        const Admin = await AdminSchema.findOne({  adminname });

        if (Admin) {
            return res.json({success:false, error: "Admin Already Exists" });
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
                success:true,
                name: newAdmin.name,
                ID: adminname
            })
        }
        else {
            res.status(400).json({success:false, message: "Invalid Admin data" });
        }

    } catch (error) {
        console.log("Error in SignUp controller", error.message);
        res.status(500).json({success:false, message: error.message })
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

        if(!ispasswordCorrect){
            return res.json({ success: false, message: "Invalid Password" });
        }

        generateTokenSetCookie(Admin._id, res);

        const time = getCurrentDateTime();

        console.log({message:"Admin Loged In", time: time, Admin: adminname});
        res.status(200).json({ success: true,message:"Login Successful !" , name:Admin.name, ID: Admin.adminname});

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

