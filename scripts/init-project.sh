#!/usr/bin/env bash
set -euo pipefail

echo "This initializes Git for the current directory; it does not delete any files."
if [ -d .git ]; then
  echo "A .git directory already exists. Nothing changed."
  exit 0
fi

git init
git add .
git commit -m "chore: initialize project from AI starter template"
echo "Initialized a new Git repository."
