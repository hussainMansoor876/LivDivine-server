import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    userOrderTypes(cursor: String, limit: Int): UserOrderTypeConnection!
    getUserOrderTypeByUserId(userId: ID!): UserOrderTypeResultArray!
    getUserByUserOrder(name: String!): UserOrderTypeResultArray!
    userOrderType(orderTypeId: ID!): UserOrderTypeResultArray!
  }

  extend type Mutation {
    createUserOrderTypes(userId: String!, userOrderTypes: [UserOrderTypesss]!): UserOrderTypeResultArray!  
    updateUserOrderTypes(userId: String!, userOrderTypes: [UserOrderTypesss]!): UserOrderTypeResultArray!
    deleteUserOrderType(id: ID!): Boolean!
  }

  input UserOrderTypesss {
    id: String
    orderTypeName: String
    subTitle: String
    isActive: Boolean
    price: Float
    userName: String
  }

  type UserOrderTypeConnection {
    edges: [UserOrderType!]!
  }

  type UserOrderType {
    id: ID!
    userId: ID!
    userName: String!
    createdAt: Date!
    price: Float
    orderTypeName: String!
    isActive: Boolean!
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
