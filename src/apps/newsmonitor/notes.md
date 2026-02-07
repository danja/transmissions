SPARQL_USER=admin SPARQL_PASSWORD=admin123 src/apps/newsmonitor/clear-graph.sh

 docker logs --tail 200 transmissions-newsmonitor 

  docker exec -it transmissions-newsmonitor ss -lntp

    docker exec -it transmissions-newsmonitor curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1:6010/api/health