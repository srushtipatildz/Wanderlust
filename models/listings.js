//for creating schema and model !
import mongoose, { set } from "mongoose";
// Creating Schema
const listingSchema = new mongoose.Schema({   
title:{
  type:String,
  required:true
 },
description:{
    type:String,
   },
   image: {  
    url: {
      type: String,
      required: true, 
    },
    filename: {
      type: String,
      required: true, 
    },
  },
price:{
    type:Number,
   },
location:{
    type:String,
   },
country:{
    type:String,
   },
   owner:{
    type: mongoose.Schema.Types.ObjectId,  // References the User model
    ref: "User",
    required: true
   },
   reviews:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review"
   }]
   });
//Creating Model
export const Listing=mongoose.model("Listing",listingSchema);
//67c81516c2b42881f81743ef