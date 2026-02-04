#!/usr/bin/env bash
# /home/danny/hyperdata/transmissions/newsmonitor.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="${ROOT_DIR}/tmp/newsmonitor.pid"
LOG_DIR="${ROOT_DIR}/tmp"
LOG_FILE="${LOG_DIR}/newsmonitor.log"

COMMAND="${1:-}"

ensure_dirs() {
  mkdir -p "${LOG_DIR}"
}

is_running() {
  if [[ -f "${PID_FILE}" ]]; then
    local pid
    pid="$(cat "${PID_FILE}")"
    if [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null; then
      return 0
    fi
  fi
  return 1
}

start() {
  if is_running; then
    echo "NewsMonitor already running (pid $(cat "${PID_FILE}"))."
    exit 0
  fi

  ensure_dirs

  nohup node "${ROOT_DIR}/docker/newsmonitor-scheduler.js" \
    > "${LOG_FILE}" 2>&1 &

  echo $! > "${PID_FILE}"
  echo "NewsMonitor started (pid $!). Logs: ${LOG_FILE}"
  echo "Startup info:"
  echo "  Port: $(node -e "import Config from './src/Config.js'; const cfg=Config.getService('newsmonitor'); console.log(cfg?.port || 8080);")"
  echo "  Admin: http://localhost:$(node -e "import Config from './src/Config.js'; const cfg=Config.getService('newsmonitor'); console.log(cfg?.port || 8080);")/admin.html"
  echo "  Frontend: http://localhost:$(node -e "import Config from './src/Config.js'; const cfg=Config.getService('newsmonitor'); console.log(cfg?.port || 8080);")/"
}

stop() {
  if ! is_running; then
    echo "NewsMonitor is not running."
    exit 0
  fi

  local pid
  pid="$(cat "${PID_FILE}")"
  kill "${pid}"
  rm -f "${PID_FILE}"
  echo "NewsMonitor stopped (pid ${pid})."
}

status() {
  if is_running; then
    echo "NewsMonitor running (pid $(cat "${PID_FILE}"))."
    exit 0
  fi
  echo "NewsMonitor not running."
  exit 1
}

case "${COMMAND}" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    stop || true
    start
    ;;
  status)
    status
    ;;
  *)
    echo "Usage: ${0} {start|stop|restart|status}"
    exit 1
    ;;
esac
