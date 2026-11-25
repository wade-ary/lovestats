# Weighted matching attribution

`blossom.js` is vendored from [EdmondsBlossom](https://github.com/mattkrick/EdmondsBlossom), npm `edmonds-blossom` version 1.0.0, under the accompanying MIT license (`blossom-LICENSE`). Registry tarball SHA-1: `e937273bd3cbe12710b66846e1e5b5086bdf1f97`.

Local adaptations: replace CommonJS export with an ES-module default export; declare the upstream implicit `b` and `path` variables in `addBlossom`, and `v` in `expandBlossom`, for strict module execution. No algorithm changes intended.

Used for exact full weighted Swiss matching. `check-football.mjs` checks small weighted graphs against exhaustive perfect matchings and tournament pairing constraints. No CDN or package install is required at runtime.
