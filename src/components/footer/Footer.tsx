import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t pt-14">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
        
        {/* Brand + Contact */}
        <div>
          <Link to="/">
            <h2 className="text-2xl font-bold text-blue-600 mb-6 cursor-pointer">
              walkINhub
            </h2>
          </Link>

          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            India's trusted platform to discover walk-in interviews, real-time job alerts,  
            and career-boosting opportunities.
          </p>

          <ul className="space-y-4 text-gray-600 text-sm">
            <li className="flex items-start gap-3 leading-relaxed">
              <MapPin className="w-5 h-5" />
              <span>Level 5, Tech Valley, Hi-Tech City, Hyderabad, Telangana</span>
            </li>

            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5" />
              <span>+91 98765 43210</span>
            </li>

            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <span>support@walkinhub.com</span>
            </li>
          </ul>
        </div>

        {/* My Account */}
        <div>
          <h3 className="text-lg font-semibold mb-6">My Account</h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li>
              {/* You don’t have auth yet, so send to Contact or Home for now */}
              <Link to="/" className="hover:text-blue-600">
                My Profile
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="hover:text-blue-600">
                Saved Jobs
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="hover:text-blue-600">
                Job Alerts
              </Link>
            </li>
            <li>
              <Link to="/walkin" className="hover:text-blue-600">
                Applied Walkins
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li>
              <Link to="/walkin" className="hover:text-blue-600">
                Latest Walkins
              </Link>
            </li>
            <li>
              <Link to="/companies" className="hover:text-blue-600">
                Top Hiring Companies
              </Link>
            </li>
            <li>
              <Link to="/tools/interview-prep" className="hover:text-blue-600">
                Interview Tips
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-600">
                Career Guidance
              </Link>
            </li>
          </ul>
        </div>

        {/* App Download */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Get Job Alerts</h3>

          <p className="text-gray-600 text-sm mb-4">
            Download our app to receive instant walk-in job alerts.
          </p>

          <div className="flex flex-col gap-4">
            {/* Apple Store Button - Official Badge */}
            <a
              href="#"
              className="overflow-hidden rounded-lg w-fit"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on App Store"
                className="h-12"
              />
            </a>

            {/* Google Play Store - Official Badge */}
            <a
              href="#"
              className="overflow-hidden rounded-lg w-fit"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play Store"
                className="h-12"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t mt-10 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-5">

          {/* Social Icons */}
          <div className="flex items-center gap-5">
            <a href="#" aria-label="YouTube" className="hover:opacity-80 transition">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png"
                className="h-6"
              />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:opacity-80 transition">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png"
                className="h-6"
              />
            </a>
            <a href="#" aria-label="Twitter" className="hover:opacity-80 transition">
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                className="h-6"
              />
            </a>
          </div>

          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} walkINhub. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
