import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chat from '../components/Chat';

function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* This is where child routes will render */}
      </main>
      <Footer />
      <Chat />
    </>
  );
}

export default MainLayout;