/**
 * XSS Sanitization Utilities
 *
 * Provides helpers to neutralise user-supplied URLs before they are placed
 * into executable DOM positions (e.g. <a href>, <iframe src>).
 *
 * Design decisions:
 *  - Strict allowlist: only `http:` and `https:` schemes are permitted.
 *  - Everything else (`javascript:`, `vbscript:`, `data:`, etc.) is
 *    replaced with `#` so the anchor still renders but is inert.
 *  - Whitespace / control-character tricks (e.g. `java\tscript:`) are
 *    stripped before the scheme check.
 */

const SAFE_URL_SCHEMES = /^https?:\/\//i;

/**
 * Characters that attackers insert to bypass naive prefix checks.
 * Covers ASCII control chars, tabs, newlines, zero-width spaces, etc.
 */
const INVISIBLE_CHARS = /[\u0000-\u001f\u007f\u200b-\u200d\ufeff]/g;

/**
 * Sanitise a user-provided URL for safe use in `href` / `src` attributes.
 *
 * @param url - The raw URL string (may be `null` or `undefined`).
 * @returns  A safe URL starting with `http(s)://`, or `"#"` if the
 *           input is missing or uses a forbidden scheme.
 *
 * @example
 * sanitizeUrl("https://twitter.com/post/123")  // → "https://twitter.com/post/123"
 * sanitizeUrl("javascript:alert(1)")            // → "#"
 * sanitizeUrl("  jav\tascript:alert(1)")        // → "#"
 * sanitizeUrl(null)                             // → "#"
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return "#";

  // 1. Trim visible whitespace
  const trimmed = url.trim();

  // 2. Strip invisible / control characters that can smuggle past regex
  const cleaned = trimmed.replace(INVISIBLE_CHARS, "");

  // 3. Only allow http:// and https:// schemes
  if (!SAFE_URL_SCHEMES.test(cleaned)) {
    return "#";
  }

  return cleaned;
}
