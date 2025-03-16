//To add sample data

import mongoose, { Schema } from "mongoose";
import { sampleListings } from "./data.js";
import { Listing} from "../models/listings.js"; 


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust'); 
}
main().then(()=>{console.log("Successful Connection !")})
.catch(err => console.log(err));


// async function initDB(){
//  await Listing.deleteMany({})
//  await Listing.insertMany(sampleListings)
//  .then((res)=>console.log("added successfully !"))
// }

// initDB();
async function initDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("✅ Database connected successfully!");

    // Delete all existing listings
    await Listing.deleteMany({});
    console.log("🗑️  Deleted all existing listings!");

    // Default owner ID (replace with a real user ID)
    const defaultOwner = "67c96780562d89d008d22667";

    // Add owner field to each listing
    const updatedListings = sampleListings.map((listing) => ({
      ...listing,
      owner: defaultOwner,
    }));

    // Insert new listings
    await Listing.insertMany(updatedListings);
    console.log(`✅ Inserted ${updatedListings.length} new listings!`);

    // Close database connection
    mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
}

initDB();
