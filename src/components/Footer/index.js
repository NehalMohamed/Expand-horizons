import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer-minimal">
      <Container>
        <Row>
          <Col lg={6} md={6} sm={12} className="footer-brand-section">
            <div className="footer-brand">
              <img src="/Asset 1.png" alt={t('footer.travel')}  className="logo-img" />
            </div>
            <p className="footer-description">
              {t('footer.footer_description')}
            </p>
            <div className="social-icons">
              <a href="#" className="social-link" aria-label="facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="social-link" aria-label="twitter">
                <FaTwitter />
              </a>
              <a href="#" className="social-link" aria-label="instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link" aria-label="linkedin">
                <FaLinkedinIn />
              </a>
            </div>
          </Col>

          <Col lg={3} md={3} sm={6} className="footer-links-section">
            <h5 className="footer-heading">{t('footer.company')}</h5>
            <ul className="footer-links">
              <li>
                <a href="#blog">{t('footer.home')}</a>
              </li>
              <li>
                <a href="#about">{t('footer.about_us')}</a>
              </li>
              <li>
                <a href="#jobs">{t('footer.contact')}</a>
              </li>
              <li>
                <a href="#press">{t('footer.privacy')}</a>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={3} sm={6} className="footer-links-section">
            <h5 className="footer-heading">{t('footer.support')}</h5>
            <ul className="footer-links">
              <li>
                <a href="#help">{t('footer.help_center')}</a>
              </li>
              <li>
                <br/>
                <br/>
              </li>
            </ul>

             <h5 className="footer-heading">{t('footer.our_news')}</h5>
            <ul className="footer-links">
              <li>
                <a href="#help">#{t('footer.discover_egypt')}</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
