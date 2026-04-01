'use client';

import { useState } from 'react';
import BZWIcon from '@shared/ui/BZWIcon';
import { Button, SelectBox, TextField } from '@jds/theme';
import DeviceMockup from './DeviceMockup';
import TierBadge from './TierBadge';

/* ──────────────────────── 데이터 ──────────────────────── */

const MAIN_PRODUCTS = [
  {
    id: 'premier',
    tier: 'premier' as const,
    tierLabel: 'PREMIER',
    name: '프리미어 채용관',
    description: '잡코리아 메인 최상단 독점 노출',
    price: '1,980,000',
    period: '전담 컨설턴트 구매',
    features: ['메인 최상단 독점', 'Top 헤드라인 포함', '점프업 12회/일', '전담 컨설턴트 배정'],
    popular: false,
    highlight: true,
  },
  {
    id: 'first-vvip',
    tier: 'vvip' as const,
    tierLabel: 'First VVIP',
    name: 'First VVIP 채용관',
    description: 'PC + 모바일 동시 상단 노출',
    price: '1,540,000',
    period: '2~30일',
    features: ['PC+모바일 메인 노출', 'Top 헤드라인 포함', '점프업 12회/일', '모바일 결합 할인'],
    popular: true,
    highlight: false,
  },
  {
    id: 'vip',
    tier: 'vip' as const,
    tierLabel: 'VIP',
    name: 'VIP 채용관',
    description: 'PC + 모바일 메인 노출',
    price: '1,067,900',
    period: '2~30일',
    features: ['PC+모바일 메인 노출', '헤드라인 포함', '점프업 8회/일', '7일 이상 할인'],
    popular: false,
    highlight: false,
  },
  {
    id: 'excellent',
    tier: 'excellent' as const,
    tierLabel: 'EXCELLENT',
    name: 'Excellent 채용관',
    description: 'PC + 모바일 합리적 노출',
    price: '508,000',
    period: '2~30일',
    features: ['PC+모바일 메인 노출', '점프업 4회/일', '모바일 결합 할인', '합리적 가격'],
    popular: false,
    highlight: false,
  },
];

const MAX_PRODUCTS = [
  { name: '[MAX] TOP 헤드라인 채용관', price: '211,200', jumpUp: 12 },
  { name: '[MAX] 헤드라인 플러스 채용관', price: '176,000', jumpUp: 10 },
  { name: '[MAX] 헤드라인 채용관', price: '140,800', jumpUp: 8 },
  { name: '[MAX] 추천 플러스 채용관', price: '123,200', jumpUp: 8 },
  { name: '[MAX] 추천 채용관', price: '105,600', jumpUp: 6 },
  { name: '[MAX] 핵심 플러스 채용관', price: '88,000', jumpUp: 6 },
  { name: '[MAX] 핵심 채용관', price: '70,400', jumpUp: 6 },
];

const CATEGORY_PRODUCTS = [
  { name: 'TOP 헤드라인 채용관', price: '110,000', jumpUp: 12 },
  { name: '헤드라인 플러스 채용관', price: '93,500', jumpUp: 10 },
  { name: '헤드라인 채용관', price: '77,000', jumpUp: 8 },
  { name: '추천 플러스 채용관', price: '66,000', jumpUp: 8 },
  { name: '추천 채용관', price: '55,000', jumpUp: 6 },
  { name: '핵심 플러스 채용관', price: '49,500', jumpUp: 6 },
  { name: '핵심 채용관', price: '44,000', jumpUp: 6 },
];

const JUMPUP_OPTIONS = [
  { count: 3, price: '30,800', description: '기본 점프업' },
  { count: 6, price: '38,500', description: '효율 점프업' },
  { count: 12, price: '49,500', description: '집중 점프업' },
];

const NAV_ITEMS = [
  { id: 'main', label: '메인 채용관' },
  { id: 'max', label: 'MAX 결합상품' },
  { id: 'category', label: '직무·산업' },
  { id: 'region', label: '지역' },
  { id: 'jumpup', label: '점프업' },
];

/* ──────────────────────── 컴포넌트 ──────────────────────── */

