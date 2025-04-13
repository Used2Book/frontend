import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <h2 className="text-2xl font-bold mb-4">Used2Book</h2>
            <p className="text-sm text-gray-400 mb-4">
              Discover, buy, and sell your favorite books with ease.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-400 hover:text-blue-600 transition"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-pink-500 transition"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-gray-400 hover:text-white transition">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/user/request-book" className="text-gray-400 hover:text-white transition">
                  Request a Book
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-400" />
                <a
                  href="mailto:used2book_support@gmail.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  used2book_support@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <a
                  href="tel:+66927364588"
                  className="text-gray-400 hover:text-white transition"
                >
                  +66 927364588
                </a>
              </li>
            </ul>
          </div>

          {/* About/Extra Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
          &copy; {currentYear} Used2Book. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}