// Module overview: LanguageDropdown component and its UI interaction logic.
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaGlobe } from 'react-icons/fa';
import { setLanguages, fetchLanguages } from '../../redux/Slices/languageSlice'; 
import i18n  from "../../i18n";

// Component: renders language dropdown UI and related interactions.
const LanguageDropdown = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const languages = useSelector((state) => state.language.languages);

  const currentLanguage = (i18n.language || "en").split("-")[0];

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  const current = languages.find((l) => l.lang_code === currentLanguage);

  // Applies language updates to state or UI.
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    dispatch(setLanguages(lng)); // Dispatch to Redux
  };

  return (
    <Dropdown className="icon-dropdown">
      <Dropdown.Toggle as="button" className="icon-btn" aria-label={t('language.language')}>
        {/* <FaGlobe /> */}
        {current?.lang_flag && (
          <img src={current.lang_flag} alt={currentLanguage} width={20} height={14} />
        )}
        <span className="icon-text">{currentLanguage.toUpperCase()}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end" className="language-menu">
        {languages.map((lang) => (
          <Dropdown.Item key={lang.id} onClick={() => changeLanguage(lang.lang_code)}>
            <img src={lang.lang_flag} alt={lang.lang_code} width={20} height={14} />
            <span className="flag">{lang.lang_code.toUpperCase()}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageDropdown;
