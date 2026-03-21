#!/usr/bin/env bash
set -euo pipefail

PROMPTS_DIR="$(cd "$(dirname "$0")/../src/content/prompts" && pwd)"

# Title
read -rp "Title: " title
[ -z "$title" ] && echo "Title is required." && exit 1

# Generate slug
slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')

# Check for duplicate
if [ -f "$PROMPTS_DIR/$slug.md" ]; then
  echo "Error: $slug.md already exists." && exit 1
fi

# Description
read -rp "Description: " description

# Category (show existing)
if ls "$PROMPTS_DIR"/*.md &>/dev/null; then
  existing=$(grep -rh "^category:" "$PROMPTS_DIR"/*.md | sed 's/category: *//' | sed 's/"//g' | sort -u | tr '\n' ', ' | sed 's/, $//')
else
  existing="(none yet)"
fi
echo "Existing categories: $existing"
read -rp "Category: " category

# Variables
read -rp "Variables (comma-separated names, or empty): " vars_input
vars_yaml=""
if [ -n "$vars_input" ]; then
  IFS=',' read -ra var_names <<< "$vars_input"
  vars_yaml=$'\nvariables:'
  for v in "${var_names[@]}"; do
    v=$(echo "$v" | xargs) # trim whitespace
    vars_yaml="$vars_yaml"$'\n'"  - name: \"$v\""$'\n'"    label: \"$v\""
  done
fi

# Prompt body via $EDITOR
tmpfile=$(mktemp /tmp/prompt-body-XXXXXXXX)
echo "<!-- DELETE THIS LINE: Write your prompt below, then save and close -->" > "$tmpfile"
echo "" >> "$tmpfile"

${EDITOR:-vim} "$tmpfile"

# Strip the instruction marker and leading/trailing blank lines
body=$(sed '/^<!-- DELETE THIS LINE/d' "$tmpfile" | awk 'NF{p=1} p' | awk '{lines[NR]=$0} END{for(i=NR;i>=1;i--) if(lines[i]!=""){last=i;break} for(i=1;i<=last;i++) print lines[i]}')
rm -f "$tmpfile"

if [ -z "$body" ]; then
  echo "Error: prompt body is empty." && exit 1
fi

# Write the file
{
  echo "---"
  echo "title: \"$title\""
  echo "description: \"$description\""
  echo "category: \"$category\""
  if [ -n "$vars_yaml" ]; then
    printf '%s\n' "$vars_yaml"
  fi
  echo "---"
  echo ""
  printf '%s\n' "$body"
} > "$PROMPTS_DIR/$slug.md"

echo "✓ Created src/content/prompts/$slug.md"
