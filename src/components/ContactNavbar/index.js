import { Container } from "react-bootstrap"
import { FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaRss } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

const ContactNavbar = () => {
  return (
    <div className="contact-navbar">
      <Container>
        <div className="contact-content">
          <div className="contact-left">
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <a href="tel:+200000000000" className="contact-link">
                +2 0000000000
              </a>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href="mailto:Info@expandhorizen.com" className="contact-link">
                Info@expandhorizen.com
              </a>
            </div>
            <div className="social-media">
              <a href="#" className="social-link facebook" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-link twitter" aria-label="Twitter">
                <FaXTwitter />
              </a>
              <a href="#" className="social-link instagram" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link rss" aria-label="RSS Feed">
                <FaRss />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default ContactNavbar
