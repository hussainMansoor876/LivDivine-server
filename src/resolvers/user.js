import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import bcrypt from 'bcryptjs';
import { AuthenticationError, UserInputError } from 'apollo-server';
var nodemailer = require('nodemailer');
import { isAdmin, isAuthenticated } from './authorization';
import { condition } from 'sequelize';
const { Op } = require("sequelize");
import _ from 'lodash';
// import userCategory from '../schema/userCategory';
import userCat from '../models/index';
import userCategory from './userCategory';
import userOrderType from './userOrderType';


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
  // console.log('otp', user.email)
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

let getUserCategoriess = async (id) => {
  // const { id } = user;
  var userCategory = await models.UserCategory.findAll({
    where: {
      userId: id
    },
  });

  if (userCategory != "") {
    return await userCategory;
  }
};



let getUserByCategoryName = async (categoryName) => {
  var userCategory = await userCat.UserCategory.findAll({
    where: {
      categoryName: categoryName
    },
  });
  if (userCategory) {
    let userss = [];
    for (var i in userCategory) {

      let user = await userCat.User.find({
        where: {
          id: userCategory[i].userId,
          role: 'ADVISOR', isApproved: true,
        },
      })
      userss.push(user);
    }
    return userss;
  } else {
    return { message: 'No Advisor Found', success: false };
  }
};


let getUserByorderTypeName = async (orderTypeName) => {

  var orderType = await userCat.UserOrderType.findAll({
    where: {
      orderTypeName: orderTypeName
    },
  });
  if (orderType) {
    let userss = [];
    for (var i in orderType) {

      let user = await userCat.User.find({
        where: {
          id: orderType[i].userId,
          role: 'ADVISOR', isApproved: true,
        },
      })

      userss.push(user);
    }
    return userss;
  } else {
    return null;
  }
};

let getUserByAdvisorName = async (advisorName) => {

  let user = await userCat.User.findAll({
    where: {
      userName: {
        [Op.iRegexp]: advisorName
      },
      role: 'ADVISOR', isApproved: true,
    },
  })
  return user;
};




let getUserOrderType = async (id) => {
  // const { id } = user;
  var userOrderType = await models.UserOrderType.findAll({
    where: {
      userId: id
    },
  });

  if (userOrderType != "") {
    return userOrderType;
  }
};

function check_duplicates(a, b) {
  var newUserResult = []
  for (var i = 0, len = a.length; i < len; i++) {
    for (var j = 0, len2 = b.length; j < len2; j++) {
      if (a[i].id === b[j].id) {
        newUserResult.push(b[j]);

      }
    }
  }
  return newUserResult;

}

function checkThree_duplicates(a, b, c) {
  var asd = []; var newUserResult = []
  for (var i = 0, len = a.length; i < len; i++) {
    for (var j = 0, len2 = b.length; j < len2; j++) {
      if (a[i].id === b[j].id) {
        asd.push(b[j]);
      }

    }
  }
  for (var k = 0, len3 = c.length; k < len3; k++) {
    for (var l = 0, len4 = asd.length; l < len4; l++) {
      if (asd[l].id === c[k].id) {
        newUserResult.push(c[k]);
      }
    }
  }
  return newUserResult;
}

