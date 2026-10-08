# Profile artwork and maintenance

The profile uses a static SVG terminal panel with an ASCII portrait derived from Gustavo's supplied photograph. The English README contains the card, a brief introduction and three navigation links. The selected-work page connects AWS data engineering, the clinic CRM delivered at Neuronz and current product engineering at Outpost. Each project uses the same contribution, technology and result/stage fields. Descriptions were revised against the user's account, repository evidence and an authenticated review of the clinic CRM interface. Bico's three paying customers and Compra Fácil's 250+ unique Android users were confirmed by the user. The latter count excludes iOS users and customers ordering through WhatsApp.

## Design references

The supplied screenshot shows [Andrew Grant's profile repository](https://github.com/Andrew6rant/Andrew6rant). That repository contains `dark_mode.svg`, `light_mode.svg`, and `today.py`. This implementation has its own portrait, layout, and generator; no artwork or code from that repository was copied.

[Pretext](https://github.com/chenglou/pretext) is a JavaScript/TypeScript text measurement and layout library that can support DOM, Canvas, and SVG output. It could help with a more complex interactive composition. GitHub [sanitizes README HTML and removes scripts](https://github.com/github/markup), so an interactive React or Pretext demo would need its own page; it cannot execute inside the profile README.

This composition has fixed columns and short fields, so it uses a small SVG generator without runtime dependencies. Canvas samples the photograph only when changing the source. The committed tone samples, crop geometry and glyph outline are sufficient to rebuild the ASCII grid and SVGs without the original photo or a browser.

The portrait was rebuilt from the corrected source, `references/profile_image (1).png`. The previous photograph's crop, highlight polygons and contrast settings are not used. Background removal finds the largest nonwhite connected subject and fills enclosed highlights, then derives a crop with a small margin. The grid and displayed aspect ratio follow that crop. At Gustavo's request, a feathered adjustment darkens the existing chin beard; its normalized source coordinates are defined in `beardShade` in the generator. Review that adjustment when replacing the photo.

Each foreground cell uses the same ASCII `@` shape, with its gray ink set from the sampled luminance. A constant texture keeps changes between letter shapes from producing bands across the skin. A small-radius detail enhancement is applied uniformly across the subject before a monotonic brightness curve; background pixels are excluded from the neighborhood average. Spaces represent only the background. The 128 × 88 grid and the original 748 × 861 crop are preserved.

Portrait characters are internal SVG paths reused at fixed positions, with neutral gray fills. There is no raster photo, image overlay or blur filter in the SVG. Fixed paths keep the character shape independent of installed fonts, fallback fonts and small-text hinting. Profile labels remain ordinary SVG text. The outline comes from Liberation Mono Bold; its copyright and SIL Open Font License are included in `assets/portrait-glyphs.LICENSE.txt`. The display name uses Gustavo de Oliveira, his preferred professional name.

## Files

- `README.md`: card, brief introduction and links to selected work, LinkedIn and email.
- `assets/profile.svg`: desktop composition for viewports above 1100 px.
- `assets/profile-compact.svg`: horizontal composition for viewports from 521 to 1100 px.
- `assets/profile-mobile.svg`: stacked composition for viewports up to 520 px.
- `docs/selected-work.md`: consistent project summaries, experience, education and certification links.
- `docs/outpost-crm-case.md`: public architecture case with contribution, upstream attribution and integration stage.
- `docs/bico-case.md`: current Flutter product, AI scope, version history and confirmed commercial outcome.
- `assets/portrait.txt`: the generated character grid, with 88 rows and up to 128 columns. It records the silhouette; the grayscale shading is applied by the SVG renderer.
- `assets/portrait-tones.json`: source luminance for each cell (`null` for background), source/crop dimensions, grid size and cell aspect ratio. The renderer derives ink intensity from these samples.
- `assets/portrait-glyphs.json`: the fixed `@` outline, spacing and stroke width used in SVG rendering.
- `assets/portrait-glyphs.LICENSE.txt`: copyright notice and license for those outlines.
- `scripts/build-profile.mjs`: editable profile fields, colors, and layout.
- `scripts/portrait.html`: local Canvas conversion used by the generator.
- `scripts/trace-portrait-font.py`: optional outline export tool, used only when changing the glyph shapes.
- `docs/ats-review.md`: local Portuguese editorial review, excluded from publication.

The original materials in `references/`, the local ATS review, and Windows `Zone.Identifier` files are ignored by Git. The photo conversion runs locally; it does not upload the image to a service.

## Rebuild the artwork

Requires Node.js 18 or newer. No package installation is needed.

```sh
node scripts/build-profile.mjs
```

To change the portrait, also install Chromium or provide the executable path for a compatible browser. No font installation is needed: the renderer uses the saved glyph path. Background removal expects a portrait on a white background; review the silhouette when using a different photo. The crop and row count are computed from the new subject. Tone and detail settings in the generator can be rebuilt from saved samples without opening the original photo.

```sh
node scripts/build-profile.mjs --photo "references/profile_image (1).png"
node scripts/build-profile.mjs --photo /path/to/photo.png --browser /path/to/chromium
```

To re-export the glyph outline, install Python's `fontTools` package and run the optional command below with Liberation Mono Bold. Keep its license with the exported path, then rebuild the SVGs. Changes to the outline or `strokeWidth` do not require resampling the photograph.

```sh
python scripts/trace-portrait-font.py /path/to/LiberationMono-Bold.ttf assets/portrait-glyphs.json
```

The generator uses a disposable browser profile under the system temporary directory. Chromium's sandbox is disabled for this local conversion; the generated page contains the locally embedded photograph and the checked-in conversion code.

The SVGs contain text, descriptions, and no scripts, external fonts, or external images. The README image has descriptive alternative text; professional details and project evidence are also available as Markdown on the selected-work page. Contact links live below the image, where they are clickable and usable with a keyboard.

The desktop panel uses a 1000 × 460 canvas; the compact panel uses 600 × 350 and the mobile panel uses 400 × 578. All three show the same name, role, organization, focus, core languages and location, sourced from one profile object in the generator. The name and role lead the hierarchy; detailed technology lists belong with the projects. All three portraits use the same cells, tones and aspect ratio.

## Updating professional information

Edit `docs/selected-work.md` for projects, outcomes, dates and background. Keep the README introduction and links brief. Edit the profile object in the generator for the terminal panel, then rebuild. Review business figures when the underlying reporting period changes. Keep business totals distinct from outcomes attributable to an individual contribution.

The README pins all three image URLs to the commit containing the reviewed artwork. A query on a `main`-branch URL did not reliably avoid stale image responses during verification. After changing the artwork, commit the generated SVGs, update all three README URLs to that commit's full SHA, then publish the README. Ordinary copy changes do not require an artwork update.

Keep implemented integrations distinct from verified operation. The Outpost QM/GBrain case records the scope of the custom integration and the remaining live validation. A private production system can be described as professional experience without publishing its source or customer information.

The paper and credential URLs were extracted from hyperlinks in the supplied PDF and verified during the October 2026 review. The [publication](https://fatecitapetininga.edu.br/academico/perspectiva/pdf/28/e28artigo%20%2829%29.pdf) lists Gustavo as first author in the July–December 2025 issue; it describes a conceptual architecture. The [AWS credential](https://www.credly.com/badges/9b2689d5-5b74-434a-8c99-440c1fe6e0b9) expires on December 16, 2027.
