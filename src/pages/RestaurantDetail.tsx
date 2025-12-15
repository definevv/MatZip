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
    if (!id) return;
    loadRestaurant(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadRestaurant = async (id: string) => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/restaurant?id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('load failed');
      const data = await res.json();

      setRestaurant({
        id,
        name: data.name ?? '',
        address: data.address ?? '',
        lat: Number(data.lat),   // ✅ 서버에서 변환된 좌표 그대로 사용
        lng: Number(data.lng),   // ✅ 서버에서 변환된 좌표 그대로 사용
        menu: Array.isArray(data.menu) ? data.menu : [],
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

  // 지도 생성 (좌표 정확도는 다음 단계에서 보정)
  useEffect(() => {
  if (!mapRef.current || map || !restaurant) return;
  if (!restaurant.address) return;

  loadKakaoMap().then((kakao) => {
    kakao.maps.load(() => {
      const mapInstance = new kakao.maps.Map(mapRef.current!, {
        center: new kakao.maps.LatLng(37.5665, 126.9780), // 임시(서울)
        level: 3,
      });

      const geocoder = new kakao.maps.services.Geocoder();

      geocoder.addressSearch(restaurant.address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const lat = Number(result[0].y);
          const lng = Number(result[0].x);

          const center = new kakao.maps.LatLng(lat, lng);
          mapInstance.setCenter(center);

          new kakao.maps.Marker({
            map: mapInstance,
            position: center,
            title: restaurant.name,
          });
        } else {
          console.warn('주소 → 좌표 변환 실패', restaurant.address);
        }
      });

      setMap(mapInstance);
    });
  });
}, [restaurant, map]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
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
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500 text-lg">
              음식점을 찾을 수 없습니다.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-80 md:h-96 bg-gray-200" />

          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              {restaurant.name}
            </h1>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">기본 정보</h2>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <p className="text-gray-700">{restaurant.address}</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">위치</h2>
                <div
                  ref={mapRef}
                  className="w-full h-64 rounded-xl bg-gray-100"
                >
                  {!window.kakao && (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      지도를 불러오는 중...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ✅ 메뉴 표시 (이제 반드시 나옴) */}
            {restaurant.menu.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">메뉴 정보</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {restaurant.menu.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border rounded-lg p-4 text-sm"
                    >
                      {item}
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
