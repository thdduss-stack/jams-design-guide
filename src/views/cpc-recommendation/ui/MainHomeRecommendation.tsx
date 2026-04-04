'use client';

import { useState } from 'react';
import BZWIcon from '@shared/ui/BZWIcon';
import { RECOMMENDED_JOBS, type JobCard } from './mock-data';

function CompanyLogo({ job, size = 48 }: { job: JobCard; size?: number }) {
  return (
    <div
      className="rounded-8 flex items-center justify-center text-16 font-semibold shrink-0"
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

function ScrapButton({ jobId, scrapped, onToggle }: {
  jobId: string;
  scrapped: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(jobId)}
      className="flex items-center justify-center w-32 h-32"
      aria-label={scrapped ? '스크랩 취소' : '스크랩'}
    >
      <BZWIcon
        name={scrapped ? 'system_favoritestar' : 'system_favoritestaro'}
        size="20"
        color={scrapped ? 'blue500' : 'gray300'}
      />
    </button>
  );
}

function JobTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center h-20 px-6 rounded-4 bg-gray-50 text-11 font-semibold text-gray-500 border border-gray-100">
      {label}
    </span>
  );
}

function RecommendBadge({ reason }: { reason: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-11 font-semibold text-blue-500">
      <span className="text-blue-300">✦</span>
      {reason}
    </span>
  );
}

export function MainHomeRecommendation() {
  const [scrapped, setScrapped] = useState<Set<string>>(
    new Set(RECOMMENDED_JOBS.filter((j) => j.isScrapped).map((j) => j.id))
  );

  function handleScrap(id: string) {
    setScrapped((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div data-jds-theme="jobkorea" className="bg-base-white">
      {/* Section Header */}
      <div className="flex items-center justify-between px-16 pt-24 pb-14">
        <div className="flex flex-col gap-2">
          <span className="text-11 font-semibold text-blue-500">AI 맞춤 추천</span>
          <h2 className="text-18 font-semibold text-gray-950">김잡코 님을 위한 공고</h2>
        </div>
        <button className="flex items-center gap-4 text-13 font-medium text-gray-500">
          전체보기
          <BZWIcon name="system_arrowrightf" size="16" color="gray400" />
        </button>
      </div>

      {/* Horizontal Scroll */}
      <div
        className="flex gap-12 px-16 pb-20 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        {RECOMMENDED_JOBS.map((job) => (
          <JobCardHorizontal
            key={job.id}
            job={job}
            scrapped={scrapped.has(job.id)}
            onScrap={handleScrap}
          />
        ))}
      </div>

      {/* Ad Disclosure */}
      <div className="flex items-center gap-4 px-16 pb-16">
        <span className="text-11 font-regular text-gray-300">광고</span>
        <span className="text-gray-200">·</span>
        <span className="text-11 font-regular text-gray-300">CPC 스마트픽</span>
      </div>

      <div className="h-8 bg-gray-50" />
    </div>
  );
}

function JobCardHorizontal({ job, scrapped, onScrap }: {
  job: JobCard;
  scrapped: boolean;
  onScrap: (id: string) => void;
}) {
  return (
    <div
      className="relative shrink-0 w-[196px] rounded-12 bg-base-white border border-gray-100 p-16 flex flex-col gap-0"
      style={{ boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.07)' }}
    >
      {/* NEW 뱃지 */}
      {job.isNew && (
        <span className="absolute top-12 left-12 inline-flex items-center h-16 px-5 rounded-4 bg-blue-500 text-10 font-semibold text-base-white">
          NEW
        </span>
      )}

      {/* 로고 + 스크랩 */}
      <div className="flex items-start justify-between mb-12">
        <CompanyLogo job={job} size={44} />
        <ScrapButton jobId={job.id} scrapped={scrapped} onToggle={onScrap} />
      </div>

      {/* 회사명 */}
      <p className="text-12 font-regular text-gray-500 mb-2">{job.company}</p>

      {/* 공고명 */}
      <p className="text-14 font-semibold text-gray-950 leading-snug mb-8 line-clamp-2">
        {job.title}
      </p>

      {/* 지역·고용형태 */}
      <p className="text-12 font-regular text-gray-500 mb-2">
        {job.location} · {job.employType}
      </p>

      {/* 급여 */}
      <p className="text-12 font-semibold text-gray-700 mb-10">{job.salary}</p>

      {/* 태그 */}
      <div className="flex flex-wrap gap-4 mb-12">
        {job.tags.slice(0, 2).map((tag) => (
          <JobTag key={tag} label={tag} />
        ))}
      </div>

      {/* 하단: 추천 이유 + D-day */}
      <div className="flex items-center justify-between pt-10 border-t border-gray-100 mt-auto">
        <RecommendBadge reason={job.reason} />
        <span
          className={`text-11 font-semibold shrink-0 ${job.isUrgent ? 'text-red-DEFAULT' : 'text-gray-400'}`}
        >
          {job.dDay}
        </span>
      </div>
    </div>
  );
}
