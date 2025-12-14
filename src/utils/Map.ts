// src/utils/map.ts

declare global {
  interface Window {
    kakao: any;
    __kakaoMapInstance?: any;
  }
}

let markers: any[] = [];

export function clearMarkers() {
  markers.forEach((m) => m.setMap(null));
  markers = [];
}

export function updateMarkers(restaurants: any[]) {
  if (!window.kakao || !window.kakao.maps) return;
  if (!window.__kakaoMapInstance) return;

  clearMarkers();

  restaurants.forEach((r) => {
    if (!r.lat || !r.lng) return;

    const position = new window.kakao.maps.LatLng(r.lat, r.lng);
    const marker = new window.kakao.maps.Marker({
      position,
      map: window.__kakaoMapInstance,
      title: r.name,
    });

    markers.push(marker);
  });
}
