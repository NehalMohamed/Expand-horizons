import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinations } from '../../redux/Slices/destinationsSlice';

const ExcursionsDropdown = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const timeoutRef = useRef(null);
    const dropdownRef = useRef(null); // Add ref for dropdown

    const { items: destinations, loading } = useSelector((state) => state.destinations);
    const currentLang = useSelector((state) => state.language.currentLang) || "en";

    useEffect(() => {
        dispatch(fetchDestinations(currentLang));
    }, [dispatch, currentLang]);

    const handleLocationClick = (route, id) => {
        navigate(`/excursions/${route.toLowerCase().replace(/\s+/g, '-')}`, { 
            state: { DestinationId: id } 
        });
        setShow(false);
    };

    const handleMainExcursionsClick = (e) => {
        e.preventDefault();
        navigate('/excursions');
    };

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setShow(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            if (!dropdownRef.current?.contains(document.activeElement)) {
                setShow(false);
            }
        }, 150);
    };

    const handleItemClick = (e, route, id) => {
        e.preventDefault();
        e.stopPropagation();
        handleLocationClick(route, id);
    };

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div
            className="nav-dropdown-hover"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={dropdownRef}
        >
            <Dropdown show={show} onToggle={() => { }} className="nav-dropdown">
                <Dropdown.Toggle
                    as="a"
                    className="nav-item dropdown-toggle"
                    onClick={handleMainExcursionsClick}
                    href="#"
                >
                    {t('main_navbar.egypt_excursions')}
                    <FaChevronDown className="dropdown-icon" />
                </Dropdown.Toggle>
                <Dropdown.Menu
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {loading ? (
                        <Dropdown.Item disabled>Loading...</Dropdown.Item>
                    ) : (
                        destinations.map(destination => (
                            <Dropdown.Item
                                key={destination.destination_id}
                                onClick={(e) => handleItemClick(e, destination.route, destination.destination_id)}
                            >
                                {destination.dest_name}
                            </Dropdown.Item>
                        ))
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default ExcursionsDropdown;