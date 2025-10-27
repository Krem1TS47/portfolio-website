const MenuButton = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-8 left-8 z-30 w-12 h-12 flex flex-col justify-center items-center space-y-1.5 group"
      aria-label="Toggle menu"
    >
      <span
        className={`block w-8 h-0.5 bg-text-primary transition-all duration-300 ${
          isOpen ? 'rotate-45 translate-y-2' : ''
        }`}
      />
      <span
        className={`block w-8 h-0.5 bg-text-primary transition-all duration-300 ${
          isOpen ? 'opacity-0' : ''
        }`}
      />
      <span
        className={`block w-8 h-0.5 bg-text-primary transition-all duration-300 ${
          isOpen ? '-rotate-45 -translate-y-2' : ''
        }`}
      />
    </button>
  )
}

export default MenuButton

