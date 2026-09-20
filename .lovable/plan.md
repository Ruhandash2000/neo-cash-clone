# Touch navigation

## Goal
Make the two full-screen views change with a natural left/right finger swipe on touch devices.

## Implementation
- Track touch start and end positions on the horizontal screen area.
- A clear left swipe opens the green view; a right swipe returns to purple.
- Ignore short or mostly vertical gestures so taps and page controls continue working.
- Keep the existing smooth snap, dots, mouse wheel, and keyboard navigation synchronized.
- Verify the gesture at the current mobile preview size and confirm there is no vertical or horizontal layout overflow.
