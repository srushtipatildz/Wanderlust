import Joi from "joi";


export const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({  // ✅ Ensures image is stored as an object
      url: Joi.string().uri().required(),
      filename: Joi.string().required(),
    }).required(), 
    price: Joi.number().required().positive(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  });
  

  export const reviewSchema = Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    createdAt: Joi.date().default(() => new Date())
  });
  