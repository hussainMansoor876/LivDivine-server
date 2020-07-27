import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
// import { isAuthenticated, isCategoryOwner } from './authorization';
import user from '../models/user';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    categories: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
          where: {
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
          },
        }
        : {};

      const categories = await models.Category.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = categories.length > limit;
      const edges = hasNextPage ? categories.slice(0, -1) : categories;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
    },
    category: async (parent, { id }, { models }) => {
      return await models.Category.findById(id);
    },
    // getCategoryById: combineResolvers(
    //   // isAuthenticated,
    //   // isCategoryOwner,
    //   async (parent, { userId }, { models }) => {
    //     console.log('user', userId)
    //     var userCategory = await models.Category.findAll({
    //       where: {
    //         userId: userId
    //       },
    //     });

    //     if (userCategory != "") {
    //       console.log('userCategory', userCategory)
    //       return {result : userCategory, success : true}
    //     } else {
    //       console.log('No category for User')
    //       return { category : 'No category for User', success: false }
    //     }
    //   },
    // ),
  },

  Mutation: {
    createCategory: async (parent, { name }, { models, me }) => {
      // combineResolvers(
      // isAuthenticated,
      console.log('name', name)

      const category = await models.Category.create({
        name: name,
        // createdBy: createdBy
      });
      console.log('category', category)
      // pubsub.publish(EVENTS.CATEGORY.CREATED, {
      //   categoryCreated: { category },
      // });

      return category;
    },
    // ),

    deleteCategory: combineResolvers(
      // isAuthenticated,
      // isCategoryOwner,
      async (parent, { id }, { models }) => {
        return await models.Category.destroy({ where: { id } });
      },
    ),
  },

  // Category: {
  //   user: async (category, args, { loaders }) => {
  //     return await loaders.user.load(category.userId);
  //   },
  // },

  Subscription: {
    categoryCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.CATEGORY.CREATED),
    },
  },
};
