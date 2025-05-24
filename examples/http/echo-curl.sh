#!/bin/bash
# examples/http/test-echo-curl.sh

set -e

# PORT=${1:-5000}
PORT=${1:-4500}
HOST="localhost"

URL="http://${HOST}:${PORT}/api/echo"

echo "Testing HTTP API with curl"
echo "=========================="
echo "URL: $URL"
echo

# Test basic echo
echo "1. Testing basic echo message:"
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from curl!", "timestamp": "'$(date -Iseconds)'"}' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" \
  -s
echo
echo

# Test empty message
echo "2. Testing empty message:"
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" \
  -s
echo
echo

# Test complex message
echo "3. Testing complex message:"
curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Complex test message",
    "data": {
      "numbers": [1, 2, 3],
      "nested": {
        "key": "value"
      }
    },
    "metadata": {
      "test": "curl-client",
      "timestamp": "'$(date -Iseconds)'"
    }
  }' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n" \
  -s
echo
echo

echo "Echo tests completed successfully!"