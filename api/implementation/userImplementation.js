const bcrypt = require("bcrypt");

const UserQueries = require("../../src/queries/userQueries");
const ResponseService = require("../../src/services/responseService");
const constants = require("../../src/utilities/constants");
const messages = require("../../src/utilities/messages");

class UserImplementation {
  async signUp(data) {
    try {
      const { username, email, phone } = data;
      const errorMessages = [];

      const existingUser = await UserQueries.getUserDetailsByData(data);

      if (existingUser) {
        if (existingUser.username === username)
          errorMessages.push(messages.USERNAME_EXISTS);
        if (existingUser.email === email)
          errorMessages.push(messages.EMAIL_EXISTS);
        if (existingUser.phone === phone)
          errorMessages.push(messages.PHONE_EXISTS);
      }

      if (errorMessages.length > 0) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          errorMessages
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      data.password = hashedPassword;

      const response = await UserQueries.createUser(data);

      if (response) {
        ResponseService.status = constants.CODE.CREATED;
        return ResponseService.responseService(
          constants.STATUS.SUCCESS,
          response,
          messages.SUCCESSFULLY_SIGN_UP
        );
      }
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async signIn(data) {
    try {
      const user = await UserQueries.getUserByEmail(data.email);

      if (!user) {
        ResponseService.status = constants.CODE.RECORD_NOT_FOUND;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.USER_NOT_FOUND
        );
      }

      const isMatch = await bcrypt.compare(data.password, user.password);

      if (!isMatch) {
        ResponseService.status = constants.CODE.BAD_REQUEST;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.INVALID_CREDENTIALS
        );
      }

      user.isOnline = true;

      await user.save();

      ResponseService.status = constants.CODE.OK;
      return ResponseService.responseService(
        constants.STATUS.SUCCESS,
        { user: user },
        messages.RECORD_FOUND
      );
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async profileEdit(data) {
    try {
      const id = data.id;
      const user = await UserQueries.getUserDetailsById(id);

      if (!user) {
        ResponseService.status = constants.CODE.RECORD_NOT_FOUND;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.USER_NOT_FOUND
        );
      }

      if (data.profilePicture) user.profilePicture = data.profilePicture;
      if (data.fullName) user.fullName = data.fullName;
      if (data.country) user.country = data.country;
      if (data.phone) user.phone = data.phone;

      const response = await user.save();

      if (response) {
        ResponseService.status = constants.CODE.OK;
        return ResponseService.responseService(
          constants.STATUS.SUCCESS,
          response,
          messages.PROFILE_UPDATED
        );
      }
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async changePassword(data) {
    try {
      const { email, currentPassword, newPassword } = data;
      const user = await UserQueries.getUserByEmail(email);
      if (!user) {
        ResponseService.status = constants.CODE.RECORD_NOT_FOUND;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.EMAIL_NOT_FOUND
        );
      }

      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordMatch) {
        ResponseService.status = constants.CODE.NOT_ACCEPTED;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.PASSWORD_MISMATCH
        );
      }

      const isNewPasswordSame = await bcrypt.compare(
        newPassword,
        user.password
      );
      if (isNewPasswordSame) {
        ResponseService.status = constants.CODE.NOT_ACCEPTED;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.PASSWORD_SAME_AS_OLD
        );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      const response = await UserQueries.updateUserPassword(
        email,
        hashedNewPassword
      );

      ResponseService.status = constants.CODE.OK;
      return ResponseService.responseService(
        constants.STATUS.SUCCESS,
        response,
        messages.PASSWORD_UPDATED
      );
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }

  async deleteUser(data) {
    try {
      const id = data.id;
      const user = await UserQueries.getUserById(id);
      if (!user) {
        ResponseService.status = constants.CODE.RECORD_NOT_FOUND;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.USER_NOT_FOUND
        );
      }

      const response = await UserQueries.deleteUserById(id);

      if (!response) {
        ResponseService.status = constants.CODE.RECORD_NOT_FOUND;
        return ResponseService.responseService(
          constants.STATUS.ERROR,
          [],
          messages.USER_ALREADY_DELETED
        );
      }

      ResponseService.status = constants.CODE.OK;
      return ResponseService.responseService(
        constants.STATUS.SUCCESS,
        response,
        messages.USER_DELETED
      );
    } catch (error) {
      ResponseService.status = constants.CODE.INTERNAL_SERVER_ERROR;
      return ResponseService.responseService(
        constants.STATUS.EXCEPTION,
        error.message,
        messages.EXCEPTION
      );
    }
  }
}

module.exports = new UserImplementation();
