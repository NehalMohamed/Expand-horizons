// Module overview: Header component and its UI interaction logic.
import ContactNavbar from "../ContactNavbar";
import MainNavbar from "../MainNavbar";

// Component: renders header UI and related interactions.
const Header = () => {
  return (
    <header className="site-header">
      <ContactNavbar />
      <MainNavbar />
    </header>
  )
}

export default Header;
