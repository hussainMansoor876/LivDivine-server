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
    getReviewByAdvisorId: combineResolvers(
      // isAuthenticated,
      // isMessageOwner,
      async (parent, { advisorId }, { models }) => {
        console.log('user', advisorId)
        var userReview = await models.Review.findAll({
          where: {
            advisorId: advisorId
          },
        });

        if (userReview != "") {
          console.log('userReview', userReview)
          return { result: userReview, success: true }
        } else {
          console.log('No Review Found')
          return { message: 'No Review Found', success: false }
        }
      },
    ),
  },

  Mutation: {
    createReviews: async (
      //  combineResolvers(
      // isAuthenticated,

      parent,
      body,
      { models, me }) => {
      const { ReviewText, reviewType, userId, advisorId} = body

      console.log('body', body)
      var advisor = await models.User.findById(advisorId);
      if (advisor) {
        console.log('advisor', advisor)
      } else {
        console.log("No Advisor")
      }
      var user = await models.User.findById(userId);
      if (advisor) {
        console.log('user', userId)
      } else {
        console.log("No user")
      }
      const review = await models.Review.create({
        ReviewText,
        userId,
        advisorId,
        reviewType,
        userName: user.userName,
        advisorName: advisor.userName
      });
      if (review) {
        console.log('review', review)
      } else {
        console.log('error')
      }
      // pubsub.publish(EVENTS.REVIEW.CREATED, {
      //   reviewCreated: { review },
      // });

      return review;
    },
    // ),

    deleteReview: combineResolvers(
      // isAuthenticated,
      // isMessageOwner,
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
