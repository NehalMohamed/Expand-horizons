import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* This is where child routes will render */}
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;