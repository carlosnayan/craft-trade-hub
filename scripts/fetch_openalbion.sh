#!/usr/bin/env bash

# Define the endpoints of the OpenAlbion API
BASE_URL="https://api.openalbion.com/api/v3"
ENDPOINTS=("armors" "weapons" "accessories" "consumables")

# Output directory
OUTPUT_DIR="openalbion_data"
mkdir -p "$OUTPUT_DIR"

echo "Starting downloads of data from OpenAlbion API..."

for endpoint in "${ENDPOINTS[@]}"; do
  OUTPUT_FILE="${OUTPUT_DIR}/${endpoint}.json"
  URL="${BASE_URL}/${endpoint}"

  echo "Downloading $endpoint from: $URL"
  curl -s "$URL" -H "Accept: application/json" -o "$OUTPUT_FILE"

  # Check if there was success
  if [[ -s "$OUTPUT_FILE" ]]; then
    echo " → Saved to $OUTPUT_FILE"
  else
    echo " ! Failed to download $endpoint"
  fi

  # Wait 0.5s to avoid rate limit
  sleep 0.5
done

echo "All data has been downloaded."

