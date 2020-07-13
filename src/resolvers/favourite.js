import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
// import { isAuthenticated, isMessageOwner } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    favourites: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
          where: {
            createdAt: {
              [Sequelize.Op.lt]: fromCursorHash(cursor),
            },
          },
        }
        : {};

      const favourites = await models.Favourites.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = favourites.length > limit;
      const edges = hasNextPage ? favourites.slice(0, -1) : favourites;

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
    favourites: async (parent, { id }, { models }) => {
      return await models.Favourites.findById(id);
    },
    getFavouriteByUserId: combineResolvers(
      // isAuthenticated,
      // isMessageOwner,
      async (parent, { userId }, { models }) => {
        var userFavourite = await models.Favourite.findAll({
          where: {
            userId: userId
          },
        });

        if (userFavourite != "") {
          return { result: userFavourite, success: true }
        } else {
          return { message: 'No Favourite Found', success: false }
        }
      },
    ),
  },

  Mutation: {
    createFavourites: async (
      //  combineResolvers(
      // isAuthenticated,

      parent,
      body,
      { models, me }) => {
      const { userId, advisorId, isFavourite } = body

      var advisor = await models.User.findById(advisorId);
      if (!advisor) {      
        return {message: 'No advisor Found', success: false};
      }
      var user = await models.User.findById(userId);
      if (!user) {
        return {message: 'No user Found', success: false};
      }
      if (isFavourite == false) {
        const deleteData = await models.Favourite.destroy({
          where: {
            userId: userId,
            advisorId: advisorId
          }
        });
        return {message: 'favourite removed successfully', success: true}
      } else {
        const favourite = await models.Favourite.create({
          userId,
          advisorId,
          userName: user.userName,
          advisorName: advisor.userName
        });
        if (favourite) {
          return {result: favourite, success: true};
        } else {
          return {result: 'No User Found', success: false};
        }
        // pubsub.publish(EVENTS.FAVOURITE.CREATED, {
        //   favouriteCreated: { favourite },
        // });

        

      }
    },
    // ),

    deleteFavourite: combineResolvers(
      // isAuthenticated,
      // isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Favourite.destroy({ where: { id } });
      },
    ),
  },

  Favourite: {
    user: async (favourite, args, { loaders }) => {
      return await loaders.user.load(favourite.userId);
    },
  },

  Subscription: {
    favouriteCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.FAVOURITE.CREATED),
    },
  },
};
