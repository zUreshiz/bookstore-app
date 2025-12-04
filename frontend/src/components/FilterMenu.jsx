import React, { useState, useEffect } from "react";
// Thêm icon ChevronLeft, ChevronRight
import {
  ChevronDown,
  X,
  Filter,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Category } from "../lib/data";
const CATEGORY_LIST = Object.values(Category);

const SectionHeader = ({ title, isOpen, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between w-full group py-2">
    <span className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
      {title}
    </span>
    <ChevronDown
      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
        isOpen ? "rotate-180" : ""
      }`}
    />
  </button>
);

const FilterMenu = ({ onFilterChange, categories = CATEGORY_LIST }) => {
  // --- STATE ---
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // State đóng mở các section accordion
  const [expanded, setExpanded] = useState({
    price: true,
    rating: true,
    sort: true,
    category: true,
  });

  // State mobile menu
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // [NEW] State cho Desktop Sidebar (Mặc định là true - hiện)
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);

  // --- HANDLERS ---
  const toggleSection = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = (e, type) => {
    let val = parseInt(e.target.value) || 0;
    if (val < 0) val = 0;
    if (type === "min") setPriceRange([val, priceRange[1]]);
    else setPriceRange([priceRange[0], val]);
  };

  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleClearFilters = () => {
    setPriceRange([0, 500]);
    setRating(0);
    setSortBy("popular");
    setSelectedCategories([]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFilterChange) {
        onFilterChange({
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          rating,
          sortBy,
          categories: selectedCategories,
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [priceRange, rating, sortBy, selectedCategories, onFilterChange]);

  const hasFilters =
    selectedCategories.length > 0 ||
    rating > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 500 ||
    sortBy !== "popular";

  return (
    <>
      {/* === MOBILE TRIGGER BUTTON (Giữ nguyên) === */}
      <div className="lg:hidden mb-4 sticky top-4 z-30">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5 text-blue-600" />
          Filter & Sort Books
        </button>
      </div>

      {/* === MOBILE OVERLAY (Giữ nguyên) === */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-fadeIn"
          onClick={() => setIsMobileOpen(false)}></div>
      )}

      {/* === MAIN SIDEBAR === */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 bg-white shadow-2xl transform transition-all duration-300 ease-in-out
          /* Mobile styles */
          w-[280px] ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          
          /* Desktop styles logic */
          lg:translate-x-0 lg:static lg:shadow-none lg:block lg:bg-transparent lg:h-auto
          ${isDesktopOpen ? "lg:w-64" : "lg:w-0"} 
          /* QUAN TRỌNG: Để overflow-visible để nút bấm lòi ra ngoài khi width = 0 */
          relative lg:overflow-visible
        `}>
        {/* WRAPPER DÍNH (STICKY): 
          Nút bấm và nội dung đều nằm trong này để cùng trôi theo khi cuộn 
        */}
        <div className="sticky top-24 z-30">
          {/* [NEW] DESKTOP TOGGLE BUTTON */}
          {/* Nút này nằm trong khối sticky nên sẽ trôi theo màn hình */}
          <button
            onClick={() => setIsDesktopOpen(!isDesktopOpen)}
            className={`
                hidden lg:flex items-center justify-center
                absolute top-0 -right-9 z-50
                w-12 h-12 rounded-full border border-gray-200 shadow-sm
                bg-white hover:bg-blue-50 text-gray-600 hover:text-blue-600
                transition-transform duration-300 focus:outline-none
              `}
            title={isDesktopOpen ? "Collapse sidebar" : "Expand sidebar"}>
            {isDesktopOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>

          {/* Nội dung bên trong Sidebar */}
          {/* Cần set width cố định w-64 ở đây để nội dung không bị bóp méo khi cha w-0 */}
          <div
            className={`
                flex flex-col 
                bg-white lg:rounded-xl lg:border lg:border-gray-200 lg:shadow-sm
                transition-all duration-300 origin-left
                overflow-hidden h-[calc(100vh-8rem)]
                w-64  
                ${
                  isDesktopOpen
                    ? "opacity-100 scale-x-100"
                    : "opacity-0 scale-x-0 lg:border-none pointer-events-none"
                }
            `}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0 whitespace-nowrap">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" /> Filters
              </h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-2 text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline hidden lg:block transition-colors">
                  Reset
                </button>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar whitespace-nowrap">
              {/* 1. SORT BY */}
              <div>
                <SectionHeader
                  title="Sort By"
                  isOpen={expanded.sort}
                  onClick={() => toggleSection("sort")}
                />
                {expanded.sort && (
                  <div className="mt-3 animate-fadeIn">
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors">
                        <option value="popular">Most Popular</option>
                        <option value="newest">Newest Arrivals</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. PRICE RANGE */}
              <div className="border-t border-gray-100 pt-4">
                <SectionHeader
                  title="Price Range"
                  isOpen={expanded.price}
                  onClick={() => toggleSection("price")}
                />
                {expanded.price && (
                  <div className="mt-3 space-y-3 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(e, "min")}
                          className="w-full pl-6 pr-2 py-2 bg-white border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow"
                          placeholder="Min"
                        />
                      </div>
                      <span className="text-gray-400">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e, "max")}
                          className="w-full pl-6 pr-2 py-2 bg-white border border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. CATEGORIES */}
              <div className="border-t border-gray-100 pt-4">
                <SectionHeader
                  title="Categories"
                  isOpen={expanded.category}
                  onClick={() => toggleSection("category")}
                />
                {expanded.category && (
                  <div className="mt-3 space-y-2 animate-fadeIn">
                    {categories.map((cat) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <label
                          key={cat}
                          className={`flex items-center gap-3 cursor-pointer group p-2 rounded-lg transition-all ${
                            isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}>
                          <div className="relative flex items-center justify-center shrink-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleCategoryToggle(cat)}
                              className="peer appearance-none h-5 w-5 border-2 border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                            />
                            <Check
                              className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                              strokeWidth={3}
                            />
                          </div>
                          <span
                            className={`text-sm select-none flex-1 truncate ${
                              isSelected
                                ? "text-blue-700 font-medium"
                                : "text-gray-600 group-hover:text-gray-900"
                            }`}>
                            {cat}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. RATING */}
              <div className="border-t border-gray-100 pt-4">
                <SectionHeader
                  title="Rating"
                  isOpen={expanded.rating}
                  onClick={() => toggleSection("rating")}
                />
                {expanded.rating && (
                  <div className="mt-3 space-y-1 animate-fadeIn">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(rating === star ? 0 : star)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all border ${
                          rating === star
                            ? "bg-yellow-50 border-yellow-200 shadow-sm"
                            : "border-transparent hover:bg-gray-50"
                        }`}>
                        <div className="flex items-center gap-2">
                          <div className="flex text-yellow-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < star
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-200"
                                }
                              />
                            ))}
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              rating === star ? "text-yellow-700" : "text-gray-500"
                            }`}>
                            & Up
                          </span>
                        </div>
                        {rating === star && <Check className="text-blue-600 w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Mobile (Giữ nguyên) */}
            <div className="lg:hidden p-4 border-t border-gray-100 bg-white shrink-0 pb-safe">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-colors active:scale-95 transform">
                Show Results
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterMenu;
