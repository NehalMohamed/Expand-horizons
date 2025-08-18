import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

const ProfileDropdown = () => {
    const { t } = useTranslation();

    return (
        <Dropdown className="icon-dropdown">
            <Dropdown.Toggle as="button" className="icon-btn profile-btn" aria-label={t('main_navbar.profile')}>
                <FaUser />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
                <Dropdown.Item href="#profile">{t('main_navbar.my_profile')}</Dropdown.Item>
                {/* <Dropdown.Item href="#bookings">Meine Buchungen</Dropdown.Item>
                  <Dropdown.Item href="#settings">Einstellungen</Dropdown.Item> */}
                <Dropdown.Divider />
                <Dropdown.Item href="#logout">{t('main_navbar.logout')}</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfileDropdown;