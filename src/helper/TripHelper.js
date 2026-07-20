// Module overview: TripHelper feature logic and route-level wiring.
import { FaStar, FaStarHalf, FaRegStar } from "react-icons/fa6";
// Component entry point for Rating.
export const Rating = (rate) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rate >= i) {
      stars.push(<FaStar key={i} className="star_icon" />);
    } else if (rate >= i - 0.5) {
      stars.push(<FaStarHalf key={i} className="star_icon" />);
    } else {
      stars.push(<FaRegStar key={i} className="star_icon" />);
    }
  }

  return <span className="star_rate"> {stars}</span>;
};
