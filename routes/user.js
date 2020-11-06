"use strict";

const express = require("express");
const bcrypt = require("bcrypt");
const { asyncHandler } = require("../middleware/async-handler");
const { authenticateUser } = require("../middleware/authenticate-user");

// Construct a router instance
const router = express.Router();

const { User, Course } = require("../models");

router.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const userId = req.currentUser.id;
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ["id", "password", "createdAt", "updatedAt"],
      },
    });
    res.json(user);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    await User.create(req.body);
    res.location("/");
    res.status(201).end();
  })
);

module.exports = router;
