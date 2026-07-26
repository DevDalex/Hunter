# Succession Visual Redesign — Non-Critical Debt

This record separates acceptable remaining constraints from release-blocking defects. Items listed here must not be misrepresented as completed data, exact spatial knowledge, or merged production state.

## Data and evidence boundaries

- The archive reading boundary can be newer than the maintained detailed voyage-event chronology. The interface must display the selected archive boundary without claiming that every chapter has a separately timestamped timeline event.
- Black Whale spatial bridges retain explicit `exact`, `aggregate`, `approximate`, and `legacy` precision. Approximate or aggregate records are not promoted to exact room coordinates by the visual map.
- Missing chapter research, incomplete mechanics, unresolved relationships, and uncertain body or consciousness states remain visible gaps rather than presentation-generated conclusions.

## Media constraints

- Some canonical visuals rely on approved Hunterpedia/Wikia hosts. Network failure must fall back to maintained local media or an accessible placeholder.
- A visual placeholder is an availability state, not evidence that no canonical image exists.
- Full-page visual QA intentionally forces lazy images while production continues to use near-viewport loading.

## Compatibility constraints

- Import-only compatibility entries may remain where removing a stable stylesheet path would create unnecessary component churn. They must contain no competing declarations.
- The final Chromium matrix covers every curated Succession release route. Firefox and WebKit cover representative high-complexity routes at desktop and mobile sizes rather than duplicating the entire Chromium screenshot matrix.
- Intentional wide structures—relationship matrices, timeline swimlanes, the ship atlas, and advanced tables—may remain horizontally navigable on narrow screens only when an ordinary semantic list or card alternative is present.

## Integration status

- PRs #50–#54 form a stacked redesign series and remain unmerged until explicitly merged by the repository owner.
- Passing the dedicated redesign closure gate does not silently merge the stack or resolve unrelated repository-wide failures outside the Succession redesign scope.
- Issue #49 should remain open until the final latest-head gate and manual artifact review pass.

## Maintenance guidance

- New Succession visual work should use semantic design tokens instead of adding raw route colors.
- New repeated records should preserve the 11px readability floor and 44px touch target contract.
- New graphs and maps require a complete textual equivalent.
- New motion requires a reduced-motion equivalent.
- New dense result sets should use containment, pagination, or virtualization rather than unbounded initial rendering.
