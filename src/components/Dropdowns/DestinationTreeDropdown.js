// Module overview: DestinationTreeDropdown component and its UI interaction logic.
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
  const [openSubmenus, setOpenSubmenus] = useState({});
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const isHoveringRef = useRef(false);
  const submenuTimeoutRef = useRef(null);
  const hoveredItemsRef = useRef(new Set());

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, []);

  // Event handler for mouse enter.
  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShow(true);
  };

  // Event handler for mouse leave.
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setShow(false);
        setOpenSubmenus({});
        hoveredItemsRef.current.clear();
      }
    }, 200); // Delay before closing
  };

  // Event handler for menu enter.
  const handleMenuEnter = () => {
    isHoveringRef.current = true;
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  // Event handler for menu leave.
  const handleMenuLeave = () => {
    isHoveringRef.current = false;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setShow(false);
        setOpenSubmenus({});
        hoveredItemsRef.current.clear();
      }
    }, 200); // Delay before closing
  };

  // Event handler for item click.
  const handleItemClick = (e, destination) => {
    e.preventDefault();
    e.stopPropagation();
    
    const hasChildren = destination.children && destination.children.length > 0;
    const isLeaf = destination.leaf || !hasChildren;
    
    if (isLeaf) {
      onLocationClick(
        destination.route,
        destination.parentDestinationId || destination.destination_id || destination.id,
        destination.tripType
      );
      setShow(false);
      setOpenSubmenus({});
      hoveredItemsRef.current.clear();
    } else {
      setOpenSubmenus(prev => ({
        ...prev,
        [destination.destination_id || destination.id]: !prev[destination.destination_id || destination.id]
      }));
    }
  };

  // Event handler for main click.
  const handleMainClick = (e) => {
    e.preventDefault();
    onMainClick();
  };

  // Event handler for item mouse enter.
  const handleItemMouseEnter = (destinationId) => {
    hoveredItemsRef.current.add(destinationId);
    
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
    
    submenuTimeoutRef.current = setTimeout(() => {
      if (hoveredItemsRef.current.has(destinationId)) {
        setOpenSubmenus(prev => ({
          ...prev,
          [destinationId]: true
        }));
      }
    }, 300);
  };

  // Event handler for item mouse leave.
  const handleItemMouseLeave = (destinationId) => {
    hoveredItemsRef.current.delete(destinationId);
    
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
    
    submenuTimeoutRef.current = setTimeout(() => {
      if (!hoveredItemsRef.current.has(destinationId)) {
        setOpenSubmenus(prev => ({
          ...prev,
          [destinationId]: false
        }));
      }
    }, 500);
  };

  // Each destination's tripTypes become its children in the tree.
  const treeDestinations = (destinations || []).map((dest) => {
    const children = (dest.tripTypes || []).map((type) => ({
      id: `${dest.destination_id}-${type.id}`,
      destination_id: `${dest.destination_id}-${type.id}`,
      parentDestinationId: dest.destination_id,
      tripType: type.id,
      dest_name: type.type_name,
      route: dest.route,
      leaf: true,
    }));
    return { ...dest, route: dest.route, children, leaf: children.length === 0 };
  });

  const renderDestinationItem = (destination, level = 0) => {
    const hasChildren = destination.children && destination.children.length > 0;
    const isOpen = openSubmenus[destination.destination_id || destination.id];
    const isLeaf = destination.leaf || !hasChildren;
    const destinationId = destination.destination_id || destination.id;

    return (
      <div key={destinationId}>
        <Dropdown.Item
          className={`d-flex justify-content-between align-items-center ${hasChildren ? 'dropdown-parent' : 'dropdown-leaf'}`}
          style={{ 
            paddingLeft: `${15 + (level * 20)}px`,
            backgroundColor: level > 0 ? '#f8f9fa' : 'transparent',
            cursor: isLeaf ? 'pointer' : 'default',
            minWidth: '220px'
          }}
          onClick={(e) => handleItemClick(e, destination)}
          onMouseEnter={() => hasChildren && handleItemMouseEnter(destinationId)}
          onMouseLeave={() => hasChildren && handleItemMouseLeave(destinationId)}
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
          <div 
            className="dropdown-submenu"
            onMouseEnter={() => handleItemMouseEnter(destinationId)}
            onMouseLeave={() => handleItemMouseLeave(destinationId)}
          >
            {destination.children.map(child => renderDestinationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="nav-dropdown-hover"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropdownRef}
    >
      <Dropdown show={show} onToggle={() => {}} className="nav-dropdown">
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
          ) : treeDestinations.length > 0 ? (
            treeDestinations.map(destination => renderDestinationItem(destination))
          ) : (
            <Dropdown.Item disabled>No destinations available</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DestinationTreeDropdown;
