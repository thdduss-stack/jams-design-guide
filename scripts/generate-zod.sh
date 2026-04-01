#!/bin/bash

# 기본 경로 설정
INPUT_FILE="./src/shared/types/api/index.ts"
OUTPUT_DIR="./e2e/schema"

# 명령줄 인자 처리
while [[ "$#" -gt 0 ]]; do
    case $1 in
    -i | --input)
        INPUT_FILE="$2"
        shift
        ;;
    -o | --output)
        OUTPUT_DIR="$2"
        shift
        ;;
    -h | --help)
        echo "사용법: $0 [-i|--input 입력파일] [-o|--output 출력폴더]"
        echo "예시: $0 -i ./src/types/custom.ts -o ./src/schemas"
        exit 0
        ;;
    *)
        echo "알 수 없는 매개변수: $1"
        exit 1
        ;;
    esac
    shift
done

echo "입력 파일: $INPUT_FILE"
echo "출력 폴더: $OUTPUT_DIR"

# TypeScript 타입을 컴파일
npx tsup $INPUT_FILE --format esm --dts-resolve --dts-only --splitting false --out-dir $OUTPUT_DIR

# 생성된 타입 정의를 Zod 스키마로 변환

npx ts-to-zod $OUTPUT_DIR/index.d.ts

# 생성된 파일 이름 변경 (index.d.ts.zod.ts -> index.ts)
if [ -f "$OUTPUT_DIR/index.d.ts" ]; then
    mv "$OUTPUT_DIR/index.d.ts" "$OUTPUT_DIR/index.ts"
    echo "✅ 파일 이름 변경: index.d.ts -> index.ts"
fi

TARGET_FILE=$OUTPUT_DIR/index.ts

if [ ! -f "$TARGET_FILE" ]; then
    echo "❌ 파일이 존재하지 않습니다: $TARGET_FILE"
    exit 1
fi

# export 없을 경우 const XxxxSchema 앞에 export 추가
sed -i '' -E 's/^const ([A-Za-z0-9_]+Schema)/export const \1/' "$TARGET_FILE"

# 불필요한 .js 파일 삭제
find $OUTPUT_DIR -name "*.js" -type f -delete

# 불필요한 .d.ts 파일 삭제
find $OUTPUT_DIR -name "*.d.ts" -type f -delete
