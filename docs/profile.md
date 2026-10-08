# Profile artwork and maintenance

The profile uses a static SVG terminal panel with an ASCII portrait derived from Gustavo's supplied photograph. The English README connects AWS data engineering, the clinic CRM delivered at Neuronz, and current product engineering at Outpost. Descriptions were revised against the user's account, repository evidence, and an authenticated review of the clinic CRM interface. Bico's three paying customers were confirmed by the user; Compra Fácil is described without unmeasured counts.

## Design references

The supplied screenshot shows [Andrew Grant's profile repository](https://github.com/Andrew6rant/Andrew6rant). That repository contains `dark_mode.svg`, `light_mode.svg`, and `today.py`. This implementation has its own portrait, layout, and generator; no artwork or code from that repository was copied.

[Pretext](https://github.com/chenglou/pretext) is a JavaScript/TypeScript text measurement and layout library that can support DOM, Canvas, and SVG output. It could help with a more complex interactive composition. GitHub [sanitizes README HTML and removes scripts](https://github.com/github/markup), so an interactive React or Pretext demo would need its own page; it cannot execute inside the profile README.

This composition has fixed columns and short fields, so it uses a small SVG generator without runtime dependencies. Canvas samples the photograph only when regenerating the portrait. The committed SVGs, ASCII text, and sampled tones are sufficient to rebuild the artwork without the original photo or a browser.

The portrait uses a uniform conversion of the source photograph's luminance. Both character density and ink brightness follow the sampled tones; no regional contrast adjustment is applied to the eye, beard, or other facial features. Its displayed aspect ratio matches the source crop. Background removal starts from near-white edge pixels; a protection polygon tuned to the supplied photograph keeps the bright forehead from being removed where it touches the white background. Dark retained subject cells use at least a dot, and spaces are reserved for the background. Every visible character has an explicit horizontal position, so SVG whitespace normalization cannot collapse the portrait's proportions. The display name uses Gustavo de Oliveira, his preferred professional name.

## Files

- `README.md`: public profile copy and links.
- `assets/profile.svg`: desktop composition.
- `assets/profile-mobile.svg`: stacked composition for viewports up to 600 px.
- `docs/outpost-crm-case.md`: public architecture case with contribution, upstream attribution and integration stage.
- `assets/portrait.txt`: generated ASCII portrait, with 110 rows and up to 160 columns.
- `assets/portrait-tones.json`: sampled source luminance for each cell. The renderer derives character colors from these values, preserving the photograph's tonal direction.
- `scripts/build-profile.mjs`: editable profile fields, colors, and layout.
- `scripts/portrait.html`: local Canvas conversion used by the generator.
- `docs/ats-review.md`: local Portuguese editorial review, excluded from publication.

The original materials in `references/`, the local ATS review, and Windows `Zone.Identifier` files are ignored by Git. The photo conversion runs locally; it does not upload the image to a service.

## Rebuild the artwork

Requires Node.js 18 or newer. No package installation is needed.

```sh
node scripts/build-profile.mjs
```

To change the portrait, also install Chromium or provide the executable path for a compatible browser. The current crop and forehead protection are tuned for the supplied square portrait; adjust them in `scripts/portrait.html` if using a different photo.

```sh
node scripts/build-profile.mjs --photo references/1768696782714.png
node scripts/build-profile.mjs --photo /path/to/photo.png --browser /path/to/chromium
```

The generator uses a disposable browser profile under the system temporary directory. Chromium's sandbox is disabled for this local conversion; the generated page contains the locally embedded photograph and the checked-in conversion code.

The SVGs contain selectable text, descriptions, and no scripts, external fonts, or external images. The README repeats the professional information in Markdown so the artwork is not the only way to read it.

The mobile panel uses a 400 × 480 canvas with the portrait, display name, role and focus. Detailed fields and contact links remain in Markdown. Its portrait uses the same cells, tones and aspect ratio as the desktop version.

## Updating professional information

Edit the README for projects, outcomes, dates, and contact links. Edit the field arrays in the generator for the terminal panel, then rebuild. Review business figures when the underlying reporting period changes. Keep business totals distinct from outcomes attributable to an individual contribution.

Keep implemented integrations distinct from verified operation. The Outpost QM/GBrain case records the scope of the custom integration and the remaining live validation. A private production system can be described as professional experience without publishing its source or customer information.

The paper and credential URLs were extracted from hyperlinks in the supplied PDF and verified during the October 2026 review. The [publication](https://fatecitapetininga.edu.br/academico/perspectiva/pdf/28/e28artigo%20%2829%29.pdf) lists Gustavo as first author in the July–December 2025 issue; it describes a conceptual architecture. The [AWS credential](https://www.credly.com/badges/9b2689d5-5b74-434a-8c99-440c1fe6e0b9) expires on December 16, 2027.
