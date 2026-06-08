const Booking = require("../models/bookings");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  const { checkIn, checkOut } = req.body;

    // Validation
  if (new Date(checkOut) <= new Date(checkIn)) {
    req.flash("error", "Check-out date must be after check-in date");
    return res.redirect(`/listings/${id}`);
  }
   // Check for overlapping bookings
  const existingBooking = await Booking.findOne({
    listing: id,
    status: "confirmed",
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });

  if (existingBooking) {
    
    req.flash("error", "These dates are already booked!");
    return res.redirect(`/listings/${id}`);
  }

  const days =
    (new Date(checkOut) - new Date(checkIn)) /
    (1000 * 60 * 60 * 24);

  const totalPrice = days * listing.price;

  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
    checkIn,
    checkOut,
    totalPrice,
  });

  await booking.save();

  req.flash("success", "Booking  successfull!");

  res.redirect(`/listings/${id}`);
};


module.exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
  }).populate("listing");

  res.render("bookings/mybookings.ejs", { bookings });
};

module.exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  await Booking.findByIdAndUpdate(bookingId, {
    status: "cancelled",
  });

  req.flash("success", "Booking cancelled successfully!");

  res.redirect("/my-bookings");
};