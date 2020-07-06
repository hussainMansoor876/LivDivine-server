import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    categories(cursor: String, limit: Int): CategoryConnection!
    category(id: ID!): Category!
  }

  extend type Mutation {
    createCategory(createdBy: ID!, name: String!): Category!
    deleteCategory(id: ID!): Boolean!
  }

  type CategoryConnection {
    edges: [Category!]!
    pageInfo: PageInfo!
  }

  type Category {
    id: ID!
    name: String!
    createdAt: Date!
    createdBy: ID!    
  }

  extend type Subscription {
    categoryCreated: CategoryCreated!
  }

  type CategoryCreated {
    category: Category!
  }
`;
