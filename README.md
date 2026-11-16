# Keletso Hato — Developer Portfolio

A responsive, animated portfolio for **Keletso Hato**, a Software Engineering student and self-taught developer in Lesotho. Built as a static site with no build step or framework.

## Run locally

Open `index.html` directly in a browser, or serve the folder locally:

```powershell
npx serve .
```

No npm install, bundler, or build command is required.

## Project structure

```text
.
├── index.html              # Semantic page markup and metadata
├── css/
│   └── style.css           # Design system, layout, mockups, animations, responsive rules
├── js/
│   └── main.js             # Loader, navigation, reveals, atom hero, Matrix contact
├── assets/
│   ├── favicon.svg         # Brand favicon
│   ├── icons/              # Local Devicon SVG tech logos + custom JavaFX icon
│   └── images/
│       └── og-image.png    # 1200x630 social preview image
├── _archive/               # Original compressed source files (reference only)
└── README.md
```

## Features

- Fixed pill navigation with active-section tracking, scroll progress, and mobile menu.
- Animated hero with pointer parallax, geometric visual stage, orbiting tech chips, and a loader.
- Scroll-reveal sections with staggered delays and service-card spotlights.
- Four project showcases, including supplied promotional artwork for DLALA and TENKONVERTA.
- Interactive project radar with five selectable signals and contextual project details.
- Separate developer console with command history, completion, navigation and project-file commands.
- Shareable project intelligence files connected to the project cards, radar and developer console.
- Skippable, session-limited system boot with code rain.
- Tech stack with local SVG icons and hover tooltips.
- Journey timeline with a scroll-linked progress fill.
- Matrix-inspired contact station with code rain, a typed boot sequence, and a verified GitHub action.
- Respects `prefers-reduced-motion`; cursor glow and parallax only run on fine-pointer devices.
- No-JS fallback hides the loader and keeps content visible.

## Customize

- `index.html`: biography, project-card structure, and metadata.
- `js/projects.js`: shared project information and dossier content. Replace the clearly marked review fields with verified personal contributions and lessons.
- `css/style.css`: colors, typography, spacing, layout, and responsive breakpoints.
- `js/main.js`: interactions, atom hero, and Matrix contact effects.
- `assets/favicon.svg`: brand favicon.
- `assets/images/og-image.png`: replace when the page title or branding changes.

### Content sources

- GitHub: <https://github.com/Hato444>
- Oxsnow: <https://oxsnow.vercel.app/> · <https://github.com/Hato444/oxsnow>
- HA RE YENG: <https://bejewelled-beignet-e43cfc.netlify.app/> (source repository intentionally not linked)
- DLALA: <https://github.com/Hato444/-DLALA> (no live deployment linked)
- OneGov Lesotho: <https://github.com/Hato444/-onegov-lesotho>
- TENKONVERTA: <https://github.com/Hato444/TENKONVERTA> (no public installer release verified)

## Deploy

1. Create a public GitHub repository, for example `hato-portfolio`.
2. Upload the project with `index.html` at the repository root.
3. Deploy on Netlify with no build command and publish directory `.`, or use Netlify Drop.
4. Add the live URL to the GitHub profile **Website** field and to `Hato444/Hato444/README.md`.

## Missing assets / next steps

- **Real project screenshots are still needed.** The current project visuals are CSS mockups labeled "Concept preview". Replace them with actual screenshots when available.
- Confirm whether HA RE YENG's source repository can be linked.
- Add a live deployment URL once the site is published.
- After deployment, change the relative `og:image` and `twitter:image` paths in `index.html` to absolute URLs so social platforms can fetch the preview image.

## Notes

- No fabricated client metrics, work experience, testimonials, or contact details.
- GitHub is currently the only verified contact channel.
- TENKAMEIN is deliberately excluded from this developer portfolio.
- Tech icons are stored locally in `assets/icons/` and originate from [Devicon](https://devicon.dev/), subject to their respective licenses. Google Fonts still require an internet connection, with system fallbacks provided.
- The original compressed `style.css` and `script.js` are preserved in `_archive/` for reference.
