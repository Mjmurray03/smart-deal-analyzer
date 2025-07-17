'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';

interface HeaderProps {
  transparent?: boolean;
  fixed?: boolean;
  showBorder?: boolean;
}

const Header = ({
  transparent = false,
  fixed = true,
  showBorder = true
}: HeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll behaviors
  useEffect(() => {
    const handleScroll = () => {
      // Add shadow on scroll
      setScrolled(window.scrollY > 10);
      
      // Calculate scroll progress
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  const navigationLinks = [
    { href: '/analyzer', label: 'Analyzer' },
    { href: '/calculators', label: 'Calculators' },
    { href: '/methodology', label: 'Methodology' }
  ];

  return (
    <>
      <header className={cn(
        "w-full transition-all duration-300 z-40",
        fixed && "fixed top-0",
        transparent && !scrolled 
          ? "bg-transparent" 
          : "bg-white/95 backdrop-blur-md",
        scrolled && "shadow-sm",
        showBorder && scrolled && "border-b border-gray-200"
      )}>
        <nav className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo - Sophisticated geometric mark */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-3 group">
                {/* Simple geometric logo */}
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors duration-200">
                  <div className="w-4 h-4 bg-white rounded-sm" />
                </div>
                <span className={cn(
                  "text-xl font-semibold transition-colors duration-200",
                  transparent && !scrolled ? "text-white" : "text-gray-900"
                )}>
                  SmartDeal
                </span>
              </Link>
            </div>
            
            {/* Center Navigation - Understated */}
            <div className="hidden lg:flex items-center gap-8">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-medium transition-colors duration-200 relative py-2",
                    isActive(link.href)
                      ? "text-primary-600"
                      : transparent && !scrolled
                        ? "text-white/90 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full" />
                  )}
                </Link>
              ))}
            </div>
            
            {/* Right Actions - Refined */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "hidden lg:flex",
                  transparent && !scrolled && "text-white hover:bg-white/10"
                )}
                leftIcon={FileText}
                onClick={() => router.push('/documentation')}
              >
                Documentation
              </Button>
              <Button 
                variant={transparent && !scrolled ? "secondary" : "primary"}
                size="sm"
                onClick={() => router.push('/analyzer/quick')}
              >
                Start Analysis
              </Button>
              
              {/* Mobile menu button */}
              <button 
                className={cn(
                  "lg:hidden p-2 rounded-md transition-colors duration-200",
                  transparent && !scrolled 
                    ? "text-white hover:bg-white/10" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
        
        {/* Scroll progress indicator - subtle */}
        {scrolled && (
          <div className="h-0.5 bg-gray-100">
            <div 
              className="h-full bg-primary-600 transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
      )}>
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-black transition-opacity duration-300",
            mobileMenuOpen ? "opacity-50" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Drawer */}
        <div className={cn(
          "absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="p-6">
            {/* Header with close button */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary-600 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  SmartDeal
                </span>
              </div>
              <button 
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Mobile nav items */}
            <nav className="space-y-6">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block text-lg font-medium transition-colors duration-200",
                    isActive(link.href) 
                      ? "text-primary-600" 
                      : "text-gray-900 hover:text-primary-600"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile actions */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <Button 
                  variant="ghost" 
                  fullWidth
                  leftIcon={FileText}
                  onClick={() => router.push('/documentation')}
                >
                  Documentation
                </Button>
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={() => router.push('/analyzer/quick')}
                >
                  Start Analysis
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      {fixed && <div className="h-16 lg:h-20" />}
    </>
  );
};

export default Header;