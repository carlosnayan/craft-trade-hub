#!/usr/bin/env bash

INPUT="backup.sql"
OUTPUT="item_ids_clean.txt"

echo "Extracting item IDs without duplicates, without enchant suffixes and without tier..."

grep -oE "'T[^']*'" "$INPUT" | \
  sed "s/'//g" | \
  sed -E "s/@[0-9]+$//" | \
  sed -E "s/^T[0-9]+_//" | \
  sort -u > "$OUTPUT"

echo "Done!"
echo "Unique and clean IDs saved to: $OUTPUT"

