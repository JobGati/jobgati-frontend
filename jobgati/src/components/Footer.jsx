import React from "react";
import { Link } from "react-router-dom";



const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-16 pb-8 px-6">

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

        {/* LOGO + DESC */}
        <div>
          <h2 className="text-xl font-bold mb-3">JobGati</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            AI-powered platform helping you discover local jobs,
            analyze your skills, and become job-ready faster.
          </p>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
         <ul className="space-y-2 text-gray-400 text-sm">
  <li>
    <Link
  to="/"
  onClick={() => window.scrollTo(0, 0)}
  className="hover:text-white cursor-pointer"
>
  Home
</Link>
  </li>
  <li>
    <Link to="/about" className="hover:text-white cursor-pointer">
      About Us
    </Link>
  </li>
</ul>
        </div>

        {/* PRODUCT */}
        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">Features</li>
            <li className="hover:text-white cursor-pointer">How it Works</li>
            <li className="hover:text-white cursor-pointer">Pricing</li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">Blog</li>
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} JobGati. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;