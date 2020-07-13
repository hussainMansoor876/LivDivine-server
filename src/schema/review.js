import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    reviews(cursor: String, limit: Int): ReviewConnection!
    getReviewByAdvisorId(advisorId: ID!): ReviewResult!
    review(id: ID!): Review!
  }

  extend type Mutation {
    createReviews(userId: String!, advisorId: String!, ReviewText: String!, reviewType: Boolean!): Review!
    deleteReview(id: ID!): Boolean!
  }

  type ReviewConnection {
    edges: [Review!]!
  }

  type Review {
    id: ID!
    advisorId: ID!
    reviewType: Boolean!
    ReviewText: String!
    createdAt: Date!
    advisorName: String!
    user: User!
  }
  type ReviewResult {
    result: [Review]
    review: String
    success: Boolean
  }
  extend type Subscription {
    reviewCreated: ReviewCreated!
  }

  type ReviewCreated {
    review: Review!
  }
`;
