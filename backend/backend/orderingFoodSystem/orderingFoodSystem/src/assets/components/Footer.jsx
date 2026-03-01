import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPaperPlane
} from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <footer className="footer-section text-light">
        <div className="container-fluid px-5">
          <div className="row gy-4">

            {/* BRAND */}
            <div className="col-md-3">
              <h4 className="fw-bold mb-3">QuickBite</h4>
              <p className="footer-text">
                Your trusted food ordering platform delivering delicious meals
                from top restaurants — fast, fresh, and reliable.
              </p>
            </div>

            {/* QUICK LINKS */}
            <div className="col-md-2">
              <h5 className="fw-bold mb-3">Quick Links</h5>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
              </ul>
            </div>

            {/* ACCOUNT */}
            <div className="col-md-2">
              <h5 className="fw-bold mb-3">Account</h5>
              <ul className="footer-links">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/orders">My Orders</Link></li>
              </ul>
            </div>

            {/* CONTACT INFO */}
            <div className="col-md-2">
              <h5 className="fw-bold mb-3">Contact</h5>
              <p><FaPhoneAlt /> +255 700 123 456</p>
              <p><FaEnvelope /> support@quickbite.com</p>
              <p><FaMapMarkerAlt /> Zanzibar, Tanzania</p>

              <div className="footer-social mt-3">
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaTwitter /></a>
              </div>
            </div>

            {/* TALK TO US FORM */}
            <div className="col-md-3">
              <h5 className="fw-bold mb-3">Talk to Us</h5>
              <form className="footer-form">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="form-control mb-2"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="form-control mb-2"
                />
                <textarea
                  rows="3"
                  placeholder="Your Message"
                  className="form-control mb-2"
                ></textarea>
                <button className="btn btn-danger w-100">
                  Send Message <FaPaperPlane />
                </button>
              </form>
            </div>

          </div>

          {/* COPYRIGHT */}
          <div className="footer-bottom text-center mt-4 pt-3">
            <p className="mb-0">
              © {new Date().getFullYear()} QuickBite. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
