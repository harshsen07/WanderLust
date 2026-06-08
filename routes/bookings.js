const express = require("express");
const router = express.Router({ mergeParams: true });

const bookingController = require("../controllers/bookings");
const { isLoggedIn } = require("../middleware");

router.post(
  "/book",
  isLoggedIn,
  bookingController.createBooking
);

// router.get(
//   "/my-bookings",
//   isLoggedIn,
//   bookingController.myBookings
// );

module.exports = router;