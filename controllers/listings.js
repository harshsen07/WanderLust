const Listing = require("../models/listing.js")

module.exports.index = async(req,res) =>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs" , {allListings});
}



module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs");
};



module.exports.showListing = async (req,res,next) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    },
  })
  .populate("owner")

  if(!listing){
    req.flash("error" , "listing you requested for does not exist!")
    res.redirect("/listings")
  }
 
res.render("listings/show.ejs" , {listing})
}


module.exports.createListing = async(req,res,next) =>{
  const newListing = new Listing(req.body.listing);
  // for owner name
  newListing.owner = req.user._id;
   await newListing.save();
   req.flash("success" , "new listing created")
   res.redirect("/listings")
}



module.exports.renderEditForm = async(req,res,next) =>{
  try{
     let {id} = req.params;
     const listing = await Listing.findById(id);
     
      if(!listing){
    req.flash("error" , "listing you requested for does not exist!")
    res.redirect("/listings")
  }
     res.render("listings/edit.ejs" , {listing});
     }
     catch(err){
      next(err);
     }
  }



  module.exports.updateListing = async(req,res,next) =>{
      let {id} = req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success" , "listing updated")
      res.redirect(`/listings/${id}`)
    }
    

    module.exports.destroyListing = async(req,res,next) =>{
    let {id} = req.params;
    
    await Listing.findByIdAndDelete(id)
    req.flash("success" , "listing successfully deleted")
    res.redirect("/listings")
  }