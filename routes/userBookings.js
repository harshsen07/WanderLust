const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookings");
const { isLoggedIn } = require("../middleware");

router.get(
  "/my-bookings",
  isLoggedIn,
  bookingController.myBookings
);

router.put(
  "/bookings/:bookingId/cancel",
  isLoggedIn,
  bookingController.cancelBooking
);

module.exports = router;