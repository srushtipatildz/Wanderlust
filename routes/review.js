import express from "express";
const router = express.Router({ mergeParams: true })
import { reviewSchema } from "../schemaValidation.js";
import { Listing } from "../models/listings.js";
import ExpressError from "../utils/ExpressErrors.js";
import { Review } from "../models/review.js";

const validateReviews = (req, res, next) => {
  let result = reviewSchema.validate(req.body)
  if (result.error) {
    throw new ExpressError(400, (result.error))
  }
  next()
}
//import controllers:
import { reviewController } from "../controllers/review.js";


//Review wali cheeze:
//post review
router.post("/listings/:id/reviews", validateReviews, reviewController.post)

//delete review:
router.delete("/listings/:id/reviews/:reviewId", reviewController.destroyReview)

export default router;
