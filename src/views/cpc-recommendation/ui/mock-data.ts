export interface JobCard {
  id: string;
  company: string;
  companyInitial: string;
  companyBgColor: string;
  companyTextColor: string;
  title: string;
  location: string;
  employType: string;
  salary: string;
  tags: string[];
  reason: string;
  dDay: string;
  isNew: boolean;
  isScrapped: boolean;
  isUrgent: boolean;
}

export const RECOMMENDED_JOBS: JobCard[] = [
  {
    id: '1',
    company: '카카오',
    companyInitial: '카',
    companyBgColor: '#FEE500',
    companyTextColor: '#000000',
    title: 'Frontend 개발자 (React)',
    location: '판교',
    employType: '정규직',
    salary: '5,000~7,000만원',
    tags: ['재택가능', '자율출퇴근', '스톡옵션'],
    reason: '최근 조회한 공고와 유사',
    dDay: 'D-3',
    isNew: true,
    isScrapped: false,
    isUrgent: true,
  },
  {
    id: '2',
    company: '네이버',
    companyInitial: '네',
    companyBgColor: '#03C75A',
    companyTextColor: '#ffffff',
    title: 'UX 디자이너',
    location: '판교',
    employType: '정규직',
    salary: '4,500~6,500만원',
    tags: ['유연근무', '복지포인트'],
    reason: '희망 직무·지역 일치',
    dDay: 'D-7',
    isNew: false,
    isScrapped: true,
    isUrgent: false,
  },
  {
    id: '3',
    company: '토스',
    companyInitial: '토',
    companyBgColor: '#1B64DA',
    companyTextColor: '#ffffff',
    title: 'Product Manager',
    location: '강남',
    employType: '정규직',
    salary: '6,000~9,000만원',
    tags: ['성과급', '주4.5일'],
    reason: '최근 스크랩 공고 기반',
    dDay: 'D-14',
    isNew: true,
    isScrapped: false,
    isUrgent: false,
  },
  {
    id: '4',
    company: '당근',
    companyInitial: '당',
    companyBgColor: '#FF6F0F',
    companyTextColor: '#ffffff',
    title: 'iOS 개발자',
    location: '역삼',
    employType: '정규직',
    salary: '5,500~8,000만원',
    tags: ['원격근무', '자율복장'],
    reason: '최근 입사지원 공고 유사',
    dDay: 'D-21',
    isNew: false,
    isScrapped: false,
    isUrgent: false,
  },
  {
    id: '5',
    company: '쿠팡',
    companyInitial: '쿠',
    companyBgColor: '#EE2028',
    companyTextColor: '#ffffff',
    title: 'Data Scientist',
    location: '잠실',
    employType: '정규직',
    salary: '5,000~8,000만원',
    tags: ['국내 최대 데이터', '해외출장'],
    reason: '이력서 희망 직무 일치',
    dDay: 'D-30',
    isNew: true,
    isScrapped: false,
    isUrgent: false,
  },
];

export const SIMILAR_JOBS: JobCard[] = [
  {
    id: '6',
    company: '라인플러스',
    companyInitial: '라',
    companyBgColor: '#06C755',
    companyTextColor: '#ffffff',
    title: 'Frontend Engineer (React/Vue)',
    location: '신촌',
    employType: '정규직',
    salary: '5,500~8,000만원',
    tags: ['글로벌', '스톡옵션'],
    reason: '유사 공고',
    dDay: 'D-5',
    isNew: false,
    isScrapped: false,
    isUrgent: true,
  },
  {
    id: '7',
    company: '크래프톤',
    companyInitial: '크',
    companyBgColor: '#2B2B2B',
    companyTextColor: '#ffffff',
    title: '웹 프론트엔드 개발자',
    location: '삼성',
    employType: '정규직',
    salary: '협의',
    tags: ['게임업계', '자율출퇴근'],
    reason: '유사 공고',
    dDay: 'D-10',
    isNew: true,
    isScrapped: false,
    isUrgent: false,
  },
  {
    id: '8',
    company: '카카오페이',
    companyInitial: '카',
    companyBgColor: '#FEE500',
    companyTextColor: '#000000',
    title: 'React Native 개발자',
    location: '판교',
    employType: '정규직',
    salary: '5,000~7,500만원',
    tags: ['핀테크', '재택가능'],
    reason: '유사 공고',
    dDay: 'D-15',
    isNew: false,
    isScrapped: true,
    isUrgent: false,
  },
];
