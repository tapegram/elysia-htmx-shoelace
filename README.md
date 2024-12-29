# Bun, Elysia, (Turso?), Htmx (ft Hyperscript)

Rolling my own BETH stack from scratch to learn and to make a starter.
Heavily referencing: https://www.youtube.com/watch?v=cpzowDDJj24&t=742s

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

## DB

Using Turso + Drizzle as the orm

Applying changes: https://orm.drizzle.team/docs/get-started/turso-existing#step-9---applying-changes-to-the-database-optional

## Scripting with hyperscript

https://hyperscript.org/img/hyperscript-cheatsheet.pdf

## Todo

- deploy on render.com
- Setup db migrations to run on deploys (part of a deploy script?)