export default function CompanyOptionPage() {
  const [activeNav, setActiveNav] = useState('main');

  const handleScrollTo = (id: string) => {
    setActiveNav(id);
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='min-w-[1038px] bg-base-white'>
      {/* ── Hero Section ── */}
      <HeroSection />

      {/* ── Sticky Navigation ── */}
      <nav className='sticky top-0 z-10 border-b border-gray-200 bg-base-white'>
        <div className='mx-auto flex max-w-[960px] items-center gap-0 px-40'>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              type='button'
              className={`border-b-2 px-24 py-16 text-14 font-semibold transition-colors ${
                activeNav === item.id
                  ? 'border-blue-700 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => handleScrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Main Products Section ── */}
      <section className='mx-auto max-w-[960px] px-40 pb-80 pt-80' id='section-main'>
        <SectionHeader
          description='PC와 모바일 상단에 동시 노출되어 최대의 효과를 경험하세요'
          subtitle='잡코리아 메인 + 모바일 웹/앱 메인 동시 노출'
          title='메인 채용관 상품'
        />

        {/* Device Mockup */}
        <div className='mt-48 flex items-center justify-center gap-32 rounded-16 bg-gray-50 p-40'>
          <div className='w-[280px]'>
            <DeviceMockup highlightArea='top' label='PC 메인' type='pc' />
          </div>
          <div className='w-[110px]'>
            <DeviceMockup highlightArea='top' label='모바일 메인' type='mobile' />
          </div>
        </div>

        {/* Product Cards */}
        <div className='mt-40 grid grid-cols-2 gap-20'>
          {MAIN_PRODUCTS.map(product => (
            <MainProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── MAX Products Section ── */}
      <section className='bg-gray-50' id='section-max'>
        <div className='mx-auto max-w-[960px] px-40 py-80'>
          <SectionHeader
            description='직무와 근무지를 결합하여 더 정확한 타겟에게 도달하세요'
            subtitle='직무·산업 + 근무지 지역 동시 노출로 타겟 채용'
            title='[MAX] 직무·산업 & 근무지 지역 결합 상품'
          />

          <div className='mt-48 flex items-center justify-center gap-32 rounded-16 border border-bluegray-100 bg-base-white p-40'>
            <div className='w-[240px]'>
              <DeviceMockup highlightArea='middle' label='PC 직무·지역' type='pc' />
            </div>
            <div className='w-[100px]'>
              <DeviceMockup highlightArea='middle' label='모바일' type='mobile' />
            </div>
          </div>

          <div className='mt-32'>
            <ProductTable products={MAX_PRODUCTS} tierType='max' />
          </div>
        </div>
      </section>

      {/* ── Category Products Section ── */}
      <section className='mx-auto max-w-[960px] px-40 py-80' id='section-category'>
        <SectionHeader
          description='PC와 모바일 직무·산업 리스트에 노출되는 상품입니다'
          subtitle='잡코리아 직무·산업 + 모바일 웹/앱 직무·산업 동시 노출'
          title='직무·산업 전용 상품'
        />

        <div className='mt-48 flex items-center justify-center gap-32 rounded-16 bg-gray-50 p-40'>
          <div className='w-[240px]'>
            <DeviceMockup highlightArea='middle' label='PC 직무·산업' type='pc' />
          </div>
          <div className='w-[100px]'>
            <DeviceMockup highlightArea='middle' label='모바일' type='mobile' />
          </div>
        </div>

        <div className='mt-32'>
          <ProductTable products={CATEGORY_PRODUCTS} tierType='standard' />
        </div>
      </section>

      {/* ── Region Products Section ── */}
      <section className='bg-gray-50' id='section-region'>
        <div className='mx-auto max-w-[960px] px-40 py-80'>
          <SectionHeader
            description='PC와 모바일 지역 리스트에 노출되는 상품입니다'
            subtitle='잡코리아 지역 + 모바일 웹/앱 지역 동시 노출'
            title='지역 전용 상품'
          />

          <div className='mt-48 flex items-center justify-center gap-32 rounded-16 border border-bluegray-100 bg-base-white p-40'>
            <div className='w-[240px]'>
              <DeviceMockup highlightArea='bottom' label='PC 지역' type='pc' />
            </div>
            <div className='w-[100px]'>
              <DeviceMockup highlightArea='middle' label='모바일' type='mobile' />
            </div>
          </div>

          <div className='mt-32'>
            <ProductTable products={CATEGORY_PRODUCTS} tierType='standard' />
          </div>
        </div>
      </section>

      {/* ── Jump-up Section ── */}
      <section className='mx-auto max-w-[960px] px-40 py-80' id='section-jumpup'>
        <SectionHeader
          description='PC와 모바일 리스트 상단으로 점프업하여 노출 효과를 극대화하세요'
          subtitle='잡코리아 + 모바일 웹/앱 채용정보 리스트 동시 노출'
          title='점프업 상품'
        />

        <div className='mt-48 grid grid-cols-3 gap-24'>
          {JUMPUP_OPTIONS.map(option => (
            <JumpUpCard key={option.count} option={option} />
          ))}
        </div>

        <div className='mt-32 flex items-start gap-12 rounded-12 bg-blue-50 p-24'>
          <BZWIcon color='blue700' name='system_info' size='20' />
          <div className='flex flex-col gap-4'>
            <span className='text-14 font-semibold text-gray-900'>점프업 안내</span>
            <span className='text-13 font-regular text-gray-700'>
              무료공고 리스트에서 PC/모바일 동시 점프업되며, 채용속보에 랜덤으로 노출됩니다.
            </span>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <CtaSection />

      {/* ── Inquiry Section ── */}
      <InquirySection />

      {/* ── Footer ── */}
      <FooterSection />
    </div>
  );
}

/* ──────────────────────── Sub Components ──────────────────────── */

function HeroSection() {
  return (
    <section className='relative overflow-hidden bg-blue-900'>
      {/* Background decoration */}
      <div className='absolute inset-0'>
        <div className='absolute right-[-50px] top-[-100px] h-[500px] w-[500px] rounded-999 bg-blue-800 opacity-30' />
        <div className='absolute bottom-[-80px] left-[-100px] h-[400px] w-[400px] rounded-999 bg-blue-850 opacity-20' />
        <div className='absolute left-[40%] top-[50px] h-[200px] w-[200px] rounded-999 bg-blue-700 opacity-10' />
      </div>

      <div className='relative mx-auto max-w-[960px] px-40 py-80'>
        <div className='flex items-center gap-60'>
          {/* Text content */}
          <div className='flex flex-1 flex-col gap-24'>
            <div className='flex items-center gap-8'>
              <span className='rounded-999 bg-base-white px-12 py-4 text-12 font-bold text-blue-700'>채용광고</span>
              <span className='text-14 font-regular text-blue-200'>효과적인 인재 채용의 시작</span>
            </div>
            <h1 className='text-36 font-bold text-base-white'>
              당신의 채용공고를
              <br />
              가장 먼저 보이게 하세요
            </h1>
            <p className='max-w-[440px] text-16 font-regular text-blue-200'>
              PC와 모바일에 동시 노출되는 채용광고 상품으로 우수 인재를 빠르게 확보하세요. 규모와 예산에 맞는 다양한
              상품을 제공합니다.
            </p>
            <div className='mt-8 flex gap-12'>
              <Button color='secondery' size='48' variant='contained'>
                상품 둘러보기
              </Button>
              <Button color='primary' size='48' variant='outlined'>
                상품 문의하기
              </Button>
            </div>
          </div>

          {/* Hero illustration */}
          <div className='flex shrink-0 items-end gap-16'>
            <div className='w-[260px] opacity-90'>
              <DeviceMockup highlightArea='top' type='pc' />
            </div>
            <div className='mb-16 w-[100px] opacity-90'>
              <DeviceMockup highlightArea='top' type='mobile' />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className='mt-56 flex gap-48'>
          {[
            { value: '500만+', label: '월간 구직자' },
            { value: '15만+', label: '등록 기업' },
            { value: '98%', label: '광고 만족도' },
          ].map(stat => (
            <div className='flex flex-col gap-4' key={stat.label}>
              <span className='text-28 font-bold text-base-white'>{stat.value}</span>
              <span className='text-14 font-regular text-blue-300'>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ description, subtitle, title }: { title: string; subtitle: string; description: string }) {
  return (
    <div className='flex flex-col gap-8'>
      <span className='text-14 font-semibold text-blue-700'>{subtitle}</span>
      <h2 className='text-28 font-bold text-gray-900'>{title}</h2>
      <p className='mt-4 text-16 font-regular text-gray-600'>{description}</p>
    </div>
  );
}

function MainProductCard({ product }: { product: (typeof MAIN_PRODUCTS)[number] }) {
  const [period, setPeriod] = useState('2');

  return (
    <div
      className={`relative flex flex-col rounded-12 border p-24 transition-shadow hover:shadow-smallbox ${
        product.highlight ? 'border-blue-700 bg-blue-50' : 'border-bluegray-100 bg-base-white'
      }`}
    >
      {product.popular && (
        <span className='absolute -top-10 left-24 rounded-999 bg-orange-500 px-10 py-4 text-11 font-bold text-base-white'>
          인기
        </span>
      )}

      <div className='mb-16 flex items-center gap-8'>
        <TierBadge label={product.tierLabel} tier={product.tier} />
        <span className='text-12 font-regular text-gray-500'>{product.period}</span>
      </div>

      <h3 className='text-18 font-bold text-gray-900'>{product.name}</h3>
      <p className='mt-4 text-13 font-regular text-gray-600'>{product.description}</p>

      <div className='mt-20 flex items-baseline gap-4'>
        <span className='text-24 font-bold text-gray-900'>{product.price}</span>
        <span className='text-14 font-regular text-gray-500'>원/일 (VAT 포함)</span>
      </div>

      {/* 이용기간 선택 */}
      <div className='mt-16 flex flex-col gap-8'>
        <span className='text-12 font-semibold text-gray-700'>이용기간</span>
        <div className='flex gap-8'>
          <div className='flex-1'>
            <SelectBox.Root size='small' value={period} onValueChange={setPeriod}>
              <SelectBox.Trigger placeholder='기간 선택' />
              <SelectBox.Content>
                {Array.from({ length: 29 }, (_, i) => i + 2).map(day => (
                  <SelectBox.Item key={day} value={String(day)}>
                    {day}일
                  </SelectBox.Item>
                ))}
              </SelectBox.Content>
            </SelectBox.Root>
          </div>
          <Button color='secondery' size='32' variant='outlined'>
            <BZWIcon color='gray500' name='system_calendar' size='14' />
            날짜 선택
          </Button>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-12 font-regular text-gray-500'>총 결제금액</span>
          <span className='text-16 font-bold text-blue-700'>0원</span>
        </div>
      </div>

      <div className='mt-16 border-t border-bluegray-100 pt-16'>
        <ul className='flex flex-col gap-8'>
          {product.features.map(feature => (
            <li className='flex items-center gap-8 text-13 font-regular text-gray-700' key={feature}>
              <BZWIcon color='blue700' name='system_check' size='16' />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className='mt-20 flex gap-8'>
        <Button className='flex-1' color='secondery' size='40' variant='outlined'>
          상품 문의
        </Button>
        <Button className='flex-1' color='primary' size='40' variant={product.highlight ? 'contained' : 'outlined'}>
          상품 신청
        </Button>
      </div>
    </div>
  );
}

function ProductTable({
  products,
  tierType,
}: {
  products: { name: string; price: string; jumpUp: number }[];
  tierType: 'max' | 'standard';
}) {
  return (
    <div className='overflow-hidden rounded-12 border border-bluegray-100'>
      {/* Header */}
      <div className='grid grid-cols-[1fr_120px_100px_120px_80px] gap-0 border-b border-bluegray-100 bg-gray-50 px-24 py-12'>
        <span className='text-13 font-semibold text-gray-700'>상품명</span>
        <span className='text-right text-13 font-semibold text-gray-700'>일일 가격</span>
        <span className='text-center text-13 font-semibold text-gray-700'>점프업</span>
        <span className='text-center text-13 font-semibold text-gray-700'>이용기간</span>
        <span className='text-center text-13 font-semibold text-gray-700'>신청</span>
      </div>

      {/* Rows */}
      {products.map((product, index) => (
        <ProductTableRow
          isLast={index === products.length - 1}
          key={product.name}
          product={product}
          tierType={tierType}
        />
      ))}

      {/* Footer info */}
      <div className='flex items-center gap-8 border-t border-bluegray-100 bg-gray-50 px-24 py-12'>
        <BZWIcon color='gray500' name='system_info' size='14' />
        <span className='text-12 font-regular text-gray-500'>모든 가격은 VAT 포함 / 이용기간: 2~30일</span>
      </div>
    </div>
  );
}

function ProductTableRow({
  isLast,
  product,
  tierType,
}: {
  product: { name: string; price: string; jumpUp: number };
  tierType: 'max' | 'standard';
  isLast: boolean;
}) {
  const [period, setPeriod] = useState('2');

  return (
    <div
      className={`grid grid-cols-[1fr_120px_100px_120px_80px] items-center gap-0 px-24 py-12 ${
        !isLast ? 'border-b border-bluegray-100' : ''
      } transition-colors hover:bg-bluegray-50`}
    >
      <div className='flex items-center gap-8'>
        {tierType === 'max' && <span className='h-6 w-6 shrink-0 rounded-999 bg-violet-600' />}
        <span className='text-14 font-medium text-gray-900'>{product.name}</span>
      </div>
      <div className='text-right'>
        <span className='text-14 font-bold text-gray-900'>{product.price}</span>
        <span className='text-12 font-regular text-gray-500'>원/일</span>
      </div>
      <span className='text-center text-13 font-regular text-gray-600'>{product.jumpUp}회/일</span>
      <div className='flex justify-center'>
        <SelectBox.Root size='small' value={period} onValueChange={setPeriod}>
          <SelectBox.Trigger placeholder='기간' />
          <SelectBox.Content>
            {Array.from({ length: 29 }, (_, i) => i + 2).map(day => (
              <SelectBox.Item key={day} value={String(day)}>
                {day}일
              </SelectBox.Item>
            ))}
          </SelectBox.Content>
        </SelectBox.Root>
      </div>
      <div className='text-center'>
        <Button color='primary' size='32' variant='outlined'>
          신청
        </Button>
      </div>
    </div>
  );
}

function JumpUpCard({ option }: { option: (typeof JUMPUP_OPTIONS)[number] }) {
  return (
    <div className='flex flex-col items-center rounded-12 border border-bluegray-100 bg-base-white p-32 transition-shadow hover:shadow-smallbox'>
      {/* Visual indicator */}
      <div className='mb-20 flex h-56 w-56 items-center justify-center rounded-12 bg-blue-50'>
        <svg className='h-32 w-32' fill='none' viewBox='0 0 32 32'>
          <path
            d='M16 4 L16 28 M8 12 L16 4 L24 12'
            stroke='#003CFF'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2.5'
          />
          {option.count >= 6 && (
            <path
              d='M10 18 L16 12 L22 18'
              opacity='0.5'
              stroke='#003CFF'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
            />
          )}
          {option.count >= 12 && (
            <path
              d='M12 24 L16 20 L20 24'
              opacity='0.3'
              stroke='#003CFF'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.5'
            />
          )}
        </svg>
      </div>

      <span className='text-14 font-semibold text-gray-600'>{option.description}</span>
      <span className='mt-8 text-20 font-bold text-gray-900'>
        {option.count}회<span className='text-14 font-regular text-gray-500'>/일</span>
      </span>

      <div className='mt-20 w-full border-t border-bluegray-100 pt-20 text-center'>
        <span className='text-24 font-bold text-blue-700'>{option.price}</span>
        <span className='text-14 font-regular text-gray-500'>원/일</span>
      </div>

      <div className='mt-20 w-full'>
        <Button color='primary' size='40' variant='outlined' width='100%'>
          상품 신청
        </Button>
      </div>
    </div>
  );
}

function CtaSection() {
  return (
    <section className='bg-blue-900'>
      <div className='mx-auto max-w-[960px] px-40 py-60'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-16'>
            <h2 className='text-28 font-bold text-base-white'>지금 바로 채용공고를 등록하세요</h2>
            <p className='text-16 font-regular text-blue-200'>
              채용공고 등록 후 유료서비스를 신청하시면 즉시 노출됩니다
            </p>
          </div>

          <div className='flex gap-12'>
            <Button color='secondery' size='48' variant='contained'>
              채용공고 등록
            </Button>
            <Button color='primary' size='48' variant='contained'>
              유료서비스 신청
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className='mt-48 grid grid-cols-3 gap-24'>
          {[
            {
              icon: 'system_calendar' as const,
              title: '내일 시작이면 오늘 무료',
              desc: '무료광고 시작일이 내일이면 오늘 하루 무료로 노출됩니다',
            },
            {
              icon: 'system_filter' as const,
              title: '맞춤 노출',
              desc: '할인 조건에 맞는 리스트에 맞춤 노출되어 효과를 극대화합니다',
            },
            {
              icon: 'system_link' as const,
              title: '결합 할인',
              desc: '모바일 결합 및 7일 이상 이용 시 추가 할인 혜택을 받으세요',
            },
          ].map(benefit => (
            <div className='flex gap-16 rounded-12 bg-blue-850 p-24' key={benefit.title}>
              <div className='flex h-40 w-40 shrink-0 items-center justify-center rounded-8 bg-blue-800'>
                <BZWIcon color='white' name={benefit.icon} size='20' />
              </div>
              <div className='flex flex-col gap-4'>
                <span className='text-16 font-bold text-base-white'>{benefit.title}</span>
                <span className='text-13 font-regular text-blue-200'>{benefit.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InquirySection() {
  return (
    <section className='mx-auto max-w-[960px] px-40 py-80'>
      <div className='flex gap-60'>
        {/* Left - Info */}
        <div className='flex flex-1 flex-col gap-24'>
          <h2 className='text-28 font-bold text-gray-900'>상품 문의</h2>
          <p className='text-16 font-regular text-gray-600'>
            상품에 대해 궁금한 점이 있으시면
            <br />
            편하게 문의해 주세요. 전문 컨설턴트가 안내해 드립니다.
          </p>

          <div className='mt-16 flex flex-col gap-20'>
            <div className='flex items-center gap-12'>
              <div className='flex h-40 w-40 items-center justify-center rounded-8 bg-blue-50'>
                <BZWIcon color='blue700' name='system_info' size='20' />
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-14 font-semibold text-gray-800'>고객센터</span>
                <span className='text-20 font-bold text-blue-700'>1588-9350</span>
              </div>
            </div>

            <div className='flex flex-col gap-8 text-13 font-regular text-gray-600'>
              <span>평일 09:00 ~ 19:00</span>
              <span>토요일 09:00 ~ 15:00 (일/공휴일 휴무)</span>
            </div>

            <div className='flex items-center gap-12'>
              <div className='flex h-40 w-40 items-center justify-center rounded-8 bg-blue-50'>
                <BZWIcon color='blue700' name='system_mail' size='20' />
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-14 font-semibold text-gray-800'>이메일</span>
                <span className='text-14 font-regular text-gray-700'>helpdesk@worxphere.ai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className='flex-1 rounded-16 bg-gray-50 p-32'>
          <h3 className='mb-24 text-20 font-bold text-gray-900'>온라인 문의</h3>
          <div className='flex flex-col gap-16'>
            <div className='grid grid-cols-2 gap-16'>
              <FormField label='기업명'>
                <TextField.Root placeholder='기업명을 입력하세요' size='medium' />
              </FormField>
              <FormField label='담당자명'>
                <TextField.Root placeholder='이름을 입력하세요' size='medium' />
              </FormField>
            </div>
            <div className='grid grid-cols-2 gap-16'>
              <FormField label='연락처'>
                <TextField.Root placeholder='010-0000-0000' size='medium' type='tel' />
              </FormField>
              <FormField label='이메일'>
                <TextField.Root placeholder='email@example.com' size='medium' type='email' />
              </FormField>
            </div>
            <FormField label='문의 내용'>
              <textarea
                className='w-full resize-none rounded-8 border border-bluegray-100 bg-base-white px-16 py-12 text-14 font-regular text-gray-900 transition-colors placeholder:text-gray-400 focus:border-blue-700 focus:outline-none'
                placeholder='문의 내용을 입력해 주세요'
                rows={4}
              />
            </FormField>
            <div className='mt-8'>
              <Button color='primary' size='48' variant='contained' width='100%'>
                문의하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({ children, label }: { label: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-6'>
      <span className='text-14 font-semibold text-gray-800'>{label}</span>
      {children}
    </div>
  );
}

function FooterSection() {
  return (
    <footer className='border-t border-gray-200 bg-gray-50'>
      <div className='mx-auto max-w-[960px] px-40 py-40'>
        <div className='flex items-start justify-between'>
          <div className='flex flex-col gap-12'>
            <div className='flex items-center gap-16 text-13 font-regular text-gray-500'>
              <span>회사소개</span>
              <span className='h-12 w-px bg-gray-200' />
              <span>광고문의</span>
              <span className='h-12 w-px bg-gray-200' />
              <span>제휴문의</span>
              <span className='h-12 w-px bg-gray-200' />
              <span className='font-bold text-gray-700'>개인정보처리방침</span>
              <span className='h-12 w-px bg-gray-200' />
              <span>이용약관</span>
            </div>
            <p className='text-12 font-regular text-gray-400'>
              (주)잡코리아 | 대표이사 윤병준 | 서울특별시 금천구 가산디지털2로 123
            </p>
            <p className='text-12 font-regular text-gray-400'>
              고객센터 1588-9350 | FAX 02-565-9351 | Email helpdesk@worxphere.ai
            </p>
          </div>

          <p className='text-11 font-regular text-gray-400'>Copyright JOBKOREA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
