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
              <a href="tel:+2 01034403755" className="contact-link">
                +2 01034403755
              </a>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href="mailto:Info@expand-horizons.de" className="contact-link">
                Info@expand-horizons.de
              </a>
            </div>
            <div className="social-media">
              <a 
                href="https://www.facebook.com/share/1Wqvi9qwjz/?mibextid=wwXIfr" 
                className="social-link facebook" 
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://x.com/expandredsea" 
                className="social-link twitter" 
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter />
              </a>
              <a 
                href="https://www.instagram.com/expandhorizonredsea" 
                className="social-link instagram" 
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default ContactNavbar