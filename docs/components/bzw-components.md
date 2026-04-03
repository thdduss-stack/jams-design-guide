# BZW 커스텀 컴포넌트 레퍼런스

> `@jds/theme` 위에 구축된 비즈센터 전용 커스텀 컴포넌트 목록.
> 새 UI 요소 추가 전 반드시 이 목록 확인.

---

## 피드백 & 알림

### BZWToast

일시적 알림. 5초 후 자동 사라짐.

```tsx
import { BZWToast } from '@/shared/ui/bzw-toast'

// 사용법 (훅 방식)
const { showToast } = useBZWToast()
showToast({ type: 'success', message: '저장되었습니다.' })
showToast({ type: 'error', message: '저장에 실패했습니다.' })
showToast({ type: 'info', message: '처리 중입니다.' })
```

| type | 언제 사용 |
|------|----------|
| `success` | 저장 완료, 상태 변경 완료 |
| `error` | API 실패, 유효성 검사 실패 |
| `info` | 중립적 안내 |
| `warning` | 주의 필요한 상황 |

### BZWAlert

사용자가 반드시 응답해야 하는 확인 다이얼로그.

```tsx
import { BZWAlert } from '@/shared/ui/bzw-alert'

<BZWAlert
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="삭제하시겠습니까?"
  description="삭제된 데이터는 복구할 수 없습니다."
  confirmLabel="삭제"
  confirmColor="red"
  onConfirm={handleDelete}
/>
```

### BZWCallout

영구적으로 표시되는 안내 박스.

```tsx
import { BZWCallout } from '@/shared/ui/bzw-callout'

<BZWCallout type="info" icon="system_info">
  채용공고 등록 후 유료서비스를 신청하실 수 있습니다.
</BZWCallout>
```

| type | 배경 | 사용 상황 |
|------|------|----------|
| `info` | Blue 100 | 안내, 도움말 |
| `warning` | Yellow 50 | 주의 사항 |
| `error` | Red 150 | 오류 안내 |

### BZWTooltip

호버/클릭 시 나타나는 부가 설명.

```tsx
<BZWTooltip content="더 자세한 설명 텍스트">
  <Icon name="system_info" size="16" color="gray500" />
</BZWTooltip>
```

---

## 모달 & 오버레이

### BZWModal

```tsx
import { BZWModal } from '@/shared/ui/bzw-modal'

<BZWModal.Root open={isOpen} onClose={() => setIsOpen(false)} width={480}>
  <BZWModal.Header title="제목" description="설명 (선택)" />
  <BZWModal.Body>
    {/* 내용 */}
  </BZWModal.Body>
  <BZWModal.Footer>
    <Button variant="outlined" size="40" color="primary" onClick={() => setIsOpen(false)}>취소</Button>
    <Button variant="contained" size="40" color="primary" onClick={handleConfirm}>확인</Button>
  </BZWModal.Footer>
</BZWModal.Root>
```

**너비 기준**:
- `480` — 기본, 간단한 확인/폼
- `640` — 중간 복잡도 폼
- `720` — 2열 레이아웃 필요 시
- `1040~1280` — 테이블/상세 뷰
- `'full'` — 복잡한 작업 흐름

### BZWDrawer

우측에서 슬라이드인 패널.

```tsx
<BZWDrawer open={isOpen} onClose={() => setIsOpen(false)} title="제목">
  {/* 내용 */}
</BZWDrawer>
```

---

## 버튼

### BZWIconBtn

아이콘만 있는 버튼.

```tsx
import { BZWIconBtn } from '@/shared/ui/bzw-icon-btn'

<BZWIconBtn iconName="system_trash" size={32} color="gray700" onClick={handleDelete} />
<BZWIconBtn iconName="system_edit" size={32} color="gray700" onClick={handleEdit} />
```

### BZWIconTextBtn

아이콘 + 텍스트 버튼.

```tsx
<BZWIconTextBtn iconName="system_plus" size={40} color="primary">
  추가하기
</BZWIconTextBtn>
```

### BZWToggleIconBtn

토글 가능한 아이콘 버튼 (즐겨찾기, 알림 등).

```tsx
<BZWToggleIconBtn
  activeIconName="system_star_fill"
  inactiveIconName="system_star"
  isActive={isFavorite}
  onChange={setIsFavorite}
/>
```

---

## 탭 & 토글

### BZWTabs

