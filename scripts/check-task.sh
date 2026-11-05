#!/usr/bin/env bash
set -euo pipefail

TASK_ID="${1:-}"

if [ -z "$TASK_ID" ]; then
  echo "Usage: ./scripts/check-task.sh <TASK_ID>"
  echo "Example: ./scripts/check-task.sh TASK-001"
  exit 1
fi

TASK_FILE="planning/task.md"

if [ ! -f "$TASK_FILE" ]; then
  echo "Error: $TASK_FILE not found."
  exit 1
fi

echo "Inspecting $TASK_ID in $TASK_FILE..."

# Search for the task in the markdown table
grep -E "\|.*${TASK_ID}.*\|" "$TASK_FILE" || {
  echo "Task $TASK_ID not found in active task table."
  exit 1
}

GRANULAR_FILE="planning/tasks/${TASK_ID}.md"
if [ -f "$GRANULAR_FILE" ]; then
  echo ""
  echo "📄 Found granular task specification: $GRANULAR_FILE"
  echo "----------------------------------------------------------"
  head -n 25 "$GRANULAR_FILE"
  echo "----------------------------------------------------------"
fi

