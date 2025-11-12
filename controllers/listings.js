const Listing = require("../models/listing.js")
const axios = require("axios");
const apiKey = process.env.MAP_API_KEY;

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
  let url = req.file.path;
  let filename = req.file.filename;

  // start forward geocoding
  const{location} = req.body.listing;

  let lat = null, lng = null;
  if(location && apiKey){
    if (location && apiKey) {
        const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`;
        try {
            const geoRes = await axios.get(geoUrl);
            const feature = geoRes.data.features[0];
            if (feature) {
                lat = feature.geometry.coordinates[1];
                lng = feature.geometry.coordinates[0];
            }
        } catch (err) {
            // Handle geocoding error if needed
        }
    }
  }
  





  const newListing = new Listing(req.body.listing);
  // for owner name
  newListing.owner = req.user._id;
  newListing.image = {url,filename};

  if(lat && lng) {
    newListing.lat = lat;
    newListing.lng = lng;
  }
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

     let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
     res.render("listings/edit.ejs" , {listing,originalImageUrl});
     }
     catch(err){
      next(err);
     }
  }



  module.exports.updateListing = async(req,res,next) =>{
      let {id} = req.params;
      let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

      const{location} = req.body.listing;
      let lat2 = null, lng2 = null;
  if(location && apiKey){
    if (location && apiKey) {
        const geoUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`;
        try {
            const geoRes = await axios.get(geoUrl);
            const feature = geoRes.data.features[0];
            // console.log(feature)
            if (feature) {
                lat2 = feature.geometry.coordinates[1];
                lng2 = feature.geometry.coordinates[0];
            }
        } catch (err) {
            // Handle geocoding error if needed
        }
    }
  }
  
      if(typeof req.file !== "undefined"){
       let url = req.file.path;
       let filename = req.file.filename;
       listing.image = {url, filename};
  }
  // let updateData = {...req.body.listing};

        if(lat2 && lng2) {
        listing.lat = lat2;
        listing.lng = lng2;
       
      
       await listing.save();
       }

      req.flash("success" , "listing updated")
      res.redirect(`/listings/${id}`)
    }
    

    module.exports.destroyListing = async(req,res,next) =>{
    let {id} = req.params;
    
    await Listing.findByIdAndDelete(id)
    req.flash("success" , "listing successfully deleted")
    res.redirect("/listings")
  }