
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AnimatedButton from '../ui/AnimatedButton';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navLinks = [
    { title: 'Home', href: '#home' },
    { title: 'Products', href: '#products' },
    { title: 'Features', href: '#features' },
    { title: 'About', href: '#about' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-in-out',
        scrolled ? 'glass py-3' : 'bg-transparent py-6',
        className
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <a href="#home" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary"></div>
          <span className="text-xl font-semibold">Essence</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <AnimatedButton href="#contact" size="sm">
            Get Started
          </AnimatedButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <div className="relative h-6 w-6">
            <span
              className={cn(
                "absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out",
                menuOpen ? "rotate-45 top-3" : "top-1"
              )}
            />
            <span
              className={cn(
                "absolute top-3 block h-0.5 bg-current transition-opacity duration-300 ease-in-out",
                menuOpen ? "opacity-0 w-0" : "opacity-100 w-6"
              )}
            />
            <span
              className={cn(
                "absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out",
                menuOpen ? "-rotate-45 top-3" : "top-5"
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "absolute left-0 right-0 z-20 md:hidden glass transition-all duration-300 ease-in-out overflow-hidden",
          menuOpen ? "max-h-screen border-b opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container mx-auto px-6 py-6">
          <ul className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block py-2 text-base font-medium transition-colors hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.title}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <AnimatedButton href="#contact" size="sm" className="w-full">
                Get Started
              </AnimatedButton>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
