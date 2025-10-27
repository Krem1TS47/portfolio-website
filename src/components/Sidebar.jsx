import { Link } from 'react-router-dom'

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Writing', path: '/writing' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-80 bg-secondary-bg border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end p-6">
            <button
              onClick={onClose}
              className="text-text-primary hover:text-accent transition-colors duration-200 text-3xl font-light"
              aria-label="Close sidebar"
            >
              &times;
            </button>
          </div>

          {/* Navigation Links */}
          <ul className="flex-1 px-8 space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className="block py-4 text-lg font-light text-text-primary hover:text-accent transition-colors duration-200 border-b border-gray-800 hover:border-accent"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="p-8 text-text-secondary text-sm font-light">
            <p>&copy; 2025 Portfolio</p>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Sidebar

