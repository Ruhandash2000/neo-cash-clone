# Extend the Neo homepage after the existing hero

## Result
Keep the current purple/green side-to-side hero visually unchanged, then add the supplied reference layout beneath it as one continuous responsive homepage.

## Sections
1. **Why Choose Us**
   - Script heading and spacious white section.
   - One large rounded pastel feature panel matching the reference.
   - Six reusable feature rows in a 2 × 3 desktop layout, with circular Lucide icons, titles, and supplied descriptions.
   - Collapse to one column on narrow screens.

2. **Have Any Question?**
   - Script heading above a two-column illustration and FAQ layout.
   - Create a cohesive Neo financial-planning illustration based on the reference, stored as a local app asset.
   - Build four accessible rounded FAQ items with the first open initially, one item open at a time, animated height/chevron changes, and the supplied first answer.

3. **Contact Us**
   - Large rounded purple-to-blue message panel matching the reference proportions.
   - Functional message field and Send action with validation, success feedback, keyboard support, and no external delivery service.

4. **Footer**
   - Near-black full-width footer with prominent Neo mark, supplied brand statement, contact details, three link columns, social icons, and copyright.
   - Preserve the reference hierarchy on desktop and stack cleanly on mobile.

## Visual system
- Extend the existing Neo tokens with pastel surfaces, footer colors, borders, and accent roles in `src/styles.css`.
- Keep Lobster Two for the hand-lettered headings and introduce a clean body face through the existing document font links.
- Add restrained reveal and hover motion, disabled when reduced motion is preferred.
- Use semantic landmarks, headings, links, labels, and visible keyboard focus states.

## Technical details
- Split the new areas into small reusable components while leaving `HeroSection` markup and styling unchanged.
- Convert only the outer page shell from viewport-locked to vertically scrollable; retain horizontal snapping, swiping, dots, and keyboard controls inside the current hero.
- At the final horizontal hero panel, allow downward wheel/touch movement to continue naturally into the new sections; upward movement at the page top returns naturally to the hero.
- Keep all content on `/` and retain its current metadata.
- Verify desktop, tablet, and mobile layouts plus horizontal hero navigation, FAQ behavior, contact feedback, overflow, and footer stacking in the live preview.

## Assumptions
- Footer contact values shown in the reference are treated as placeholders because no real phone, email, or location was provided.
- “Send” provides polished local confirmation only; no message is transmitted because no destination or mail service was specified.
