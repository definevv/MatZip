// src/utils/loadKakaoMap.ts
export function loadKakaoMap(): Promise<typeof window.kakao> {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve(window.kakao);
      return;
    }

    const script = document.querySelector<HTMLScriptElement>(
      'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
    );

    // index.html 에 이미 넣어둔 스크립트가 있으므로 그걸 사용
    if (script) {
      script.addEventListener('load', () => {
        if (window.kakao && window.kakao.maps) {
          resolve(window.kakao);
        } else {
          reject(new Error('Kakao map load failed'));
        }
      });
      // 이미 로드된 상태일 수도 있으니 한 번 더 체크
      if (window.kakao && window.kakao.maps) {
        resolve(window.kakao);
      }
    } else {
      reject(new Error('Kakao map script not found'));
    }
  });
}
