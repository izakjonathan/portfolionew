# Landing word rotator

The landing screen retains its four fixed corners and exact scroll stop. The title uses the existing masked letter reveal. Five editable service phrases share one CSS grid cell, reserving the longest phrase's width and height so neither the prefix nor the surrounding layout moves. Each phrase holds before a slow opacity/vertical transition; the next starts every 3.6 seconds. No additional animation package is needed.

Rotation pauses behind the splash, menu and project dialog, on outgoing frames, and while the tab is hidden. A keyboard-accessible pause/play control stops automatic changes. Reduced motion and the editor's Motion toggle show the complete static service list. Screen readers receive one stable list rather than repeated announcements. Timers and visibility subscriptions clean up when the landing frame unmounts.

Primary references researched 7 November 2026:
- Motion enter/exit sequencing: https://motion.dev/docs/react-animate-presence
- Overlapping grid cells: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts
- Reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- Automatic content pause controls: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide
