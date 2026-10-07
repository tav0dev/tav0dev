# Profile artwork and maintenance

The profile uses a static SVG terminal panel with an ASCII portrait derived from Gustavo's supplied photograph. The English README connects AWS data engineering, AI product development, and client-facing technical delivery. Project descriptions and business figures come from the supplied ATS resume; repository links were checked separately.

## Design references

The supplied screenshot shows [Andrew Grant's profile repository](https://github.com/Andrew6rant/Andrew6rant). That repository contains `dark_mode.svg`, `light_mode.svg`, and `today.py`. This implementation has its own portrait, layout, and generator; no artwork or code from that repository was copied.

[Pretext](https://github.com/chenglou/pretext) is a JavaScript/TypeScript text measurement and layout library that can support DOM, Canvas, and SVG output. It could help with a more complex interactive composition. GitHub [sanitizes README HTML and removes scripts](https://github.com/github/markup), so an interactive React or Pretext demo would need its own page; it cannot execute inside the profile README.

This composition has fixed columns and short fields, so it uses a small SVG generator without runtime dependencies. Canvas samples the photograph only when regenerating the portrait. The committed SVGs and ASCII text are sufficient to rebuild the artwork without the original photo or a browser.

## Files

- `README.md`: public profile copy and links.
- `assets/profile.svg`: desktop composition.
- `assets/profile-mobile.svg`: stacked composition for viewports up to 600 px.
- `assets/portrait.txt`: generated ASCII portrait, with 46 rows and up to 68 columns.
- `scripts/build-profile.mjs`: editable profile fields, colors, and layout.
- `scripts/portrait.html`: local Canvas conversion used by the generator.
- `docs/ats-review.md`: local Portuguese editorial review, excluded from publication.

The original materials in `references/`, the local ATS review, and Windows `Zone.Identifier` files are ignored by Git. The photo conversion runs locally; it does not upload the image to a service.

## Rebuild the artwork

Requires Node.js 18 or newer. No package installation is needed.

```sh
node scripts/build-profile.mjs
```

To change the portrait, also install Chromium or provide the executable path for a compatible browser. The current crop is tuned for the supplied square portrait; adjust the crop in `scripts/portrait.html` if using a different photo.

```sh
node scripts/build-profile.mjs --photo references/1768696782714.png
node scripts/build-profile.mjs --photo /path/to/photo.png --browser /path/to/chromium
```

The generator uses a disposable browser profile under the system temporary directory. Chromium's sandbox is disabled for this local conversion; the generated page contains the locally embedded photograph and the checked-in conversion code.

The SVGs contain selectable text, descriptions, and no scripts, external fonts, or external images. The README repeats the professional information in Markdown so the artwork is not the only way to read it.

## Updating professional information

Edit the README for projects, outcomes, dates, and contact links. Edit the field arrays in the generator for the terminal panel, then rebuild. Review business figures when the underlying reporting period changes. Keep business totals distinct from outcomes attributable to an individual contribution.

The paper and credential URLs were extracted from hyperlinks in the supplied PDF. Their targets could not be independently retrieved during this review; verify them before relying on them in a job application.
