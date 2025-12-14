import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="맛.zip" className="h-10" />
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="메뉴"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-16 right-0 w-64 bg-white border-l border-b border-gray-200 shadow-lg">
          <nav className="py-4">
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="block px-6 py-3 text-gray-900 hover:bg-gray-50 transition-colors"
            >
              서비스 소개
            </Link>
            <Link
              to="/location"
              onClick={() => setIsMenuOpen(false)}
              className="block px-6 py-3 text-gray-900 hover:bg-gray-50 transition-colors"
            >
              내 위치 정보
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
