// Module overview: TransfersDropdown component and its UI interaction logic.
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinationTree } from '../../redux/Slices/destinationsSlice';
import DestinationTreeDropdown from './DestinationTreeDropdown';

// Component: renders transfers dropdown UI and related interactions.
const TransfersDropdown = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const tripType = 2; 
    const { treeItems, treeLoading } = useSelector((state) => state.destinations);
    const destinations = treeItems[tripType] || [];
    const loading = treeLoading[tripType] || false;
    const currentLang = localStorage.getItem("lang") || "en";

    useEffect(() => {
        const params = {
            lang_code: currentLang,
            trip_type: tripType
        }
        dispatch(fetchDestinationTree(params));
    }, [dispatch, currentLang]);

    // Event handler for location click.
    const handleLocationClick = (route, id) => {
        navigate(`/transfers/${route.toLowerCase().replace(/\s+/g, '-')}`, {
            state: {
                DestinationId: id,
                tripType: tripType
            }
        });
    };

    // Event handler for main click.
    const handleMainClick = () => {
        navigate('/transfers');
    };

    return (
        <DestinationTreeDropdown
            title={t('main_navbar.transfer_services')}
            destinations={destinations}
            loading={loading}
            onMainClick={handleMainClick}
            onLocationClick={handleLocationClick}
            basePath="/transfers"
        />
    );
};

export default TransfersDropdown;
