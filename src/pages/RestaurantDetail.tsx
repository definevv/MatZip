// src/pages/RestaurantDetail.tsx
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Header from '../components/Header';
import { loadKakaoMap } from '../utils/loadKakaoMap';

interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  review_count: number;
  image: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  menu: string[];
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRestaurant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadRestaurant = async () => {
  if (!id) return;

  setIsLoading(true);
  try {
    const res = await fetch(`/api/restaurant?id=${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('load failed');
    const data = await res.json();

    setRestaurant({
      id,
      name: data.name,
      address: data.addr,
      lat: Number(data.y), // 좌표계 주의 (필요시 변환)
      lng: Number(data.x),
      menu: [],
      category: '',
      rating: 0,
      review_count: 0,
      image: '',
      description: '',
    });
  } catch (e) {
    console.error(e);
    setRestaurant(null);
  } finally {
    setIsLoading(false);
  }
};

  // 지도 생성
  useEffect(() => {
    if (!mapRef.current || map || !restaurant) return;

    loadKakaoMap()
      .then((kakao) => {
        kakao.maps.load(() => {
          const center = new kakao.maps.LatLng(restaurant.lat, restaurant.lng);
          const newMap = new kakao.maps.Map(mapRef.current!, {
            center,
            level: 3,
          });
          setMap(newMap);

          new kakao.maps.Marker({
            position: center,
            map: newMap,
            title: restaurant.name,
          });
        });
      })
      .catch((err) => console.error(err));
  }, [map, restaurant]);

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

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500 text-lg">음식점을 찾을 수 없습니다.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-80 md:h-96">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {restaurant.name}
                </h1>
                <div className="mb-3">
                  <span className="text-yellow-500 text-2xl font-bold">
                    ★ {restaurant.rating}
                  </span>
                  <span className="text-gray-600 ml-2">
                    리뷰 {restaurant.review_count}개
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {restaurant.category}
                  </span>
                </div>
              </div>
            </div>

            {restaurant.description && (
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {restaurant.description}
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  기본 정보
                </h2>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">주소</p>
                    <p className="text-gray-600">{restaurant.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  위치
                </h2>
                <div
                  ref={mapRef}
                  className="w-full h-64 rounded-xl overflow-hidden bg-gray-100"
                >
                  {!window.kakao && (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      지도를 불러오는 중...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {restaurant.menu && restaurant.menu.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  메뉴 정보
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {restaurant.menu.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all p-4"
                    >
                      <p className="font-medium text-gray-900 text-sm">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
