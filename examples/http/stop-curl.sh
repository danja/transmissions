#!/bin/bash
# examples/http/test-stop-curl.sh

set -e

PORT=${1:-4500}
HOST="localhost"
URL="http://${HOST}:${PORT}/api/echo"

echo "Testing graceful shutdown with curl"
echo "==================================="
echo "URL: $URL"
echo

echo "Sending stop command to server..."
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{"system": "stop"}' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" \
  -s
echo
echo

echo "Waiting 2 seconds for server to shutdown..."
sleep 2

echo "Testing if server is still running..."
if curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{"test": "after shutdown"}' \
  -w "\nStatus: %{http_code}\n" \
  -s --connect-timeout 3 >/dev/null 2>&1; then
  echo "❌ Server is still running (unexpected)"
  exit 1
else
  echo "✅ Server shutdown successfully"
fi

echo
echo "Graceful shutdown test completed!"