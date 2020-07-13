import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    userCategories(cursor: String, limit: Int): UserCategoryConnection!
    getUserCategoryByUserId(userId: ID!): UserCategoryResultArray!
    userCategory(categoryId: ID!): UserCategoryResultArray!
  }

  extend type Mutation {
    createUserCategories(userId: String!, categoryId: String!): UserCategoryResult!
    deleteUserCategory(id: ID!): Boolean!
  }

  type UserCategoryConnection {
    edges: [UserCategory!]!
  }

  type UserCategory {
    id: ID!
    userId: ID!
    userName: String!
    createdAt: Date!
    categoryId: ID!
    categoryName: String!
    user: User!
  }
  type UserCategoryResult {
    result: UserCategory
    success: Boolean
    message: String
  }
  type UserCategoryResultArray {
    result: [UserCategory]
    success: Boolean
    message: String
  }
  extend type Subscription {
    userCategoryCreated: UserCategoryCreated!
  }

  type UserCategoryCreated {
    userCategory: UserCategory!
  }
`;
