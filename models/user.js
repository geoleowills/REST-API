"use strict";

const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a first name.",
          },
          notEmpty: {
            msg: "Please provide a first name.",
          },
        },
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a last name.",
          },
          notEmpty: {
            msg: "Please provide a last name.",
          },
        },
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          msg: "The email you have provided is already in use.",
        },
        validate: {
          notNull: {
            msg: "Please provide an email address.",
          },
          isEmail: {
            msg: "Email addres provided is not valid.",
          },
          notEmpty: {
            msg: "Please provide an email address.",
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a password.",
          },
          notEmpty: {
            msg: "Please provide a password.",
          },
        },
      },
    },
    { sequelize }
  );

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a User ID.",
          },
          notEmpty: {
            msg: "Please provide a User ID.",
          },
        },
      },
    });
  };

  return User;
};
