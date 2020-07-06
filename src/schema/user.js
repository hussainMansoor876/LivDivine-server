import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User    
    getAllUserByRole(role: String!): RoleUser!
    me: User
  }

  extend type Mutation {
    signUp(
      userName: String!
      email: String!
      password: String
      isVerified: Boolean!
      categories: String
    ): Token!
    socialSignUp(userName: String!, email: String, authType: String!, authId: String!, image: String ): Token!
    signIn(login: String!, password: String!): Token!
    forgotPassword(email: String!, password: String!, otp: String!): Token!
    updateUser(email: String!, userName: String, image: String, isLogin: Boolean, isOnline: Boolean): Token!
    updatePassword(email: String!, password: String!): Token!
    updateVerified(email: String!, isVerified: Boolean!): Token!    
    becomeAdvisor(email: String,authId: String, userName: String, title: String, advisorImage: String, 
      role: String, aboutService: String, aboutMe: String,categories: String isLogin: Boolean): Token!
    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String
    user: User
    message: String
    success: Boolean!
  }
  type RoleUser {
    user: [User]
    message: String
    success: Boolean!
  }
  type Messages {
    messages: String!
  }
  type Categories {
    categories: String!
  }

  type User {
    id: ID!
    userName: String!
    email: String
    authId: String
    role: String
    messages: [Message!]
    image: String
    isVerified: Boolean!
    isLogin: Boolean!
    isOnline: Boolean
    authType: String
    title: String
    advisorImage: String
    aboutService: String
    aboutMe: String
    categories: String
  }
`;
