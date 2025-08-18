import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaMapMarkerAlt , FaRegHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import WishlistCard from "../WishlistCard";

const WishlistSection = () => {
  const wishList = [
    {
      id: 1,
      title: "Ausflüge ab Hurghada",
      description:
        "Erleben Sie einen unvergesslichen Tagesausflug nach Luxor – privat und ohne Verkaufsveranstaltungen",
      image: "/images/Cities/makadi bay.jpg",
      features: [
        "Online buchen und vor Ort bezahlen",
        "Abholung von der Lobby Ihres Hotels",
        "Inklusive Versicherung",
        "Keine Verkaufsveranstaltungen",
      ],
      price: "187",
      date: "21/07/2025",
      isLiked:true
    },
    {
      id: 2,
      title: "DOLPHIN WATCH und Schnorcheln",
      description: "Erlebe Sie hautnah die faszinierende Welt der Delfine bei einem Schnorchelausflug ab Hurghada",
      image: "/images/Cities/el guna.jpg",
      features: [
        "Kostenlose Stornierung",
        "Dauer 7 Stunden",
        "jetzt buchen und vor Ort bezahlen",
        "Abholung von der Lobby Ihres Hotels",
      ],
      price: "187",
      date: "21/07/2025",
      isLiked:true
    },
    {
      id: 3,
      title: "DOLPHIN WATCH und Schnorcheln",
      description: "Erlebe Sie hautnah die faszinierende Welt der Delfine bei einem Schnorchelausflug ab Hurghada",
      image: "/images/Cities/el guna.jpg",
      features: [
        "Kostenlose Stornierung",
        "Dauer 7 Stunden",
        "jetzt buchen und vor Ort bezahlen",
        "Abholung von der Lobby Ihres Hotels",
      ],
      price: "187",
      date: "21/07/2025",
      isLiked:true
    }
  ];
    const { t } = useTranslation();

//   if (loading) {
//     return (
//       <section className="tours-section">
//         <Container>
//           <div className="tours-loading">
//             <div>
//               <Spinner animation="border" role="status" />
//               <div className="loading-text">{t('tours.loading')}</div>
//             </div>
//           </div>
//         </Container>
//       </section>
//     );
//   }

  if (wishList.length === 0) {
    return (
      <section className="tours-section">
        <Container>
          <div className="tours-empty">
            <FaMapMarkerAlt className="empty-icon" />
            <h3 className="empty-title">{t('tours.empty_title')}</h3>
            <p className="empty-text">{t('tours.empty_text')}</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="tours-section" id="tours">
      <Container>
        <div className="section-header">
          <h2 className="section-title">{t('wishlist.title')}</h2>
          <div className="section-divider"></div>
        </div>

        <div className="tours-grid">
          <Row>
            {wishList.map((tour) => (
              <Col key={tour.id} lg={4} md={6} className="d-flex">
                <WishlistCard tour={tour} />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default WishlistSection;
