import React from 'react';
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white py-8">
      <div className="container mx-auto text-center">
      <Link to="/">
          <h1 className="text-white text-2xl md:text-2xl lg:text-4xl font-bold flex flex-wrap justify-center p-4">
            <span className="text-violet-500">Property</span>
            <span className="text-violet-700">X</span>
          </h1>
        </Link>
        <nav className="mb-4">
          <ul className="flex justify-center space-x-6 text-gray-600">
            <li><a href="/about" className="hover:text-gray-800">About</a></li>
            <li><a href="/search" className="hover:text-gray-800">Search</a></li>
            <li><a href="/all-agents" className="hover:text-gray-800">Agents</a></li>
            <li><a href="/contact" className="hover:text-gray-800">Contact</a></li>
            
          </ul>
        </nav>
        <div className="mb-4">
          <hr className="border-t border-gray-300 w-1/2 mx-auto" />
        </div>
        <div className="mb-4">
          <ul className="flex justify-center space-x-6 text-gray-600">
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="hover:text-gray-800" /></a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF className="hover:text-gray-800" /></a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram className="hover:text-gray-800" /></a></li>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub className="hover:text-gray-800" /></a></li>
          </ul>
        </div>
        <div className="text-gray-600">
          © Copyright 2021, All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;