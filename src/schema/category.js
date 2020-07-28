import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    categories(cursor: String, limit: Int): CategoryConnection!
    category(id: ID!): Category!
  }

  extend type Mutation {
    createCategory(name: String!): CategoryResult!
    deleteCategory(id: ID!): Boolean!
  }

  type CategoryConnection {
    edges: [Category!]!
    pageInfo: PageInfo!
  }

  type CategoryResult {
    category: Category
    message: String
    success: Boolean
  }

  type Category {
    id: ID!
    name: String!
    createdAt: Date!
  }

  extend type Subscription {
    categoryCreated: CategoryCreated!
  }

  type CategoryCreated {
    category: Category!
  }
`;
