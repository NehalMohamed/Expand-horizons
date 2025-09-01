import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinationTree } from '../../redux/Slices/destinationsSlice';
import DestinationTreeDropdown from './DestinationTreeDropdown';

const TransfersDropdown = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { treeItems: destinations, treeLoading: loading } = useSelector((state) => state.destinations);
    const currentLang = useSelector((state) => state.language.currentLang) || "en";

    React.useEffect(() => {
        dispatch(fetchDestinationTree(currentLang));
    }, [dispatch, currentLang]);

    const handleLocationClick = (route, id) => {
        navigate(`/transfers/${route.toLowerCase().replace(/\s+/g, '-')}`, { 
            state: { 
                DestinationId: id,
                tripType: 2 // Transfer trip type
            } 
        });
    };

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