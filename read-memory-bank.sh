#!/bin/bash

echo -e "\n===== READING ALL MEMORY BANK FILES =====\n"

# Read core memory bank files in the recommended order
core_files=(
  "memory-bank/projectbrief.md"
  "memory-bank/productContext.md"
  "memory-bank/systemPatterns.md"
  "memory-bank/techContext.md"
  "memory-bank/activeContext.md"
  "memory-bank/progress.md"
  "memory-bank/.clinerules"
)

for file in "${core_files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "\n===== $file =====\n"
    cat "$file"
  else
    echo -e "\n===== $file (NOT FOUND) =====\n"
  fi
done

# Check for any additional context files
echo -e "\n===== ADDITIONAL CONTEXT FILES =====\n"
find memory-bank -type f -not -path "*/\.*" -not -name "projectbrief.md" -not -name "productContext.md" \
  -not -name "systemPatterns.md" -not -name "techContext.md" -not -name "activeContext.md" \
  -not -name "progress.md" -not -name ".clinerules" | while read file; do
  echo -e "\n===== $file =====\n"
  cat "$file"
done

echo -e "\n===== END OF MEMORY BANK FILES =====\n"
