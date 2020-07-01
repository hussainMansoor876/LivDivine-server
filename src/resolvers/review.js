import Sequelize from 'sequelize';
import { combineResolvers } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
// import { isAuthenticated, isMessageOwner } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    reviews: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
            },
          }
        : {};

      const reviews = await models.Reviews.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = reviews.length > limit;
      const edges = hasNextPage ? reviews.slice(0, -1) : reviews;

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
    reviews: async (parent, { id }, { models }) => {
      return await models.Reviews.findById(id);
    },
  },

  Mutation: {
    createReviews: combineResolvers(
      // isAuthenticated,
      async (parent, { text }, { models, me }) => {
        const review = await models.Review.create({
          text,
          userId: me.id,
        });

        pubsub.publish(EVENTS.REVIEW.CREATED, {
          reviewCreated: { review },
        });

        return review;
      },
    ),

    deleteReview: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Review.destroy({ where: { id } });
      },
    ),
  },

  Review: {
    user: async (review, args, { loaders }) => {
      return await loaders.user.load(review.userId);
    },
  },

  Subscription: {
    reviewCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.REVIEW.CREATED),
    },
  },
};
