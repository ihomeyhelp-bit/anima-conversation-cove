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

- Category pages use one dynamic TanStack route and a shared data-driven layout so every category preserves the same reference design without duplicated pages.
- Store navigation is shared between the homepage and category pages so category destinations remain consistent.
- Product pages use a shared dynamic route and catalogue derived from category products so links, galleries, and details resolve consistently; purchases hand off explicitly to the official store until commerce is connected.
- Product layout selection is centralized by product family: robot vacuums and baby monitors render sanitized complete clean-reference markup and original CSS in a shadow root; matching models retain source sections, other models fill source wrappers with their own data to prevent cross-product claims; other families retain the original layout, media is registered and original scripts never execute.
