import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import walletService from "../requests/wallet.requests";
import { walletKeys } from "../../wallet.query-keys";

export function useWallets() {
  return useQuery({
    queryKey: walletKeys.list(),
    queryFn: () => walletService.getWallets().then((r) => r.data),
  });
}

export function useStarsBalance() {
  return useQuery({
    queryKey: walletKeys.starsBalance(),
    queryFn: () => walletService.getStarsBalance().then((r) => r.data),
  });
}

export function useTransactions() {
  return useInfiniteQuery({
    queryKey: walletKeys.transactions(),
    queryFn: ({ pageParam }) =>
      walletService.getTransactions(pageParam as string | undefined).then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (p: any) => p.next ?? undefined,
  });
}
