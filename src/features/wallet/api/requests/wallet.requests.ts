import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";

export interface Wallet {
  id: string;
  address: string;
  chain_id: number;
  is_default: boolean;
  created_at: string;
}

export interface StarsBalance {
  balance: number;
}

class WalletService {
  getWallets() {
    return apiClient.get<Wallet[]>(ENDPOINTS.WALLET.LIST);
  }
  linkWallet(address: string, chainId: number) {
    return apiClient.post<Wallet>(ENDPOINTS.WALLET.LINK, { address, chain_id: chainId });
  }
  toggleDefault(id: string) {
    return apiClient.patch(ENDPOINTS.WALLET.TOGGLE_DEFAULT(id));
  }
  getStarsBalance() {
    return apiClient.get<StarsBalance>(ENDPOINTS.REWARD.STARS_BALANCE);
  }
  getDefaultStars() {
    return apiClient.get(ENDPOINTS.REWARD.DEFAULT_STARS);
  }
  updateStarsSettings(id: string, payload: { amount: number }) {
    return apiClient.patch(ENDPOINTS.REWARD.STARS_SETTINGS(id), payload);
  }
  donatePost(postId: string, amount: number) {
    return apiClient.post(ENDPOINTS.REWARD.DONATE_POST, { post_id: postId, amount });
  }
  donateUser(userId: string, amount: number) {
    return apiClient.post(ENDPOINTS.REWARD.DONATE_USER, { user_id: userId, amount });
  }
  getTransactions(pageParam?: string) {
    return apiClient.get(pageParam ?? ENDPOINTS.REWARD.TRANSACTIONS);
  }
  mintEstimate(tokenId: string) {
    return apiClient.post(ENDPOINTS.BLOCKCHAIN.MINT_ESTIMATE, { token_id: tokenId });
  }
  mintPrepare(tokenId: string) {
    return apiClient.post(ENDPOINTS.BLOCKCHAIN.MINT_PREPARE, { token_id: tokenId });
  }
  mintSubmit(payload: { token_id: string; tx_hash: string }) {
    return apiClient.post(ENDPOINTS.BLOCKCHAIN.MINT_SUBMIT, payload);
  }
  swapStarToDoto(amount: number) {
    return apiClient.post(ENDPOINTS.BLOCKCHAIN.SWAP_STAR_TO_DOTO, { amount });
  }
  getBlockchainHistory(pageParam?: string) {
    return apiClient.get(pageParam ?? ENDPOINTS.BLOCKCHAIN.HISTORY);
  }
}

export default new WalletService();
