import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    searchUsers(userName: String!, role: String, isOnline: Boolean, isAdvisor: Boolean): RoleUser!
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
    ): Token!
    socialSignUp(userName: String!, email: String, authType: String!, authId: String!, image: String ): Token!
    signIn(login: String!, password: String!): Token!
    forgotPassword(id: String!, password: String!, otp: String!): Token!
    updateUser(id: String!, userName: String, image: String, isLogin: Boolean, isOnline: Boolean, isAdvisor: Boolean, isApproved: Boolean): Token!
    updatePassword(id: String!,currentPassword: String, password: String!): Token!
    updateVerified(id: String!): Token!    
    becomeAdvisor(id: String,authId: String,
       userName: String,
        title: String,
         image: String,
          videoThumbnail: String,
          
      role: String,
       aboutService: String,
        aboutMe: String,
         isLogin: Boolean,
          isAdvisor: Boolean, 
          isOnline: Boolean,
      categories: [String],
       orderTypes: [UserOrderTs]): Token!
    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String
    user: User
    message: String
    success: Boolean!
    categories: [UserCategories],
    orderTypes: [UserOrderTypes]
  }
  type RoleUser {
    user: [User]
    message: String
    success: Boolean!
  }
  type Messages {
    messages: String!
  }
  type UserCategories {
    id: String    
    userId: String,
    userName: String,
    categoryName: String,
  }
  type UserOrderTypes {
    id: String    
    userId: String,
    userName: String,
    orderTypeName: String,
    subTitle: String
    price: Float
    isActive: Boolean
  }
  input UserOrderTs {
    orderTypeName: String,
    subTitle: String
    isActive: Boolean
    price: Float
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
    isAdvisor: Boolean
    isOnline: Boolean
    isApproved: Boolean
    authType: String
    title: String
    aimage: String
    aboutService: String
    aboutMe: String
    videoThumbnail: String,
    userCategories: [UserCategories]
    userOrderTypes: [UserOrderTypes]
  }
`;
