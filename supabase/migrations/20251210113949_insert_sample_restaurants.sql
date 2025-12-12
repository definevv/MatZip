/*
  # Insert Sample Restaurant Data

  1. Data
    - Insert 4 sample restaurants with complete information
    - All restaurants include name, category, address, rating, reviews, images, description, coordinates, and menu items
  
  2. Notes
    - These are sample restaurants for testing and demonstration purposes
    - Coordinates are set to various locations in Seoul
    - All image URLs use Pexels stock photos
*/

INSERT INTO restaurants (name, category, address, rating, review_count, image, description, lat, lng, menu)
VALUES 
(
  '티엔미미 (홍대점)',
  '중식',
  '서울특별시 마포구 양화로 144 (동교동) 4층',
  4.5,
  328,
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
  '담백으로 유명한 정통 중식 맛집입니다. 새우살 볶음밥이 시그니처 메뉴이며, 오랜 전통을 자랑합니다.',
  37.5567,
  126.9240,
  ARRAY['새우살 볶음밥', '짜장면', '짬뽕', '탕수육']
),
(
  '서촌안하우스',
  '한식',
  '서울특별시 강남구 테헤란로 87길 29 (삼성동) 메타워',
  4.8,
  542,
  'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800',
  '강한 향과 매콤한 우리 입맛에 맞춘 사시미가 최고입니다. 라츠지를 비롯해 미역냉국 등이 세트로 특색 돋보입니다.',
  37.5048,
  127.0392,
  ARRAY['된장찌개', '김치찌개', '비빔밥', '불고기']
),
(
  '따뽕',
  '중식',
  '서울특별시 서초구 강남대로 107길 6 (잠원동) 디라버사이드호텔',
  4.2,
  215,
  'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800',
  '매이징에서 유명한 북경의 진한 육수와 잔득한 복공의 서울 본점입니다. 작스킨 볶 세토로 특식 베는 매뉴가 특별합니다.',
  37.5172,
  126.9983,
  ARRAY['마라탕', '마라샹궈', '깐풍기', '유산슬']
),
(
  '부우샨',
  '중식',
  '부산광역시 해운대구 해운대로 209번길 13',
  4.6,
  401,
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
  '블렌드로 구현 모던한 분위기 용식당. 버섯과 검은 배이명에서 시그니스 제공 특추가 있습니다.',
  37.5665,
  126.9780,
  ARRAY['탕수육', '짜장면', '볶음밥', '팔보채']
)
ON CONFLICT (id) DO NOTHING;