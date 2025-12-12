import Header from '../components/Header';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            서비스 소개
          </h1>

          <div className="space-y-12">
            <section>
              <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                맛.zip은 여러분이 원하는 맛집을 빠르고 쉽게 찾을 수 있도록 도와주는
                혁신적인 음식점 검색 서비스입니다. 지역별, 음식 종류별로 다양한
                맛집 정보를 제공하며, 사용자의 위치 기반으로 가까운 맛집을
                추천해드립니다.
              </p>
            </section>

            <section className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  주요 기능
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>지역별, 음식 종류별 맛집 검색</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>실시간 위치 기반 맛집 추천</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>상세한 음식점 정보 및 리뷰</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>지도 기반 검색 결과 확인</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>최근 검색 기록 자동 저장</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  데이터 보안
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  사용자의 개인정보와 위치 정보는 안전하게 보호됩니다. 모든
                  데이터는 암호화되어 전송되며, 사용자가 직접 권한을 관리할 수
                  있습니다.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  위치 정보는 맛집 검색과 추천에만 사용되며, 제3자와 공유되지
                  않습니다.
                </p>
              </div>
            </section>

            <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                이용 방법
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    1
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    검색하기
                  </h3>
                  <p className="text-gray-600 text-sm">
                    원하는 지역이나 음식 종류를 검색창에 입력하세요
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    2
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    결과 확인
                  </h3>
                  <p className="text-gray-600 text-sm">
                    검색 결과를 목록이나 지도에서 확인하세요
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    3
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    상세 정보
                  </h3>
                  <p className="text-gray-600 text-sm">
                    음식점을 선택하여 상세 정보를 확인하세요
                  </p>
                </div>
              </div>
            </section>

            <section className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">문의하기</h2>
              <p className="text-gray-700 mb-4">
                서비스 이용 중 궁금한 점이나 문의사항이 있으시면 언제든지
                연락주세요.
              </p>
              <a
                href="mailto:contact@matzip.com"
                className="text-primary hover:text-primary/80 font-semibold"
              >
                contact@matzip.com
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
