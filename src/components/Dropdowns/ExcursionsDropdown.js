import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinationTree } from '../../redux/Slices/destinationsSlice';
import DestinationTreeDropdown from './DestinationTreeDropdown';

const ExcursionsDropdown = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { treeItems: destinations, treeLoading: loading } = useSelector((state) => state.destinations);
    const currentLang = useSelector((state) => state.language.currentLang) || "en";

    React.useEffect(() => {
        dispatch(fetchDestinationTree(currentLang));
    }, [dispatch, currentLang]);

    const handleLocationClick = (route, id) => {
        navigate(`/excursions/${route.toLowerCase().replace(/\s+/g, '-')}`, { 
            state: { 
                DestinationId: id,
                tripType: 1 // Excursions trip type
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