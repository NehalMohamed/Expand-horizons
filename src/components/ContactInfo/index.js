import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ContactInfo = () => {
  const { t } = useTranslation();

  const contactData = [
    {
      id: 1,
      icon: 'images/location.png',
      title: t('contactInfo.visitUs'),
      info: [
        t('contactInfo.address1'),
        t('contactInfo.address2')
      ]
    },
    {
      id: 2,
      icon: 'images/call.png',
      title: t('contactInfo.callUs'),
      info: [
        t('contactInfo.phone1'),
        t('contactInfo.phone2')
      ]
    },
    {
      id: 3,
      icon: 'images/mail.png',
      title: t('contactInfo.emailUs'),
      info: [
        t('contactInfo.email1'),
        t('contactInfo.email2')
      ]
    }
  ];

  return (
    <section className="contact-info-section">
      <Container>
        <Row className="g-4 justify-content-center">
          {contactData.map((contact) => (
            <Col lg={4} md={6} sm={12} key={contact.id}>
              <Card className="contact-card h-100">
                <Card.Body className="text-center">
                  <div className="contact-icon">
                     <img
                        src={contact.icon || "/placeholder.svg"}
                        alt="logo alt"
                        className="contact-img"/>
                  </div>
                  <h4 className="contact-title">{contact.title}</h4>
                  <div className="contact-details">
                    {contact.info.map((item, index) => (
                      <p key={index} className="contact-item">
                        {item}
                      </p>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ContactInfo;
