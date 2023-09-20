const Messages = require("../models/messageModel");
const formidable = require('formidable');
const fs = require('fs')
module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        file: msg.message.file,
        type: msg.message.filetype,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, file, type } = req.body
    const data = new Messages()
    data.message.text = message
    data.message.file = file
    data.message.filetype = type
    data.users = [from, to],
      data.sender = from,
      data.save()


    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });

  } catch (ex) {
    next(ex);
  }
};
