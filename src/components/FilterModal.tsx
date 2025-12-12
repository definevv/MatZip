import { X } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTypes: string[];
  selectedCategories: string[];
  selectedServices: string[];
  selectedAtmospheres: string[];
  selectedAmenities: string[];
  selectedPurposes: string[];
  onTypeToggle: (type: string) => void;
  onCategoryToggle: (category: string) => void;
  onServiceToggle: (service: string) => void;
  onAtmosphereToggle: (atmosphere: string) => void;
  onAmenityToggle: (amenity: string) => void;
  onPurposeToggle: (purpose: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const cuisineTypes = ['한국', '서양', '일본', '중국', '동남아시아', '이탈리아', '퓨전'];

const foodCategories = [
  '밥',
  '국',
  '조림',
  '구이',
  '튀김/커틀릿',
  '찜',
  '나물/생채/샐러드',
  '밑반찬/김치',
  '양식',
  '도시락/간식',
  '양념장',
  '떡/한과',
  '빵/과자',
  '음료',
  '만두/면류',
  '찌개/전골/스튜',
  '부침',
  '그라탕/리조또',
  '샌드위치/햄버거',
  '피자',
  '볶음',
  '커피',
  '디저트',
  '과일',
  '코스요리',
  '고기',
  '안주',
];

const services = ['친절', '구워줌', '주문제작', '배달'];

const atmospheres = [
  '차분',
  '아늑',
  '음악',
  '독특 컨셉',
  '뷰',
  '라이브 공연',
  '편안',
  '아기자기',
  '곡',
  '트렌디',
  '고급',
  '디자인',
  '프라이빗',
];

const amenities = ['주차', '환기', '야외공간', '냉난방', '화장실', '룸', '샐러드바', '휴게공간'];

const purposes = ['혼밥', '단체모임', '혼술', '아이동반', '반려동물', '선물'];

export default function FilterModal({
  isOpen,
  onClose,
  selectedTypes,
  selectedCategories,
  selectedServices,
  selectedAtmospheres,
  selectedAmenities,
  selectedPurposes,
  onTypeToggle,
  onCategoryToggle,
  onServiceToggle,
  onAtmosphereToggle,
  onAmenityToggle,
  onPurposeToggle,
  onReset,
  onApply,
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">고급 검색</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="닫기"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">유형</h3>
            <div className="flex flex-wrap gap-3">
              {cuisineTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => onTypeToggle(type)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedTypes.includes(type)
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-primary'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">음식 종류</h3>
            <div className="flex flex-wrap gap-3">
              {foodCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryToggle(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategories.includes(category)
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">서비스</h3>
            <div className="flex flex-wrap gap-3">
              {services.map((service) => (
                <button
                  key={service}
                  onClick={() => onServiceToggle(service)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedServices.includes(service)
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-primary'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">분위기</h3>
            <div className="flex flex-wrap gap-3">
              {atmospheres.map((atmosphere) => (
                <button
                  key={atmosphere}
                  onClick={() => onAtmosphereToggle(atmosphere)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedAtmospheres.includes(atmosphere)
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-primary'
                  }`}
                >
                  {atmosphere}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">편의시설</h3>
            <div className="flex flex-wrap gap-3">
              {amenities.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => onAmenityToggle(amenity)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedAmenities.includes(amenity)
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-primary'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">목적</h3>
            <div className="flex flex-wrap gap-3">
              {purposes.map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => onPurposeToggle(purpose)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedPurposes.includes(purpose)
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-primary'
                  }`}
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            전체 해제
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            식당 500개 보기
          </button>
        </div>
      </div>
    </div>
  );
}
