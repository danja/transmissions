# Conventions

- keeping it simple, with sensible defaults
- keeping concerns separate :
  - `transmission.ttl` = topology
  - `services.ttl` = details of individual service configurations
    together they define the application
  - `manifest.ttl` = application instance configuration

### Terminology

- `URL` is the fully qualified resource locater, e.g. `https:///danny.ayers.name/blog/2024-05-03_two.html` (this can be considered a synonym for `URI` and `IRI` in the context of RDF etc - here all URIs _SHOULD_ be resolvable over http)
- `relURL` - a relative URL
- `filename` is the local name of an fs file, without path, e.g. `/home/danny/HKMS/postcraft/danny.ayers.name/public/post-content-cache/2024-05-03_two.html`
- `filepath` is the full fs file path and name of a file, e.g. `2024-05-03_two.md`
- `slug` is the part of a filename without any extension, e.g. `2024-05-03_two` (see [Slug](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide#slugs), though the naming style here differs)

  Postcraft : use Atom terms

other refs?

Use pseudo-namespaces to reflect the aspect of #Transmissions in which an artifact appears:

- `t:transmission` - typically `transmission.ttl`
- `t:service
- `t:manifest` - typically `manifest.ttl` in the application root

- in docs as `s:ServiceName`

#### Services
