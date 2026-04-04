'use client';

import { useState } from 'react';

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  sub: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

interface ExperimentGroup {
  group: string;
  condition: string;
  exposureMethod: string;
  purpose: string;
  ctr: string;
  cvr: string;
  ratio: number;
  status: 'running' | 'baseline' | 'research';
}

interface SegData {
  seg: string;
  gender: string;
  age: string;
  feature: string;
  ctr: string;
  cvr: string;
  trend: 'up' | 'down' | 'neutral';
}

interface ModelStatus {
  name: string;
  type: string;
  cycle: string;
  status: 'active' | 'standby';
  description: string;
}

// ────────────────────────────────────────────────────────────
// Mock Data
// ────────────────────────────────────────────────────────────

const STAT_CARDS: StatCard[] = [
  { label: '인당 CPC 클릭 수', value: '1.24', sub: '클릭 수 / 유저 수', trend: 'up', trendValue: '+19.2%' },
  { label: 'CPC Revenue', value: '₩4,820만', sub: '클릭 수 × CPC 단가', trend: 'up', trendValue: '+12.4%' },
  { label: 'CPC CTR', value: '1.18%', sub: '지면 평균 (Guardrail)', trend: 'up', trendValue: '+0.14%p' },
  { label: '인당 자연 공고 조회수', value: '3.42', sub: 'CPC 외 공고 클릭/im_user', trend: 'neutral', trendValue: '±0.0%' },
];

const EXPERIMENT_GROUPS: ExperimentGroup[] = [
  {
    group: 'Control',
    condition: '기존 CPC 로직 유지',
    exposureMethod: '룰베이스 로직',
    purpose: 'Baseline 측정',
    ctr: '1.04%',
    cvr: '2.08%',
    ratio: 50,
    status: 'baseline',
  },
  {
    group: 'Treatment A',
    condition: 'MAB 추천 로직',
    exposureMethod: 'SEG 후보 필터링 + MAB 최적 선택',
    purpose: 'MAB×SEG 결합 효과 검증',
    ctr: '-',
    cvr: '-',
    ratio: 50,
    status: 'running',
  },
  {
    group: 'Treatment B',
    condition: 'Research',
    exposureMethod: 'N/A',
    purpose: '최종 통합 모델 효과 검증',
    ctr: '-',
    cvr: '-',
    ratio: 0,
    status: 'research',
  },
];

const SEG_DATA: SegData[] = [
  { seg: 'SEG-01', gender: '남성', age: '20대', feature: '신입·인턴, IT·공학 직무', ctr: '1.32%', cvr: '2.41%', trend: 'up' },
  { seg: 'SEG-02', gender: '여성', age: '20대', feature: '서비스·사무직, 브랜드 민감', ctr: '1.28%', cvr: '2.35%', trend: 'up' },
  { seg: 'SEG-03', gender: '남성', age: '30대', feature: '경력 이직, 연봉·복지 중심', ctr: '1.21%', cvr: '2.18%', trend: 'up' },
  { seg: 'SEG-04', gender: '여성', age: '30대', feature: '워라밸, 경력 복귀 수요', ctr: '1.19%', cvr: '2.12%', trend: 'neutral' },
  { seg: 'SEG-05', gender: '남성', age: '40대', feature: '관리직·전문직 이직, 안정성', ctr: '1.09%', cvr: '1.98%', trend: 'neutral' },
  { seg: 'SEG-06', gender: '여성', age: '40대', feature: '파트타임, 재취업 수요', ctr: '1.04%', cvr: '1.87%', trend: 'down' },
  { seg: 'SEG-07', gender: '남성', age: '50대 이상', feature: '중장년 전문직·컨설팅', ctr: '0.98%', cvr: '1.72%', trend: 'down' },
  { seg: 'SEG-08', gender: '여성', age: '50대 이상', feature: '시간제·요양·서비스직', ctr: '0.94%', cvr: '1.65%', trend: 'down' },
];

const MODELS: ModelStatus[] = [
  { name: 'CPC 통계 모델 (MAB)', type: 'MAB', cycle: '1일 1분 주기', status: 'active', description: 'Thompson Sampling 기반 공고 행동로그 + SEG 분류' },
  { name: 'POP-in', type: '인기공고', cycle: '1일 1시간 주기', status: 'active', description: '최근 직무 N개, 경력 기반 인기 테마 구성' },
  { name: 'Xsimgcl (공고-공고)', type: '유사공고', cycle: '1일 3회 주기', status: 'standby', description: '최신/지원순/조회순 다양한 테마 구성' },
  { name: 'Xsimgcl (유저-공고)', type: '유저공고', cycle: '1일 1시간 주기', status: 'standby', description: '정합성 높은 Fit한 추천 테마 구성' },
];

// ────────────────────────────────────────────────────────────
// Sub Components
// ────────────────────────────────────────────────────────────

