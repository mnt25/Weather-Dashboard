import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Navigation, Loader2 } from "lucide-react";
import { searchCities } from "../../services/apiService";
import type { CityResult } from "../../types/api";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onCoordsSearch?: (lat: number, lon: number, name: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onCoordsSearch,
  isLoading,
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
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

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        let resolvedCityName = "Vị trí của bạn";
        try {
          const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`;
          const res = await fetch(url);
          const data = await res.json();
          resolvedCityName = data.city || data.locality || data.principalSubdivision || "Vị trí của bạn";
        } catch (e) {
          console.warn("Reverse geocode failed", e);
        }

        setIsLocating(false);
        if (onCoordsSearch) {
          onCoordsSearch(latitude, longitude, resolvedCityName);
          setQuery(resolvedCityName); // Show the resolved city name inside the search bar input
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = "Không thể lấy vị trí hiện tại.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Bạn đã từ chối quyền định vị. Vui lòng cho phép quyền vị trí trong cài đặt trình duyệt để tiếp tục.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = "Thông tin vị trí hiện tại không có sẵn.";
        } else if (error.code === error.TIMEOUT) {
          msg = "Yêu cầu lấy vị trí bị hết hạn thời gian.";
        }
        alert(msg);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Determine spacing for the GPS button
  const hasInputText = query.trim().length > 0;
  const gpsRightOffset = hasInputText ? "76px" : "16px";

  return (
    <div
      className="w-100 mx-auto position-relative"
      style={{ maxWidth: "500px" }}
      ref={wrapperRef}
    >
      <form onSubmit={handleSubmit} className="position-relative shadow-sm rounded-pill overflow-hidden">
        <div className="position-absolute top-50 start-0 translate-middle-y ps-3 pe-none z-1">
          <Search className="text-secondary-custom opacity-75" size={20} />
        </div>
        
        <input
          type="text"
          className="form-control glass-input py-3 ps-5 shadow-none"
          style={{ paddingRight: hasInputText ? "130px" : "55px" }}
          placeholder="Nhập tên thành phố để tìm kiếm..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length >= 2 && suggestions.length > 0)
              setShowSuggestions(true);
          }}
          disabled={isLoading || isLocating}
          autoComplete="off"
        />

        {/* Geolocation Button */}
        <button
          type="button"
          onClick={handleGeolocation}
          disabled={isLoading || isLocating}
          className="btn btn-link position-absolute top-50 translate-middle-y p-2 text-secondary-custom d-flex align-items-center justify-content-center border-0"
          style={{ 
            right: gpsRightOffset, 
            zIndex: 10, 
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            color: isLocating ? "var(--accent-color)" : "inherit"
          }}
          title="Sử dụng vị trí GPS hiện tại"
        >
          {isLocating ? (
            <Loader2 size={20} className="spinner-border spinner-border-sm text-primary border-0" style={{ animation: "spinner-border 0.75s linear infinite" }} />
          ) : (
            <Navigation size={20} className="hover-scale" style={{ transform: "rotate(45deg)" }} />
          )}
        </button>

        {/* Search Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isLocating || !hasInputText}
          className="btn glass-btn position-absolute top-50 end-0 translate-middle-y me-1 py-2 px-3 text-sm fw-bold"
          style={{ 
            height: "calc(100% - 8px)", 
            right: "4px",
            opacity: hasInputText ? 1 : 0,
            transform: hasInputText ? "translateY(-50%) scale(1)" : "translateY(-50%) scale(0.9)",
            pointerEvents: hasInputText ? "auto" : "none",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          }}
        >
          {isLoading ? "..." : "Tìm"}
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="position-absolute start-0 end-0 mt-2 glass-card overflow-hidden shadow-lg animate-fade-in"
          style={{ zIndex: 1050, maxHeight: "320px", overflowY: "auto", border: "1px solid var(--glass-border)" }}
        >
          <ul className="list-unstyled m-0 p-0">
            {suggestions.map((location, index) => (
              <li
                key={`${location.latitude}-${location.longitude}-${index}`}
                onClick={() => handleSuggestionClick(location)}
                className="px-3 py-3 text-dark cursor-pointer d-flex align-items-center justify-content-between border-bottom glass-card-item rounded-0 border-0"
                style={{ 
                  borderBottom: "1px solid var(--card-item-border) !important",
                  color: "var(--text-primary)"
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <MapPin className="text-secondary-custom opacity-75 flex-shrink-0" size={16} />
                  <div className="d-flex flex-column text-start">
                    <span className="fw-semibold small" style={{ color: "var(--text-primary)" }}>{location.name}</span>
                    <span
                      className="text-secondary-custom"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {location.admin1 ? `${location.admin1}, ` : ""}
                      {location.country}
                    </span>
                  </div>
                </div>
                
                {/* Flag Icon */}
                <div className="d-flex align-items-center">
                  <img
                    src={`https://hatscripts.github.io/circle-flags/flags/${
                      location.countryCode ? location.countryCode.toLowerCase() : "globe"
                    }.svg`}
                    onError={(e) => {
                      e.currentTarget.src = "https://hatscripts.github.io/circle-flags/flags/globe.svg";
                    }}
                    className="shadow-sm rounded-circle border border-white"
                    width="20"
                    height="20"
                    alt=""
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