let getCategorybyUser = async (userId) => {
  var userCategory = await userCat.UserCategory.findAll({
    where: {
      userId: userId
    },
  });
  return userCategory

}
let getOrderTypebyUser = async (userId) => {
  var userOrderType = await userCat.UserOrderType.findAll({
    where: {
      userId: userId
    },
  });
  return userOrderType
}

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
    searchUsers: async (parent, { userId, userName, role, isOnline, isAdvisor }, { models }) => {
      let user = [];
      var userCategory = [];
      var userOrderType = [];
      if (role && isOnline && isAdvisor) {
        user = await models.User.findAll({
          where: {
            userName: {
              [Op.iRegexp]: userName
            },
            role: role, isOnline: isOnline, isAdvisor: isAdvisor,
            isApproved: true,
          },
        })
        if (user.length > 0) {
          for (var i in user) {

            userCategory = await getCategorybyUser(user[i].id)
            userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType

          }
          user = user.filter(x => x.id != userId)
          return { user: user, success: true };
        } else {
          return {  user: user, message: 'No User', success: false }
        }
      }
      else if (role && isOnline) {
        user = await models.User.findAll({
          where: {
            userName: {
              [Op.iRegexp]: userName
            },
            role: role, isOnline: true,
            isApproved: true,
          },
        })

        if (user.length > 0) {
          for (var i in user) {

            userCategory = await getCategorybyUser(user[i].id)
            userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType

          }
          user = user.filter(x => x.id != userId)
          return { user: user, success: true };
        } else {
          return {  user: user, message: 'No User', success: false }
        }
      }
      else if (role && isAdvisor == true) {
        user = await models.User.findAll({
          where: {
            userName: {
              [Op.iRegexp]: userName
            },
            role: role, isAdvisor: isAdvisor,
            isApproved: true,
          },
        })
        if (user.length > 0) {
          for (var i in user) {
            userCategory = await getCategorybyUser(user[i].id)
            userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType
          }
          user = user.filter(x => x.id != userId)
          return { user: user, success: true };
        } else {
          return {  user: user, message: 'No User', success: false }
        }
      }
      else if (role && isOnline == false && isAdvisor == false) {
        user = await models.User.findAll({
          where: {
            userName: {
              [Op.iRegexp]: userName
            },
            role: role, isAdvisor: false, isOnline: false,
            isApproved: true,
          },
        })
        if (user.length > 0) {
          for (var i in user) {
            userCategory = await getCategorybyUser(user[i].id)
            userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType
          }
          user = user.filter(x => x.id != userId)
          return { user: user, success: true };
        } else {
          return {  user: user, message: 'No User', success: false }
        }

      }
      else if (role) {
        if (!isOnline) {
          user = await models.User.findAll({
            where: {
              userName: {
                [Op.iRegexp]: userName
              },
              role: role, isApproved: true,
            },
          })
        } else if (!isAdvisor) {
          user = await models.User.findAll({
            where: {
              userName: {
                [Op.iRegexp]: userName
              },
              role: role, isAdvisor: false, isApproved: true,
            },
          })
        }
        if (user.length > 0) {
          for (var i in user) {
            userCategory = await getCategorybyUser(user[i].id)
            userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType
          }
          user = user.filter(x => x.id != userId)
          return { user: user, success: true };
        } else {
          return { user: user, message: 'No User', success: false }
        }

      } else {
        user = await models.User.findAll({
          where: {
            userName: {
              [Op.iRegexp]: userName
            },
            // isApproved: true,
          },
        })
        if (user.length > 0) {
          for (var i in user) {
            userCategory = await getCategorybyUser(user[i].id)
            userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType
          }
          user = user.filter(x => x.id != userId)
          return { user: user, success: true };

        } else {
          return {  user: user, message: 'No User', success: false }
        }
      }
      // let searchFor = body.userName

    },
    user: async (parent, { id }, { models }) => {
      let user = await models.User.findById(id);
      var userCategory = await getCategorybyUser(user.id)
      var userOrderType = await getOrderTypebyUser(user.id)
      user.categories = userCategory
      user.orderTypes = userOrderType
      return user
    },
    getAllAdvisorForUser: async (parent, { userId }, { models }) => {
      var user = [];
      let userCategory = [];
      let userOrderType = [];
      user = await models.User.findAll({
        where: {
          role: 'ADVISOR',
          isApproved: true
        }
      });

      if (user.length > 0) {
        for (var i in user) {
          userCategory = await getCategorybyUser(user[i].id)
          userOrderType = await getOrderTypebyUser(user[i].id)
          user[i].categories = userCategory
          user[i].orderTypes = userOrderType

        }
        user = user.filter(x => x.id != userId)
        return { user: user, success: true };
      } else {
        return { message: 'No User Found', success: false }
      }
    },
    getAllAdvisorForAdmin: async (parent, { userId, isApproved }, { models }) => {
      var user = [];
      let userCategory = [];
      let userOrderType = [];
      var admin = await models.User.find({
        where: {
          id: userId, role: 'ADMIN'
        }
      });
      if (admin) {
        user = await models.User.findAll({
          where: {
            role: 'ADVISOR',
            isApproved: isApproved
          }
        });
        if (user.length > 0) {
          for (var i in user) {

            userCategory = await getCategorybyUser(user[i].id)
            userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType

          }
          return { user: user, success: true };
        } else {
          return { message: 'No User Found', success: false }
        }
      } else {
        return { message: 'No Admin Found', success: false }
      }
    },

    getAllAdvisor: async (parent, { userId, categoryName, orderTypeName, advisorName }, { models }) => {
      let user = []
      let categoryUsers = [];
      let orderTypeUsers = [];
      let adUser = [];
      if (categoryName) {
        categoryUsers = await getUserByCategoryName(categoryName);
      }
      if (orderTypeName) {
        orderTypeUsers = await getUserByorderTypeName(orderTypeName);
      }
      if (advisorName) {
        adUser = await getUserByAdvisorName(advisorName);
        // console.log('adUser', adUser)
      }
      if (categoryUsers.length > 0 && orderTypeUsers.length > 0 && adUser.length > 0) {
        user = await checkThree_duplicates(categoryUsers, orderTypeUsers, adUser);
        if (user.length > 0) {
          for (var i in user) {
            let userCategory = await getCategorybyUser(user[i].id)
            let userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType

          }
          user = user.filter(x => x.id != userId)
          return { user: user, success: true };
        } else {
          return { user: user, message: 'No Advisor Found', success: false }
        }
      }
      else if (categoryUsers.length > 0 && orderTypeUsers.length > 0) {
        user = await check_duplicates(categoryUsers, orderTypeUsers);
        if (user.length > 0) {
          for (var i in user) {
            let userCategory = await getCategorybyUser(user[i].id)
            let userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType

          }
          user = user.filter(x => x.id != userId)
          return { user: user, success: true };
        } else {
          return { user: user, message: 'No Advisor Found', success: false }
        }
      }
      else if (categoryUsers.length > 0 && adUser.length > 0) {
        user = await check_duplicates(categoryUsers, adUser);
        if (user.length > 0) {
          for (var i in user) {
            let userCategory = await getCategorybyUser(user[i].id)
            let userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType

          }
          user = user.filter(x => x.id != userId)
          return { user: user, success: true };
        } else {
          return { user: user, message: 'No Advisor Found', success: false }
        }
      }
      else if (orderTypeUsers.length > 0 && adUser.length > 0) {
        user = await check_duplicates(orderTypeUsers, adUser);
        if (user.length > 0) {
          for (var i in user) {
            let userCategory = await getCategorybyUser(user[i].id)
            let userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType

          }
          user = user.filter(x => x.id != userId)
          return { user: user, success: true };
        } else {
          return { user: user, message: 'No Advisor Found', success: false }
        }
      } else if (categoryUsers.length > 0 || orderTypeUsers.length > 0 || adUser.length > 0) {
        user = categoryUsers.length > 0 ? categoryUsers : orderTypeUsers.length > 0 ? orderTypeUsers : adUser
        if (user.length > 0) {
          for (var i in user) {
            let userCategory = await getCategorybyUser(user[i].id)
            let userOrderType = await getOrderTypebyUser(user[i].id)
            user[i].categories = userCategory
            user[i].orderTypes = userOrderType

          }
          user = user.filter(x => x.id != userId)
          return { user: user, success: true };
        } else {
          return { user: user, message: 'No Advisor Found', success: false }
        }
      } else {
        console.log('else')
        return { user: user, message: 'No Advisor Found', success: false }
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
      var usersss = await user.update({
        isLogin: true,
        isOnline: true,
      });
      var userCategory = await getCategorybyUser(user.id)
      var userOrderType = await getOrderTypebyUser(user.id)
      user.categories = userCategory
      user.orderTypes = userOrderType
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
        var userCategory = await getCategorybyUser(user.id)
        var userOrderType = await getOrderTypebyUser(user.id)
        user.categories = userCategory
        user.orderTypes = userOrderType
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
          if (!currentPass) {
            return { success: false, message: 'Old password is typed incorrectly...' }
          }
          var pass = password;

          password = await bcrypt.hash(pass, saltRounds);
          await newUser.update({ password });
          var userCategory = await getCategorybyUser(newUser.id)
          var userOrderType = await getOrderTypebyUser(newUser.id)
          newUser.categories = userCategory
          newUser.orderTypes = userOrderType
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
      // isAuthenticated,
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
            var userCategory = await getCategorybyUser(user.id)
            var userOrderType = await getOrderTypebyUser(user.id)
            user.categories = userCategory
            user.orderTypes = userOrderType
            return { user: user, success: true }
          }
          else {
            return { success: false, message: 'User is already verified! Please Login...' }
            // throw new UserInputError(
            //   'Email is already verified! Please Login...',
            // );
          }
        }
        else {
          return { success: false, message: 'No user found.' }
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
        const { id, title, userName, image, role, aboutService, aboutMe, isLogin, isAdvisor, isOnline, video,
          categories, orderTypes } = body
        var newUser = await models.User.find({
          where: {
            // $or: [
            //   { email: email },
            //   { authId: authId },
            // ],
            id: body.id,
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
        const user = await models.User.findById(newUser.id);
        // var userCat = "";

        var userOrderType = [];
        var userCategory = [];

        if (orderTypes) {
          for (var i in orderTypes) {
            // const orderTypessss = await models.OrderType.find({
            //   where: { name: orderTypes[i] },
            // });
            // .findById(orderTypes[i]);
            let userOrderTyp = await models.UserOrderType.create({
              userId: user.id,
              userName: user.userName,
              // orderTypeId: orderTypessss.id,
              subTitle: orderTypes[i].subTitle,
              price: orderTypes[i].price,
              orderTypeName: orderTypes[i].orderTypeName,
              isActive: orderTypes[i].isActive
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

    approvedAdvisor: combineResolvers(
      // isAuthenticated,
      async (
        parent,
        { userId, adminId, status },
        { models, me }) => {
        var adminUser = await models.User.find({
          where: {
            id: adminId,
          },
        });
        if (adminUser.role == 'ADMIN') {
          // return { success: true, message: 'User is Admin' }
          var newUser = await models.User.find({
            where: {
              id: userId,
            },
          });
          if (newUser) {
            if (newUser.isApproved === false) {
              const user = await models.User.findById(newUser.id);
              if (status == true) {
                await user.update({ isApproved: true });
                var userCategory = await getCategorybyUser(user.id)
                var userOrderType = await getOrderTypebyUser(user.id)
                user.categories = userCategory
                user.orderTypes = userOrderType
                return { user: user, success: true }
              } else {
                await user.update({
                  video: null,
                  role: 'USER',
                  aboutService: null,
                  aboutMe: null,
                  isAdvisor: false,
                  categories: null,
                  orderTypes: null,
                  title: null,
                  isApproved: false
                });
                var userCat = await models.UserCategory.findAll({
                  where: {
                    userId: userId,
                  },
                });
                var userOrder = await models.UserOrderType.findAll({
                  where: {
                    userId: userId,
                  },
                });
                for (var i in userCat) {
                  await models.UserCategory.destroy({ where: { id: userCat[i].id } });
                }
                for (var i in userOrder) {
                  await models.UserOrderType.destroy({ where: { id: userOrder[i].id } });
                }
                return { user: user, success: true }
              }
            }
            else {
              return { success: false, message: 'User is already isApproved! Please Login...' }
            }
          }
          else {
            return { success: false, message: 'No user found.' }
          }

        } else {
          return { success: false, message: 'User is Not Admin' }
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
