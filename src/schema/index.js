import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import reviewSchema from './review';
import favouriteSchema from './favourite';

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

export default [linkSchema, userSchema, messageSchema, reviewSchema, favouriteSchema];
