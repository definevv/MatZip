// src/pages/Map.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import Header from '../components/Header';
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  RecentSearch,
} from '../utils/recentSearches';
import { loadKakaoMap } from '../utils/loadKakaoMap';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  address: string;
  rating: number;
  review_count: number;
  image: string;
  description: string;
  lat: number;
  lng: number;
  menu: string[];
}

export default function Map() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    loadAllRestaurants();
  }, []);

  const loadAllRestaurants = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error loading restaurants:', error);
      setFilteredRestaurants([]);
    } else {
      setFilteredRestaurants(data || []);
    }
    setIsLoading(false);
  };

  // 지도 생성
  useEffect(() => {
    if (!mapRef.current || map) return;

    loadKakaoMap()
      .then((kakao) => {
        kakao.maps.load(() => {
          const center = new kakao.maps.LatLng(37.5665, 126.9780);
          const newMap = new kakao.maps.Map(mapRef.current!, {
            center,
            level: 5, // 여러 식당을 보기 위해 약간 멀게
          });
          setMap(newMap);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [map]);

  // 식당 목록이 바뀔 때마다 마커 갱신
  useEffect(() => {
    if (!map) return;

    const kakao = window.kakao;

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));

    if (filteredRestaurants.length > 0) {
      const newMarkers = filteredRestaurants.map((restaurant) => {
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(restaurant.lat, restaurant.lng),
          map,
          title: restaurant.name,
        });

        kakao.maps.event.addListener(marker, 'click', () => {
          handleRestaurantClick(restaurant.id);
        });

        return marker;
      });

      setMarkers(newMarkers);

      // bounds 맞추기
      const bounds = new kakao.maps.LatLngBounds();
      filteredRestaurants.forEach((restaurant) => {
        bounds.extend(new kakao.maps.LatLng(restaurant.lat, restaurant.lng));
      });
      map.setBounds(bounds);
    } else {
      setMarkers([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, filteredRestaurants]);

  const handleRestaurantClick = (id: string) => {
    navigate(`/restaurant/${id}`);
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      addRecentSearch(query);
      setCurrentSearchQuery(query);
      setIsLoading(true);

      const searchLower = query.toLowerCase();
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .or(
          `name.ilike.%${searchLower}%,category.ilike.%${searchLower}%,address.ilike.%${searchLower}%,description.ilike.%${searchLower}%`
        );

      if (error) {
        console.error('Error searching restaurants:', error);
        setFilteredRestaurants([]);
      } else {
        const filtered = (data || []).filter((restaurant) => {
          return (
            restaurant.menu?.some((item: string) =>
              item.toLowerCase().includes(searchLower)
            ) ||
            restaurant.name.toLowerCase().includes(searchLower) ||
            restaurant.category.toLowerCase().includes(searchLower) ||
            restaurant.address.toLowerCase().includes(searchLower) ||
            restaurant.description?.toLowerCase().includes(searchLower)
          );
        });
        setFilteredRestaurants(filtered);
      }

      setRecentSearches(getRecentSearches());
      setIsLoading(false);
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
    setSearchQuery(searchText);
    handleSearch(searchText);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentSearchQuery('');
    loadAllRestaurants();
  };

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
              {currentSearchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="ml-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </form>

          {recentSearches.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {recentSearches.map((search) => (
                <button
                  key={search.id}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-white rounded-full border border-gray-200 hover:border-primary transition-colors shadow-sm"
                >
                  <span
                    onClick={() => handleRecentSearchClick(search.text)}
                    className="text-gray-700 font-medium"
                  >
                    {search.text}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSearch(search.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="삭제"
                  >
                    <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 h-[calc(100vh-280px)]">
          <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div ref={mapRef} className="w-full h-full">
              {!window.kakao && (
                <div className="h-full flex items-center justify-center text-gray-500">
                  지도를 불러오는 중...
                </div>
              )}
            </div>
          </div>

          <div className="w-96 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-primary">
                {currentSearchQuery ? `"${currentSearchQuery}" 검색 결과` : '음식점 목록'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredRestaurants.length}개의 음식점
              </p>
            </div>
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>로딩 중...</p>
                </div>
              ) : filteredRestaurants.length > 0 ? (
                <div className="space-y-3 p-4">
                  {filteredRestaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      onClick={() => handleRestaurantClick(restaurant.id)}
                      className="bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer p-4"
                    >
                      <div className="flex gap-3">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {restaurant.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {restaurant.category}
                          </p>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {restaurant.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentSearchQuery ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                  <Search className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">등록되지 않은 정보입니다</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}