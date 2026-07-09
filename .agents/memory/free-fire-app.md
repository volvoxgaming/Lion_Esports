---
name: Free Fire Tournament App
description: Durable lessons from building the BLAZEFIRE Expo mobile app in artifacts/mobile/.
---

## Key Architecture

- 5-tab navigation: `app/(tabs)/index|tournaments|wallet|leaderboard|profile`
- Auth gate in `app/_layout.tsx` using `useSegments + useRouter + useAuth`
- All persistence via AsyncStorage (no backend)
- Two demo accounts: `player@freefire.com/player123`, `admin@freefire.com/admin123`

## TypeScript Pitfalls

**Ionicons icon names**: Not all human-readable icon names are in the TypeScript types even if they render at runtime. Specifically, `"crown"` is NOT in the @expo/vector-icons v15 Ionicons type union — use `"ribbon"` or `"star"` instead.

**Why:** The TS type union for Ionicons glyphs lags behind the actual icon set; typecheck fails even though the icon renders.

**useColors() narrowing**: The scaffold's `useColors.ts` used an unsafe cast `(colors as Record<string, typeof colors.light>).dark`. Simplified to `const palette: typeof colors.light = scheme === 'dark' ? colors.dark : colors.light;` to fix the type error cleanly.

**Closure nullability**: `tournament` found via `array.find()` (type: `T | undefined`) is NOT automatically narrowed inside inner closures even after an outer `if (!tournament) return`. Add a local guard `if (!tournament) return;` at the start of each inner function that uses it, or cast with `tournament!`.

**Expo Router typed routes**: Admin screen at `app/admin/index.tsx` resolves to `/admin` (NOT `/admin/` or `/admin/index`). Typed routes enforce exact string matching. Use `as any` cast when the route is valid but TypeScript's generated types don't include it.

## Color System

`constants/colors.ts` defines both `light` and `dark` keys pointing to the same dark gaming palette (black `#0B0B0B` bg, red `#FF3B30` accent). Extra tokens added: `gold`, `silver`, `bronze`, `success`, `warning` — all accessible via `useColors()` since the hook returns the full palette object.

## Package Notes

- `expo-clipboard` must be version `~8.0.8` for Expo SDK 54 (not the latest 57.x that pnpm resolves by default).
- `isLiquidGlassAvailable` from `expo-glass-effect` used to detect iOS 26 NativeTabs support; falls back to ClassicTabs with BlurView on iOS and plain View on Android/web.
