import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    favourites(cursor: String, limit: Int): FavouriteConnection!
    getFavouriteByUserId(userId: ID!): FavouriteResultArray!
    favourite(id: ID!): Favourite!
  }

  extend type Mutation {
    createFavourites(userId: String!, advisorId: String!, isFavourite: Boolean): FavouriteResult!
    deleteFavourite(id: ID!): Boolean!
  }

  type FavouriteConnection {
    edges: [Favourite!]!
  }

  type Favourite {
    id: ID
    advisorId: ID
    createdAt: Date
    advisorName: String
    user: User
  } 
   type FavouriteResultArray {
    result: [Favourite]
    message: String
    success: Boolean
  }

  type FavouriteResult {
    result: Favourite
    message: String
    success: Boolean
  }
  extend type Subscription {
    favouriteCreated: FavouriteCreated!
  }

  type FavouriteCreated {
    favourite: Favourite!
  }
`;
