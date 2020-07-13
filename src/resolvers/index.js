import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from '../resolvers/user';
import messageResolvers from '../resolvers/message';
import reviewResolvers from '../resolvers/review';
import favouriteResolvers from '../resolvers/favourite';
import categoryResolvers from '../resolvers/category';
import userCategoryResolvers from '../resolvers/userCategory';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  messageResolvers,
  reviewResolvers,
  favouriteResolvers,
  categoryResolvers,
  userCategoryResolvers
];
