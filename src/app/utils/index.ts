import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Generate or retrieve unique user ID
export const getUserId = (): string => {
  if (typeof window !== "undefined") {
    let userId = localStorage.getItem("podcast_user_id");
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("podcast_user_id", userId);
    }
    return userId;
  }
  return "";
};

// GraphQL client utilities
export const executeGraphQL = async <T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> => {
  try {
    const response = await axios.post(
      "/api/graphql",
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { data, errors } = response.data;

    if (errors) {
      console.error("GraphQL Errors:", errors);
      throw new Error(errors[0].message);
    }

    return data as T;
  } catch (error: any) {
    console.error("Network or Axios error:", error);
    throw error;
  }
};

// Example GraphQL query functions
export const fetchAllPodcastsQuery = `
  query allPodcasts {
  allPodcasts {
    _id
    name
    img
    uNm
  }
}
`;

export const fetchSelectedPodcastsQuery = `
  query selectedPodcasts($userId: String!) {
    selectedPodcasts(userId: $userId)
  }
`;

export const saveSelectedPodcasts = `
  mutation saveSelectedPodcasts($userId: String!, $selectedPodcasts: [String!]!) {
    saveSelectedPodcasts(userId: $userId, selectedPodcasts: $selectedPodcasts)
  }
`