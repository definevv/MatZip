import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Map } from 'lucide-react';
import Header from '../components/Header';
import FilterModal from '../components/FilterModal';
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  type RecentSearch,
} from '../utils/recentSearches';

const foodCategories = [
  {
    id: '1',
    name: '한식',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    name: '양식',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    name: '일식',
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '4',
    name: '중식',
    image: 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '5',
    name: '분식',
    image: 'https://images.pexels.com/photos/7218637/pexels-photo-7218637.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6',
    name: '디저트',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '7',
    name: '베이커리',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '8',
    name: '주점',
    image: 'https://images.pexels.com/photos/5490965/pexels-photo-5490965.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAtmospheres, setSelectedAtmospheres] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addRecentSearch(query);
      setRecentSearches(getRecentSearches());
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleRemoveSearch = (id: string) => {
    removeRecentSearch(id);
    setRecentSearches(getRecentSearches());
  };

  const handleRecentSearchClick = (searchText: string) => {
    handleSearch(searchText);
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleAtmosphereToggle = (atmosphere: string) => {
    setSelectedAtmospheres((prev) =>
      prev.includes(atmosphere) ? prev.filter((a) => a !== atmosphere) : [...prev, atmosphere]
    );
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handlePurposeToggle = (purpose: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(purpose) ? prev.filter((p) => p !== purpose) : [...prev, purpose]
    );
  };

  const handleFilterReset = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
    setSelectedServices([]);
    setSelectedAtmospheres([]);
    setSelectedAmenities([]);
    setSelectedPurposes([]);
  };

  const handleFilterApply = () => {
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => navigate('/map')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Map className="w-5 h-5" />
              <span>지도</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative mb-8">
            <div className="relative flex items-center bg-white rounded-full shadow-md border border-gray-200 px-6 py-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력해주세요."
                className="flex-1 outline-none text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="ml-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </form>

          {recentSearches.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center">
              {recentSearches.map((search) => (
                <div
                  key={search.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRecentSearchClick(search.text)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleRecentSearchClick(search.text);
                  }}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-gray-200 hover:border-primary transition-colors shadow-sm cursor-pointer"
                >
                  <span className="text-gray-700 font-medium">{search.text}</span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSearch(search.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="삭제"
                  >
                    <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">무엇을 먹을까요?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {foodCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSearch(category.name)}
                className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 aspect-[4/3] group hover:ring-2 hover:ring-primary"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-bold">{category.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedTypes={selectedTypes}
        selectedCategories={selectedCategories}
        selectedServices={selectedServices}
        selectedAtmospheres={selectedAtmospheres}
        selectedAmenities={selectedAmenities}
        selectedPurposes={selectedPurposes}
        onTypeToggle={handleTypeToggle}
        onCategoryToggle={handleCategoryToggle}
        onServiceToggle={handleServiceToggle}
        onAtmosphereToggle={handleAtmosphereToggle}
        onAmenityToggle={handleAmenityToggle}
        onPurposeToggle={handlePurposeToggle}
        onReset={handleFilterReset}
        onApply={handleFilterApply}
      />
    </div>
  );
}
