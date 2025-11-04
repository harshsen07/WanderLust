const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")



const listingController = require("../controllers/listings.js")


// index route
router.get("/" , wrapAsync(listingController.index)); 


// new route  it must be written above the show route otherwise we get a cast error
router.get("/new" ,isLoggedIn,listingController.renderNewForm )




// show or read route
router.get("/:id" , wrapAsync(listingController.showListing))





// create route
router.post("/" ,isLoggedIn,validateListing, wrapAsync(listingController.createListing));


// edit route
 router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm ));




  // update route
 router.put("/:id" ,isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));



  // delete route
   router.delete("/:id" ,isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


  module.exports = router;