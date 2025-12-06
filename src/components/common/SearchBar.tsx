import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { searchCities } from "../../services/apiService";
import type { CityResult } from "../../types/api";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        const results = await searchCities(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (location: CityResult) => {
    const displayName = location.name;
    setQuery(displayName);
    setShowSuggestions(false);
    onSearch(displayName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query.trim());
    }
  };

  return (
    <div
      className="w-100 mx-auto position-relative"
      style={{ maxWidth: "450px" }}
      ref={wrapperRef}
    >
      <form onSubmit={handleSubmit} className="position-relative">
        <div className="position-absolute top-50 start-0 translate-middle-y ps-3 pe-none z-1">
          <Search className="text-secondary-custom" size={20} />
        </div>
        <input
          type="text"
          className="form-control glass-input py-3 ps-5 pe-5 shadow"
          placeholder="Nhập tên thành phố ..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length >= 2 && suggestions.length > 0)
              setShowSuggestions(true);
          }}
          disabled={isLoading}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="btn glass-btn position-absolute top-50 end-0 translate-middle-y me-1 py-1 px-3 text-sm fw-medium"
          style={{ height: "calc(100% - 8px)", right: "4px" }}
        >
          {isLoading ? "..." : "Tìm"}
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          className="position-absolute start-0 end-0 mt-2 glass-card overflow-hidden shadow-lg animate-fade-in"
          style={{ zIndex: 1050, maxHeight: "320px", overflowY: "auto" }}
        >
          <ul className="list-unstyled m-0 p-0">
            {suggestions.map((location, index) => (
              <li
                key={`${location.latitude}-${location.longitude}-${index}`}
                onClick={() => handleSuggestionClick(location)}
                className="px-3 py-3 text-dark cursor-pointer d-flex align-items-center justify-content-between border-bottom"
                style={{ borderBottomColor: "rgba(0,0,0,0.05)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <div className="d-flex align-items-center gap-2">
                  <MapPin className="text-primary flex-shrink-0" size={16} />
                  <div className="d-flex flex-column text-start">
                    <span className="fw-medium small">{location.name}</span>
                    <span
                      className="small text-secondary-custom"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {location.admin1 ? `${location.admin1}, ` : ""}
                      {location.country}
                    </span>
                  </div>
                </div>
                <img
                  src={`https://hatscripts.github.io/circle-flags/flags/${
                    location.country === "Vietnam" ? "vn" : "globe"
                  }.svg`}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="opacity-50"
                  width="16"
                  height="16"
                  alt=""
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
