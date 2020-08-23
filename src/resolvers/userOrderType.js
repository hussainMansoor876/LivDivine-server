import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
// import { isAuthenticated, isMessageOwner } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    userOrderTypes: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
          where: {
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
          },
        }
        : {};

      const userOrderTypes = await models.userOrderTypes.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = userOrderTypes.length > limit;
      const edges = hasNextPage ? userOrderTypes.slice(0, -1) : userOrderTypes;

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
    userOrderType: async (parent, { orderTypeId }, { models }) => {
      const userOrderTypes = await models.UserOrderType.findAll({
        where: {
          orderTypeId: orderTypeId
        }
      });
      if (userOrderTypes != "") {
        console.log('userOrderTypes', userOrderTypes)
        return { result: userOrderTypes, success: true }
      } else {

        console.log('NouserOrderTypes')
        return { message: 'No User OrderType Found', success: false }
      }
    },
    getUserOrderTypeByUserId: async (parent, { userId }, { models }) => {
      // isMessageOwner,
      // async (parent, { userId }, { models }) => {
      console.log('user', userId)
      var userOrderType = await models.UserOrderType.findAll({
        where: {
          userId: userId
        },
      });

      if (userOrderType != "") {
        console.log('userOrderType', userOrderType)
        return { result: userOrderType, success: true }
      } else {
        console.log('No User OrderType Found')
        return { message: 'No User OrderType Found', success: false }
      }
    },

    getUserByUserOrder: async (parent, { name }, { models }) => {
      // isMessageOwner,
      // async (parent, { userId }, { models }) => {
      console.log('user', name)
      var userOrderType = await models.UserOrderType.findAll({
        where: {
          orderTypeName: name
        },
      });

      if (userOrderType != "") {
        return { result: userOrderType, success: true }
      } else {
        return { message: 'No User Order Type Found', success: false }
      }
    },
    // ),
  },

  Mutation: {
    // createUserOrderTypes: async (
    //   //  combineResolvers(
    //   // isAuthenticated,

    //   parent,
    //   body,
    //   { models, me }) => {
    //   const { orderTypeId, userId } = body

    //   console.log('body', body)
    //   var orderType = await models.OrderType.findById(orderTypeId);
    //   if (orderType) {
    //     console.log('orderType', orderType)
    //   } else {
    //     console.log("No orderType")
    //     return { message: 'No orderType', success: false }
    //   }
    //   var user = await models.User.findById(userId);
    //   if (user) {
    //     console.log('user', userId)
    //   } else {
    //     console.log("No user")
    //     return { message: 'No User', success: false }
    //   }
    //   const userOrderType = await models.UserOrderType.create({
    //     userId,
    //     userName: user.userName,
    //     orderTypeId,
    //     orderTypeName: orderType.name
    //   });
    //   return { result: userOrderType, success: true }
    //   // pubsub.publish(EVENTS.USERORDERTYPE.CREATED, {
    //   //   userOrderTypeCreated: { userOrderType },
    //   // });

    // },
    // // ),

    createUserOrderTypes: async (
      //  combineResolvers(
      // isAuthenticated,

      parent,
      body,
      { models, me }) => {
      const { userOrderTypes, userId } = body

      var user = await models.User.findById(userId);
      if (user) {
        var newUserOrderTypes = []
        for (let index in userOrderTypes) {
          // console.log('userOrderTypes[index].id', userOrderTypes[index])

          let newUserOrder = await models.UserOrderType.create({
            userId: user.id,
            userName: user.userName,
            orderTypeName: userOrderTypes[index].name,
            subTitle: userOrderTypes[index].subTitle,
            price: userOrderTypes[index].price,
            isActive: userOrderTypes[index].isActive
          });

          // console.log("newUserOrder", newUserOrder.dataValues)
          newUserOrderTypes.push(newUserOrder.dataValues);
        }
        return { result: newUserOrderTypes, success: true }
      } else {
        // console.log("No user")
        return { message: 'No User', success: false }
      }


    },

    updateUserOrderTypes: async (
      //  combineResolvers(
      // isAuthenticated,

      parent,
      body,
      { models, me }) => {
      const { userOrderTypes, userId } = body
      // var user = await models.User.findById(userId);
      var userOrderTyp = await models.UserOrderType.findAll({
        where: {
          userId: userId,
        },
      });
      // console.log("userOrderTyp", userOrderTyp)
      // return {result: userOrderTyp}
      if (!userOrderTyp) {

        return { message: "No User Order Type Found", success: false }
      }
      var newUserOrderTypes = []
      for (let index in userOrderTypes) {
        // console.log('userOrderTypes[index].id', userOrderTypes[index].id)
        var userOrderTyp = await models.UserOrderType.findById(userOrderTypes[index].id)
        //   {
        //   where: {
        //     id: userOrderTypes[index].id,
        //   },
        // });

        // console.log("userOrderTyp", userOrderTyp)
        if (!userOrderTyp) {
          return { message: "No Order Type Found", success: false }
        }
        let newUserOrder = await userOrderTyp.update({
          price: userOrderTypes[index].price,
          isActive: userOrderTypes[index].isActive
        });
        newUserOrderTypes.push(newUserOrder.dataValues);
      }
      return { result: newUserOrderTypes, success: true }

    },

    deleteUserOrderType: combineResolvers(
      // isAuthenticated,
      // isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.UserOrderType.destroy({ where: { id } });
      },
    ),
  },

  UserOrderType: {
    user: async (userOrderType, args, { loaders }) => {
      return await loaders.user.load(userOrderType.userId);
    },
  },

  Subscription: {
    userOrderTypeCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.USERORDERTYPE.CREATED),
    },
  },
};

