import { createHash, createPrivateKey, X509Certificate } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import jsQR from "jsqr";
import { PKPass } from "passkit-generator";
import { PNG } from "pngjs";

export const WALLET_PASS_PATH = "/api/wallet/badge";
export const WALLET_QR_PATH = `${WALLET_PASS_PATH}?format=qr`;
export const WALLET_PASS_TYPE_ID = "pass.org.immersethebay.checkin.2026";
export const WALLET_PASS_EXPIRATION = "2026-11-16T08:00:00.000Z"; // End of Sunday Pacific time.
const pngPrefix = "data:image/png;base64,";
const pngMagic = Buffer.from("89504e470d0a1a0a", "hex");
const badgeCode = /^itb2026\.(?:[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}|staff\.[A-Za-z0-9_-]{1,171})\.[A-Za-z0-9_-]{43}$/;

type Certificates = { signerCert: string; signerKey: string; wwdr: string };
type Signer = { certificates: Certificates; teamIdentifier: string };

/** Consume the portal's existing authorized QR, rather than creating a second check-in token. */
export function decodeBadgeQr(dataUrl: string): string | null {
  if (!dataUrl.startsWith(pngPrefix) || dataUrl.length > 20_000) return null;
  try {
    const bytes = Buffer.from(dataUrl.slice(pngPrefix.length), "base64");
    if (bytes.length < 33 || !bytes.subarray(0, 8).equals(pngMagic)
      || bytes.readUInt32BE(8) !== 13 || bytes.toString("ascii", 12, 16) !== "IHDR") return null;
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    if (width !== height || width < 32 || width > 768) return null;
    const { data } = PNG.sync.read(bytes);
    const pixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
    const qr = jsQR(pixels, width, height, { inversionAttempts: "dontInvert" });
    return qr && badgeCode.exec(qr.data)?.[0] === qr.data ? qr.data : null;
  } catch {
    return null;
  }
}

/** Do not advertise a pass if the certificates are missing, expired, or mismatched. */
export function validateWalletSigner(certificates: Certificates, now = Date.now()): Signer | null {
  try {
    const signer = new X509Certificate(certificates.signerCert);
    const wwdr = new X509Certificate(certificates.wwdr);
    const teamIdentifier = /^OU=([A-Z0-9]{10})$/m.exec(signer.subject)?.[1];
    const valid = (cert: X509Certificate) => Date.parse(cert.validFrom) <= now && now < Date.parse(cert.validTo);
    if (!teamIdentifier || !signer.subject.split("\n").includes(`UID=${WALLET_PASS_TYPE_ID}`)
      || !valid(signer) || !valid(wwdr) || !wwdr.ca || !signer.checkIssued(wwdr)
      || !signer.verify(wwdr.publicKey) || !signer.checkPrivateKey(createPrivateKey(certificates.signerKey))) {
      return null;
    }
    return { certificates, teamIdentifier };
  } catch {
    return null;
  }
}

export function makeWalletPass(
  signer: Signer,
  holder: { name: string; role: string; code: string },
): Buffer {
  const pass = new PKPass({
    "icon.png": readFileSync(join(process.cwd(), "lib/wallet-assets/icon.png")),
    "icon@2x.png": readFileSync(join(process.cwd(), "lib/wallet-assets/icon@2x.png")),
    "icon@3x.png": readFileSync(join(process.cwd(), "lib/wallet-assets/icon@3x.png")),
  }, signer.certificates, {
    formatVersion: 1,
    passTypeIdentifier: WALLET_PASS_TYPE_ID,
    teamIdentifier: signer.teamIdentifier,
    serialNumber: createHash("sha256").update(holder.code).digest("hex").slice(0, 32),
    organizationName: "Stanford XR",
    description: "Immerse the Bay 2026 check-in badge",
    logoText: "Immerse the Bay 2026",
    backgroundColor: "rgb(22, 14, 42)",
    foregroundColor: "rgb(255, 255, 255)",
    labelColor: "rgb(132, 232, 244)",
    sharingProhibited: true,
  });
  pass.type = "eventTicket";
  pass.setExpirationDate(new Date(WALLET_PASS_EXPIRATION));
  pass.primaryFields.push({ key: "attendee", label: "ATTENDEE", value: holder.name });
  pass.secondaryFields.push(
    { key: "role", label: "EVENT ROLE", value: holder.role },
    { key: "dates", label: "DATES", value: "Nov 13–15, 2026" },
  );
  pass.backFields.push(
    { key: "check-in", label: "Check-in", value: "Show this QR code to a check-in volunteer at Immerse the Bay." },
    { key: "dashboard", label: "Live dashboard", value: "https://live.immersethebay.org/badge" },
  );
  pass.setBarcodes({
    format: "PKBarcodeFormatQR",
    message: holder.code,
    messageEncoding: "iso-8859-1",
    altText: "Immerse the Bay check-in",
  });
  return pass.getAsBuffer();
}
