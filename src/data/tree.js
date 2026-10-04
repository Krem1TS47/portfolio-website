/**
 * Hand-authored pear tree geometry (viewBox 0 0 1000 760). Branches are
 * index-aligned with `stackCategories` in ./stack.js.
 */
export const TREE = {
    viewBox: '0 0 1000 760',
    ground: 'M40 742 Q 500 716 960 742',
    trunk: 'M466 746 C 474 660 486 560 500 468 C 514 560 526 660 534 746 Z',
    branches: [
        // Languages — left, low
        { d: 'M500 470 C 430 436 300 426 150 310', pearRange: [0.3, 0.97], label: { anchor: 'end', dx: -8, dy: -16 } },
        // Frameworks — right, low
        { d: 'M500 470 C 570 416 690 398 850 300', pearRange: [0.36, 0.97], label: { anchor: 'start', dx: 8, dy: -16 } },
        // Data/ML — left, high
        { d: 'M500 470 C 472 380 408 290 330 136', pearRange: [0.42, 0.98], label: { anchor: 'end', dx: -6, dy: -12 } },
        // Tools & Other — right, high
        { d: 'M500 470 C 536 380 606 260 690 120', pearRange: [0.44, 0.98], label: { anchor: 'start', dx: 6, dy: -12 } },
    ],
    /* decorative leaves: [branchIndex, t, side] */
    leaves: [
        [0, 0.18, 1], [0, 0.5, -1], [0, 0.8, 1], [0, 0.62, -1],
        [1, 0.2, -1], [1, 0.52, 1], [1, 0.78, -1],
        [2, 0.2, -1], [2, 0.36, 1], [2, 0.66, -1], [2, 0.9, 1],
        [3, 0.22, 1], [3, 0.4, -1], [3, 0.7, 1], [3, 0.92, -1],
    ],
}

export const HANG_LEVELS = [30, 58, 86]
