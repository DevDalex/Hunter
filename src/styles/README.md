# Global CSS ownership

`src/styles.css` is the only global stylesheet imported by the React entry point. Its import order is intentional and must remain stable.

- `base.css` owns design tokens, resets, shared layout primitives, and the original component contracts. Add broadly reusable selectors here.
- `editorial.css` owns the museum/editorial redesign layer. It may deliberately override base rules, but it should not introduce unrelated route systems.
- `experiences.css` owns later page-specific and route-specific visual systems, including their responsive behavior.
- `../nen.css` is isolated from the global stack because the Nen workbench has its own media and interaction layout contract.

A repeated selector is not automatically an error: the later layers are override layers. An exact repeated selector-and-declaration block is usually redundant and should be removed when encountered. Run `npm run audit:css` after changing ownership, imports, or file names.
