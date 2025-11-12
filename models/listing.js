const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String,
        // type: String,
        // default:
        //     "https://media.istockphoto.com/id/913439164/photo/blue-city-of-jodhpur-top-view.jpg?s=1024x1024&w=is&k=20&c=KueZQUfL8pTd7dDx6Y6dzCI4MlPCQWMc6-voFcL3Qs8=",
            
        // set: (v) => v === "" ?"https://media.istockphoto.com/id/1177931033/photo/urban-decay-and-view-of-roofs-in-delhi-india.jpg?s=1024x1024&w=is&k=20&c=6ifSELzxZJEn40gitoupS5Eos0orDMAiDCgCR7PmYhg=" : v,
    }, 
    price: Number,
    location: String,
    country: String,

    lat: Number,
    lng: Number,

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    

});

listingSchema.post("findOneAndDelete" , async(listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema); 
module.exports = Listing;


