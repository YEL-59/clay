#!/usr/bin/env bash
set -euo pipefail

CONTRACT_FILE="docs/08-api-contract.md"

echo "Validating API Contract: $CONTRACT_FILE..."

if [ ! -f "$CONTRACT_FILE" ]; then
  echo "Error: $CONTRACT_FILE does not exist."
  exit 1
fi

# Check for essential API contract sections
ERRORS=0

if ! grep -q "Base URL" "$CONTRACT_FILE"; then
  echo "❌ Missing 'Base URL' definition."
  ERRORS=$((ERRORS + 1))
fi

if ! grep -E -q "(GET|POST|PUT|PATCH|DELETE) /" "$CONTRACT_FILE"; then
  echo "❌ No HTTP endpoints (GET/POST/PUT/PATCH/DELETE) documented."
  ERRORS=$((ERRORS + 1))
fi

if [ "$ERRORS" -eq 0 ]; then
  echo "✅ API Contract format is valid."
  exit 0
else
  echo "⚠️ API Contract validation failed with $ERRORS issues."
  exit 1
fi
