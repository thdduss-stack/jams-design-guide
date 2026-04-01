/**
 * 자동 생성된 BizCenter 아이콘 이름들의 상수 배열
 *
 * 이 파일은 scripts/bizcenter/create-svg-css.js에 의해 자동 생성됩니다.
 * public/assets/images/svg 폴더의 SVG 파일들을 기반으로 생성되며,
 * 수동으로 편집하면 스크립트 실행 시 덮어쓰여집니다.
 *
 * @readonly
 */
export const BIZCENTER_ICON_NAMES = [
  'special_ai',
  'special_aimatching',
  'special_aos_logo',
  'special_bar_graph',
  'special_bar_graph_gray',
  'special_basicmail',
  'special_card_index',
  'special_caution',
  'special_chip_baroalba',
  'special_cpc_off',
  'special_cpc',
  'special_cursor',
  'special_desktop',
  'special_duty',
  'special_email',
  'special_email_noti',
  'special_empty',
  'special_file_excel',
  'special_file_pdf',
  'special_file_sheet',
  'special_fileexcel',
  'special_filezip',
  'special_folder',
  'special_headset',
  'special_icon_check',
  'special_id',
  'special_id_card',
  'special_id_card_green',
  'special_id_v2',
  'special_infofail',
  'special_invite',
  'special_ios_logo',
  'special_key',
  'special_map',
  'special_map_green',
  'special_member',
  'special_memo',
  'special_money_bag',
  'special_noti',
  'special_notiorange',
  'special_notired',
  'special_office_idshare',
  'special_office_money',
  'special_on_ai',
  'special_on_ats',
  'special_position_offer_yellow',
  'special_search',
  'special_search_v2',
  'special_search_office',
  'special_search_report',
  'special_sent_message_yellow',
  'special_smart_fit',
  'special_star',
  'special_target_green',
  'special_time',
  'special_welcome',
  'special_write',
  'special_ws',
  'special_z',
] as const;

/**
 * BIZCENTER_ICON_NAMES 배열로부터 생성된 아이콘 이름 유니온 타입
 *
 * TypeScript에서 아이콘 이름의 타입 안전성을 보장하기 위해 사용됩니다.
 * BZWIcon 컴포넌트의 name prop에서 사용 가능한 모든 아이콘 이름을 나타냅니다.
 *
 * @example
 * ```typescript
 * const iconName: BZWIconNames = 'special_email'; // ✅ 유효
 * const invalidIcon: BZWIconNames = 'invalid-icon'; // ❌ 타입 에러
 * ```
 */
export type BZWIconNames = (typeof BIZCENTER_ICON_NAMES)[number];
