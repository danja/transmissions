# NewsMonitor Remote Deployment Guide

## Troubleshooting 504 Gateway Timeout

If you're getting a 504 Gateway Timeout error on your remote server, follow these steps:

### 1. Test SPARQL Connectivity

First, check if the NewsMonitor container can reach Fuseki:

```bash
# On your remote server
curl https://strandz.it/api/diagnostics
```

Expected response:
```json
{
  "status": "ok",
  "sparql": {
    "endpoint": "http://...:3030/newsmonitor/query",
    "reachable": true,
    "responseTime": "50ms"
  }
}
```

If `reachable: false`, check:
- Is Fuseki running? `docker ps | grep fuseki`
- Can the container reach Fuseki? Check `FUSEKI_BASEURL` in `.env`
- Network configuration between containers

### 2. Check Nginx Timeout Configuration

The 504 error is usually caused by nginx timing out. Update your nginx config:

```nginx
# In your nginx site config for strandz.it
location / {
    proxy_pass http://localhost:6010;

    # IMPORTANT: Increase these timeouts
    proxy_read_timeout 60s;      # Was probably 30s or less
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
}

# Special handling for long-running operations
location /api/update-feeds {
    proxy_pass http://localhost:6010;
    proxy_read_timeout 300s;  # 5 minutes for feed updates
}
```

After updating, reload nginx:
```bash
sudo nginx -t  # Test config
sudo systemctl reload nginx
```

### 3. Check Container Environment

On the remote server, verify the container has the correct Fuseki URL:

```bash
docker exec transmissions-newsmonitor printenv | grep FUSEKI
```

Should show:
```
FUSEKI_BASEURL=http://172.17.0.1:3030  # or your Fuseki host
FUSEKI_USERNAME=admin
FUSEKI_PASSWORD=admin123
```

If `FUSEKI_BASEURL` is wrong or empty:
1. Check `.env` file has `FUSEKI_BASEURL` set
2. Rebuild and restart: `docker compose up -d --build`

### 4. Test Feed Query Performance

Check how long the feeds query takes:

```bash
time curl -s https://strandz.it/api/feeds | jq '.feeds | length'
```

Should complete in < 1 second. If slower:
- Check Fuseki performance
- Verify Fuseki has enough memory
- Consider optimizing SPARQL queries

### 5. Check Container Logs

Look for SPARQL errors:

```bash
docker logs transmissions-newsmonitor --tail 100 | grep -i error
```

Common issues:
- `ECONNREFUSED`: Fuseki not reachable
- `ECONNABORTED`: Query timeout
- `401 Unauthorized`: Wrong Fuseki credentials

## Quick Fixes

### Fix 1: Increase Nginx Timeout (Most Common)

```bash
# Edit your nginx config
sudo nano /etc/nginx/sites-available/strandz.it

# Add/update these lines in the location / block:
proxy_read_timeout 60s;
proxy_connect_timeout 60s;
proxy_send_timeout 60s;

# Reload nginx
sudo nginx -t && sudo systemctl reload nginx
```

### Fix 2: Use Host Network (If Fuseki on Same Server)

If Fuseki is on the same server, you can use `host.docker.internal`:

```bash
# In .env
FUSEKI_BASEURL=http://host.docker.internal:3030
```

Then rebuild:
```bash
docker compose up -d --build
```

### Fix 3: Check Fuseki is Accessible

From inside the container:

```bash
docker exec transmissions-newsmonitor curl -s "http://172.17.0.1:3030/newsmonitor/query" \
  --data-urlencode "query=SELECT (COUNT(*) as ?count) WHERE { ?s ?p ?o }" \
  -u admin:admin123
```

Should return JSON with results.

## Production Checklist

- [ ] Nginx timeout increased to 60s+
- [ ] FUSEKI_BASEURL correctly set in `.env`
- [ ] Container can reach Fuseki (`/api/diagnostics` shows ok)
- [ ] SSL configured (recommended)
- [ ] Firewall allows traffic on port 6010
- [ ] Fuseki has auth enabled
- [ ] Regular backups of Fuseki data

## Performance Tips

1. **Index Fuseki**: Add indexes for frequently queried fields
2. **Limit Feed Count**: Don't subscribe to too many feeds (< 100 recommended)
3. **Adjust Update Interval**: Increase `UPDATE_INTERVAL` in `.env` if needed
4. **Use SSD**: Store Fuseki data on SSD for faster queries

## Getting Help

If still having issues:

1. Check `/api/diagnostics` - Should show `status: ok`
2. Check `/api/health` - Should show endpoint configuration
3. Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
4. Check container logs: `docker logs transmissions-newsmonitor -f`

## Example Nginx Configuration

See `docker/nginx.conf.example` for a complete working configuration with proper timeouts.
