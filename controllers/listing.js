import { Listing } from "../models/listings.js"
import mongoose from "mongoose"

const  index=async (req,res,next)=>{
    try {
        let allLists = await Listing.find({})
        res.render("listings/index.ejs", { allLists })
    } catch (err) {
        next(err)
    }
}
const newForm=(req, res) => {
    if(req.isAuthenticated()){
        return res.render("listings/newForm.ejs")
    }
    req.flash("error","You need to be logged in to add listing!")
    return res.redirect("/listings");
}

const specificList=async (req, res, next) => {
    try {
        let id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.flash("error","Invalid Listing ID")
            return res.status(400).render("error.ejs", { message: req.flash("error") });
        }
        console.log(id)
        let listing = await Listing.findById(id).populate({
            path: "reviews",
            populate: { path: "author" }  
        }).populate("owner")
      
        console.log(listing.owner.username)
       
        if(!listing){
            req.flash("error","ID Does not Exsist!!")
           return  res.redirect("/listings")
        }
        res.render("listings/show.ejs", { listing})
    } catch (err) {
        next(err)
    }

}
const postList= async(req, res, next) => {
    try {
        let newList = req.body
        newList.owner = req.user._id;
        if (req.file) {
            newList.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        console.log(req.body)
        console.log(req.file)
        const newListing = new Listing(newList)
        await newListing.save()
        console.log(newList)
       
        req.flash("success","New Listing Added Successfully !")
        res.redirect("/listings")
    } catch (err) {
        next(err)
    }
}
const edit=async (req, res,next) => {
    try {
        let id = req.params.id
        let listing = await Listing.findById(id)
        console.log("Authenticated User:", req.user);

        //listing hai ya nahi
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
       //authenticated(loggedin)hai ya nahi
        if (!req.isAuthenticated()|| !req.user) {
            req.flash("error", "User needs to login to edit listing!");
            return res.redirect(`/listings/${id}`);
        }
        //dono same hai ya nahi
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You need to be the owner to edit!");
            return res.redirect(`/listings/${id}`);
        }
        res.render("listings/edit.ejs", { listing });
       
    } catch (err) {
        next(err)
    }
}
const update=async (req, res, next) => {
    try {
        let id = req.params.id
        let listing = await Listing.findById(id)
        console.log(listing)          //Ye orignal data hai
       
        let updatedList = await Listing.findByIdAndUpdate(
            id,
            req.body,                   // Update data from request body
            { new: true, runValidators: true }
        );
        console.log(updatedList) //Updated Data 
        //(I've taken this from chatgpt)samjha nai meko
        res.redirect("/listings")
    } catch (err) {
        next(err)
    }

}
const destroy=async (req, res,next) => {
    try {
        let id = req.params.id
        let listing = await Listing.findById(id)
        console.log("Authenticated User:", req.user);
        if(!req.isAuthenticated()|| !req.user){
            
            req.flash("error","You need to login in order to delete listing")
            res.redirect(`/listings/${id}`)
        }
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You need to be the owner to delete this!");
            return res.redirect(`/listings/${id}`);
        }
           let deletedList = await Listing.findByIdAndDelete(id)
            console.log(deletedList)
            req.flash("success","Listing deleted successfully!")
            res.redirect("/listings")
    } catch (err) {
        next(err)
    }
}
export const listingController = {
    index,
    newForm,
    specificList,
    postList,
    edit,
    update,
    destroy
};
