import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinationTree } from '../../redux/Slices/destinationsSlice';
import DestinationTreeDropdown from './DestinationTreeDropdown';

const ExcursionsDropdown = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const tripType = 1; 
    const { treeItems, treeLoading } = useSelector((state) => state.destinations);
    const destinations = treeItems[tripType] || [];
    const loading = treeLoading[tripType] || false;
    const currentLang = useSelector((state) => state.language.currentLang) || "en";


    useEffect(() => {
        const params = {
            lang_code: currentLang,
            trip_type: tripType
        }
        dispatch(fetchDestinationTree(params));
    }, [dispatch, currentLang]);

    const handleLocationClick = (route, id) => {
        navigate(`/excursions/${route.toLowerCase().replace(/\s+/g, '-')}`, {
            state: {
                DestinationId: id,
                tripType: tripType
            }
        });
    };

    const handleMainClick = () => {
        navigate('/excursions');
    };

    return (
        <DestinationTreeDropdown
            title={t('main_navbar.egypt_excursions')}
            destinations={destinations}
            loading={loading}
            onMainClick={handleMainClick}
            onLocationClick={handleLocationClick}
            basePath="/excursions"
        />
    );
};

export default ExcursionsDropdown;