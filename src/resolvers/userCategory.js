import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
// import { isAuthenticated, isMessageOwner } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    userCategories: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
          where: {
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
          },
        }
        : {};

      const userCategories = await models.userCategories.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = userCategories.length > limit;
      const edges = hasNextPage ? userCategories.slice(0, -1) : userCategories;

      return {
        edges,
        // pageInfo: {
        //   hasNextPage,
        //   endCursor: toCursorHash(
        //     edges[edges.length - 1].createdAt.toString(),
        //   ),
        // },
      };
    },
    userCategorysss: async (parent, { userId }, { models }) => {
      const userCategories = await models.UserCategory.findAll({
        where: {
          userId: userId
        }
      });
      if (userCategories != "") {
        console.log('userCategories', userCategories)
        return { result: userCategories, success: true }
      } else {

        console.log('NouserCategories')
        return { message: 'No User Category Found', success: false }
      }
    },
    getUserCategoryByUserId: async (parent, { userId }, { models }) => {
      // isMessageOwner,
      // async (parent, { userId }, { models }) => {
      console.log('user', userId)
      var userCategory = await models.UserCategory.findAll({
        where: {
          userId: userId
        },
      });

      if (userCategory != "") {
        console.log('userCategory', userCategory)
        return { result: userCategory, success: true }
      } else {
        console.log('No User Category Found')
        return { message: 'No User Category Found', success: false }
      }
    },

    getUserByUserCategory: async (parent, { name }, { models }) => {
      // isMessageOwner,
      // async (parent, { userId }, { models }) => {
      // console.log('user', name)
      var userCategory = await models.UserCategory.findAll({
        where: {
          categoryName: name
        },
      });

      if (userCategory != "") {
        // console.log('userCategory', userCategory)
        return { result: userCategory, success: true }
      } else {
        return { message: 'No User Category Found', success: false }
      }
    },
    // ),
  },

  Mutation: {
    createUserCategories: async (
      //  combineResolvers(
      // isAuthenticated,

      parent,
      body,
      { models, me }) => {
      const { userCategories, userId } = body

      var user = await models.User.findById(userId);
      if (user) {
        console.log('user', userId)
      } else {
        console.log("No user")
        return { message: 'No User', success: false }
      }

      let userCategory = []
      if (userCategories) {
        for (var i in userCategories) {
          let userCat = await models.UserCategory.create({
            userId: user.id,
            userName: user.userName,
            categoryName: userCategories[i]
          });
          userCategory.push(userCat.dataValues);
        }
      }
      return { result: userCategory, success: true }
    },

    updateUserCategories: async (
      //  combineResolvers(
      // isAuthenticated,

      parent,
      body,
      { models, me }) => {
      const { userId, userCategories } = body
      console.log("userCategories", userCategories)
      var user = await models.User.findById(userId);
      var userCat = await models.UserCategory.findAll({
        where: {
          userId: userId,
        },
      });
      if (!userCat) {

        return { message: "No Category Found", success: false }
      } else {
        for (var i in userCat) {
          await models.UserCategory.destroy({ where: { id: userCat[i].id } });
        }
      }

      var newUserCategorys = []
      for (let index in userCategories) {
        let newUserCat = await models.UserCategory.create({
          userId: user.id,
          userName: user.userName,
          categoryName: userCategories[index]
        });
        newUserCategorys.push(newUserCat.dataValues);
      }
      return { result: newUserCategorys, success: true }

    },

    deleteUserCategory: combineResolvers(
      // isAuthenticated,
      // isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.UserCategory.destroy({ where: { id } });
      },
    ),
  },

  UserCategory: {
    user: async (usercategory, args, { loaders }) => {
      return await loaders.user.load(usercategory.userId);
    },
  },

  Subscription: {
    userCategoryCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.USERCATEGORY.CREATED),
    },
  },
};
