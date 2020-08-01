import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import bcrypt from 'bcryptjs';
import { AuthenticationError, UserInputError } from 'apollo-server';
var nodemailer = require('nodemailer');
import { isAdmin, isAuthenticated } from './authorization';
import { condition } from 'sequelize';
const { Op } = require("sequelize");
import _ from 'lodash';
import userCategory from '../schema/userCategory';


const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';

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
  console.log('otp', user.email)
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

const sendVerificationEmail = (user) => {

  jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    EMAIL_SECRET,
    {
      expiresIn: '1d',
    },
    (err, emailToken) => {
      // console.log('emailToken', emailToken)
      const url = `http://localhost:8000/confirmation/${emailToken}`;

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'Office.seasolconsultancy@gmail.com',
          pass: 'seasol12346'
        }
      });

      var mailOptions = {
        from: 'Office.seasolconsultancy@gmail.com',
        to: 'waqasdemo222@gmail.com',
        // to: 'bonihe3478@entrastd.com',
        subject: 'Confirm Email',
        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    },
  );




  // console.log('otp', user.email)
  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });
}

let getUserCategories = async (id) => {
  // const { id } = user;
  var userCategory = await models.UserCategory.findAll({
    where: {
      userId: id
    },
  });

  if (userCategory != "") {
    console.log('userCategory', userCategory)
    return await userCategory;
  }
};

let getUserOrderType = async (id) => {
  // const { id } = user;
  var userOrderType = await models.UserOrderType.findAll({
    where: {
      userId: id
    },
  });

  if (userOrderType != "") {
    console.log('UserOrderType', userOrderType)
    return userOrderType;
  }
};


export default {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
    // socialSignUp: async (
    //   parent,
    //   body,
    //   { models, secret },
    // ) => {
    searchUsers: async (parent, { userName, role, isOnline, isAdvisor }, { models }) => {
      let user = "";
      if (role && isOnline && isAdvisor) {
        console.log('role && isOnline && isAdvisor', role, isOnline, isAdvisor)
        user = models.User.findAll({
          where: {
            userName: {
              [Op.iRegexp]: userName
            },
            role: role, isOnline: isOnline, isAdvisor: isAdvisor,
            // isApproved: true,
          },
        })
        return { user: user, success: true };
      }
      else if (role && isOnline == true) {

        console.log('role && isOnline', role, isOnline)
        user = models.User.findAll({
          where: {
            userName: {
              [Op.iRegexp]: userName
            },
            role: role, isOnline: isOnline, isAdvisor: false,
            isApproved: true,
          },
        })

        return { user: user, success: true };
      }
      else if (role && isAdvisor == true) {
        console.log('role && isAdvisor', role, isAdvisor)
        user = models.User.findAll({
          where: {
            userName: {
              [Op.iRegexp]: userName
            },
            role: role, isAdvisor: isAdvisor, isOnline: false,
            isApproved: true,
          },
        })

        return { user: user, success: true };
      }
      else if (role && isOnline == false && isAdvisor == false) {
        console.log('role && isOnline == false && isAdvisor == false', role, isOnline, isAdvisor)
        user = models.User.findAll({
          where: {
            userName: {
              [Op.iRegexp]: userName
            },
            role: role, isAdvisor: false, isOnline: false,
            isApproved: true,
          },
        })
        return { user: user, success: true };

      }
      else if (role) {
        console.log('role', role)
        user = models.User.findAll({
          where: {
            userName: {
              [Op.iRegexp]: userName
            },
            role: role,
            isApproved: true,
          },
        })
        return { user: user, success: true };

      } else {
        console.log('else')
        user = models.User.findAll({
          where: {
            userName: {
              [Op.iRegexp]: userName
            },
            isApproved: true,
          },
        })
      }
      // let searchFor = body.userName
      if (user != "") {
        return { user: user, success: true };

      } else {
        return { message: 'No User', success: false }
      }
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
      { userName, email, password, isVerified },
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
            isAdvisor: false,
            isApproved: false,
            // categories: categories
          });
          sendVerificationEmail(user);
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
          isAdvisor: false,
          isApproved: false,
          // categories: categories,
          role: "USER"
        });
        sendVerificationEmail(user1);
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
            isAdvisor: false,
            isApproved: false,
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
            isAdvisor: false,
            isApproved: false,
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
            isAdvisor: false,
            isApproved: false,
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
            isAdvisor: false,
            isApproved: false,
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
      { id, password, otp },
      { models, secret },
    ) => {
      var user = await models.User.find({
        where: {
          id: id,
        },
      });
      if (!user) {
        return { success: false, message: 'No user found' }
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
            id: body.id,
            isVerified: true
          },
        });
        if (!newUser) {
          return { message: 'No user found', success: false }
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
        { id, currentPassword, password },
        { models, me }) => {

        const saltRounds = 10;

        var newUser = await models.User.find({
          where: {
            id: id, isVerified: true,
          },
        });
        if (newUser) {
          var currentPass = await newUser.validatePassword(currentPassword);
          console.log('currentPass', currentPass)
          if (!currentPass) {
            return { success: false, message: 'Old password is typed incorrectly...' }
          }
          var pass = password;

          password = await bcrypt.hash(pass, saltRounds);
          await newUser.update({ password });
          return { user: newUser, success: true }
        } else {
          return { success: false, message: 'No user found' }

        }


        // if (!newUser) {
        //   return { success: false, message: 'No user found' }
        // }
        // else if (newUser.password != currentPass) {
        //   return { success: false, message: 'Old password is typed incorrectly...' }

        // }
        // const user = await models.User.findById(newUser.id);
        // var pass = password;

        // password = await bcrypt.hash(pass, saltRounds);
        // await user.update({ password });
        // return { user: user, success: true }
      },
    ),

    updateVerified: combineResolvers(
      async (
        parent,
        { id, isVerified },
        { models, me }) => {
        var newUser = await models.User.find({
          where: {
            id: id,
          },
        });
        if (newUser) {
          if (newUser.isVerified === false) {
            const user = await models.User.findById(newUser.id);
            await user.update({ isVerified: true });
            return { user: user, success: true }
          }
          else {
            return { success: false, message: 'User is already verified! Please Login...' }
          }
        }
        else {
          return { success: false, message: 'No user found.' }
        }

      },
    ),


    becomeAdvisor: combineResolvers(
      async (
        parent,
        body,
        { models, me }) => {
        const { id, title, userName, image, role, aboutService, aboutMe, isLogin, isAdvisor, isOnline, videoThumbnail,
          categories, orderTypes } = body
        var newUser = await models.User.find({
          where: {
            id: body.id,
            isVerified: true
          },
        });
        if (!newUser) {
          return { message: 'No user found.', success: false }
        }
        const user = await models.User.findById(newUser.id);

        var userOrderType = [];
        var userCategory = [];

        if (orderTypes) {
          for (var i in orderTypes) {
            let userOrderTyp = await models.UserOrderType.create({
              userId: user.id,
              userName: user.userName,
              subTitle: orderTypes[i].subTitle,
              price: orderTypes[i].price,
              orderTypeName: orderTypes[i].orderTypeName
            });
            userOrderType.push(userOrderTyp);
          }

        }
        if (categories) {
          for (var i in categories) {
            let userCat = await models.UserCategory.create({
              userId: user.id,
              userName: user.userName,
              categoryName: categories[i]
            });
            userCategory.push(userCat.dataValues);
          }

        }
        await user.update(body);
        
        return { user: user, categories: userCategory, orderTypes: userOrderType, success: true }
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
