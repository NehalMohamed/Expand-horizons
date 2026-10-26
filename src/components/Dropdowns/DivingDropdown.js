// Module overview: DivingDropdown component and its UI interaction logic.
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinationTree } from '../../redux/Slices/destinationsSlice';
import DestinationTreeDropdown from './DestinationTreeDropdown';

// Component: renders diving dropdown UI and related interactions.
const DivingDropdown = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const tripCategory = 3;
    const { treeItems, treeLoading } = useSelector((state) => state.destinations);
    const destinations = treeItems[tripCategory] || [];
    const loading = treeLoading[tripCategory] || false;
    const currentLang = localStorage.getItem("lang") || "en";

    useEffect(() => {
        const params = {
            lang_code: currentLang,
            trip_category: tripCategory
        }
        dispatch(fetchDestinationTree(params));
    }, [dispatch, currentLang]);

    // Event handler for location click.
    const handleLocationClick = () => {
        navigate('/diving/coming-soon');
        //  navigate(`/diving/${route.toLowerCase().replace(/\s+/g, '-')}`, { 
        //     state: { 
        //         DestinationId: id,
        //         tripType: tripType
        //     } 
        // });
    };

    // Event handler for main click.
    const handleMainClick = () => {
        navigate('/diving/coming-soon');
        //  navigate('/diving');
    };

    return (
        <DestinationTreeDropdown
            title={t('main_navbar.egypt_diving')}
            destinations={destinations}
            loading={loading}
            onMainClick={handleMainClick}
            onLocationClick={handleLocationClick}
            basePath="/diving"
        />
    );
};

export default DivingDropdown;
