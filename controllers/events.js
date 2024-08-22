const { response } = require("express");
const EventModel = require("../models/EventModel");

const getEvents = async (req, res = response) => {
  const events = await EventModel.find().populate("user", "name");
  res.send({
    ok: true,
    events,
  });
};

const createEvent = async (req, res = response) => {
  try {
    const event = new EventModel(req.body);
    event.user = req.uid;
    const eventSaved = await event.save();
    res.send({
      ok: true,
      event: eventSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      ok: false,
      msg: "Try again in a minutes",
    });
  }
};

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    let event = await EventModel.findById(eventId);
    if (!event)
      return res.status(404).json({
        ok: false,
        msg: "Don't found by this id",
      });

    if (event.user.toString() !== uid)
      return res.status(401).json({
        ok: false,
        msg: "You don't have permission to edit",
      });

    const newEvent = {
      ...req.body,
      user: uid,
    };

    const eventUpdated = await EventModel.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.json({
      ok: true,
      event: eventUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Try again in a minutes",
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    let event = await EventModel.findById(eventId);
    if (!event)
      return res.status(404).json({
        ok: false,
        msg: "Don't found by this id",
      });

    if (event.user.toString() !== uid)
      return res.status(401).json({
        ok: false,
        msg: "You don't have permission to edit",
      });

    await EventModel.findByIdAndDelete(eventId);
    res.send({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      ok: false,
      msg: "Try again in minutes",
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
