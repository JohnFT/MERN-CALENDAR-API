const { Router } = require("express");
const { validateJWT } = require("../middlewares/validate-jwt");
const {
  deleteEvent,
  updateEvent,
  createEvent,
  getEvents,
} = require("../controllers/events");
const { check } = require("express-validator");
const { fieldsValidator } = require("../middlewares/fieldsValidator");
const { isDate } = require("../helpers/isDate");

const router = Router();

// Middleware Validate Token
router.use(validateJWT);

// Get Events
router.get("/", getEvents);

// Create Event
router.post(
  "/",
  [
    check("title", "Title is requires").notEmpty(),
    check("start", "Start date is requires").custom(isDate),
    check("end", "End date is requires").custom(isDate),
    fieldsValidator,
  ],

  createEvent
);

// Update Event
router.put(
  "/:id",
  [
    check("title", "Title is requires").notEmpty(),
    check("start", "Start date is requires").custom(isDate),
    check("end", "End date is requires").custom(isDate),
    fieldsValidator,
  ],
  updateEvent
);

// Delete Event
router.delete("/:id", deleteEvent);

module.exports = router;
