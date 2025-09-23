import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaUserCircle, FaSignInAlt } from 'react-icons/fa';
import { useAuthModal } from '../AuthComp/AuthModal';


const ProfileDropdown = () => {
    const { t } = useTranslation();
    const { openAuthModal } = useAuthModal();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        // Remove user and token from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        // You might want to redirect or refresh the page here
       window.location.href = "/";
    };

    return (
        <Dropdown className="icon-dropdown">
            <Dropdown.Toggle as="button" className="icon-btn profile-btn" aria-label={t('main_navbar.profile')}>
                <FaUser />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
                {user ? (
                    // User is logged in
                    <>
                        <div className="dropdown-header px-3">
                            <small>{t('main_navbar.Welcome')}</small>
                            <br />
                            <strong>{user.firstName+' '+user.lastName}</strong>
                        </div>
                        <Dropdown.Divider />
                        <Dropdown.Item href="/profile">
                            <FaUserCircle className="me-2" />
                            {t('main_navbar.my_profile')}
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>
                            <FaSignOutAlt className="me-2" />
                            {t('main_navbar.logout')}
                        </Dropdown.Item>
                    </>
                ) : (
                    // User is not logged in
                    <>
                        <Dropdown.Item onClick={() => openAuthModal("login")}>
                            <FaSignInAlt className="me-2" />
                            {t('main_navbar.login_signup')}
                        </Dropdown.Item>
                    </>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfileDropdown;