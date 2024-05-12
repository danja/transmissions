# Conventions

- keeping it simple, with sensible defaults
- keeping concerns separate :
  - `transmission.ttl` = topology
  - `services.ttl` = details of individual service configurations
    together they define the application
  - `manifest.ttl` = application instance configuration

### Terminology

Postcraft : use Atom terms

other refs?

Use pseudo-namespaces to reflect the aspect of #Transmissions in which an artifact appears:

- `t:transmission` - typically `transmission.ttl`
- `t:service
- `t:manifest` - typically `manifest.ttl` in the application root

- in docs as `s:ServiceName`

#### Services
