import React, { useState, useRef, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const DestinationTreeDropdown = ({ 
  title, 
  destinations, 
  loading, 
  onMainClick, 
  onLocationClick,
  basePath 
}) => {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const menuHoverRef = useRef(false);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShow(true);
  };

  const handleMouseLeave = () => {
    // Use a shorter delay for better responsiveness
    timeoutRef.current = setTimeout(() => {
      if (!menuHoverRef.current && !dropdownRef.current?.contains(document.activeElement)) {
        setShow(false);
        setOpenSubmenus({});
      }
    }, 50); // Reduced from 150ms to 50ms
  };

  const handleMenuEnter = () => {
    menuHoverRef.current = true;
    clearTimeout(timeoutRef.current);
  };

  const handleMenuLeave = () => {
    menuHoverRef.current = false;
    timeoutRef.current = setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setShow(false);
        setOpenSubmenus({});
      }
    }, 50);
  };

  const handleItemClick = (e, destination) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only handle click for leaf nodes (destinations without children)
    const hasChildren = destination.children && destination.children.length > 0;
    const isLeaf = destination.leaf || !hasChildren;
    
    if (isLeaf) {
      onLocationClick(destination.route, destination.destination_id || destination.id);
      setShow(false);
      setOpenSubmenus({});
    } else {
      // Toggle submenu for parent items
      setOpenSubmenus(prev => ({
        ...prev,
        [destination.destination_id || destination.id]: !prev[destination.destination_id || destination.id]
      }));
    }
  };

  const handleMainClick = (e) => {
    e.preventDefault();
    onMainClick();
  };

  const renderDestinationItem = (destination, level = 0) => {
    const hasChildren = destination.children && destination.children.length > 0;
    const isOpen = openSubmenus[destination.destination_id || destination.id];
    const isLeaf = destination.leaf || !hasChildren;

    return (
      <div key={destination.destination_id || destination.id}>
        <Dropdown.Item
          className={`d-flex justify-content-between align-items-center ${hasChildren ? 'dropdown-parent' : 'dropdown-leaf'}`}
          style={{ 
            paddingLeft: `${15 + (level * 20)}px`,
            backgroundColor: level > 0 ? '#f8f9fa' : 'transparent',
            cursor: isLeaf ? 'pointer' : 'default'
          }}
          onClick={(e) => handleItemClick(e, destination)}
        >
          <span>{destination.dest_name}</span>
          {hasChildren && (
            <FaChevronRight 
              className={`dropdown-submenu-icon ${isOpen ? 'rotated' : ''}`} 
              size={10} 
            />
          )}
        </Dropdown.Item>
        
        {hasChildren && isOpen && (
          <div className="dropdown-submenu">
            {destination.children.map(child => renderDestinationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
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
          onClick={handleMainClick}
          href="#"
        >
          {title}
          <FaChevronDown className="dropdown-icon" />
        </Dropdown.Toggle>
        <Dropdown.Menu
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMenuLeave}
          className="destination-tree-menu"
        >
          {loading ? (
            <Dropdown.Item disabled>Loading...</Dropdown.Item>
          ) : destinations && destinations.length > 0 ? (
            destinations.map(destination => renderDestinationItem(destination))
          ) : (
            <Dropdown.Item disabled>No destinations available</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DestinationTreeDropdown;