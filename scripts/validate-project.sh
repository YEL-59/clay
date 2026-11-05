#!/usr/bin/env bash
set -euo pipefail

echo "=========================================================="
echo "🛡️  Avengerse (Avengers Protocol) Project Validation Check"
echo "=========================================================="

FAILED=0

check_file() {
  if [ -f "$1" ]; then
    echo "  ✅ Found: $1"
  else
    echo "  ❌ MISSING: $1"
    FAILED=$((FAILED + 1))
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo "  ✅ Found Directory: $1"
  else
    echo "  ❌ MISSING Directory: $1"
    FAILED=$((FAILED + 1))
  fi
}

echo ""
echo "1. Checking Core Protocol Files..."
check_file "README.md"
check_file "AGENTS.md"
check_file "project.config.md"
check_file "HOW_TO_USE_BN.md"
check_file "HOW_TO_USE_EN.md"
check_file "PROJECT_STRUCTURE.md"

echo ""
echo "2. Checking Codex Multi-Agent Configuration (.codex/)..."
check_file ".codex/config.toml"
check_file ".codex/agents/iron_man.toml"
check_file ".codex/agents/jarvis.toml"
check_file ".codex/agents/friday.toml"
check_file ".codex/agents/edith.toml"
check_file ".codex/agents/thor.toml"
check_file ".codex/agents/thanos.toml"
check_file ".codex/agents/ultron.toml"

echo ""
echo "3. Checking Reusable Skills (.agents/skills/)..."
check_file ".agents/skills/project-planning/SKILL.md"
check_file ".agents/skills/task-execution/SKILL.md"
check_file ".agents/skills/frontend-development/SKILL.md"
check_file ".agents/skills/backend-development/SKILL.md"
check_file ".agents/skills/design-system/SKILL.md"
check_file ".agents/skills/api-contract-validation/SKILL.md"
check_file ".agents/skills/testing/SKILL.md"
check_file ".agents/skills/deployment-security/SKILL.md"

echo ""
echo "4. Checking Planning Governance (planning/)..."
check_file "planning/task.md"
check_file "planning/updateplanning.md"
check_file "planning/decisions.md"
check_file "planning/open-questions.md"
check_dir "planning/checkpoints"
check_dir "planning/tasks"

echo ""
echo "5. Checking Technical Documentation (docs/ 01 - 14)..."
for i in $(seq -w 1 14); do
  MATCH=$(find docs -maxdepth 1 -name "${i}-*.md" 2>/dev/null | head -n 1)
  if [ -n "$MATCH" ]; then
    echo "  ✅ Found Doc: $MATCH"
  else
    echo "  ❌ MISSING Doc for prefix ${i}-"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "6. Checking Development Rules & Boundaries..."
check_file "development/AGENTS.md"
check_file "development/frontend/AGENTS.md"
check_file "development/backend/AGENTS.md"
check_file "development/mobile/AGENTS.md"

echo ""
if [ "$FAILED" -eq 0 ]; then
  echo "🎉 SUCCESS: All Avengerse project structures and agent protocols validated successfully!"
  exit 0
else
  echo "⚠️ ERROR: $FAILED checks failed. Please fix missing files."
  exit 1
fi
