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
- All product pages use the original reference layout in a shadow root: FamiLock retains its verbatim markup, while other models fill a stripped reference template with their own catalogue data to prevent cross-product claims; media uses registered asset pointers and original scripts are not executed.
