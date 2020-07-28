import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    orderTypes(cursor: String, limit: Int): OrderTypeConnection!
    orderType(id: ID!): OrderTypeResult!
  }

  extend type Mutation {
    createOrderType(name: String!, subTitle: String!, price: Float!): OrderTypeResult!
    updateOrderType(name: String!, price: Float): OrderTypeResult!
    deleteOrderType(id: ID!): Boolean!
  }

  type OrderTypeConnection {
    edges: [OrderType!]!
    pageInfo: PageInfo!
  }

  type OrderTypeResult {
    orderType: OrderType
    message: String
    success: Boolean!
  }
  type OrderType {
    id: ID!
    name: String!
    subTitle: String!
    price: Float!
    createdAt: Date! 
  }

  extend type Subscription {
    orderTypeCreated: OrderTypeCreated!
  }

  type OrderTypeCreated {
    orderType: OrderType!
  }
`;
