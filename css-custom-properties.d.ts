import "react";

declare module "react" {
  /** Lets inline styles set CSS custom properties (e.g. `style={{ "--delay": "2s" }}`) without casts. */
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined;
  }
}
