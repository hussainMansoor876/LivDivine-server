import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    orderTypes(cursor: String, limit: Int): OrderTypeConnection!
    orderType(id: ID!): OrderType!
  }

  extend type Mutation {
    createOrderType(createdBy: ID!, name: String!): OrderType!
    deleteOrderType(id: ID!): Boolean!
  }

  type OrderTypeConnection {
    edges: [OrderType!]!
    pageInfo: PageInfo!
  }

  type OrderType {
    id: ID!
    name: String!
    createdAt: Date!
    createdBy: ID!    
  }

  extend type Subscription {
    orderTypeCreated: OrderTypeCreated!
  }

  type OrderTypeCreated {
    orderType: OrderType!
  }
`;
