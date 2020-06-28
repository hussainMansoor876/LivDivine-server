import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import bcrypt from 'bcryptjs';
import { AuthenticationError, UserInputError } from 'apollo-server';
var nodemailer = require('nodemailer');
import { isAdmin, isAuthenticated } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, userName, role } = user;
  return await jwt.sign({ id, email, userName, role }, secret, {
    expiresIn,
  });
};

const sendOptpEmail = (user, optp) => {
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
    subject: 'Sending Email using Node.js ' + optp,
    text: 'That was easy! ' + optp
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
      { userName, email, password, isVerified },
      { models, secret },
    ) => {

      console.log('***')
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
            isLogin: false
          });
          return { token: createToken(user, password, '30m') };

        } else {
          throw new UserInputError(
            'Email already in Use! Please SignIn.',
          );
        }

      } else {
        const user1 = await models.User.create({
          userName,
          email,
          password,
          isVerified,
          isLogin: false
        });

        return { token: createToken(user1, password, '30m') };

      }
    },

    socialSignUp: async (
      parent,
      { userName, email, authType, isVerified },
      { models, secret },
    ) => {
      var newUser = await models.User.findOne({
        where: {
          email: email,
        },
        attributes: { exclude: ['password'] }
      });
      if (newUser) {
        if (newUser.isVerified === false) {
          const user = await models.User.findById(newUser.id);
          // var pass = password;

          // const saltRounds = 10;
          // password = await bcrypt.hash(pass, saltRounds);

          await user.update({
            userName,
            isLogin: true,
            authType
            // password,
          });
          return { token: JSON.stringify(newUser) };

        } else {
          return { token: JSON.stringify(newUser) };
        }

      } else {
        let newUser1 = await models.User.create({
          userName,
          email,
          isVerified,
          isLogin: true,
          authType
        }, {
          attributes: { exclude: ['password'] }
        })

        return { token: JSON.stringify(newUser1) };

      }
    },

    forgotPassword: async (
      parent,
      { email, password, optp },
      { models, secret },
    ) => {
      var user = await models.User.find({
        where: {
          email: email,
        },
      });
      if (!user) {
        throw new UserInputError(
          'No user found with this Email.',
        );
      }
      var _optp = Math.floor(
        Math.random() * (9999 - 1000 + 1) + 1000
      );

      if (optp == null || optp == '' || optp == undefined) {

        optp = _optp;
        sendOptpEmail(user, _optp);
        await user.update({ optp });
      } else {
        if (user.optp != optp) {
          throw new UserInputError(
            'Optp Not Matched',
          );
        } else {
          var pass = password;
          const saltRounds = 10;
          password = await bcrypt.hash(pass, saltRounds);
          await user.update({ password });
        }
      }
      return { token: createToken(user, password, '30m') };
    },

    signIn: async (
      parent,
      { login, password, isLogin },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }
      await user.update({
        isLogin: true,
      });

      return { token: createToken(user, password, '30m') };
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
          throw new UserInputError(
            'No user found with this Email.',
          );
        }
        const user = await models.User.findById(newUser.id);
        return await user.update(body);
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
          throw new UserInputError(
            'No user found with this Email.',
          );
        }
        const user = await models.User.findById(newUser.id);
        var pass = password;

        const saltRounds = 10;
        password = await bcrypt.hash(pass, saltRounds);
        return await user.update({ password });
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
            return await user.update({ isVerified });
          }
          else {
            throw new UserInputError(
              'Email is already verified! Please Login...',
            );
          }
        }
        else {
          throw new UserInputError(
            'No user found with this Email.',
          );
        }

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




