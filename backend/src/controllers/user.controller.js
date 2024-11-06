const UserService = require("../services/user.service");

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserService.getUserById(userId);
    res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
}

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
