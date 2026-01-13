import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

import footerBg from "../../assets/footerbg.png";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background Image */}
      <img
        src={footerBg}
        alt="Footer background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 text-white">
        <div className="grid grid-cols-1 gap-12 items-start md:grid-cols-3">
          {/* Logo + Socials */}
          <div>
            <img src={logo} alt="Miraj Foundation" className="h-14 mb-6" />

            <h4 className="font-semibold mb-3">Find us on</h4>
            <div className="flex gap-4">
              <Instagram className="h-5 w-5 cursor-pointer hover:text-green-300" />
              <Facebook className="h-5 w-5 cursor-pointer hover:text-green-300" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-green-300" />
              <Linkedin className="h-5 w-5 cursor-pointer hover:text-green-300" />
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>

            <p className="text-sm leading-relaxed mb-3">
              Phase 5, Lahore, Punjab, Pakistan
            </p>
            <p className="text-sm">miraj@gmail.com</p>
            <p className="text-sm mb-6">+92 123 456 789</p>

            <Link to="/contact">
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 transition-all rounded-lg font-semibold text-white shadow-lg">
                Contact Us
              </button>
            </Link>
          </div>

          {/* Language + Policies */}
          <div>
            <h4 className="font-semibold mb-4">Language</h4>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm">English</span>
              <div className="w-10 h-5 bg-white rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-green-600 rounded-full" />
              </div>
              <span className="text-sm">Urdu</span>
            </div>

            <ul className="text-sm space-y-2 opacity-90">
              <li className="hover:underline cursor-pointer">Privacy Policy</li>
              <li className="hover:underline cursor-pointer">Terms of Use</li>
              <li className="hover:underline cursor-pointer">Cookie Policy</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
