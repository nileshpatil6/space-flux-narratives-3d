
import { useState, useEffect } from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Introduction', href: '#introduction' },
    { name: 'Methodology', href: '#methodology' },
    { name: 'Visualizations', href: '#visualizations' },
    { name: 'Take Action', href: '#action' },
    { name: 'Story', href: '/story' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-400 animate-pulse-glow"></div>
              <span className="font-bold text-xl">Climate Story</span>
            </a>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <button 
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glassmorphism mx-4 mt-2 py-4">
          <ul className="flex flex-col space-y-4 px-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <a 
                  href={item.href}
                  className="block py-2 hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
