// Waitlist mode hides the app's login / "start free" entry points and routes
// everyone to the on-page waitlist instead. It is ON by default while the
// platform is in private early access, and is resolved at build time so the
// login/signup links are never rendered (no client-side flicker, and no reliance
// on PostHog being reachable).
//
// To reopen signup/login once the platform is public, build with
// PUBLIC_WAITLIST_MODE=off (and turn the PostHog `signup-login-waitlist` flag off).
export const WAITLIST_MODE = import.meta.env.PUBLIC_WAITLIST_MODE !== 'off';
