#!/bin/bash
# Prepare for deployment by removing problematic postinstall script

echo "Preparing for deployment..."

# Backup original package.json
cp package.json package.json.backup

# Remove postinstall script
npm pkg delete scripts.postinstall

echo "Removed postinstall script from package.json"
echo "Ready for deployment!"