'use client';

import { useState } from 'react';
import { Button } from '@jds/theme';
import BZWIcon from '@shared/ui/BZWIcon';
import { SIMILAR_JOBS, RECOMMENDED_JOBS, type JobCard } from './mock-data';

const currentJob = RECOMMENDED_JOBS[0];

function CompanyLogo({ job, size = 48 }: { job: JobCard; size?: number }) {
  return (
    <div
      className="rounded-8 flex items-center justify-center text-15 font-semibold shrink-0"
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

export function JobViewRecommendation() {
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

      {/* 현재 공고 카드 */}
      <div className="bg-base-white px-16 pt-20 pb-20 mb-8">
        <div className="flex items-center gap-6 mb-12">
          <span className="inline-flex items-center h-20 px-6 rounded-4 bg-blue-50 text-11 font-semibold text-blue-500 border border-blue-100">
            {currentJob.employType}
          </span>
          <span
            className="text-11 font-semibold"
            style={{ color: '#f37676' }}
          >
            {currentJob.dDay} 마감
          </span>
        </div>

        <h1 className="text-18 font-semibold text-gray-950 mb-4">{currentJob.title}</h1>
        <p className="text-14 font-regular text-gray-500 mb-6">
          {currentJob.company} · {currentJob.location} · {currentJob.salary}
        </p>

        <div className="flex gap-4 mb-16">
          {currentJob.tags.map((tag) => (
            <JobTag key={tag} label={tag} />
          ))}
        </div>

        <div className="flex gap-8">
          <Button
            variant="outlined"
            size="40"
            color="primary"
            className="flex-1"
          >
            스크랩
          </Button>
          <Button
            variant="contained"
            size="40"
            color="primary"
            className="flex-[2]"
          >
            지원하기
          </Button>
        </div>
      </div>

      {/* 유사 공고 섹션 */}
      <div className="bg-base-white">
        <div className="flex items-center justify-between px-16 pt-20 pb-14 border-b border-gray-100">
          <div>
            <span className="text-11 font-semibold text-blue-500 block mb-2">AI 유사 추천</span>
            <h2 className="text-16 font-semibold text-gray-950">이 공고와 비슷한 공고</h2>
          </div>
          <span className="text-11 font-regular text-gray-300">광고</span>
        </div>

        <div className="divide-y divide-gray-50">
          {SIMILAR_JOBS.map((job) => (
            <SimilarJobRow
              key={job.id}
              job={job}
              scrapped={scrapped.has(job.id)}
              onScrap={handleScrap}
            />
          ))}
        </div>

        <div className="px-16 py-12">
          <Button variant="outlined" size="40" color="primary" className="w-full">
            유사 공고 더보기
          </Button>
        </div>
      </div>
    </div>
  );
}

function SimilarJobRow({ job, scrapped, onScrap }: {
  job: JobCard;
  scrapped: boolean;
  onScrap: (id: string) => void;
}) {
  return (
    <div className="flex items-start gap-12 px-16 py-16">
      <CompanyLogo job={job} size={44} />

      <div className="flex-1 min-w-0">
        <p className="text-12 font-regular text-gray-500 mb-2">{job.company}</p>
        <p className="text-14 font-semibold text-gray-950 mb-6 truncate">{job.title}</p>
        <div className="flex items-center gap-6 mb-6">
          <span className="text-12 font-regular text-gray-500">{job.location}</span>
          <span className="w-px h-10 bg-gray-200" />
          <span className="text-12 font-regular text-gray-500">{job.employType}</span>
          <span className="w-px h-10 bg-gray-200" />
          <span className="text-12 font-semibold text-gray-700">{job.salary}</span>
        </div>
        <div className="flex gap-4">
          {job.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center h-20 px-6 rounded-4 bg-gray-50 text-11 font-semibold text-gray-500 border border-gray-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end gap-10 shrink-0 pt-2">
        <button
          onClick={() => onScrap(job.id)}
          className="flex items-center justify-center"
          aria-label={scrapped ? '스크랩 취소' : '스크랩'}
        >
          <BZWIcon
            name={scrapped ? 'system_favoritestar' : 'system_favoritestaro'}
            size="20"
            color={scrapped ? 'blue500' : 'gray300'}
          />
        </button>
        <span className={`text-11 font-semibold ${job.isUrgent ? 'text-red-DEFAULT' : 'text-gray-400'}`}>
          {job.dDay}
        </span>
      </div>
    </div>
  );
}
