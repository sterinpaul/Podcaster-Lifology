import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import axios from "axios";
import User from "../models/User";

// Type definitions of graphql
const typeDefs = gql`
  type Podcast {
    _id: String!
    name: String!
    img: String!
    title: String!
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

// Resolvers including queries and mutations
const resolvers = {
  Query: {
    allPodcasts: async () => {
      const options = {
        method: 'GET',
        url: 'https://spotify23.p.rapidapi.com/search/',
        params: {
          q: 'movies',
          type: 'podcasts',
          offset: '0',
          limit: '100',
          numberOfTopResults: '5'
        },
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY,
          'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
      };
      try {
        const response = await axios.request(options);
        return response?.data?.podcasts?.items?.map(({data}:{data:{uri:string,name:string,publisher:{name:string},coverArt:{sources:{url:string}[]}}})=>(
          {_id:data.uri,name:data.name,img:data.coverArt.sources[0].url,title:data.publisher.name}
        ))
        
      } catch (error) {
        console.error(error);
      }
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
