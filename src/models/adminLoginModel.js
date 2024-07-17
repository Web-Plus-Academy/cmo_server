import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true
    },
    adminname:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    //createdAt, updatedAt
},{timestamps:true})

const AdminSchema = mongoose.model("Admin",adminSchema); // For admin


export  default AdminSchema