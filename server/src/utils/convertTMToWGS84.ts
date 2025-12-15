import fetch from 'node-fetch';

export async function convertTMToWGS84(x: number, y: number) {
  const KAKAO_REST_KEY = process.env.KAKAO_REST_KEY;

  if (!KAKAO_REST_KEY) {
    throw new Error('KAKAO_REST_KEY is not defined');
  }

  const url =
    `https://dapi.kakao.com/v2/local/geo/transcoord.json` +
    `?x=${x}&y=${y}&input_coord=TM&output_coord=WGS84`;

  const res = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${KAKAO_REST_KEY}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`좌표 변환 실패: ${text}`);
  }

  const json = await res.json();

  if (!json.documents || json.documents.length === 0) {
    throw new Error('좌표 변환 결과 없음');
  }

  return {
    lat: json.documents[0].y,
    lng: json.documents[0].x,
  };
}
