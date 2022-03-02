"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  enum GameType {
    VIDEOSLOT
    SLOTMACHINES
    ALL
  }

  input LogInInput {
    code: String!
  }

  type Wishlist {
    id: ID!
    game: Game!
  }

  type Wishlists {
    total: Int!
    result: [Wishlist!]!
  }

  type Game {
    id: ID!
    name: String!
    description: String!
    code: String!
    icon: String!
    type: GameType!
    url: String!
    wishlist(limit: Int!, page: Int!): Wishlists
  }

  type Games {
    total: Int!
    result: [Game!]!
  }

  type User {
    id: ID!
    name: String!
    avatar: String!
    contact: String!
    wishlist(limit: Int!, page: Int!): Wishlists
    games(limit: Int!, page: Int!): Games!
  }

  type Viewer {
    id: ID
    token: String
    avatar: String
    hasWallet: Boolean
    didRequest: Boolean!
  }

  type Query {
    authUrl: String!
    user(id: ID!): User!
    game(id: ID!): Game!
    games(filter: GameType!, limit: Int!, page: Int!): Games!
  }

  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
  }
`;
