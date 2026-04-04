'use client';

import { useState } from 'react';
import BZWIcon from '@shared/ui/BZWIcon';
import { RECOMMENDED_JOBS, type JobCard } from './mock-data';

const FILTER_CHIPS = ['전체', 'IT·개발', '디자인', '기획·PM', '마케팅', '영업'];

function CompanyLogo({ job, size = 40 }: { job: JobCard; size?: number }) {
  return (
    <div
      className="rounded-8 flex items-center justify-center text-14 font-semibold shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: job.companyBgColor,
        color: job.companyTextColor,
      }}
    >
      {job.companyInitial}
    </div>
  );
}

function JobTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center h-20 px-6 rounded-4 bg-gray-50 text-11 font-semibold text-gray-500 border border-gray-100">
      {label}
    </span>
  );
}

export function JobFindRecommendation() {
  const [activeFilter, setActiveFilter] = useState('전체');
  const [scrapped, setScrapped] = useState<Set<string>>(new Set());

  function handleScrap(id: string) {
    setScrapped((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div data-jds-theme="jobkorea" className="bg-gray-50 min-h-screen">

      {/* 검색 바 */}
      <div className="bg-base-white px-16 pt-16 pb-12 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-8 bg-gray-50 border border-gray-200 rounded-999 px-14 h-40">
          <BZWIcon name="system_search" size="18" color="gray400" />
          <span className="text-14 font-regular text-gray-400">직무, 회사, 키워드 검색</span>
        </div>
      </div>

      {/* 개인화 배너 */}
      <div className="mx-16 mt-16 rounded-12 overflow-hidden mb-16">
        <div className="bg-blue-500 px-20 py-18">
          <p className="text-11 font-semibold text-blue-100 mb-4">SEG-01 · IT·개발 관심 직군</p>
          <h2 className="text-16 font-semibold text-base-white mb-2">김잡코 님 맞춤 공고</h2>
          <p className="text-12 font-regular text-blue-200">
            최근 행동 기반 {RECOMMENDED_JOBS.length}개 추천
          </p>
        </div>
      </div>

      {/* 필터 칩 */}
      <div
        className="flex gap-8 px-16 mb-16 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveFilter(chip)}
            className={`shrink-0 h-32 px-12 rounded-999 text-13 font-semibold border transition-colors ${
              activeFilter === chip
                ? 'bg-blue-500 text-base-white border-blue-500'
                : 'bg-base-white text-gray-600 border-gray-200'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between px-16 mb-12">
        <p className="text-13 font-semibold text-gray-700">
          추천 공고{' '}
          <span className="text-blue-500">{RECOMMENDED_JOBS.length}</span>
        </p>
        <span className="text-11 font-regular text-gray-300">광고 · CPC 스마트픽</span>
      </div>

      {/* 2열 그리드 */}
      <div className="grid grid-cols-2 gap-10 px-16 pb-80">
        {RECOMMENDED_JOBS.map((job) => (
          <JobCardGrid
            key={job.id}
            job={job}
            scrapped={scrapped.has(job.id)}
            onScrap={handleScrap}
          />
        ))}
      </div>
    </div>
  );
}

function JobCardGrid({ job, scrapped, onScrap }: {
  job: JobCard;
  scrapped: boolean;
  onScrap: (id: string) => void;
}) {
  return (
    <div
      className="relative bg-base-white rounded-12 border border-gray-100 p-14 flex flex-col"
      style={{ boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.07)' }}
    >
      {/* NEW 뱃지 */}
      {job.isNew && (
        <span className="absolute top-10 right-10 inline-flex items-center h-16 px-5 rounded-4 bg-blue-500 text-10 font-semibold text-base-white">
          NEW
        </span>
      )}

      {/* 로고 + 스크랩 */}
      <div className="flex items-start justify-between mb-10">
        <CompanyLogo job={job} size={40} />
        <button
          onClick={() => onScrap(job.id)}
          className="flex items-center justify-center w-28 h-28 -mr-2"
          aria-label={scrapped ? '스크랩 취소' : '스크랩'}
        >
          <BZWIcon
            name={scrapped ? 'system_favoritestar' : 'system_favoritestaro'}
            size="18"
            color={scrapped ? 'blue500' : 'gray300'}
          />
        </button>
      </div>

      {/* 회사명 */}
      <p className="text-11 font-regular text-gray-400 mb-2">{job.company}</p>

      {/* 공고명 */}
      <p className="text-13 font-semibold text-gray-950 leading-snug mb-6 line-clamp-2">
        {job.title}
      </p>

      {/* 지역·고용형태 */}
      <p className="text-11 font-regular text-gray-500 mb-2">
        {job.location} · {job.employType}
      </p>

      {/* 급여 */}
      <p className="text-12 font-semibold text-gray-700 mb-8">{job.salary}</p>

      {/* 태그 */}
      <div className="flex flex-wrap gap-4 mb-10">
        {job.tags.slice(0, 2).map((tag) => (
          <JobTag key={tag} label={tag} />
        ))}
      </div>

      {/* 하단: 추천 이유 + D-day */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-100 mt-auto">
        <span className="text-10 font-semibold text-blue-400 truncate pr-4">
          ✦ {job.reason}
        </span>
        <span className={`text-11 font-semibold shrink-0 ${job.isUrgent ? 'text-red-DEFAULT' : 'text-gray-400'}`}>
          {job.dDay}
        </span>
      </div>
    </div>
  );
}
