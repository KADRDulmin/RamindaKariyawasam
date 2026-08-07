# Portfolio design note

## Intent

The redesign keeps the portfolio's tactile desk-board identity rather than turning it into a generic dark technology landing page. Sticky-note colors, cork/paper surfaces, tape and pin details, hand-drawn typography, photography, gentle rotation, and wide-screen dragging remain the core visual vocabulary.

The added signature element is the **engineering evidence layer**. Featured case studies use numbered evidence cards, architecture lanes, status stamps, and capability annotations. They feel like marked-up system notes pinned to the existing board, but they give recruiters a fast path from a project name to its actual engineering boundary.

## Visual system

- Paper: `#f4e8cd` and `#ebdcb8`
- Cork: `#d9bc8a`
- Ink: `#2a241f`
- Notes: yellow `#ffe58a`, pink `#ffb7c5`, mint `#b7e3c2`, sky `#a9d2ef`, lavender `#d7c2f2`, peach `#ffcfa1`
- Display type: Caveat Brush and Shadows Into Light
- Reading type: Patrick Hand
- Technical labels: Space Mono

The palette and type remain deliberately warm and human. Small monospace labels carry implementation status and architecture detail without taking over the page.

## Interaction decisions

- Notes can still be dragged on wide pointer devices, but all content is readable and usable without dragging.
- Project cards are keyboard-operable buttons with visible focus, Enter/Space activation, and dialog intent.
- Project and resume dialogs trap focus, close on Escape or backdrop, and restore focus to their trigger.
- Filters use `aria-pressed`, expose result changes through a polite status region, and support projects in multiple technical categories.
- Mobile converts spatial/drag-oriented compositions into a linear stack with no required gestures.
- Reduced-motion users receive static photos, near-zero transitions, and no entrance choreography.

## Resume connection

The four-option resume chooser uses the same note-board language. The three targeted PDFs intentionally retain the immutable source resume's warm cream wave, circular portrait, orange serif headings, and two-column composition so the website and documents feel authored by the same person.
