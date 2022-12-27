const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const utils = require("../utils/utilities");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!utils.isAlphaNumeric(username)) {
    return response.status(404).json({
      error:
        "Username must only contain alphanumeric characters (0-9, a-z, A-Z)",
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(404).json({
      error: "Username must be unique",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
