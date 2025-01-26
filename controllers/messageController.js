const Messages = require("../models/messageModel");
const formidable = require('formidable');
const fs = require('fs')

const { uploadOnCloudinary } = require("../utils/cloudinary.js");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { currentChatId } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [currentChatId, req.profile._id],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === req.profile._id.toString(),
        message: msg.message.text
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { to, message } = req.body
    const from = req.profile._id
    const data = new Messages()
    data.message.text = message
    data.users = [from, to],
      data.sender = from,
      data.save()


    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });

  } catch (ex) {
    next(ex);
  }
};


