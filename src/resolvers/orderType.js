import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
// import { isAuthenticated, isOrderTypeOwner } from './authorization';
import user from '../models/user';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    orderTypes: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
          where: {
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
          },
        }
        : {};

      const orderTypes = await models.OrderType.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = orderTypes.length > limit;
      const edges = hasNextPage ? orderTypes.slice(0, -1) : orderTypes;

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
    orderType: async (parent, { id }, { models }) => {
      return await models.OrderType.findById(id);
    },
    // getOrderTypeById: combineResolvers(
    //   // isAuthenticated,
    //   // isOrderTypeOwner,
    //   async (parent, { userId }, { models }) => {
    //     console.log('user', userId)
    //     var userOrderType = await models.OrderType.findAll({
    //       where: {
    //         userId: userId
    //       },
    //     });

    //     if (userOrderType != "") {
    //       console.log('userOrderType', userOrderType)
    //       return {result : userOrderType, success : true}
    //     } else {
    //       console.log('No orderType for User')
    //       return { orderType : 'No orderType for User', success: false }
    //     }
    //   },
    // ),
  },

  Mutation: {
    createOrderType: async (parent, { name, subTitle, price }, { models, me }) => {
      // combineResolvers(
      // isAuthenticated,
      var ordertypesss = await models.OrderType.find({
        where: {
          name: name,
        },
      });
      if (!ordertypesss) {
        const orderType = await models.OrderType.create({
          name: name,
          subTitle: subTitle,
          price: price
          // createdBy: createdBy
        });

        return { orderType: orderType, success: true };

      } else {
        return { message: "Order Type Already Exist", success: false };
      }
    },
    updateOrderType: async (parent, { name, price }, { models, me }) => {
      // combineResolvers(
      // isAuthenticated,
      console.log('name', name)
      var ordertypesss = await models.OrderType.find({
        where: {
          name: name,
        },
      });
      console.log('ordertypesss', ordertypesss)
      if (ordertypesss) {

        var orderType = await ordertypesss.update({
          price: price
        });

        return { orderType: orderType, success: true };

      } else {
        return { message: "Order Type Does not Exist", success: false };
      }
    },
    // ),

    deleteOrderType: combineResolvers(
      // isAuthenticated,
      // isOrderTypeOwner,
      async (parent, { id }, { models }) => {
        return await models.OrderType.destroy({ where: { id } });
      },
    ),
  },

  // OrderType: {
  //   user: async (orderType, args, { loaders }) => {
  //     return await loaders.user.load(orderType.userId);
  //   },
  // },

  Subscription: {
    orderTypeCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.ORDERTYPE.CREATED),
    },
  },
};
