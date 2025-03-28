#!/bin/bash

echo -e "\n===== READING ALL MEMORY BANK FILES =====\n"

# Read core memory bank files in the recommended order
core_files=(
  "memory-bank/projectbrief.md"
  "memory-bank/productContext.md"
  "memory-bank/systemPatterns.md"
)

for file in "${core_files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "\n===== $file =====\n"
    cat "$file"
  else
    echo -e "\n===== $file (NOT FOUND) =====\n"
  fi
done

echo -e "\n===== END OF MEMORY BANK FILES =====\n"
