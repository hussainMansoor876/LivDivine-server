import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    userCategories(cursor: String, limit: Int): UserCategoryConnection!
    getUserCategoryByUserId(userId: ID!): UserCategoryResultArray!
    getUserByUserCategory(name: String!): UserCategoryResultArray!
    userCategorysss(userId: ID!): UserCategoryResultArray!
  }

  extend type Mutation {
    createUserCategories(userId: String!, userCategories: [String]!): UserCategoryResultArray!    
    updateUserCategories(userId: String!, userCategories: [String]!): UserCategoryResultArray!
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
    categoryName: String!
    user: User!
  }

  input UserCategorys {
    categoryName: String!
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
