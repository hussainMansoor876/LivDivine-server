import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String
      isVerified: Boolean!
    ): Token!
    socialSignUp(username: String!, authType: String!, email: String!, isVerified: Boolean!): Token!
    signIn(login: String!, password: String!): Token!
    forgotPassword(email: String!, password: String!, optp: String!): Token!
    updateUser(email: String!, username: String, image: String, isLogin: Boolean): User!
    updatePassword(email: String!, password: String!): User!
    updateVerified(email: String!, isVerified: Boolean!): User!
    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String
    messages: [Message!]
    image: String
    isVerified: Boolean!
    isLogin: Boolean!
    authType: String
  }
`;
