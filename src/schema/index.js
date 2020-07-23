import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import reviewSchema from './review';
import favouriteSchema from './favourite';
import categorySchema from './category';
import userCategorySchema from './userCategory';
import orderTypeSchema from './orderType';
import userOrderTypeSchema from './userOrderType';

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, messageSchema, reviewSchema, favouriteSchema, categorySchema, userCategorySchema, , orderTypeSchema, userOrderTypeSchema];