```tsx
import { BZWTabs } from '@/shared/ui/bzw-tabs'

<BZWTabs.Root value={activeTab} onValueChange={setActiveTab} variant="default">
  <BZWTabs.List>
    <BZWTabs.Trigger value="all">전체</BZWTabs.Trigger>
    <BZWTabs.Trigger value="reviewing">검토중</BZWTabs.Trigger>
    <BZWTabs.Trigger value="passed">합격</BZWTabs.Trigger>
  </BZWTabs.List>
  <BZWTabs.Content value="all">{/* 내용 */}</BZWTabs.Content>
  <BZWTabs.Content value="reviewing">{/* 내용 */}</BZWTabs.Content>
</BZWTabs.Root>
```

**variant 선택 기준**:
- `default` — 일반 탭 (밑줄 인디케이터)
- `rectangle` — 배경 채워지는 탭
- `line` — 컴팩트한 공간
- `PCtab` — PC 전용 넓은 탭

### BZWToggleGroup

하나만 선택 가능한 옵션 그룹.

```tsx
<BZWToggleGroup value={view} onValueChange={setView}>
  <BZWToggleGroup.Item value="list">목록</BZWToggleGroup.Item>
  <BZWToggleGroup.Item value="grid">그리드</BZWToggleGroup.Item>
</BZWToggleGroup>
```

---

## 데이터 표시

### BZWDataTable

AG Grid 기반 데이터 테이블. 정렬/필터/선택 지원.

```tsx
import { BZWDataTable } from '@/shared/ui/bzw-data-table'

const columns = [
  { field: 'name', headerName: '이름', sortable: true, width: 120 },
  { field: 'status', headerName: '상태', width: 100 },
  { field: 'appliedAt', headerName: '지원일', sortable: true, width: 120 },
]

<BZWDataTable
  rowData={data}
  columnDefs={columns}
  onRowClicked={handleRowClick}
  rowSelection="multiple"
/>
```

### BZWLabelstatus

상태 표시 라벨. 12색 지원.

```tsx
import { BZWLabelstatus } from '@/shared/ui/bzw-labelstatus'

<BZWLabelstatus color="blue" label="검토중" />
<BZWLabelstatus color="green" label="합격" />
<BZWLabelstatus color="red" label="불합격" />
<BZWLabelstatus color="gray" label="대기" />
```

**color 옵션**: `purple` `bluegray` `blue` `orange` `green` `mint` `gray` `yellow` `pink` `olive` `brown` `violet`

### BZWProgress

프로그레스 바.

```tsx
<BZWProgress value={75} max={100} label="지원 완료율" />
```

### BZWContentsTitle

섹션 타이틀 + 설명 영역.

```tsx
<BZWContentsTitle
  title="기본 정보"
  description="지원자의 기본 프로필 정보입니다."
  action={<Button size="32" variant="outlined">수정</Button>}
/>
```

---

## 입력 & 선택 (BZW 확장)

### BZWTextField

비밀번호 표시/숨김 토글이 필요한 경우.

```tsx
import { BZWTextField } from '@/shared/ui/bzw-text-field'

<BZWTextField type="password" placeholder="비밀번호" />
```

### BZWSelectCalendar / BZWDatePickerRange

날짜 및 기간 선택.

```tsx
// 단일 날짜
<BZWSelectCalendar value={date} onChange={setDate} />

// 기간 선택
<BZWDatePickerRange
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
/>
```

### BZWPeriodFilter

기간 필터 (빠른 선택 포함).

```tsx
<BZWPeriodFilter
  value={period}
  onChange={setPeriod}
  options={['오늘', '1주일', '1개월', '3개월', '직접 입력']}
/>
```

### BZWUploader

파일 업로드 (드래그 & 드롭, 진행률).

```tsx
<BZWUploader
  accept=".pdf,.doc,.docx"
  maxSize={10 * 1024 * 1024} // 10MB
  onUpload={handleUpload}
/>
```

---

## 아바타 & 프로필

### BZWAvatar

```tsx
import { BZWAvatar } from '@/shared/ui/bzw-avatar'

// 프로필 이미지
<BZWAvatar type="profile" src="/profile.jpg" size={32} />

// 이니셜
<BZWAvatar type="word" word="김" size={32} color="blue" />

// 멤버 추가 버튼
<BZWAvatar type="add" size={32} onClick={handleAddMember} />

// 그룹 (겹치는 아바타)
<BZWGroupAvatar users={[...]} maxVisible={3} size={28} />
```

---

## 기타

### BZWDropdown

커스텀 드롭다운 메뉴.

```tsx
<BZWDropdown.Root>
  <BZWDropdown.Trigger>
    <BZWIconBtn iconName="system_morev" size={32} />
  </BZWDropdown.Trigger>
  <BZWDropdown.Content>
    <BZWDropdown.Item onClick={handleEdit}>수정</BZWDropdown.Item>
    <BZWDropdown.Item onClick={handleDelete} color="red">삭제</BZWDropdown.Item>
  </BZWDropdown.Content>
</BZWDropdown.Root>
```
