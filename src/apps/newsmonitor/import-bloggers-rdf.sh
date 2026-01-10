#!/bin/bash
# src/apps/newsmonitor/import-bloggers-rdf.sh
# Import feeds from bloggers.rdf file

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
RDF_FILE="${1:-$SCRIPT_DIR/bloggers.rdf}"
DELAY="${2:-2}"

# Change to project root
cd "$PROJECT_ROOT"

if [ ! -f "$RDF_FILE" ]; then
    echo "Error: File not found: $RDF_FILE"
    echo "Usage: $0 [rdf-file] [delay-seconds]"
    exit 1
fi

echo "=========================================="
echo "NewsMonitor Feed Importer"
echo "=========================================="
echo "RDF file: $RDF_FILE"
echo "Delay: ${DELAY}s between subscriptions"
echo ""

# Extract feed URLs from RDF
FEED_URLS=$(grep -oP '(?<=<rss:channel rdf:about=")[^"]+' "$RDF_FILE")

if [ -z "$FEED_URLS" ]; then
    echo "Error: No feed URLs found in RDF file"
    exit 1
fi

# Count feeds
TOTAL=$(echo "$FEED_URLS" | wc -l)
echo "Found $TOTAL feeds to subscribe"
echo "=========================================="
echo ""

SUCCESS=0
FAILED=0
CURRENT=0

# Subscribe to each feed
while IFS= read -r url; do
    ((CURRENT++))
    echo "[$CURRENT/$TOTAL] Subscribing to: $url"

    if ./trans src/apps/newsmonitor/subscribe -m "{\"url\":\"$url\"}"; then
        echo "✓ Success"
        ((SUCCESS++))
    else
        echo "✗ Failed"
        ((FAILED++))
    fi

    # Delay before next (except last)
    if [ $CURRENT -lt $TOTAL ]; then
        sleep "$DELAY"
    fi
    echo ""
done <<< "$FEED_URLS"

echo "=========================================="
echo "Import Summary:"
echo "  Total feeds: $TOTAL"
echo "  Successful: $SUCCESS"
echo "  Failed: $FAILED"
echo "=========================================="
