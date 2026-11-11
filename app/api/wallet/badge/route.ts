import { getAttendee } from "@/lib/attendee";
import { badgeRoleLabel, dashboardAccess } from "@/lib/dashboard-access";
import { decodeBadgeQr, makeWalletPass } from "@/lib/wallet-pass";
import { walletSigner } from "@/lib/wallet-signer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, noarchive",
};

function unavailable(message: string, status: number) {
  return new Response(message, { status, headers: { ...privateHeaders, "Content-Type": "text/plain; charset=utf-8" } });
}

export async function GET(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return unavailable("Open My Badge on the live dashboard to download your pass.", 403);
  }

  const attendee = await getAttendee(true);
  const now = Date.now();
  const { status } = dashboardAccess(attendee, now);
  if (status === "signed-out") return unavailable("Sign in on the live dashboard first.", 401);
  if (status === "unavailable") return unavailable("We couldn’t check your sign-in. Try again shortly.", 503);
  if (status !== "allowed" || attendee?.status !== "confirmed") {
    return unavailable("This account does not have access to a badge yet.", 403);
  }
  if (!attendee.audience || !attendee.badgeQr) return unavailable("Your badge is not available yet.", 404);

  // Google Wallet can import the same QR from a photo, even without a pass signer.
  if (new URL(request.url).searchParams.get("format") === "qr") {
    const png = Buffer.from(attendee.badgeQr.slice("data:image/png;base64,".length), "base64");
    return new Response(new Uint8Array(png), {
      headers: {
        ...privateHeaders,
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="Immerse-the-Bay-2026-Check-in.png"',
      },
    });
  }

  const signer = walletSigner(now);
  const code = decodeBadgeQr(attendee.badgeQr);
  if (!signer || !code) return unavailable("Wallet pass unavailable. Use your QR code in My Badge.", 503);

  try {
    const pass = makeWalletPass(signer, {
      name: attendee.name, role: badgeRoleLabel(attendee.audience, attendee.staffRole), code,
    });
    return new Response(new Uint8Array(pass), {
      headers: {
        ...privateHeaders,
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": 'attachment; filename="Immerse-the-Bay-2026-Check-in.pkpass"',
      },
    });
  } catch {
    // Never log the holder, QR, or signing material.
    return unavailable("Wallet pass unavailable. Use your QR code in My Badge.", 503);
  }
}
