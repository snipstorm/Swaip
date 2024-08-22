import { useMemo } from "react";
import { api } from "~/trpc/react";

export const useTokens = () => {
  const { data, isLoading, error, refetch } =
    api.jupiter.tokens.getTokens.useQuery(undefined, {
      retry: false,
    });

  const status = useMemo(() => {
    if (error) {
      return "failed" as const;
    }
    if (isLoading) {
      return "pending" as const;
    }
    if (data) {
      return "fetched" as const;
    }
    return "failed" as const;
  }, [data, error, isLoading]);

  return {
    status,
    data,
    _refetchSession: refetch,
  };
};
