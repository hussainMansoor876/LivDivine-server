import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    reviews(cursor: String, limit: Int): ReviewConnection!
    review(id: ID!): Review!
  }

  extend type Mutation {
    createReview(text: String!): Review!
    deleteReview(id: ID!): Boolean!
  }

  type ReviewConnection {
    edges: [Review!]!
  }

  type Review {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }

  extend type Subscription {
    reviewCreated: ReviewCreated!
  }

  type ReviewCreated {
    review: Review!
  }
`;