function TrendBadge({ trend, value }: { trend: 'up' | 'down' | 'neutral'; value: string }) {
  if (trend === 'up') {
    return <span className="text-12 font-medium text-green-600 bg-green-50 px-6 py-2 rounded-4">{value}</span>;
  }
  if (trend === 'down') {
    return <span className="text-12 font-medium text-red-500 bg-red-50 px-6 py-2 rounded-4">{value}</span>;
  }
  return <span className="text-12 font-medium text-gray-500 bg-gray-100 px-6 py-2 rounded-4">{value}</span>;
}

function StatusBadge({ status }: { status: 'running' | 'baseline' | 'research' | 'active' | 'standby' }) {
  const map = {
    running: { label: '진행중', className: 'text-blue-600 bg-blue-50' },
    baseline: { label: 'Baseline', className: 'text-gray-600 bg-gray-100' },
    research: { label: 'Research', className: 'text-purple-600 bg-purple-50' },
    active: { label: '운영중', className: 'text-green-600 bg-green-50' },
    standby: { label: '대기', className: 'text-gray-500 bg-gray-100' },
  };
  const { label, className } = map[status];
  return (
    <span className={`text-12 font-medium px-6 py-2 rounded-4 ${className}`}>{label}</span>
  );
}

// ────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────

export function CpcRecommendationDashboard() {
  const [activeTab, setActiveTab] = useState<'experiment' | 'segment' | 'model'>('experiment');

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-40 h-[62px] border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-12">
          <h1 className="text-20 font-bold text-gray-900">CPC 공고추천 실험 현황</h1>
          <StatusBadge status="running" />
        </div>
        <div className="flex items-center gap-8 text-13 text-gray-500">
          <span>실험 기간</span>
          <span className="font-medium text-gray-800">2026.03.28 ~ 진행중</span>
          <span className="w-px h-12 bg-gray-200" />
          <span>노출 비율</span>
          <span className="font-medium text-gray-800">Control 50% / Treatment 50%</span>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-40 pt-24 pb-80">

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-16 mb-24">
          {STAT_CARDS.map((card) => (
            <div key={card.label} className="rounded-12 border border-bluegray-100 bg-white p-20">
              <p className="text-13 font-regular text-gray-500 mb-4">{card.label}</p>
              <p className="text-28 font-bold text-gray-900 mb-6">{card.value}</p>
              <div className="flex items-center justify-between">
                <span className="text-12 text-gray-400">{card.sub}</span>
                <TrendBadge trend={card.trend} value={card.trendValue} />
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 mb-20">
          {[
            { key: 'experiment', label: 'A/B 실험 그룹' },
            { key: 'segment', label: 'SEG별 성과' },
            { key: 'model', label: '추천 모델 현황' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-20 py-12 text-14 font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: A/B 실험 그룹 */}
        {activeTab === 'experiment' && (
          <div className="flex flex-col gap-16">
            {/* 실험 요약 callout */}
            <div className="rounded-12 bg-blue-50 border border-blue-100 px-20 py-16 text-13 text-blue-700">
              <span className="font-semibold">실험 단위</span> : 유저(mem_sys_no) 단위 SEG별 배정 &nbsp;·&nbsp;
              <span className="font-semibold">최소 기간</span> : 1주 (MAB 수렴 안정화) &nbsp;·&nbsp;
              <span className="font-semibold">실험 지면</span> : 모바일 메인 CPC 영역
            </div>

            {/* Experiment Groups */}
            <div className="rounded-12 border border-bluegray-100 bg-white overflow-hidden">
              <div
                className="grid text-13 font-medium text-gray-500 bg-gray-50 border-b border-gray-100 px-20 py-12"
                style={{ gridTemplateColumns: '100px 1fr 1fr 1fr 80px 80px 80px' }}
              >
                <span>그룹</span>
                <span>조건</span>
                <span>노출 방식</span>
                <span>목적</span>
                <span className="text-center">CTR</span>
                <span className="text-center">CVR</span>
                <span className="text-center">상태</span>
              </div>
              {EXPERIMENT_GROUPS.map((g, i) => (
                <div
                  key={g.group}
                  className={`grid items-center px-20 py-16 text-14 ${i !== EXPERIMENT_GROUPS.length - 1 ? 'border-b border-gray-100' : ''}`}
                  style={{ gridTemplateColumns: '100px 1fr 1fr 1fr 80px 80px 80px' }}
                >
                  <span className="font-semibold text-gray-900">{g.group}</span>
                  <span className="text-gray-700">{g.condition}</span>
                  <span className="text-gray-600 text-13">{g.exposureMethod}</span>
                  <span className="text-gray-600 text-13">{g.purpose}</span>
                  <span className={`text-center font-semibold ${g.ctr !== '-' ? 'text-gray-900' : 'text-gray-400'}`}>{g.ctr}</span>
                  <span className={`text-center font-semibold ${g.cvr !== '-' ? 'text-gray-900' : 'text-gray-400'}`}>{g.cvr}</span>
                  <div className="flex justify-center">
                    <StatusBadge status={g.status} />
                  </div>
                </div>
              ))}
            </div>

            {/* Pre-mortem */}
            <div className="rounded-12 border border-yellow-100 bg-yellow-50 p-20">
              <p className="text-14 font-semibold text-yellow-800 mb-12">⚠️ Pre-mortem 리스크</p>
              <div className="flex flex-col gap-8">
                {[
                  { title: 'MAB 수렴 지연', desc: '초기 탐색 기간(1주 이내) CTR이 낮게 나올 수 있음 → 단기 지표보다 2주 이후 추세로 판단' },
                  { title: 'SEG 분류 오류', desc: 'SEG 기준이 공고 선호도를 충분히 반영 못할 경우 MAB 스코어링 왜곡 → SEG별 CTR을 Support Metric으로 모니터링' },
                  { title: '행동 이력 부족 유저', desc: '추천불가 회원 비율이 높은 경우 Treatment 효과 희석 → 유저 Seg그룹 분석 병행' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-8 text-13">
                    <span className="font-semibold text-yellow-800 shrink-0">{item.title}</span>
                    <span className="text-yellow-700">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: SEG별 성과 */}
        {activeTab === 'segment' && (
          <div className="rounded-12 border border-bluegray-100 bg-white overflow-hidden">
            <div
              className="grid text-13 font-medium text-gray-500 bg-gray-50 border-b border-gray-100 px-20 py-12"
              style={{ gridTemplateColumns: '80px 60px 100px 1fr 90px 90px 80px' }}
            >
              <span>세그먼트</span>
              <span>성별</span>
              <span>나이대</span>
              <span>주요 특성</span>
              <span className="text-center">CTR</span>
              <span className="text-center">CVR</span>
              <span className="text-center">추세</span>
            </div>
            {SEG_DATA.map((seg, i) => (
              <div
                key={seg.seg}
                className={`grid items-center px-20 py-14 text-14 ${i !== SEG_DATA.length - 1 ? 'border-b border-gray-100' : ''}`}
                style={{ gridTemplateColumns: '80px 60px 100px 1fr 90px 90px 80px' }}
              >
                <span className="font-semibold text-blue-600">{seg.seg}</span>
                <span className="text-gray-700">{seg.gender}</span>
                <span className="text-gray-600">{seg.age}</span>
                <span className="text-gray-600 text-13">{seg.feature}</span>
                <span className="text-center font-semibold text-gray-900">{seg.ctr}</span>
                <span className="text-center font-semibold text-gray-900">{seg.cvr}</span>
                <div className="flex justify-center">
                  <TrendBadge
                    trend={seg.trend}
                    value={seg.trend === 'up' ? '↑' : seg.trend === 'down' ? '↓' : '—'}
                  />
                </div>
              </div>
            ))}
            <div className="px-20 py-12 bg-gray-50 border-t border-gray-100 text-12 text-gray-500">
              * 나이 미입력 시 SEG 미분류 → Fallback(전체 인기공고) 적용
            </div>
          </div>
        )}

        {/* Tab: 추천 모델 현황 */}
        {activeTab === 'model' && (
          <div className="grid grid-cols-2 gap-16">
            {MODELS.map((model) => (
              <div key={model.name} className="rounded-12 border border-bluegray-100 bg-white p-24">
                <div className="flex items-start justify-between mb-12">
                  <div>
                    <p className="text-15 font-bold text-gray-900">{model.name}</p>
                    <p className="text-13 text-gray-500 mt-2">{model.type}</p>
                  </div>
                  <StatusBadge status={model.status} />
                </div>
                <p className="text-13 text-gray-600 mb-16">{model.description}</p>
                <div className="flex items-center gap-6 text-12 text-gray-500 bg-gray-50 rounded-8 px-12 py-8">
                  <span className="font-medium">학습/추론 주기</span>
                  <span className="text-gray-400">·</span>
                  <span>{model.cycle}</span>
                </div>
              </div>
            ))}

            {/* 스코어링 공식 */}
            <div className="col-span-2 rounded-12 border border-bluegray-100 bg-white p-24">
              <p className="text-14 font-semibold text-gray-800 mb-16">최종 스코어링 공식</p>
              <div className="rounded-8 bg-gray-900 text-gray-100 p-20 font-mono text-13 leading-loose">
                <p>Final Score = α × 관련도_score + β × eCTR + γ × Thompson_sample</p>
                <p className="text-gray-400 mt-4 ml-20">→ 관련도_score = SEG 매칭도 + 직무코드 매칭도 + 유저 행동 유사도</p>
                <p className="text-gray-500 mt-8 text-12">α · β · γ 가중치는 A/B 테스트를 통해 확정</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
