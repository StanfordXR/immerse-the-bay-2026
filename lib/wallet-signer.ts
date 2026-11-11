import "server-only";
import { validateWalletSigner, WALLET_PASS_EXPIRATION } from "@/lib/wallet-pass";

/** All three PEMs are server-only. The button stays hidden when signing is unavailable. */
export function walletSigner(now = Date.now()) {
  if (now >= Date.parse(WALLET_PASS_EXPIRATION)) return null;
  const signerCert = process.env.ITB_WALLET_SIGNER_CERT_PEM;
  const signerKey = process.env.ITB_WALLET_SIGNER_KEY_PEM;
  const wwdr = process.env.ITB_WALLET_WWDR_PEM;
  return signerCert && signerKey && wwdr
    ? validateWalletSigner({ signerCert, signerKey, wwdr }, now)
    : null;
}
