import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer-minimal">
      <Container>
        <Row>
          <Col lg={6} md={6} sm={12} className="footer-brand-section">
            <div className="footer-brand">
              <img 
              src="/Asset 1.png" 
              alt={t('footer.travel')}  
              className="logo-img"
              loading="lazy" 
              decoding="async"  
              />
            </div>
            <p className="footer-description">
              {t('footer.footer_description')}
            </p>
            <div className="social-icons">
              <a 
                href="https://www.facebook.com/share/1Wqvi9qwjz/?mibextid=wwXIfr" 
                className="social-link" 
                aria-label="facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a 
                href="https://x.com/expandredsea" 
                className="social-link" 
                aria-label="twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
               <FaXTwitter />
              </a>
              <a 
                href="https://www.instagram.com/expandhorizonredsea" 
                className="social-link" 
                aria-label="instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </Col>

          <Col lg={3} md={3} sm={6} className="footer-links-section">
            <h5 className="footer-heading">{t('footer.company')}</h5>
            <ul className="footer-links">
              <li>
                <a href="/">{t('footer.home')}</a>
              </li>
              <li>
                <a href="/AboutUs">{t('footer.about_us')}</a>
              </li>
              <li>
                <a href="/Contact">{t('footer.contact')}</a>
              </li>
              <li>
                <a href="/ComingSoon">{t('footer.privacy')}</a>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={3} sm={6} className="footer-links-section">
            <h5 className="footer-heading">{t('footer.support')}</h5>
            <ul className="footer-links">
              <li>
                <a href="/ComingSoon">{t('footer.help_center')}</a>
              </li>
              <li>
                <br/>
                <br/>
              </li>
            </ul>

             <h5 className="footer-heading">{t('footer.our_news')}</h5>
            <ul className="footer-links">
              <li>
                <a href="/">#{t('footer.discover_egypt')}</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer;