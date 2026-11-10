import "server-only";
import type { FAQItem } from "@/data/types";

/** Guide-derived logistics stay behind the live Help page's attendee gate. */
export function getArrivalGuideFaq(): FAQItem[] {
  const raw = process.env.ITB_HELP_FAQ_JSON;
  if (!raw || raw.length > 24_000) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length > 16) return [];
    return parsed.flatMap((item, index) => {
      if (!item || typeof item !== "object") return [];
      const { question, answer } = item as Record<string, unknown>;
      if (typeof question !== "string" || typeof answer !== "string") return [];
      const q = question.trim();
      const a = answer.trim();
      return q && a && q.length <= 150 && a.length <= 700
        ? [{ id: `arrival-${index + 1}`, question: q, answer: a }]
        : [];
    });
  } catch {
    return [];
  }
}
