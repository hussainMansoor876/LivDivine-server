import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    messages(cursor: String, limit: Int): MessageConnection!
    getMessageById(userId: ID!): MessageResult!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(userId: ID!, text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }
  type MessageResult {
    result: [Message]
    message: String
    success: Boolean
  }

  type Message {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!    
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type MessageCreated {
    message: Message!
  }
`;
