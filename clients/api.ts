import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphqlClient = new GraphQLClient(
  "https://d34enubk5rjjda.cloudfront.net/graphql",
  {
    headers: () => ({
      Authorization: isClient
        ? `Bearer ${window.localStorage.getItem("twitter_token")}`
        : "",
    }),
  }
);
