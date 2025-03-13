const Joi = require("joi");
const constants = require("../utilities/constants");

class UserValidation {
  signUp(userData) {
    const schema = Joi.object({
      profilePicture: Joi.string().uri().optional(),
      fullName: Joi.string().trim().max(55).required(),
      username: Joi.string().trim().max(55).required(),
      email: Joi.string().trim().email().required(),
      phone: Joi.string().trim().length(11).required(),
      country: Joi.string().trim().optional(),
      password: Joi.string()
        .regex(constants.PASSWORD.REGEX)
        .required()
        .messages({
          "string.pattern.base": constants.PASSWORD.MESSAGE_FORMAT,
        }),
    });

    return schema.validate(userData, { abortEarly: false });
  }

  signIn(userData) {
    const schema = Joi.object({
      email: Joi.string().trim().email().required(),
      password: Joi.string().required(),
    });

    return schema.validate(userData, { abortEarly: false });
  }
}

module.exports = new UserValidation();
