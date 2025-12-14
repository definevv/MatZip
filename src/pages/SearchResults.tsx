// src/pages/SearchResults.tsx
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
import { updateMarkers } from '../utils/Map'; // ✅ 지도 마커 유틸
import { updateMapFromSearch } from './Map';

export interface Restaurant {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  menu?: string[];

  matchType?: 'RESTAURANT' | 'MENU' | 'INGREDIENT' | 'RECIPE';
  matchDetail?: string;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 🔹 Fuseki 검색 (서버에서 KG 기준으로 정제된 결과를 준다는 가정)
  async function fetchRestaurantsByQuery(q: string): Promise<Restaurant[]> {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error(`search failed: ${res.status}`);
    return res.json();
  }

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // 🔹 검색 실행
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchRestaurantsByQuery(query);
        if (!mounted) return;

        setRestaurants(data);
        updateMapFromSearch(data); // ⭐ 여기 (Map.tsx로 결과 전달)
        updateMarkers(data); // ✅ 검색 결과 = 지도 마커
      } catch (e) {
        console.error(e);
        if (mounted) setRestaurants([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [query]);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    addRecentSearch(q);
    setRecentSearches(getRecentSearches());
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchQuery(q);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurant/${encodeURIComponent(id)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex items-center justify-center h-96">
          <p className="text-gray-500 text-lg">로딩 중...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 🔍 검색창 */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center bg-white rounded-full shadow border px-6 py-4">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력해주세요"
              className="flex-1 outline-none"
            />
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="ml-3 p-2 hover:bg-gray-100 rounded-lg"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </form>

        <h1 className="text-xl font-bold mb-4">
          “{query}” 검색 결과
        </h1>

        {restaurants.length === 0 ? (
          <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurants.map((r) => (
              <div
                key={r.id}
                onClick={() => handleRestaurantClick(r.id)}
                className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer p-6"
              >
                <h2 className="text-xl font-bold mb-2">{r.name}</h2>

                {/* 🔎 매칭 이유 (핵심) */}
                {r.matchType && (
                  <p className="text-sm text-gray-500 mb-3">
                    🔎 매칭 이유:&nbsp;
                    {r.matchType === 'RESTAURANT' && `음식점명에 "${query}" 포함`}
                    {r.matchType === 'MENU' && `메뉴 "${r.matchDetail}"`}
                    {r.matchType === 'INGREDIENT' && `재료 "${r.matchDetail}" 사용`}
                    {r.matchType === 'RECIPE' && `레시피 "${r.matchDetail}"`}
                  </p>
                )}

                {r.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-1" />
                    <span>{r.address}</span>
                  </div>
                )}

                {r.menu && r.menu.length > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    대표 메뉴: {r.menu.slice(0, 3).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}
