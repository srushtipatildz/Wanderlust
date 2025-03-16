import { Review } from "../models/review.js";
import { Listing } from "../models/listings.js"

const post = async (req, res, next) => {
    try {
        let id = req.params.id
        let response = req.body
        console.log(response)
        if (!req.isAuthenticated()) {
            req.flash("error", "you must be logged in to add review")
            return res.redirect(`/listings/${id}`)
        }
        let listing = await Listing.findById(id).populate("reviews")
        let newReview = new Review({
            comment: req.body.comment,
            rating: req.body.rating,
            author: req.user._id
        })//process of making a review!
        listing.reviews.push(newReview._id)
        await newReview.save()
        await listing.save()
        console.log(listing)
        res.redirect(`/listings/${id}`)
    }
    catch (err) {
        next(err)
    }
}

const destroyReview = async (req, res, next) => {
    try {
        let reviewId = req.params.reviewId
        let listingId = req.params.id
        console.log(reviewId)
        console.log(listingId)
        let review = await Review.findById(reviewId)
        if (!review.author) {
            req.flash("error", "Review author not found!");
            return res.redirect(`/listings/${id}`);
        }
        if (!review.author.equals(req.user._id)) {
            req.flash("error", "You need to be the owner to delete this!");
            return res.redirect(`/listings/${listingId}`);

        }

        let deletedReview = await Review.findByIdAndDelete(reviewId)//Delete review indivisuallly!
        console.log(deletedReview)

        await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } }) //Delete review also from listing
        req.flash("success", "Review Deleted Successfully!");
        return res.redirect(`/listings/${listingId}`)
    } catch (err) {
        next(err)
    }

}
export const reviewController = {
    post,
    destroyReview
};
