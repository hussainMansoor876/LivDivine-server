import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import bcrypt from 'bcryptjs';
import { AuthenticationError, UserInputError } from 'apollo-server';
var nodemailer = require('nodemailer');
import { isAdmin, isAuthenticated } from './authorization';
import { condition } from 'sequelize';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, userName, role } = user;
  return await jwt.sign({ id, email, userName, role }, secret, {
    expiresIn,
  });
};

const sendOtpEmail = (user, otp) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Office.seasolconsultancy@gmail.com',
      pass: 'seasol12346'
    }
  });

  var mailOptions = {
    from: 'Office.seasolconsultancy@gmail.com',
    to: 'babarkaramat123@gmail.com',
    subject: 'Sending Email using Node.js ' + otp,
    text: 'That was easy! ' + otp
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
export default {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    getAllUserByRole: async (parent, { role }, { models }) => {
      var user = await models.User.findAll({
        where: {
          role: role
        }
      });
      if (user) {
        console.log('users', user);
        return { user: user, success: true }
      } else {
        console.log('No User Found')
        return { message: 'No User Found', success: false }
      }
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }

      return await models.User.findById(me.id);
    },
  },

  Mutation: {
    signUp: async (
      parent,
      { userName, email, password, isVerified, categories },
      { models, secret },
    ) => {

      var newUser = await models.User.find({
        where: {
          email: email,
        },
      });
      if (newUser) {
        if (newUser.isVerified === false) {
          const user = await models.User.findById(newUser.id);
          var pass = password;

          const saltRounds = 10;
          password = await bcrypt.hash(pass, saltRounds);

          await user.update({
            userName,
            password,
            isLogin: false,
            isOnline: false,
            categories: categories
          });
          return { token: createToken(user, password, '30m'), user: user, success: true };

        } else {
          return { success: false, message: 'Email already in Use! Please SignIn.' }
        }

      } else {
        const user1 = await models.User.create({
          userName,
          email,
          password,
          isVerified,
          isLogin: false,
          isOnline: false,
          categories: categories,
          role: "USER"
        });
        return { token: createToken(user1, password, '30m'), user: user1, success: true };

      }
    },

    socialSignUp: async (
      parent,
      body,
      { models, secret },
    ) => {
      const { userName, email, authId, image, authType } = body
      if (email) {
        var newUser = await models.User.findOne({
          where: {
            $or: [
              { email: email },
              { authId: authId },
            ]
          },
          attributes: { exclude: ['password'] }
        });
        if (newUser) {
          await newUser.update({
            userName,
            isLogin: true,
            isOnline: true,
            isVerified: true,
            authId,
          });
          return { user: newUser, success: true, };

        } else {
          let newUser1 = await models.User.create({
            userName,
            authId,
            isVerified: true,
            isLogin: true,
            isOnline: true,
            authType,
            image,
            email,
            role: "USER"
          }, {
            attributes: { exclude: ['password'] }
          })
          return { user: newUser1, success: true, };

        }
      }
      else {
        var newUser = await models.User.findOne({
          where: {
            authId: authId
          },
          attributes: { exclude: ['password'] }
        });
        if (newUser) {
          await newUser.update({
            userName,
            isLogin: true,
            isVerified: true,
            authId,
            image,
            authType,
          });
          return { user: newUser, success: true, };

        } else {
          let newUser1 = await models.User.create({
            userName,
            authId,
            isVerified: true,
            isLogin: true,
            authType,
            role: "USER"
          }, {
            attributes: { exclude: ['password'] }
          })
          return { user: newUser1, success: true, };

        }
      }
    },

    forgotPassword: async (
      parent,
      { email, password, otp },
      { models, secret },
    ) => {
      var user = await models.User.find({
        where: {
          email: email,
        },
      });
      if (!user) {
        return { success: false, message: 'No user found with this Email.' }
        // throw new UserInputError(
        //   'No user found with this Email.',
        // );
      }
      var _otp = Math.floor(
        Math.random() * (9999 - 1000 + 1) + 1000
      );

      if (otp == null || otp == '' || otp == undefined) {

        otp = _otp;
        sendOtpEmail(user, _otp);
        await user.update({ otp });
        return { success: false, message: 'otp sent...' }
      } else {
        if (user.otp != otp) {
          return { success: false, message: 'otp Not Matched' }
          // throw new UserInputError(
          //   'otp Not Matched',
          // );
        } else {
          var pass = password;
          const saltRounds = 10;
          password = await bcrypt.hash(pass, saltRounds);
          await user.update({ password });
        }
      }
      return { token: createToken(user, password, '30m'), user: user, success: true };
    },

    signIn: async (
      parent,
      { login, password, isLogin },
      { models, secret },
    ) => {
      var user = await models.User.find({
        where: {
          email: login, isVerified: true
        },
      });
      // const user = await models.User.findByLogin(login);

      if (!user) {

        return { success: false, message: 'No user found with this login credentials.' }
        // throw new UserInputError(
        //   'No user found with this login credentials.',
        // );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        return { success: false, message: 'Invalid password.' }
        // throw new AuthenticationError('Invalid password.');
      }
      await user.update({
        isLogin: true,
        isOnline: true,
      });

      return { token: createToken(user, password, '30m'), user: user, success: true };
    },

    updateUser: combineResolvers(
      // isAuthenticated,
      async (
        parent,
        body,
        { models, me }) => {
        var newUser = await models.User.find({
          where: {
            email: body.email,
            isVerified: true
          },
        });
        if (!newUser) {
          return { message: 'No user found with this Email.', success: false }
          // throw new UserInputError(
          //   'No user found with this Email.',
          // );
        }
        const user = await models.User.findById(newUser.id);
        await user.update(body);
        return { user: user, success: true }
      },
    ),


    updatePassword: combineResolvers(
      // isAuthenticated,
      async (
        parent,
        { email, password },
        { models, me }) => {
        var newUser = await models.User.find({
          where: {
            email: email, isVerified: true
          },
        });
        if (!newUser) {
          return { success: false, message: 'No user found with this Email.' }
          // throw new UserInputError(
          //   'No user found with this Email.',
          // );
        }
        const user = await models.User.findById(newUser.id);
        var pass = password;

        const saltRounds = 10;
        password = await bcrypt.hash(pass, saltRounds);
        await user.update({ password });
        return { user: user, success: true }
      },
    ),

    updateVerified: combineResolvers(
      // isAuthenticated,
      async (
        parent,
        { email, isVerified },
        { models, me }) => {
        var newUser = await models.User.find({
          where: {
            email: email,
          },
        });
        if (newUser) {
          if (newUser.isVerified === false) {
            const user = await models.User.findById(newUser.id);
            await user.update({ isVerified });
            return { user: user, success: true }
          }
          else {
            return { success: false, message: 'Email is already verified! Please Login...' }
            // throw new UserInputError(
            //   'Email is already verified! Please Login...',
            // );
          }
        }
        else {
          return { success: false, message: 'No user found with this Email.' }
          // throw new UserInputError(
          //   'No user found with this Email.',
          // );
        }

      },
    ),


    becomeAdvisor: combineResolvers(
      // isAuthenticated,
      async (
        parent,
        body,
        { models, me }) => {
        const { email, authId, title, userName, advisorImage, role, aboutService, aboutMe, categories, isLogin } = body
        var newUser = await models.User.find({
          where: {
            $or: [
              { email: email },
              { authId: authId },
            ],
            // email: body.email,
            isVerified: true
          },
        });
        if (!newUser) {
          console.log("No User Found")
          return { message: 'No user found.', success: false }
          // throw new UserInputError(
          //   'No user found with this Email.',
          // );
        }
        console.log("else")
        const user = await models.User.findById(newUser.id);
        await user.update(body);
        return { user: user, success: true }
      },
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        return await models.User.destroy({
          where: { id },
        });
      },
    ),
  },

  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },


};
