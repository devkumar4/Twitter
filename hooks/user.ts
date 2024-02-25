import { graphqlClient } from "@/clients/api";
import { getCurrentUserQuery } from "@/garphql/query/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: () => graphqlClient.request(getCurrentUserQuery),
  });

  return { ...query, user: query?.data?.getCurrentUser };
};
