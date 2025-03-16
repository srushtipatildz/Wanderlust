import dotenv from "dotenv";
dotenv.config();
console.log(process.env.ClOUD_NAME)
import express from "express";
const router = express.Router()
import mongoose, { Schema } from "mongoose";
import { Listing } from "../models/listings.js";
import ExpressError from "../utils/ExpressErrors.js";
import { listingSchema } from "../schemaValidation.js";
//importing controller
import {listingController} from "../controllers/listing.js";
//passport 
import passport from "passport";
router.use(passport.initialize());
router.use(passport.session());
//flash
import flash from "connect-flash";
router.use(flash())


 //Cloudinary
 import { CloudinaryStorage } from "multer-storage-cloudinary";
 import cloudinary from "../cloudinary.js"; // Import Cloudinary config
 const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "wanderlust", // Change this to your preferred folder
      allowedFormats: ["jpeg", "png", "jpg"],
    },
  });
 //multer
 import multer from "multer"
 const upload =multer({ storage })

//validation
const validateListing = (req, res, next) => {
   
    if (req.file) {
        req.body.image = {
            url: req.file.path,        // Cloudinary image URL
            filename: req.file.filename // Cloudinary-generated filename
        };
    }
    let result = listingSchema.validate(req.body)
    if (result.error) {
        throw new ExpressError(400, (result.error))
    }
    next()
}
//Index Routing
router.get("/", listingController.index); 
router.get("/listings",listingController.index)
//Rendering New form
router.get("/listings/add",listingController.newForm)
//Specific List Routing
router.get("/listings/:id", listingController.specificList)
//Posting Form
router.post("/listings",upload.single("image"),
validateListing,
listingController.postList
)

//Edit Route 
router.get("/listings/:id/edit",listingController.edit)
//Update Form 
router.patch("/listings/:id/edit",listingController.update)
//Delete
router.delete("/listings/:id/edit", listingController.destroy)

//exports
//  const exports={
//     router,
//     upload
//  }
// export default exports;
export default router;
