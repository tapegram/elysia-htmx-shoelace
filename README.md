# Bun, Elysia, (Turso?), Htmx (ft Hyperscript)

Rolling my own BETH stack from scratch to learn and to make a starter.

## Technologies

- Bun
- Elysia for the server
- Htmx for frontend behavior
- Shoelace web components for a design system and most behavior
- Tailwind for some extra styling
- Hyperscript for simple behaviors in the html
- Turso for the DB

## Live reload

Implemented ourselves using web sockets.

Based on https://github.com/elysiajs/elysia/issues/125#issuecomment-1716994577

## Shoelace

In order to use shoelace components and not have tsx cause type errors, add any of the needed elements to `shoelace.d.ts`
