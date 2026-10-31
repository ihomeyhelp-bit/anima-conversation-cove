<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Category pages use one dynamic TanStack route; every category renders the same complete sanitized category reference markup and registered media inside a shared shadow root (preserve source wrappers, never execute imported scripts, keep the verbatim reference isolated from site styles), except smart-locks and robot-vacuums which keep the earlier hand-built page in category-page-legacy.tsx with their own catalogue content.
- Store navigation is shared between the homepage and category pages so category destinations remain consistent.
- Product pages use a shared dynamic route and catalogue derived from category products so links, galleries, and details resolve consistently; purchases hand off explicitly to the official store until commerce is connected.
- Every product route renders the same complete sanitized FamiLock source markup and reference media in OriginalProductPage's shadow root; other products identify that content as provisional reference material while purchase handoffs retain catalogue identity, preventing placeholder claims from being mistaken for verified model data. Original scripts never execute.
