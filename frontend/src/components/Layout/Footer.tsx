import type React from "react";
import { BookOpen, Heart, Github, Twitter, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary-800 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary-200" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-primary-100">
                  Book Hub
                </h3>
                <p className="text-sm text-primary-300">Literary Collection</p>
              </div>
            </div>
            <p className="text-primary-300 mb-4 max-w-md">
              Discover, share, and celebrate the world of literature. Join our
              community of book lovers and build your personal digital library.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-primary-400 hover:text-primary-200 transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary-400 hover:text-primary-200 transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-primary-400 hover:text-primary-200 transition-colors duration-200"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-primary-100 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-primary-300 hover:text-primary-100 transition-colors duration-200"
                >
                  Discover Books
                </a>
              </li>
              <li>
                <a
                  href="/add-book"
                  className="text-primary-300 hover:text-primary-100 transition-colors duration-200"
                >
                  Add Book
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-300 hover:text-primary-100 transition-colors duration-200"
                >
                  Popular Genres
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-300 hover:text-primary-100 transition-colors duration-200"
                >
                  New Releases
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-primary-100 mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-primary-300 hover:text-primary-100 transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-300 hover:text-primary-100 transition-colors duration-200"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-300 hover:text-primary-100 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-300 hover:text-primary-100 transition-colors duration-200"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-400 text-sm">
            © 2024 Book Hub. Made with{" "}
            <Heart className="w-4 h-4 inline text-red-400" /> for book lovers.
          </p>
          <p className="text-primary-400 text-sm mt-2 md:mt-0">
            Connecting readers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
