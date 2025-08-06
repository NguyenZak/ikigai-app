#!/bin/bash

echo "🔧 Fixing API routes for static export..."

# Find all API route files and add dynamic export
find src/app/api -name "route.ts" -type f | while read file; do
    echo "Fixing: $file"
    # Add dynamic export if not already present
    if ! grep -q "export const dynamic" "$file"; then
        # Add at the beginning of the file
        sed -i '' '1i\
export const dynamic = "force-static"
' "$file"
    fi
done

echo "✅ API routes fixed!" 