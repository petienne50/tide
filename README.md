# TIDE Belize static website

The deployable website is `out/`. It contains plain HTML, CSS, JavaScript, photographs, and downloadable documents. Upload its contents to a static web host that supports directory index pages.

## Editing

Each page is stored in `content/` as a JSON file with a title, fixed URL, header photo, and formatted HTML body. `.pages.yml` configures Pages CMS to edit these fields with formatting controls at https://app.pagescms.org. The owner has connected Pages CMS to `petienne50/tide`. Choose that repository and open Website pages. Preserve page URLs when changing text.

Install dependencies with `pnpm install --frozen-lockfile`, then run `node build.cjs`. The build updates the static HTML files in `out/`. The GitHub workflow rebuilds and commits those files when the source is changed, and can also be run manually. The generated files stay in the repository, without storing another full copy as a workflow artifact. The workflow does not deploy to the live TIDE domain or the private Sites preview.

## Editing layouts and shared sections

Edit these source files in GitHub or a code editor:

| File | What it changes |
| --- | --- |
| `partials/header.html` | Shared logo, contact strip, and header structure |
| `partials/menu.html` | Shared navigation links and submenus |
| `partials/footer.html` | Shared footer content and links |
| `partials/head.html` | Shared page metadata, stylesheet, and script links |
| `templates/document.html` | The common HTML document around every page |
| `templates/page.html` | Default photo header and article layout |
| `pages/<page-name>.html` | Layout changes for one page only |
| `content/<page-name>.json` | Page wording and photo selection, also editable through Pages CMS |

For example, `pages/paynes-creek-national-park.html` controls `/paynes-creek-national-park/`. Nested addresses use double underscores, such as `pages/our-story__management-plans.html`.

Each normal page initially includes `{{> templates/page.html}}`. To customize only that page, replace this include with a copy of the HTML from `templates/page.html`, then edit its layout. Keep `{{{body}}}` where the text from Pages CMS should appear. Available page values are `title`, `intro`, `picture`, `heroClass`, `heroCaption`, `sectionLabel`, `storyLink`, `contentClass`, and `body`. Use `{{title}}` for escaped text and triple braces for an HTML fragment. Generated archive, directory, and staff pages use `{{{main}}}` for their generated content.

The header, menu, and footer are included once by the document template. Do not paste them into individual page files. An edit to a shared source file applies to every generated page on the next build. GitHub now runs the build automatically when shared templates, page layouts, or page text are saved on `main`. The manual **Build website files** action remains available. Publishing the rebuilt files to the live host is still a separate step.

Do not make lasting layout edits to `out/**/index.html`: these are generated files and will be replaced when the site rebuilds. The published output is ordinary standalone HTML, so navigation and shared sections work without browser-side includes or JavaScript.

`out/site.css` and `out/site.js` hold the design and interactions. `archives.json` stores category/tag listings, and `resources.json` records downloaded-resource addresses. The private Sites review uses smaller photographs and links to document downloads on their original servers; the full `out/` version carries its own document files.

## Migration archive

On the migration computer, `dist/wp-content/uploads/` preserves the downloaded original resources, including full-size photos and videos. This folder is deliberately excluded from Git; copy it separately when making a complete backup. It contains several gigabytes of files. `out/` uses optimized photo copies; PDF and Office files are copied without content changes.

The local `archive/` folder records original WordPress content, the asset inventory, failed downloads, recovered links, large videos, and validation results. It is also excluded from Git.

Forty-one failed links were matched to surviving files elsewhere in the archive. Twenty-nine requested resources remained unavailable on the original servers. Missing photographs are identified on affected pages. Eighteen videos exceed the static host's single-file limit; their originals are saved locally and their embedded players still use the original TIDE server. Choose durable video hosting before retiring that server.

Contact and grievance forms link to their original pages until replacement form handling is configured. Existing external donation and other service links remain external. WordPress account, cart, checkout, and shop routes are preserved as content; their original server-side commerce behavior is not recreated.

## Validation

`node check.cjs` audits generated local links, image references, and oversized files and writes `archive/validation.json`. Browser review covered the homepage, a protected-area page, navigation, and search. Pages CMS is configured and the owner reports that its GitHub connection is complete; no test edit was submitted through its interface. Form submission and deployment to the final independent host remain integration work.
