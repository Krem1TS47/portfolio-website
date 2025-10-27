# Portfolio Site

A minimalist portfolio website built with React, Vite, and Tailwind CSS, inspired by elegant design aesthetics.

## Features

- ✨ Clean, minimalist design with dark theme
- 🎨 Styled with Tailwind CSS
- ⚡ Fast development with Vite
- 🧭 Smooth sidebar navigation
- 📱 Responsive design
- 🎭 Page transitions and animations

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx       # Sidebar navigation component
│   │   └── MenuButton.jsx    # Hamburger menu button
│   ├── pages/
│   │   ├── Home.jsx          # Home page with 3D placeholder
│   │   ├── About.jsx         # About page (blank template)
│   │   ├── Writing.jsx       # Writing page (blank template)
│   │   ├── Projects.jsx      # Projects page (blank template)
│   │   └── Contact.jsx       # Contact page (blank template)
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Customization

### Colors

Edit the color scheme in `tailwind.config.js`:

```js
colors: {
  'primary-bg': '#0a0a0a',
  'secondary-bg': '#1a1a1a',
  'accent': '#e0e0e0',
  'text-primary': '#ffffff',
  'text-secondary': '#a0a0a0',
}
```

### Fonts

The project uses Inter and Merriweather fonts from Google Fonts. You can change these in `index.html` and `tailwind.config.js`.

## Future Enhancements

- [ ] Add 3D interactive design to home page
- [ ] Customize About page content
- [ ] Add writing posts to Writing page
- [ ] Showcase projects on Projects page
- [ ] Add contact form to Contact page

## License

MIT

