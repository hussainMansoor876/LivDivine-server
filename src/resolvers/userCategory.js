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
    userCategory: async (parent, { categoryId }, { models }) => {
      const userCategories = await models.UserCategory.findAll({
        where: {
          categoryId: categoryId
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
    // ),
  },

  Mutation: {
    createUserCategories: async (
      //  combineResolvers(
      // isAuthenticated,

      parent,
      body,
      { models, me }) => {
      const { categoryId, userId } = body

      console.log('body', body)
      var category = await models.Category.findById(categoryId);
      if (category) {
        console.log('category', category)
      } else {
        console.log("No category")
        return { message: 'No category', success: false }
      }
      var user = await models.User.findById(userId);
      if (user) {
        console.log('user', userId)
      } else {
        console.log("No user")
        return { message: 'No User', success: false }
      }
      const userCategory = await models.UserCategory.create({
        userId,
        userName: user.userName,
        categoryId,
        categoryName: category.name
      });
      return { result: userCategory, success: true }
      // pubsub.publish(EVENTS.USERCATEGORY.CREATED, {
      //   usercategoryCreated: { usercategory },
      // });

    },
    // ),

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
