/** Sections in page order. `index` is the Roman-gallery style numeral shown in nav and headings. */
export const navItems = [
    { name: 'Home', path: '#home', index: null },
    { name: 'About Me', path: '#about', index: '01' },
    { name: 'Experience', path: '#experience', index: '02' },
    { name: 'My Stack', path: '#stack', index: '03' },
    { name: 'Projects', path: '#projects', index: '04' },
]

export const sectionIndex = (id) => navItems.find((item) => item.path === `#${id}`)?.index ?? null
