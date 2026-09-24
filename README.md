# Neo Cash Pages

Act as a senior frontend developer and UI/UX engineer. I have uploaded two reference screenshots of a website called "Neo Cashless". Recreate the website as closely as possible to the screenshots.

IMPORTANT: Use the uploaded screenshots as the primary visual references. Do not redesign, modernize, simplify, or invent a different layout. Match the positions, proportions, colors, typography, illustrations, spacing, and overall appearance as closely as possible.

PROJECT REQUIREMENTS

1. TWO FULL-SCREEN LANDING SECTIONS

- Create exactly two full-screen hero sections.

- First section: Purple theme, matching the purple reference screenshot.

- Second section: Green theme, matching the green reference screenshot.

- The Purple section must be the initial landing page when the website loads.

- The Green section must be the next landing page.

- Each section should occupy approximately 100vh and the full available viewport width.

- Use smooth vertical scrolling with scroll snapping so that scrolling down moves from Purple to Green and scrolling up returns from Green to Purple.

- Support mouse wheel, trackpad, touch swipes, and keyboard scrolling.

- Avoid unintended extra sections or excessive scrolling.

2. FIXED HEADER

The header must remain fixed and visually stable while the hero sections scroll.

Include:

- Neo logo on the upper-left side.

- Home navigation item.

- English | বাংলা language selector.

- Login navigation item on the upper-right side.

- Match the reference screenshot's positioning, typography, spacing, and colors.

- Keep the header in the same position across both sections.

- Do not allow the header to scroll away with the hero content.

- Do not duplicate the header when changing slides.

- Ensure it stays readable against both backgrounds.

3. HERO CONTENT

Recreate the text and visual composition shown in the uploaded screenshots.

Purple first section:

- Purple background with the same overall tone and decorative shapes as the reference.

- Large Neo logo on the left.

- Small introductory text: "Neo Cash AI"

- Main heading: "Intelligent Cashless Financial Ecosystem"

- Supporting paragraph: "Transforming institutional finance with AI, biometric security, and fully automated digital transactions. Fast. Secure. Transparent. Paperless."

- Black "How To Use" button.

- Recreate the large illustration on the right showing the woman, financial documents, and banking/building elements, matching the reference as closely as possible.

Green second section:

- Green background matching the uploaded green reference.

- Keep the same logo, header, and overall text layout.

- Recreate the green version of the hero illustration, showing the person using a laptop while sitting on a stack of books, with floating financial icons and a desk lamp.

- Preserve the same heading, paragraph, and button text.

- Match the illustration's size, alignment, and position relative to the text.

4. SCROLLING AND SLIDE INDICATORS

- Place two small circular slide indicators near the bottom-center of the viewport, matching the reference.

- The left dot represents the Purple slide.

- The right dot represents the Green slide.

- Initially, the Purple slide is active.

- The active dot must be white, and the inactive dot must be a muted/translucent color, matching the screenshots.

- When scrolling down to Green, update the active indicator to the Green dot.

- When scrolling up to Purple, update the active indicator to the Purple dot.

- Clicking a dot must smoothly navigate to its corresponding section.

- Keep the indicators fixed near the bottom of the viewport, rather than making them part of the scrolling content.

- Keep the active indicator synchronized with the actual visible section.

5. WHAT SHOULD SCROLL

- Only the hero sections and their associated text and illustrations should move during section transitions.

- The header must remain fixed.

- The bottom slide indicators must remain fixed.

- Use smooth, controlled transitions without making the page feel like an ordinary long scrolling article.

- Prevent the fixed header and indicators from jumping or shifting between slides.

6. VISUAL FIDELITY

- Reproduce the screenshots as closely as possible.

- Match the exact background colors by sampling the reference images if possible.

- Match the logo size, typography, line breaks, font weights, text alignment, button appearance, margins, and illustration placement.

- Preserve the contrast and visual hierarchy of the original design.

- Avoid unnecessary shadows, gradients, borders, animations, icons, or extra UI elements that are not present in the screenshots.

- Do not replace the illustrations with unrelated stock images.

- If the original illustrations are available as separate assets, use them. Otherwise, use the uploaded screenshots as visual references and recreate the illustrations as closely as possible using suitable assets or custom SVG artwork.

- Do not use the entire screenshot as a single full-screen background image. Build the actual webpage with separate text, navigation, buttons, indicators, and illustration elements so that they remain properly positioned and responsive.

7. RESPONSIVE DESIGN

- Match the reference screenshots at their original desktop proportions first.

- Make the layout responsive for smaller laptop screens, tablets, and mobile devices.

- Preserve the visual hierarchy and keep the logo, text, illustration, header, and indicators visible.

- On mobile, adapt the layout carefully without removing the essential content or breaking the two-section scrolling behavior.

- Prevent horizontal overflow and overlapping elements.

8. FUNCTIONAL REQUIREMENTS

- Home should navigate to the first section.

- English | বাংলা should be presented as a language selector. If implementing language switching, translate the displayed text appropriately.

- Login should be a functional navigation link or clearly defined placeholder route.

- The How To Use button should be clickable and navigate to an appropriate section or placeholder destination.

- Make the two slide indicators functional.

- Make sure scroll snapping works correctly and the active dot always reflects the current section.

- Use accessible semantic HTML and keyboard-friendly controls.

9. IMPLEMENTATION

- Build the page using React, CSS, and JavaScript, or the framework already available in my project.

- If no existing project is provided, create a complete runnable implementation.

- Use reusable components for the fixed header, hero sections, and slide indicators.

- Keep the code organized and easy to modify.

- Do not return only a static mockup or a description. Implement the actual functioning website.

- Do not leave unfinished TODOs for the main layout, scrolling, or indicators.

10. FINAL VERIFICATION

Before finishing, compare the rendered website against both uploaded reference screenshots.

Check:

- Purple is the first section and Green is the second.

- Header remains fixed during scrolling.

- Text and illustrations transition together.

- The active dot changes correctly in both directions.

- The website visually matches the reference as closely as possible.

- No unexpected layout shifts, overflow, or broken scrolling occur.

DELIVERABLE:

Provide the complete working website implementation, including all necessary files, styles, and scripts. Tell me how to run it locally. Prioritize visual accuracy to my uploaded screenshots over creative redesign.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://neo-cash-clone.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/247c2749-bd13-43ca-84ed-2cffa30b2fdf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
