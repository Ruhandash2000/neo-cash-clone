# Neo Cashless light and dark color themes

## Goal
Apply the supplied warm professional light palette and layered dark palette across every existing non-hero area, while preserving the two hero slides exactly as they are today.

## Implementation

1. **Central theme system**
   - Replace scattered non-hero colors with reusable semantic variables for page backgrounds, alternate surfaces, cards, text, muted text, borders, fields, actions, hover/focus states, and feedback messages.
   - Define light values from burnt orange, coral, gold, tan, beige, and warm off-white.
   - Define dark values from Night, Asphalt, Jet, Erie, Dim, Nightvision, Gunmetal, and Smoke, with controlled warm accents.
   - Keep the existing hero-specific purple, green, aqua, ink, and paper variables isolated and unchanged.

2. **Theme preference and toggle**
   - Add a compact sun/moon icon toggle beside Login in the existing hero navigation without changing the hero layout or behavior.
   - Restore the saved choice from local storage, otherwise follow the operating-system preference and fall back to light.
   - Apply the theme before the page paints to avoid a wrong-theme flash.
   - Keep the selected theme active across landing, sign-up, password reset, fingerprint flows, and dashboard navigation.

3. **Recolor existing interfaces only**
   - Update Why Choose Us, FAQ states, Contact Us, footer, login modal, sign-up, password reset, biometric panels, dashboard, and shared error/not-found screens to consume the semantic theme variables.
   - Preserve every current layout, image, font rule, dimension, wording, interaction, and authentication behavior.
   - Add consistent readable disabled, hover, keyboard-focus, error, success, input, and placeholder colors in both modes.

4. **Verification**
   - Compare the hero before and after to confirm its purple/green colors and artwork are unchanged.
   - Test light/dark switching, reload persistence, and cross-page persistence.
   - Check the landing sections, FAQ interaction, contact form, login views, sign-up validation, reset page, protected dashboard redirect, and mobile header for readability and overflow.

## Files
- `src/styles.css` — semantic palette, light/dark mappings, and color-only component updates.
- `src/components/theme-toggle.tsx` — accessible reusable sun/moon control.
- `src/lib/theme.ts` — theme preference helpers shared by the control and initial page setup.
- `src/routes/__root.tsx` — pre-paint theme initialization.
- `src/routes/index.tsx` — place the toggle beside Login.
- `src/routes/_authenticated/dashboard.tsx`, `src/routes/signup.tsx`, and `src/routes/reset-password.tsx` — expose the same toggle on standalone app screens only where needed for access; no flow or layout changes.
