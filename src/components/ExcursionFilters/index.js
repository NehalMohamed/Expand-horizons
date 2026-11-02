import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronDown, FiChevronUp, FiSliders } from "react-icons/fi";
import {
  fetchTripTypes,
  fetchFilterDestinations,
} from "../../redux/Slices/tripFiltersSlice";

const MultiSelect = ({ id, label, options, selected, onChange, openId, setOpenId }) => {
  const isOpen = openId === id;
  const toggle = (optId) =>
    onChange(selected.includes(optId) ? selected.filter((o) => o !== optId) : [...selected, optId]);

  return (
    <div className="ef-item">
      <button
        type="button"
        className={`ef-pill ${selected.length ? "active" : ""}`}
        onClick={() => setOpenId(isOpen ? null : id)}
      >
        {label}
        {selected.length > 0 && <span className="ef-count">{selected.length}</span>}
        <span className="ef-caret">{isOpen ? <FiChevronUp /> : <FiChevronDown />}</span>
      </button>
      {isOpen && (
        <div className="ef-panel ef-panel-list">
          {options.map((opt) => (
            <label key={opt.id} className="ef-check">
              <input
                type="checkbox"
                checked={selected.includes(opt.id)}
                onChange={() => toggle(opt.id)}
              />
              <span>{opt.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const ExcursionFilters = ({ onChange }) => {
  const [openId, setOpenId] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [types, setTypes] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { types: apiTypes, destinations: apiDestinations } = useSelector(
    (state) => state.tripFilters
  );
  const currentLang = localStorage.getItem("lang") || "en";

  const typeOptions = useMemo(
    () => (apiTypes || []).map((t) => ({ id: t.id, name: t.type_name })),
    [apiTypes]
  );
  const destinationOptions = useMemo(
    () => (apiDestinations || []).map((d) => ({ id: d.destination_id, name: d.dest_name })),
    [apiDestinations]
  );

  useEffect(() => {
    dispatch(fetchTripTypes());
    dispatch(fetchFilterDestinations({ lang_code: currentLang }));
  }, [dispatch, currentLang]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpenId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (onChange) onChange({ minPrice, maxPrice, types, destinations });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, types, destinations]);

  const clearPrice = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="excursion-filters container" ref={ref}>
      <div className="ef-bar">
        <span className="ef-title">
          <FiSliders /> Filters
        </span>
        <div className="ef-item">
          <button
            type="button"
            className="ef-pill"
            onClick={() => setOpenId(openId === "price" ? null : "price")}
          >
            Price <span className="ef-caret">{openId === "price" ? <FiChevronUp /> : <FiChevronDown />}</span>
          </button>
          {openId === "price" && (
            <div className="ef-panel ef-panel-price">
              <div className="ef-price-row">
                <label>
                  Min. price
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </label>
                <label>
                  Max. price
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </label>
              </div>
              <button type="button" className="ef-clear" onClick={clearPrice}>
                Clear
              </button>
            </div>
          )}
        </div>

        <MultiSelect
          id="types"
          label="Types"
          options={typeOptions}
          selected={types}
          onChange={setTypes}
          openId={openId}
          setOpenId={setOpenId}
        />
        <MultiSelect
          id="destinations"
          label="Destinations"
          options={destinationOptions}
          selected={destinations}
          onChange={setDestinations}
          openId={openId}
          setOpenId={setOpenId}
        />
      </div>
    </div>
  );
};

export default ExcursionFilters;
