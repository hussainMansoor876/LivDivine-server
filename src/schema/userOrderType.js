import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    userOrderTypes(cursor: String, limit: Int): UserOrderTypeConnection!
    getUserOrderTypeByUserId(userId: ID!): UserOrderTypeResultArray!
    userOrderType(orderTypeId: ID!): UserOrderTypeResultArray!
  }

  extend type Mutation {
    createUserOrderTypes(userId: String!, orderTypeId: String!): UserOrderTypeResult!
    deleteUserOrderType(id: ID!): Boolean!
  }

  type UserOrderTypeConnection {
    edges: [UserOrderType!]!
  }

  type UserOrderType {
    id: ID!
    userId: ID!
    userName: String!
    createdAt: Date!
    orderTypeId: ID!
    orderTypeName: String!
    user: User!
  }
  type UserOrderTypeResult {
    result: UserOrderType
    success: Boolean
    message: String
  }
  type UserOrderTypeResultArray {
    result: [UserOrderType]
    success: Boolean
    message: String
  }
  extend type Subscription {
    userOrderTypeCreated: UserOrderTypeCreated!
  }

  type UserOrderTypeCreated {
    userOrderType: UserOrderType!
  }
`;
