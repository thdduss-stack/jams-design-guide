#!/usr/bin/env node

/**
 * Coverage 결과에서 80% 미만인 파일만 필터링하여 표시
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { COVERAGE_THRESHOLD, EXCLUDED_FILES } from './coverage-filter.config.mjs';

try {
  // coverage-summary.json 파일 읽기
  const summaryPath = resolve(process.cwd(), 'coverage/coverage-summary.json');
  const summary = JSON.parse(readFileSync(summaryPath, 'utf-8'));

  console.log('\n📊 Coverage Report (80% 미만 파일만 표시)\n');
  console.log('─'.repeat(140));
  console.log(
    'File'.padEnd(60) +
      '| % Stmts'.padStart(10) +
      '| % Branch'.padStart(12) +
      '| % Funcs'.padStart(10) +
      '| % Lines'.padStart(10) +
      '| Uncovered Lines'.padStart(20),
  );
  console.log('─'.repeat(140));

  let hasLowCoverage = false;
  const lowCoverageFiles = [];

  // 파일별로 체크
  Object.entries(summary).forEach(([file, data]) => {
    // total은 제외
    if (file === 'total') return;

    // .types.ts 파일 제외
    if (file.endsWith('.types.ts') || file.includes('/types.ts')) return;

    // 테스트 파일 제외 (Functions 커버리지가 의미 없음)
    if (
      file.endsWith('.test.ts') ||
      file.endsWith('.test.tsx') ||
      file.endsWith('.spec.ts') ||
      file.endsWith('.spec.tsx')
    ) {
      return;
    }

    // 제외 목록에 있는 파일 제외
    if (EXCLUDED_FILES.some(excludedPath => file.includes(excludedPath))) {
      return;
    }

    const statements = data.statements.pct;
    const branches = data.branches.pct;
    const functions = data.functions.pct;
    const lines = data.lines.pct;

    // 80% 미만인 것이 하나라도 있으면 표시
    if (
      statements < COVERAGE_THRESHOLD ||
      branches < COVERAGE_THRESHOLD ||
      functions < COVERAGE_THRESHOLD ||
      lines < COVERAGE_THRESHOLD
    ) {
      hasLowCoverage = true;

      // 상대 경로로 변환
      const relativePath = file.replace(process.cwd() + '/', '');

      // 커버되지 않은 라인 정보
      const uncoveredLines = Object.entries(data.lines.covered)
        .filter(([_, covered]) => !covered)
        .map(([line]) => line)
        .slice(0, 10)
        .join(',');

      lowCoverageFiles.push({
        file: relativePath,
        statements,
        branches,
        functions,
        lines,
        uncoveredLines,
      });
    }
  });

  if (!hasLowCoverage) {
    console.log('\n✨ 모든 파일이 80% 이상의 커버리지를 달성했습니다!\n');
  } else {
    // 커버리지가 낮은 순으로 정렬
    lowCoverageFiles
      .sort((a, b) => {
        const avgA = (a.statements + a.branches + a.functions + a.lines) / 4;
        const avgB = (b.statements + b.branches + b.functions + b.lines) / 4;
        return avgA - avgB;
      })
      .forEach(item => {
        const color = item => {
          const avg = (item.statements + item.branches + item.functions + item.lines) / 4;
          if (avg < 50) return '\x1b[31m'; // 빨강
          if (avg < 70) return '\x1b[33m'; // 노랑
          return '\x1b[0m'; // 기본
        };

        const reset = '\x1b[0m';
        const fileColor = color(item);

        console.log(
          fileColor +
            item.file.padEnd(60) +
            reset +
            '|' +
            `${item.statements.toFixed(2)}%`.padStart(9) +
            '|' +
            `${item.branches.toFixed(2)}%`.padStart(11) +
            '|' +
            `${item.functions.toFixed(2)}%`.padStart(9) +
            '|' +
            `${item.lines.toFixed(2)}%`.padStart(9) +
            '|' +
            ` ${item.uncoveredLines}`.padStart(19),
        );
      });

    console.log('─'.repeat(140));
    console.log(`\n⚠️  총 ${lowCoverageFiles.length}개 파일이 80% 미만의 커버리지를 가지고 있습니다.\n`);
  }

  // Total 요약 표시
  if (summary.total) {
    const total = summary.total;
    console.log('\n📈 전체 요약:');
    console.log(
      `   Statements: ${total.statements.pct.toFixed(2)}% (${total.statements.covered}/${total.statements.total})`,
    );
    console.log(`   Branches  : ${total.branches.pct.toFixed(2)}% (${total.branches.covered}/${total.branches.total})`);
    console.log(
      `   Functions : ${total.functions.pct.toFixed(2)}% (${total.functions.covered}/${total.functions.total})`,
    );
    console.log(`   Lines     : ${total.lines.pct.toFixed(2)}% (${total.lines.covered}/${total.lines.total})\n`);
  }

  // 80% 미만 파일이 있으면 exit code 1
  process.exit(hasLowCoverage ? 1 : 0);
} catch (error) {
  console.error('❌ Coverage 파일을 읽는 중 오류 발생:', error.message);
  console.error('   coverage/coverage-summary.json 파일이 존재하는지 확인하세요.');
  process.exit(1);
}
