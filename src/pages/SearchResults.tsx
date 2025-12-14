import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import Header from '../components/Header';
import FilterModal from '../components/FilterModal';
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  type RecentSearch,
} from '../utils/recentSearches';

interface Restaurant {
  id: string;
  name: string;
  category?: string;
  address?: string;
  rating?: number;
  review_count?: number;
  image?: string;
  description?: string;
  lat?: number;
  lng?: number;
  menu?: string[];
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAtmospheres, setSelectedAtmospheres] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);

  // ---- Fuseki API 호출 유틸 ----
  async function fetchRestaurantsByQuery(q: string): Promise<Restaurant[]> {
    const url = q.trim() ? `/api/search?q=${encodeURIComponent(q)}` : `/api/search?q=*`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`search failed: ${res.status}`);
    // 서버가 최소한 id/name/address를 돌려준다는 가정
    const rows = await res.json();
    return rows.map((r: any) => ({
      id: r.id ?? r.uri ?? r.concept ?? '',
      name: r.name ?? r.label ?? '',
      address: r.address ?? '',
      category: r.category ?? '',
      description: r.description ?? '',
      review_count: Number(r.review_count ?? 0),
      lat: r.lat ? Number(r.lat) : undefined,
      lng: r.lng ? Number(r.lng) : undefined,
      menu: Array.isArray(r.menu) ? r.menu : [],
      image: r.image ?? undefined,
    })) as Restaurant[];
  }

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // 쿼리 바뀌면 Fuseki에서 가져와 상태 갱신
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchRestaurantsByQuery(query);
        if (!mounted) return;
        setAllRestaurants(data);
        // 간단 필터: 이름/카테고리/메뉴 포함
        const lower = query.toLowerCase();
        const filtered = data.filter((r) =>
          (r.name ?? '').toLowerCase().includes(lower) ||
          (r.category ?? '').toLowerCase().includes(lower) ||
          (r.menu ?? []).some((m) => m.toLowerCase().includes(lower))
        );
        setFilteredRestaurants(filtered);
      } catch (e) {
        console.error(e);
        if (mounted) {
          setAllRestaurants([]);
          setFilteredRestaurants([]);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [query]);

  const handleSearch = (q: string) => {
    if (q.trim()) {
      addRecentSearch(q);
      setRecentSearches(getRecentSearches());
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchQuery(q);
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

  const handleRecentSearchClick = (text: string) => handleSearch(text);
  const handleRestaurantClick = (id: string) => navigate(`/restaurant/${encodeURIComponent(id)}`);

  const handleTypeToggle = (t: string) =>
    setSelectedTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  const handleCategoryToggle = (c: string) =>
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  const handleServiceToggle = (s: string) =>
    setSelectedServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const handleAtmosphereToggle = (a: string) =>
    setSelectedAtmospheres((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  const handleAmenityToggle = (a: string) =>
    setSelectedAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  const handlePurposeToggle = (p: string) =>
    setSelectedPurposes((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const handleFilterReset = () => {
    setSelectedTypes([]);
    setSelectedCategories([]);
    setSelectedServices([]);
    setSelectedAtmospheres([]);
    setSelectedAmenities([]);
    setSelectedPurposes([]);
  };
  const handleFilterApply = () => setIsFilterOpen(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500 text-lg">로딩 중...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <form onSubmit={handleSubmit} className="relative mb-6">
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
            <div className="flex flex-wrap gap-3 mb-6">
              {recentSearches.map((s) => (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleRecentSearchClick(s.text)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleRecentSearchClick(s.text);
                  }}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-gray-200 hover:border-primary transition-colors shadow-sm cursor-pointer"
                >
                  <span className="text-gray-700 font-medium">{s.text}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemoveSearch(s.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="삭제"
                  >
                    <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              "{query}" 검색 결과
            </h1>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRestaurants.map((r) => (
              <div
                key={r.id}
                onClick={() => handleRestaurantClick(r.id)}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">{r.name}</h2>

                {r.address && (
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm leading-relaxed">{r.address}</p>
                  </div>
                )}

                {r.description && (
                  <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                    {r.description}
                  </p>
                )}

                <p className="text-gray-500 text-sm">
                  리뷰 {r.review_count ?? 0}개
                </p>
              </div>
            ))}
          </div>
        )}
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
