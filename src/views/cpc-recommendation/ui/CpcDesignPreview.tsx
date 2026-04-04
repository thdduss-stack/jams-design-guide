'use client';

import { useState } from 'react';
import { MainHomeRecommendation } from './MainHomeRecommendation';
import { JobViewRecommendation } from './JobViewRecommendation';
import { JobFindRecommendation } from './JobFindRecommendation';

const SCREENS = [
  { key: 'home', label: '메인 홈', sub: '추천 공고 섹션' },
  { key: 'jobview', label: '공고 뷰', sub: '유사 공고 하단' },
  { key: 'jobfind', label: 'JOB찾기', sub: '맞춤 공고 그리드' },
] as const;

type ScreenKey = (typeof SCREENS)[number]['key'];

const SPEC_ITEMS = [
  { label: '상품', value: 'CPC 스마트픽' },
  { label: '추천 모델', value: 'MAB + Thompson Sampling' },
  { label: '1순위', value: '최근 입사지원 공고' },
  { label: '2순위', value: '최근 스크랩 공고' },
  { label: '3순위', value: '희망 직무 / 지역' },
  { label: '4순위', value: '최근 조회 공고' },
  { label: '개인화', value: 'SEG-01~08 분류' },
  { label: '디자인 시스템', value: 'CommJAMS JK' },
];

export function CpcDesignPreview() {
  const [active, setActive] = useState<ScreenKey>('home');

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#0F0F1A' }}>

      {/* 왼쪽 패널 */}
      <div className="w-[264px] shrink-0 flex flex-col gap-4 p-28 border-r" style={{ borderColor: '#ffffff12' }}>
        <div className="mb-20">
          <p className="text-12 font-semibold mb-6" style={{ color: '#5C9BFF' }}>
            JK CPC 공고추천 PRD
          </p>
          <h1 className="text-20 font-semibold text-base-white leading-snug">
            스마트픽<br />UI 디자인
          </h1>
        </div>

        <p className="text-11 font-semibold mb-8" style={{ color: '#ffffff50' }}>
          지면 선택
        </p>

        {SCREENS.map((screen, i) => (
          <button
            key={screen.key}
            onClick={() => setActive(screen.key)}
            className="flex items-center gap-12 text-left px-16 py-14 rounded-8 transition-all"
            style={{
              backgroundColor: active === screen.key ? '#1B55F6' : 'transparent',
              border: `1px solid ${active === screen.key ? '#1B55F6' : '#ffffff15'}`,
            }}
          >
            <span
              className="text-13 font-semibold shrink-0"
              style={{ color: active === screen.key ? '#fff' : '#ffffff50' }}
            >
              0{i + 1}
            </span>
            <div>
              <p
                className="text-14 font-semibold"
                style={{ color: active === screen.key ? '#fff' : '#ffffffCC' }}
              >
                {screen.label}
              </p>
              <p
                className="text-12 font-regular mt-1"
                style={{ color: active === screen.key ? '#93BBFF' : '#ffffff40' }}
              >
                {screen.sub}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* 폰 프레임 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-16">
          {/* 상단 라벨 */}
          <div className="flex items-center gap-8">
            <span className="text-12 font-semibold" style={{ color: '#ffffff50' }}>
              {SCREENS.find((s) => s.key === active)?.label}
            </span>
            <span style={{ color: '#ffffff20' }}>·</span>
            <span className="text-12 font-regular" style={{ color: '#ffffff30' }}>
              375 × 812 · CommJAMS JK
            </span>
          </div>

          {/* 폰 껍데기 */}
          <div
            className="relative rounded-[44px] p-[10px]"
            style={{
              backgroundColor: '#1A1A1A',
              boxShadow: '0 0 0 1px #333, 0 40px 80px rgba(0,0,0,0.8), inset 0 1px 0 #444',
              width: 397,
            }}
          >
            {/* 스크린 */}
            <div className="rounded-[36px] overflow-hidden bg-base-white" style={{ width: 375, height: 780 }}>
              {/* 상태바 */}
              <div className="flex items-center justify-between px-24 pt-14 pb-10 bg-base-white relative">
                <span className="text-12 font-semibold text-gray-950">9:41</span>
                {/* 다이나믹 아일랜드 */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-[14px] rounded-999 bg-gray-950"
                  style={{ width: 120, height: 34 }}
                />
                <div className="flex items-center gap-4">
                  <div className="flex items-end gap-1 h-12">
                    {[4, 7, 10, 12].map((h, i) => (
                      <div
                        key={i}
                        className="w-[3px] rounded-[1px] bg-gray-950"
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                  <span className="text-12 font-semibold text-gray-950">100%</span>
                </div>
              </div>

              {/* 콘텐츠 */}
              <div className="overflow-y-auto overflow-x-hidden" style={{ height: 736 }}>
                {/* 탭바 (홈 + JOB찾기) */}
                {(active === 'home' || active === 'jobfind') && (
                  <div className="bg-base-white border-b border-gray-100">
                    <div className="flex">
                      {['홈', 'JOB찾기', '인재검색', '지원현황', '내정보'].map((tab) => (
                        <div
                          key={tab}
                          className="flex-1 flex items-center justify-center py-12 text-11 font-semibold"
                          style={{
                            color:
                              (tab === '홈' && active === 'home') ||
                              (tab === 'JOB찾기' && active === 'jobfind')
                                ? '#1B55F6'
                                : '#86919A',
                            borderBottom:
                              (tab === '홈' && active === 'home') ||
                              (tab === 'JOB찾기' && active === 'jobfind')
                                ? '2px solid #1B55F6'
                                : '2px solid transparent',
                          }}
                        >
                          {tab}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 화면 콘텐츠 */}
                {active === 'home' && (
                  <>
                    {/* 홈 배너 */}
                    <div
                      className="mx-16 mt-16 rounded-12 flex items-center justify-center"
                      style={{ height: 120, backgroundColor: '#F4F6F7' }}
                    >
                      <span className="text-12 font-regular text-gray-400">메인 배너</span>
                    </div>
                    <MainHomeRecommendation />
                  </>
                )}
                {active === 'jobview' && <JobViewRecommendation />}
                {active === 'jobfind' && <JobFindRecommendation />}
              </div>
            </div>

            {/* 홈 인디케이터 */}
            <div className="flex justify-center py-8">
              <div className="w-32 h-4 rounded-999 bg-gray-950" style={{ opacity: 0.3 }} />
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 스펙 패널 */}
      <div
        className="w-[220px] shrink-0 flex flex-col p-28 gap-16 border-l"
        style={{ borderColor: '#ffffff12' }}
      >
        <p className="text-11 font-semibold mb-4" style={{ color: '#ffffff50' }}>
          PRD 스펙
        </p>
        {SPEC_ITEMS.map((item) => (
          <div key={item.label}>
            <p className="text-11 font-regular mb-2" style={{ color: '#ffffff35' }}>
              {item.label}
            </p>
            <p className="text-12 font-semibold" style={{ color: '#ffffffCC' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
