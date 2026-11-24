# TIDE Belize static website

The deployable website is `out/`. It contains plain HTML, CSS, JavaScript, photographs, and downloadable documents. Upload its contents to a static web host that supports directory index pages.

## Editing

Each page is stored in `content/` as a JSON file with a title, fixed URL, header photo, and formatted HTML body. `.pages.yml` configures Pages CMS to edit these fields with formatting controls at https://app.pagescms.org. The owner has connected Pages CMS to `petienne50/tide`. Choose that repository and open Website pages. Preserve page URLs when changing text.

Install dependencies with `pnpm install --frozen-lockfile`, then run `node build.cjs`. The build updates the static HTML files in `out/`. A manually triggered GitHub workflow is prepared to rebuild and commit those files and provide a downloadable site artifact. It does not deploy to the live TIDE domain or the private Sites preview.

`navigation.html` stores the nested navigation. `out/site.css` and `out/site.js` hold the design and interactions. `archives.json` stores category/tag listings, and `resources.json` records downloaded-resource addresses. The private Sites review uses smaller photographs and links to document downloads on their original servers; the full `out/` version carries its own document files.

## Migration archive

On the migration computer, `dist/wp-content/uploads/` preserves the downloaded original resources, including full-size photos and videos. This folder is deliberately excluded from Git; copy it separately when making a complete backup. It contains several gigabytes of files. `out/` uses optimized photo copies; PDF and Office files are copied without content changes.

The local `archive/` folder records original WordPress content, the asset inventory, failed downloads, recovered links, large videos, and validation results. It is also excluded from Git.

Forty-one failed links were matched to surviving files elsewhere in the archive. Twenty-nine requested resources remained unavailable on the original servers. Missing photographs are identified on affected pages. Eighteen videos exceed the static host's single-file limit; their originals are saved locally and their embedded players still use the original TIDE server. Choose durable video hosting before retiring that server.

Contact and grievance forms link to their original pages until replacement form handling is configured. Existing external donation and other service links remain external. WordPress account, cart, checkout, and shop routes are preserved as content; their original server-side commerce behavior is not recreated.

## Validation

`node check.cjs` audits generated local links, image references, and oversized files and writes `archive/validation.json`. Browser review covered the homepage, a protected-area page, navigation, and search. Pages CMS is configured and the owner reports that its GitHub connection is complete; no test edit was submitted through its interface. Form submission and deployment to the final independent host remain integration work.
