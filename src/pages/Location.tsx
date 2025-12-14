// src/pages/Location.tsx
import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import Header from '../components/Header';
import { loadKakaoMap } from '../utils/loadKakaoMap';

export default function Location() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [userMarker, setUserMarker] = useState<any>(null);
  const [locationPermission, setLocationPermission] =
    useState<'granted' | 'denied' | 'prompt'>('prompt');

  // 지도 생성
  useEffect(() => {
    if (!mapRef.current || map) return;

    loadKakaoMap()
      .then((kakao) => {
        kakao.maps.load(() => {
          const center = new kakao.maps.LatLng(37.5665, 126.9780);

          const newMap = new kakao.maps.Map(mapRef.current!, {
            center,
            level: 3, // 숫자 작을수록 확대 (네이버 zoom 15 근처)
          });

          setMap(newMap);

          // 위치 권한 거부된 경우, 클릭한 곳에 마커 찍기
          if (locationPermission === 'denied') {
            kakao.maps.event.addListener(newMap, 'click', (mouseEvent: any) => {
              const clickedPosition = mouseEvent.latLng;
              placeUserMarker(kakao, newMap, clickedPosition);
            });
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [map, locationPermission]);

  // 지도 만들어지면 사용자 위치 요청
  useEffect(() => {
    if (map) {
      requestUserLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const requestUserLocation = () => {
    if (!map) return;

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const kakao = window.kakao;
          const userPosition = new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          map.setCenter(userPosition);
          map.setLevel(3);

          placeUserMarker(kakao, map, userPosition);
          setLocationPermission('granted');
        },
        (error) => {
          console.log('위치 권한이 거부되었습니다:', error);
          setLocationPermission('denied');
        }
      );
    } else {
      setLocationPermission('denied');
    }
  };

  const placeUserMarker = (kakao: any, targetMap: any, position: any) => {
    if (userMarker) {
      userMarker.setMap(null);
    }

    const marker = new kakao.maps.Marker({
      position,
      map: targetMap,
    });

    setUserMarker(marker);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-7 h-7 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">내 위치 정보</h1>
          </div>
          <p className="text-orange-500">
            현재 위치가 표시되었습니다.
          </p>
        </div>

        <div
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
          style={{ height: '600px' }}
        >
          <div ref={mapRef} className="w-full h-full">
            {!window.kakao && (
              <div className="h-full flex items-center justify-center text-gray-500">
                지도를 불러오는 중...
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">사용 방법</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>위치 권한을 허용하면 현재 위치에 마커가 표시됩니다.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>위치 권한을 거부한 경우, 지도를 클릭하여 원하는 위치에 마커를 배치할 수 있습니다.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>마우스 휠이나 확대/축소 버튼으로 지도를 조절할 수 있습니다.</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
