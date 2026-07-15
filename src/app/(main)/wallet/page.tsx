"use client";
import { useTranslation } from "react-i18next";
import { useWallets, useStarsBalance } from "@/features/wallet/api/queries/wallet.queries";
import { Spinner } from "@/shared/ui/spinner/Spinner";

export default function WalletPage() {
  const { t } = useTranslation();
  const { data: wallets, isLoading: walletsLoading } = useWallets();
  const { data: stars, isLoading: starsLoading } = useStarsBalance();

  return (
    <div>
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-zinc-800 px-4 py-3">
        <h1 className="text-xl font-bold text-white">{t("wallet")}</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="rounded-2xl border border-zinc-800 p-6">
          <p className="text-zinc-500 text-sm">Stars Balance</p>
          {starsLoading ? (
            <Spinner />
          ) : (
            <p className="text-3xl font-bold text-white mt-1">⭐ {stars?.balance ?? 0}</p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Connected Wallets</h2>
          {walletsLoading ? (
            <Spinner />
          ) : wallets?.length === 0 ? (
            <p className="text-zinc-500 text-sm">No wallets connected</p>
          ) : (
            <div className="space-y-2">
              {wallets?.map((w) => (
                <div key={w.id} className="flex items-center justify-between rounded-xl border border-zinc-800 p-4">
                  <div>
                    <p className="text-sm font-mono text-white">
                      {w.address.slice(0, 6)}...{w.address.slice(-4)}
                    </p>
                    <p className="text-xs text-zinc-500">Chain {w.chain_id}</p>
                  </div>
                  {w.is_default && (
                    <span className="text-xs bg-sky-500/20 text-sky-400 px-2 py-1 rounded-full">Default</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
