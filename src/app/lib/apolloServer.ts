import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import axios from "axios";
import User from "../models/User";

const typeDefs = gql`
  type Podcast {
    _id: String!
    name: String!
    img: String!
    uNm: String!
  }

  type Query {
    allPodcasts: [Podcast!]!
    selectedPodcasts(userId: String!): [String!]!
  }

  type Mutation {
    saveSelectedPodcasts(
      userId: String!
      selectedPodcasts: [String!]!
    ): Boolean!
  }
`;

const resolvers = {
  Query: {
    allPodcasts: async () => {
      const response = await axios.get(
        "https://openwhyd.org/hot/electro?format=json"
      );
      return response.data?.tracks;
    },
    selectedPodcasts: async (_parent: any, args: { userId: string }) => {
      const { userId } = args;
      const user = await User.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId } },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          projection: { selectedPodcasts: 1, _id: 0 },
        }
      ).lean();
      return user?.selectedPodcasts || [];
    },
  },
  Mutation: {
    saveSelectedPodcasts: async (
      _parent: any,
      args: { userId: string; selectedPodcasts: string[] }
    ) => {
      const { userId, selectedPodcasts } = args;
      
      await User.findOneAndUpdate(
        { userId },
        { $set: { selectedPodcasts } },
        { upsert: true }
      );
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default server;
