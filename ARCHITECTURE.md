# Architecture

If you are an AI looking for context, look here!

When generating code, please consider the following

## Tech Stack

This codebase is using the BETH stack plus some extra bits.

### Bun

Develop, test, run, and bundle JavaScript & TypeScript projects—all with Bun. Bun is an all-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager.

### Elysia

https://github.com/elysiajs/documentation/blob/main/docs/at-glance.md

<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Playground from '../components/nearl/playground.vue'

import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', 'Hello Elysia')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)

const demo2 = new Elysia()
    .get('/user/:id', ({ params: { id }}) => id)
    .get('/user/abc', () => 'abc')
</script>

# At glance

Elysia is an ergonomic web framework for building backend servers with Bun.

Designed with simplicity and type-safety in mind, Elysia has a familiar API with extensive support for TypeScript, optimized for Bun.

Here's a simple hello world in Elysia.

```typescript twoslash
import { Elysia } from "elysia";

new Elysia()
  .get("/", "Hello Elysia")
  .get("/user/:id", ({ params: { id } }) => id)
  .post("/form", ({ body }) => body)
  .listen(3000);
```

Navigate to [localhost:3000](http://localhost:3000/) and it should show 'Hello Elysia' as a result.

<Playground
    :elysia="demo1"
    :alias="{
        '/user/:id': '/user/1'
    }"
    :mock="{
        '/user/:id': {
            GET: '1'
        },
        '/form': {
            POST: JSON.stringify({
                hello: 'Elysia'
            })
        }
    }"
/>

::: tip
Hover over the code snippet to see the type definition.

In the mock browser, click on the path highlighted in blue to change paths and preview the response.

Elysia can run in the browser, and the results you see are actually run using Elysia.
:::

## Performance

Building on Bun and extensive optimization like Static Code Analysis allows Elysia to generate optimized code on the fly.

Elysia can outperform most of the web frameworks available today<a href="#ref-1"><sup>[1]</sup></a>, and even match the performance of Golang and Rust frameworks<a href="#ref-2"><sup>[2]</sup></a>.

| Framework     | Runtime | Average     | Plain Text | Dynamic Parameters | JSON Body  |
| ------------- | ------- | ----------- | ---------- | ------------------ | ---------- |
| bun           | bun     | 262,660.433 | 326,375.76 | 237,083.18         | 224,522.36 |
| elysia        | bun     | 255,574.717 | 313,073.64 | 241,891.57         | 211,758.94 |
| hyper-express | node    | 234,395.837 | 311,775.43 | 249,675            | 141,737.08 |
| hono          | bun     | 203,937.883 | 239,229.82 | 201,663.43         | 170,920.4  |
| h3            | node    | 96,515.027  | 114,971.87 | 87,935.94          | 86,637.27  |
| oak           | deno    | 46,569.853  | 55,174.24  | 48,260.36          | 36,274.96  |
| fastify       | bun     | 65,897.043  | 92,856.71  | 81,604.66          | 23,229.76  |
| fastify       | node    | 60,322.413  | 71,150.57  | 62,060.26          | 47,756.41  |
| koa           | node    | 39,594.14   | 46,219.64  | 40,961.72          | 31,601.06  |
| express       | bun     | 29,715.537  | 39,455.46  | 34,700.85          | 14,990.3   |
| express       | node    | 15,913.153  | 17,736.92  | 17,128.7           | 12,873.84  |

## TypeScript

Elysia is designed to help you write less TypeScript.

Elysia's Type System is fine-tuned to infer your code into types automatically, without needing to write explicit TypeScript, while providing type-safety at both runtime and compile time to provide you with the most ergonomic developer experience.

Take a look at this example:

```typescript twoslash
import { Elysia } from "elysia";

new Elysia()
  .get("/user/:id", ({ params: { id } }) => id)
  // ^?
  .listen(3000);
```

<br>

The above code creates a path parameter "id". The value that replaces `:id` will be passed to `params.id` both at runtime and in types without manual type declaration.

<Playground
    :elysia="demo2"
    :alias="{
        '/user/:id': '/user/123'
    }"
    :mock="{
        '/user/:id': {
            GET: '123'
        },
    }"
/>

Elysia's goal is to help you write less TypeScript and focus more on business logic. Let the complex types be handled by the framework.

TypeScript is not needed to use Elysia, but it's recommended to use Elysia with TypeScript.

## Type Integrity

To take a step further, Elysia provides **Elysia.t**, a schema builder to validate types and values at both runtime and compile-time to create a single source of truth for your data-type.

Let's modify the previous code to accept only a numeric value instead of a string.

```typescript twoslash
import { Elysia, t } from "elysia";

new Elysia()
  .get("/user/:id", ({ params: { id } }) => id, {
    // ^?
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .listen(3000);
```

This code ensures that our path parameter **id** will always be a numeric string and then transforms it into a number automatically at both runtime and compile-time (type-level).

::: tip
Hover over "id" in the above code snippet to see a type definition.
:::

With Elysia's schema builder, we can ensure type safety like a strongly-typed language with a single source of truth.

## Standard

Elysia adopts many standards by default, like OpenAPI, and WinterCG compliance, allowing you to integrate with most of the industry standard tools or at least easily integrate with tools you are familiar with.

For instance, because Elysia adopts OpenAPI by default, generating documentation with Swagger is as easy as adding a one-liner:

```typescript twoslash
import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";

new Elysia()
  .use(swagger())
  .get("/user/:id", ({ params: { id } }) => id, {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .listen(3000);
```

With the Swagger plugin, you can seamlessly generate a Swagger page without additional code or specific config and share it with your team effortlessly.

## End-to-end Type Safety

With Elysia, type safety is not limited to server-side only.

With Elysia, you can synchronize your types with your frontend team automatically like tRPC, with Elysia's client library, "Eden".

```typescript twoslash
import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(swagger())
  .get("/user/:id", ({ params: { id } }) => id, {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .listen(3000);

export type App = typeof app;
```

And on your client-side:

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from "elysia";

const app = new Elysia()
  .get("/user/:id", ({ params: { id } }) => id, {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .listen(3000);

export type App = typeof app;

// @filename: client.ts
// ---cut---
// client.ts
import { treaty } from "@elysiajs/eden";
import type { App } from "./server";

const app = treaty<App>("localhost:3000");

// Get data from /user/617
const { data } = await app.user({ id: 617 }).get();
// ^?

console.log(data);
```

With Eden, you can use the existing Elysia types to query an Elysia server **without code generation** and synchronize types for both frontend and backend automatically.

Elysia is not only about helping you create a confident backend but for all that is beautiful in this world.

## Platform Agnostic

Elysia was designed for Bun, but is **not limited to Bun**. Being [WinterCG compliant](https://wintercg.org/) allows you to deploy Elysia servers on Cloudflare Workers, Vercel Edge Functions, and most other runtimes that support Web Standard Requests.

## Our Community

If you have questions or get stuck regarding Elysia, feel free to ask our community on GitHub Discussions, Discord, and Twitter.

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        Official ElysiaJS discord community server
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        Track update and status of Elysia
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        Source code and development
    </Card>
</Deck>

---

<small id="ref-1">1. Measured in requests/second. The benchmark for parsing query, path parameter and set response header on Debian 11, Intel i7-13700K tested on Bun 0.7.2 on 6 Aug 2023. See the benchmark condition [here](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/c7e26fe3f1bfee7ffbd721dbade10ad72a0a14ab#results).</small>

<small id="ref-2">2. Based on [TechEmpower Benchmark round 22](https://www.techempower.com/benchmarks/#section=data-r22&hw=ph&test=composite).</small>

https://github.com/elysiajs/documentation/blob/main/docs/key-concept.md

# Key Concept

### We **highly recommended** you to read this page before start using Elysia.

Although Elysia is a simple library, it has some key concepts that you need to understand to use it effectively.

This page covers most important concepts of Elysia that you should to know.

## Everything is a component

Every Elysia instance is a component.

A component is a plugin that could plug into other instances.

A component could be a router, a store, a service, or anything else.

```ts twoslash
import { Elysia } from "elysia";

const store = new Elysia().state({ visitor: 0 });

const router = new Elysia()
  .use(store)
  .get("/increase", ({ store }) => store.visitor++);

const app = new Elysia()
  .use(router)
  .get("/", ({ store }) => store)
  .listen(3000);
```

This force you to break down your application into small pieces, making it to add or remove features easily.

Learn more about this in [plugin](/essential/plugin.html).

## Scope

By default, event/life-cycle in each instance is isolated from each other.

```ts twoslash
// @errors: 2339
import { Elysia } from "elysia";

const ip = new Elysia()
  .derive(({ server, request }) => ({
    ip: server?.requestIP(request),
  }))
  .get("/ip", ({ ip }) => ip);

const server = new Elysia()
  .use(ip)
  .get("/ip", ({ ip }) => ip)
  .listen(3000);
```

In this example, the `ip` property is only share in it's own instance but not in the `server` instance.

To share the lifecycle, in our case, an `ip` property with `server` instance, we need to **explicitly says it** could be shared.

```ts twoslash
import { Elysia } from "elysia";

const ip = new Elysia()
  .derive(
    { as: "global" }, // [!code ++]
    ({ server, request }) => ({
      ip: server?.requestIP(request),
    }),
  )
  .get("/ip", ({ ip }) => ip);

const server = new Elysia()
  .use(ip)
  .get("/ip", ({ ip }) => ip)
  .listen(3000);
```

In this example, `ip` property is shared between `ip` and `server` instance because we define it as `global`.

This force you to think about the scope of each property preventing you from accidentally sharing the property between instances.

Learn more about this in [scope](/essential/plugin.html#scope).

## Method Chaining

Elysia code should always use **method chaining**.

As Elysia type system is complex, every methods in Elysia returns a new type reference.

**This is important** to ensure type integrity and inference.

```typescript twoslash
import { Elysia } from "elysia";

new Elysia()
  .state("build", 1)
  // Store is strictly typed // [!code ++]
  .get("/", ({ store: { build } }) => build)
  // ^?
  .listen(3000);
```

In the code above **state** returns a new **ElysiaInstance** type, adding a `build` type.

### ❌ Don't: Use Elysia without method chaining

Without using method chaining, Elysia doesn't save these new types, leading to no type inference.

```typescript twoslash
// @errors: 2339
import { Elysia } from "elysia";

const app = new Elysia();

app.state("build", 1);

app.get("/", ({ store: { build } }) => build);

app.listen(3000);
```

We recommend to <u>**always use method chaining**</u> to provide an accurate type inference.

## Dependency

By default, each instance will be re-execute everytime it's applied to another instance.

This can cause a duplication of the same method being applied multiple times but some methods should be called once like **lifecycle** or **routes**.

To prevent lifecycle methods from being duplicated, we can add **an unique identifier** to the instance.

```ts twoslash
import { Elysia } from "elysia";

const ip = new Elysia({ name: "ip" })
  .derive({ as: "global" }, ({ server, request }) => ({
    ip: server?.requestIP(request),
  }))
  .get("/ip", ({ ip }) => ip);

const router1 = new Elysia().use(ip).get("/ip-1", ({ ip }) => ip);

const router2 = new Elysia().use(ip).get("/ip-2", ({ ip }) => ip);

const server = new Elysia().use(router1).use(router2);
```

This will prevent the `ip` property from being call multiple time by applying deduplication using an unique name.

Once `name` is provided, the instance will become a **singleton**. Allowing Elysia to apply plugin deduplication.

Allowing us to reuse the same instance multiple time without performance penalty.

This force you to think about the dependency of each instance, allowing for easily applying migration or refactoring.

Learn more about this in [plugin deduplication](/essential/plugin.html#plugin-deduplication).

## Type Inference

Elysia has a complex type system that allows you to infer types from the instance.

```ts twoslash
import { Elysia, t } from "elysia";

const app = new Elysia().post("/", ({ body }) => body, {
  // ^?

  body: t.Object({
    name: t.String(),
  }),
});
```

If possible, **always use an inline function** to provide an accurate type inference.

If you need to apply a separate function, eg. MVC's controller pattern. It's recommended to destructure properties from inline function to prevent unnecessary type inference.

```ts twoslash
import { Elysia, t } from "elysia";

abstract class Controller {
  static greet({ name }: { name: string }) {
    return "hello " + name;
  }
}

const app = new Elysia().post("/", ({ body }) => Controller.greet(body), {
  body: t.Object({
    name: t.String(),
  }),
});
```

Learn more about this in [Best practice: MVC Controller](/essential/best-practice.html#controller).

## Turso

Example Turso code with drizzle:

```ts
import { createClient } from "@libsql/client/web";
import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { v4 as uuidv4 } from "uuid";

import {
  error,
  IRequest,
  json,
  Router,
  RouterType,
  withParams,
} from "itty-router";
import {
  categories,
  insertCategorySchema,
  insertMugsSchema,
  mugs,
} from "../drizzle/schema";
import { eq } from "drizzle-orm";

interface Env {
  TURSO_AUTH_TOKEN?: string;
  TURSO_URL?: string;
  router?: RouterType;
}

function buildDbClient(env: Env): LibSQLDatabase {
  const url = env.TURSO_URL?.trim();
  if (url === undefined) {
    throw new Error("TURSO_URL is not defined");
  }

  const authToken = env.TURSO_AUTH_TOKEN?.trim();
  if (authToken === undefined) {
    throw new Error("TURSO_AUTH_TOKEN is not defined");
  }

  return drizzle(createClient({ url, authToken }));
}

function buildIttyRouter(env: Env): RouterType {
  const router = Router();
  const db = buildDbClient(env);

  // TODO: Add basic authentication

  router
    // add some middleware upstream on all routes
    .all("*", withParams)

    .get("/", async () => {
      return json({
        name: "The Mugs Store API",
        endpoints: [
          {
            path: "/",
            information: "Get this endpoints index",
            method: "GET",
          },
          {
            path: "/mugs",
            information: "Get a list of all mugs",
            method: "GET",
          },
          {
            path: "/categories",
            information: "Get a list of all mug categories",
            method: "GET",
          },
          {
            path: "/mug/$id",
            information: "Get the information on a mug whose $id was passed",
            method: "GET",
          },
          {
            path: "/mug/$id",
            information: "Get the information on a mug whose $id was passed",
            method: "GET",
          },
          {
            path: "/category/$id",
            information:
              "Get the information on the mug category whose $id was passed",
            method: "GET",
          },
        ],
      });
    })

    .get("/mugs", async () => {
      const mugsData = await db.select().from(mugs).all();

      return json({
        mugs: mugsData,
      });
    })

    .get("/mug/:id", async ({ id }) => {
      if (!id) {
        return error(422, "ID is required");
      }
      const mugData = await db.select().from(mugs).where(eq(mugs.id, id)).get();

      return mugData
        ? json({
            mug: mugData,
          })
        : error(404, "Mug not found!");
    })

    .post("/mug", async (request: IRequest) => {
      const {
        category_id,
        ...jsonData
      }: {
        name: string;
        description: string;
        price: number;
        category_id: string;
        image?: string;
      } = await request.json();
      const mugData = insertMugsSchema.safeParse({
        id: uuidv4(),
        categoryId: category_id,
        ...(jsonData as object),
      });
      if (!mugData.success) {
        const { message, path } = mugData.error.issues[0];
        return error(path.length ? 422 : 400, `[${path}]: ${message}`);
      }

      const newMug = await db
        .insert(mugs)
        .values(mugData.data)
        .returning()
        .get();

      return json(
        { mug: newMug },
        {
          status: 201,
        },
      );
    })

    .patch("/mug/:id", async (request) => {
      const { id } = request.params;
      if (!id) {
        return error(422, "ID is required");
      }
      const jsonData: {
        name?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        category_id?: string | undefined;
        image?: string | undefined;
      } = await request.json();

      if (!Object.keys(jsonData).length)
        return error(400, "No data is being updated!");

      const mug = await db
        .update(mugs)
        .set({ updatedAt: Number((Date.now() / 1000).toFixed(0)), ...jsonData })
        .where(eq(mugs.id, id))
        .returning()
        .get();

      return json({ mug });
    })

    .delete("/mug/:id", async ({ id }) => {
      if (!id) {
        return error(422, "ID is required");
      }
      const mugData = await db
        .delete(mugs)
        .where(eq(mugs.id, id))
        .returning()
        .get();
      return json({
        mug: mugData,
      });
    })

    .get("/categories", async () => {
      const categoryData = await db.select().from(categories).all();
      return json({
        categories: categoryData,
      });
    })

    .get("/category/:id", async ({ id }) => {
      if (!id) {
        return error(422, "ID is required");
      }
      const categoryData = await db
        .select()
        .from(categories)
        .where(eq(categories.id, id))
        .get();
      return categoryData
        ? json({
            category: categoryData,
          })
        : error(404, "Category not found!");
    })

    .post("/category", async (request: IRequest) => {
      const jsonData = await request.json();
      const categoryData = insertCategorySchema.safeParse({
        id: uuidv4(),
        ...(jsonData as object),
      });
      if (!categoryData.success) {
        const { message, path } = categoryData.error.issues[0];
        return error(path.length ? 422 : 400, `[${path}]: ${message}`);
      }

      const newCategory = await db
        .insert(categories)
        .values(categoryData.data)
        .returning()
        .get();

      return json(
        { category: newCategory },
        {
          status: 201,
        },
      );
    })

    .patch("/category/:id", async (request) => {
      const { id } = request.params;
      if (!id) {
        return error(422, "ID is required");
      }

      const jsonData: { name: string } = await request.json();

      if (!Object.keys(jsonData).length) {
        return error(400, "No data is being updated!");
      }
      const category = await db
        .update(categories)
        .set(jsonData)
        .where(eq(categories.id, id))
        .returning()
        .get();

      return json({ category });
    })

    .delete("/category/:id", async ({ id }) => {
      if (!id) {
        return error(422, "ID is required");
      }
      const categoryData = await db
        .delete(categories)
        .where(eq(categories.id, id))
        .returning()
        .get();
      return categoryData
        ? json({
            category: categoryData,
          })
        : error(404, "Category not found!");
    })

    .all("*", () => error(404));

  return router;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (env.router === undefined) {
      env.router = buildIttyRouter(env);
    }
    return env.router?.handle(request);
  },
};
```

Example with elysia:

```ts
import { Elysia, t } from "elysia";
import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from "uuid";

const port = process.env.PORT as unknown as string;
const hostname = process.env.HOSTNAME as unknown as string;

const db = createClient({
  url: process.env.LOCAL_DB as string,
  syncUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  // syncInterval: 15 - https://docs.turso.tech/sdk/ts/reference#periodic-sync,
  encryptionKey: process.env.SECRET, // embedded replica will be encrypted hence not readable by sqlite3
});

db.executeMultiple(
  "CREATE TABLE IF NOT EXISTS expenses(id VARCHAR NOT NULL, amount INTEGER NOT NULL, information TEXT, date INTEGER NOT NULL)",
);

const app = new Elysia()
  .get("/", () => "Hello, welcome to My Expenses Tracker! ❤︎ Turso")
  .post(
    "/records",
    async ({ body }) => {
      const id = uuidv4();
      const _ = await db.execute({
        sql: "INSERT INTO expenses values (?, ?, ?, ?)",
        args: [
          id,
          body.amount,
          body.information,
          Number((Date.now() / 1000).toFixed(0)),
        ],
      });

      const results = await db.execute({
        sql: "SELECT * FROM expenses WHERE id = ?",
        args: [id],
      });
      return results.rows[0];
    },
    {
      body: t.Object({
        amount: t.Number(),
        information: t.String(),
      }),
    },
  )
  .get("/records", async () => {
    const results = await db.execute("SELECT * FROM expenses");
    return results.rows;
  })
  .listen({ hostname, port });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
```

## htmx

https://github.com/syarul/htmx-todomvc/blob/main/src/components/index.tsx
with some hyperscript

```ts

import React from 'react'
import { type Todo, type Todos, type Filter, type filter } from '../types'
import classNames from 'classnames'
import { lambdaPath } from '..'

export const TodoCheck: React.FC<Todo> = ({ id, completed }) => (
  <input
    className="toggle"
    type="checkbox"
    defaultChecked={completed}
    hx-patch={`${lambdaPath}/toggle-todo?id=${id}&completed=${completed}`}
    hx-target="closest <li/>"
    hx-swap="outerHTML"
    _={`
      on toggle
        if $toggleAll.checked and my.checked === false
          my.click()
        else if $toggleAll.checked === false and my.checked
          my.click()
    `}
  />
)

export const EditTodo: React.FC<Todo> = ({ id, text, editing }) => (
  <input
    className="edit"
    name="text"
    defaultValue={editing ? text : ''}
    hx-trigger="keyup[keyCode==13], text" // capture Enter and text input
    hx-get={`${lambdaPath}/update-todo?id=${id}`}
    hx-target="closest li"
    hx-swap="outerHTML"
    _={`
      on keyup[keyCode==27] remove .editing from closest <li/>
      on htmx:afterRequest send focus to <input.new-todo/>
    `}
    autoFocus/>
)

export const TodoItem: React.FC<Todo> = ({ id, text, completed, editing }) => (
  <li
    key={id}
    className={classNames('todo', { completed, editing })}
    _={`
      on destroy my.querySelector('button').click()
      on show wait 20ms
        if window.location.hash === '#/active' and my.classList.contains('completed')
          set my.style.display to 'none'
        else if window.location.hash === '#/completed' and my.classList.contains('completed') === false
          set my.style.display to 'none'
        else
          set my.style.display to 'block'
    `}
  >
    <div className="view">
      <TodoCheck id={id} completed={completed} />
      <label
        hx-trigger="dblclick"
        hx-patch={`${lambdaPath}/edit-todo?id=${id}&text=${text}`}
        hx-target="next input"
        hx-swap="outerHTML"
        _={`
          on dblclick add .editing to the closest <li/>
          on htmx:afterRequest wait 50ms
            set $el to my.parentNode.nextSibling
            set $el.selectionStart to $el.value.length
        `} // 1) add class editing 2) place cursor on the end of the text line in the input
      >{text}</label>
      <button
        className="destroy"
        hx-delete={`${lambdaPath}/remove-todo?id=${id}`}
        hx-trigger="click"
        hx-target="closest li"
        _={`
          on htmx:afterRequest
            send toggleDisplayClearCompleted to <button.clear-completed/>
            send todoCount to <span.todo-count/>
            send toggleAll to <input.toggle-all/>
            send footerToggleDisplay to <footer.footer/>
            send labelToggleAll to <label/>
            send focus to <input.new-todo/>
        `}
      />
    </div>
    <EditTodo id={id} text={text} editing={editing}/>
  </li>
)

export const TodoFilter: React.FC<Filter> = ({ filters }) => (
  <ul className="filters">
    {filters.map(({ url, name, selected }: filter) => (
      <li key={name}>
        <a className={classNames({ selected })} href={url}
          hx-get={`${lambdaPath}/todo-filter?id=${name}`}
          hx-trigger="click"
          hx-target=".filters"
          hx-swap="outerHTML"
          _="on htmx:afterRequest send show to <li.todo/>"
        >{`${name.charAt(0).toUpperCase()}${name.slice(1)}`}</a>
      </li>
    ))}
  </ul>
)

export const TodoList: React.FC<Todos> = ({ todos }) => todos.map(TodoItem)

export const MainTemplate: React.FC<Todos> = ({ todos, filters }) => (
  <html lang="en" data-framework="htmx">
    <head>
      <meta charSet="utf-8" />
      <title>HTMX • TodoMVC</title>
      <link rel="stylesheet" href="https://unpkg.com/todomvc-common@1.0.5/base.css" type="text/css" />
      <link rel="stylesheet" href="https://unpkg.com/todomvc-app-css/index.css" type="text/css" />
    </head>
    <body>
      <section
        className="todoapp"
        hx-get={`${lambdaPath}/get-hash`} // send hash to the server and render .filters base on hash location on load
        hx-vals="js:{hash: window.location.hash}"
        hx-trigger="load"
        hx-target=".filters"
        hx-swap="outerHTML"
      >
        <header className="header">
          <h1>todos</h1>
          <input
            id="new-todo"
            name="text"
            className="new-todo"
            placeholder="What needs to be done?"
            hx-get={`${lambdaPath}/new-todo`}
            hx-trigger="keyup[keyCode==13], text"
            hx-target=".todo-list"
            hx-swap="beforeend"
            _={`
              on htmx:afterRequest set my value to ''
              on focus my.focus()
            `}
            autoFocus />
        </header>
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox"
            defaultChecked={todos.filter(t => !t.completed).length === 0 && todos.length !== 0}
            _={`
              on load set $toggleAll to me
              on toggleAll debounced at 100ms
                fetch ${lambdaPath}/toggle-all then
                if it === 'true' and my.checked === false then
                  set my.checked to true
                else
                  if my.checked === true and it === 'false' then set my.checked to false
                end
              end
              on click send toggle to <input.toggle/>
            `}
          />
          <label htmlFor="toggle-all"
            _={`
             on load send labelToggleAll to me
             on labelToggleAll debounced at 100ms
               if $todo.hasChildNodes() set my.style.display to 'flex'
               else set my.style.display to 'none'
           `}
            style={{ display: 'none' }}>Mark all as complete</label>
          <ul
            className="todo-list"
            _={`
              on load debounced at 10ms
                set $todo to me
                send toggleDisplayClearCompleted to <button.clear-completed/>
                send footerToggleDisplay to <footer.footer/>
                send todoCount to <span.todo-count/>
                send toggleAll to <input.toggle-all/>
                send footerToggleDisplay to <footer.footer/>
                send labelToggleAll to <label/>
                send show to <li.todo/>
            `}
          >
            <TodoList todos={todos} filters={filters} />
          </ul>
        </section>
        <footer className="footer" _={`
          on load send footerToggleDisplay to me
          on footerToggleDisplay debounced at 100ms
            if $todo.hasChildNodes() set my.style.display to 'block'
            else set my.style.display to 'none'
            send focus to <input.new-todo/>
        `} style={{ display: 'none' }}>
          <span
            className="todo-count"
            hx-trigger="load"
            _={`
              on load send todoCount to me
              on todoCount debounced at 100ms
                fetch ${lambdaPath}/update-counts then put the result into me
            `}
          />
          <TodoFilter filters={filters} />
          <button className="clear-completed"
            _={`
              on load send toggleDisplayClearCompleted to me
              on toggleDisplayClearCompleted debounced at 100ms
                fetch ${lambdaPath}/completed then
                set my.style.display to it
              end
              on click send destroy to <li.completed/>
            `}
          >Clear Complete</button>
        </footer>
      </section>
      <footer className="info" _="on load debounced at 100ms call startMeUp()">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="http://github.com/syarul/">syarul</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        <img src="https://htmx.org/img/createdwith.jpeg" width="250" height="auto" />
      </footer>
      <script src="https://unpkg.com/todomvc-common@1.0.5/base.js" />
      <script src="https://unpkg.com/htmx.org@1.9.6" />
      <script src="https://unpkg.com/hyperscript.org/dist/_hyperscript.js" />
      <script type="text/hyperscript">
        {`
          def startMeUp()
            log \`this is TodoMVC app build with HTMX!\`
          end
        `}
      </script>
    </body>
  </html>
)
```

## hyperscript

From the docs page, here is the html content of the page

```html
<div id="docs-content">
  <h2 id="introduction" tabindex="-1">
    <a class="header-anchor" href="#introduction" aria-hidden="true">§</a>
    Introduction
  </h2>
  <p>
    Hyperscript is a scripting language for doing front end web development. It
    is designed to make it very easy to respond to events and do simple DOM
    manipulation in code that is directly embedded on elements on a web page.
  </p>
  <p>Here is a simple example of some hyperscript:</p>
  <figure class="box">
    <figcaption class="allcaps">Example</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">toggle</span></span><span class="token class-ref selector"> .red</span> <span class="token keyword"><span class="token hs-start bold">on</span></span> <span class="token builtin">me</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click toggle .red on me">Click Me</button>
  </figure>
  <style>
    .red {
      background: rgba(255, 0, 0, 0.48) !important;
    }
  </style>
  <p>
    The first thing to notice is that hyperscript is defined
    <em>directly on the button</em>, using the <code>_</code> (underscore)
    attribute.
  </p>
  <p>
    Embedding code directly on the button like this might seem strange at first,
    but hyperscript is one of a growing number of technologies that de-emphasize
    <a href="https://en.wikipedia.org/wiki/Separation_of_concerns"
      >Separation of Concerns</a
    >
    in favor of
    <a href="https://htmx.org/essays/locality-of-behaviour/"
      >Locality of Behavior</a
    >.
  </p>
  <p>
    Other examples of libraries going this direction are
    <a href="https://tailwindcss.com/">Tailwind CSS</a>,
    <a href="https://alpinejs.dev">AlpineJS</a> and
    <a href="https://htmx.org">htmx</a>.
  </p>
  <p>
    The next thing you will notice about hyperscript is its syntax, which is
    very different than most programming languages used today. Hyperscript is
    part of the <a href="https://en.wikipedia.org/wiki/XTalk">xTalk</a> family
    of scripting languages, which ultimately derive from
    <a href="https://hypercard.org/HyperTalk%20Reference%202.4.pdf">HyperTalk</a
    >. These languages all read more like english than the programming languages
    you are probably used to.
  </p>
  <p>
    This unusual syntax has advantages, once you get over the initial shock:
  </p>
  <ul>
    <li>
      It is very distinctive, making it obvious when hyperscript is being used
      in a web page
    </li>
    <li>It is very easy to read, making it obvious what a script is doing</li>
  </ul>
  <p>
    Hyperscript favors read time over write time when it comes to code. It can
    be a bit tricky to write at first for some people who are used to other
    programming languages, but it reads very clearly once you are done.
  </p>
  <p>
    Code is typically read many more times than it is written, so this tradeoff
    is a good one for simple front end scripting needs.
  </p>
  <p>
    Below you will find an overview of the various features, commands and
    expressions in hyperscript, as well as links to more detailed treatments of
    each them.
  </p>
  <p>Some other hypserscript resources you may want to check out are:</p>
  <ul>
    <li>
      The <a href="/cookbook">cookbook</a> for existing hyperscripts you can
      start using and modifying for your own needs.
    </li>
    <li>
      The <a href="/comparison">VanillaJS/jQuery/hyperscript comparison</a>,
      which shows the differences between vanillajs, jQuery and hyperscript
      implementations of various common UI patterns
    </li>
    <li>
      Syntax highlighting for
      <a
        href="https://marketplace.visualstudio.com/items?itemName=dz4k.vscode-hyperscript-org"
        >VSCode</a
      >
      or <a href="https://packagecontrol.io/packages/Hyperscript">Sublime</a>
    </li>
  </ul>
  <p>OK, let's get started with hyperscript!</p>
  <h2 id="install" tabindex="-1">
    <a class="header-anchor" href="#install" aria-hidden="true">§</a> Install
    &amp; Quick Start
  </h2>
  <p>
    Hyperscript is a dependency-free JavaScript library that can be included in
    a web page without any build step:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>https://unpkg.com/hyperscript.org@0.9.13<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>If you are using a build step:</p>
  <pre
    class=" language-js"
    tabindex="0"
  ><code class=" language-js"><span class="token keyword">import</span> _hyperscript <span class="token keyword">from</span> <span class="token string">'hyperscript.org'</span><span class="token punctuation">;</span>

_hyperscript<span class="token punctuation">.</span><span class="token function">browserInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
  <p>After you've done this, you can begin adding hyperscript to elements:</p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">call</span></span> alert<span class="token punctuation">(</span><span class="token string">'You clicked me!'</span><span class="token punctuation">)</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Click Me!
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    You can also add hyperscript within script tags that are denoted as
    <code>text/hyperscript</code>:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/hyperscript<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-hyperscript">
  <span class="token keyword"><span class="token hs-start bold">on</span></span> mousedown
    <span class="token keyword"><span class="token hs-start bold">halt</span></span> <span class="token keyword">the</span> <span class="token builtin">event</span> <span class="token comment">-- prevent text selection...</span>
    <span class="token comment">-- do other stuff...</span>
  <span class="token keyword"><span class="token hs-start bold">end</span></span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>Features defined in script tags will apply to the <code>body</code>.</p>
  <p>
    Hyperscript has an open, pluggable grammar &amp; some advanced features do
    not ship by default (e.g. <a href="#workers">workers</a>).
  </p>
  <p>To use a feature like workers you can either:</p>
  <ul>
    <li>
      install the extension directly by including
      <code>/dist/workers.js</code> after you include hyperscript
    </li>
    <li>
      use the "Whole 9 Yards" version of hyperscript, which includes everything
      by default and can be found at <code>/dist/hyperscript_w9y.js</code>
    </li>
  </ul>
  <h2 id="basics" tabindex="-1">
    <a class="header-anchor" href="#basics" aria-hidden="true">§</a> Language
    Basics
  </h2>
  <p>
    A hyperscript script consists of a series of
    <a href="/reference#features">"features"</a>, the most common of which is an
    event handler, as we saw in the first example. The body of a feature then
    consists of a series of <a href="/reference#commands">"commands"</a>, which
    are often called statements in other languages. These commands may include
    one or more <a href="/reference#expressions">"expressions"</a>.
  </p>
  <p>Going back to our original example:</p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">toggle</span></span><span class="token class-ref selector"> .red</span> <span class="token keyword"><span class="token hs-start bold">on</span></span> <span class="token builtin">me</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>In the script above:</p>
  <ul>
    <li>
      The <code>on click</code> is an
      <a href="/features/on">event handler feature</a>
    </li>
    <li>
      <a href="/commands/toggle"><code>toggle</code></a> is a command
    </li>
    <li>
      <code>.red</code> and <code>me</code> are expressions that are part of the
      <code>toggle</code> command
    </li>
  </ul>
  <p>All hyperscript scripts are made up of these basic building blocks.</p>
  <p>
    It's worth mentioning that, if you prefer, you can use
    <code>script</code> or <code>data-script</code> instead of
    <code>_</code> when using hyperscript:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">script</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>on click toggle .red on me<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button script="on click toggle .red on me">Click Me</button>
  </figure>
  <h3 id="comments" tabindex="-1">
    <a class="header-anchor" href="#comments" aria-hidden="true">§</a> Comments
  </h3>
  <p>
    Comments in hyperscript start with the <code>--</code> characters and a
    whitespace character (space, tab, carriage return or newline) and go to the
    end of the line:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token comment">-- this is a comment</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"Yep, that was a comment"</span>
</code></pre>
  <p>
    To ease migrations to hyperscript, <code>//</code> and
    <code>/* ... */</code> comments are supported.
  </p>
  <h3 id="separators" tabindex="-1">
    <a class="header-anchor" href="#separators" aria-hidden="true">§</a>
    Separators
  </h3>
  <p>
    Multiple commands may be optionally separated with a <code>then</code>,
    which acts like a semi-colon in JavaScript:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"Hello"</span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"World"</span>
</code></pre>
  <p>
    Using the <code>then</code> keyword is recommended when multiple commands
    are on the same line.
  </p>
  <p>
    When commands have bodies that include other commands, such as with the
    <a href="/commands/if"><code>if</code></a> command, the series of commands
    are terminated by an <code>end</code>:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">if</span></span> x <span class="token operator">&gt;</span> <span class="token number">10</span>  <span class="token comment">-- start of the conditional block</span>
  <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"Greater than 10"</span>
<span class="token keyword"><span class="token hs-start bold">end</span></span>        <span class="token comment">-- end of the conditional block</span>
</code></pre>
  <p>Features are also terminated by an <code>end</code>:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click
  <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"Clicked!"</span>
<span class="token keyword"><span class="token hs-start bold">end</span></span>
</code></pre>
  <p>
    The <code>end</code> terminator can often be omitted for both features and
    statements if either of these conditions hold:
  </p>
  <ul>
    <li>
      The script ends:
      <pre
        class=" language-html"
        tabindex="0"
      ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">if</span></span> <span class="token boolean">true</span> <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">'Clicked!'</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    </li>
    <li>
      Another feature starts:
      <pre
        class=" language-html"
        tabindex="0"
      ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">if</span></span> <span class="token boolean">true</span> <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">'Clicked!'</span>
           <span class="token keyword"><span class="token hs-start bold">on</span></span> mouseenter <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">'Mouse entered!'</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    </li>
  </ul>
  <p>
    In practice, <code>end</code> is used only when necessary, in order to keep
    scripts small and neat.
  </p>
  <h3 id="expressions" tabindex="-1">
    <a class="header-anchor" href="#expressions" aria-hidden="true">§</a>
    Expressions
  </h3>
  <p>
    Many expressions in hyperscript will be familiar to developers and are based
    on expressions available in JavaScript:
  </p>
  <ul>
    <li>Number literals - <code>1.1</code></li>
    <li>String literals = <code>"hello world"</code></li>
    <li>Array literals = <code>[1, 2, 3]</code></li>
  </ul>
  <p>
    Others are a bit more exotic and, for example, make it easy to work with the
    DOM:
  </p>
  <ul>
    <li>ID References: <code>#foo</code></li>
    <li>Class References: <code>.tabs</code></li>
    <li>Query References: <code>&lt;div/&gt;</code></li>
    <li>Attribute References: <code>@count</code></li>
  </ul>
  <p>
    We will see how features, commands and expressions all fit together and what
    they can do in the coming sections.
  </p>
  <h3 id="variables" tabindex="-1">
    <a class="header-anchor" href="#variables" aria-hidden="true">§</a>
    Variables
  </h3>
  <p>
    In hyperscript, variables are created by the
    <a href="/commands/set"><code>set</code></a> or
    <a href="/commands/put"><code>put</code></a> commands, with
    <code>set</code> being preferred.
  </p>
  <p>Here is how you create a simple, local variable:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> x <span class="token keyword">to</span> <span class="token number">10</span>
</code></pre>
  <p>
    Here is an example that creates a local variable and then logs it to the
    console:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Local variable</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">set</span></span> x <span class="token keyword">to</span> <span class="token number">10</span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">log</span></span> x</span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click set x to 10 then log x">Click Me</button>
  </figure>
  <p>
    If you click this button and open up the console, you should see
    <code>10</code> being logged to it.
  </p>
  <h4 id="scoping" tabindex="-1">
    <a class="header-anchor" href="#scoping" aria-hidden="true">§</a> Scoping
  </h4>
  <p>
    hyperscript has three different variable scopes: <code>local</code>,
    <code>element</code>, and <code>global</code>.
  </p>
  <ul>
    <li>
      Global variables are globally available (and should be used sparingly)
    </li>
    <li>
      Element variables are scoped to the element they are declared on, but
      shared across all features on that element
    </li>
    <li>
      Local scoped variables are scoped to the currently executing feature
    </li>
  </ul>
  <p>
    Note that hyperscript has a flat local scope, similar to JavaScript's
    <code>var</code> statement.
  </p>
  <h4 id="names_and_scoping" tabindex="-1">
    <a class="header-anchor" href="#names_and_scoping" aria-hidden="true">§</a>
    Variable Names &amp; Scoping
  </h4>
  <p>
    In order to make non-locally scoped variables easy to create and recognize
    in code, hyperscript supports the following naming conventions:
  </p>
  <ul>
    <li>
      If a variable starts with the <code>$</code> character, it will default to
      the global scope
    </li>
    <li>
      If a variable starts with the <code>:</code> character, it will default to
      the element scope
    </li>
  </ul>
  <p>
    By using these prefixes it is easy to tell differently scoped variables from
    one another without a lot of additional syntax:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> <span class="token operator">$</span>foo <span class="token keyword">to</span> <span class="token number">10</span> <span class="token comment">-- sets a global named $foo</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> <span class="token punctuation">:</span>bar <span class="token keyword">to</span> <span class="token number">20</span> <span class="token comment">-- sets an element scoped variable named :bar</span>
</code></pre>
  <p>
    Here is an example of a click handler that uses an element scoped variable
    to maintain a counter:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">increment</span></span> <span class="token punctuation">:</span>x <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token builtin">it</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click increment :x then put it into the next <output/>">
      Click Me
    </button>
    <output>--</output>
  </figure>
  <p>
    This script also uses the implicit <code>it</code> symbol, which we will
    discuss <a href="#special-names">below</a>.
  </p>
  <h4 id="scoping_modifiers" tabindex="-1">
    <a class="header-anchor" href="#scoping_modifiers" aria-hidden="true">§</a>
    Scoping Modifiers
  </h4>
  <p>You may also use scope modifiers to give symbols particular scopes:</p>
  <ul>
    <li>
      A variable with a <code>global</code> prefix is a global
      <pre
        class=" language-hyperscript"
        tabindex="0"
      ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> <span class="token keyword">global</span> myGlobal <span class="token keyword">to</span> <span class="token boolean">true</span>
</code></pre>
    </li>
    <li>
      A variable with an <code>element</code> prefix is element-scoped
      <pre
        class=" language-hyperscript"
        tabindex="0"
      ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> <span class="token keyword">element</span> myElementVar <span class="token keyword">to</span> <span class="token boolean">true</span>
</code></pre>
    </li>
    <li>
      A variable with a <code>local</code> prefix is locally scoped
      <pre
        class=" language-hyperscript"
        tabindex="0"
      ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> <span class="token keyword">local</span> x <span class="token keyword">to</span> <span class="token boolean">true</span>
</code></pre>
    </li>
  </ul>
  <h4 id="attributes" tabindex="-1">
    <a class="header-anchor" href="#attributes" aria-hidden="true">§</a>
    Attributes
  </h4>
  <p>
    In addition to scoped variables, another way to store data is to put it
    directly in the DOM, in an attribute of an element.
  </p>
  <p>
    You can access attributes on an element with the attribute literal syntax,
    using an <code>@</code> prefix:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> <span class="token attribute">@<span class="token attr-name">my-attr</span></span> <span class="token keyword">to</span> <span class="token number">10</span>
</code></pre>
  <p>
    This will store the value 10 in the attribute <code>my-attr</code> on the
    current element:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">my-attr</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>10<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    Note that, unlike regular variables, attributes can only store strings.
    Anything else you store in them will be converted to a string.
  </p>
  <p>
    You can remember the <code>@</code> sign as the <strong>at</strong>tribute
    operator. We will discuss other DOM literals
    <a href="#dom-literals">below</a>.
  </p>
  <p>
    Here is the above example, rewritten to use an attribute rather than an
    element-scoped variable:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">increment</span></span> <span class="token attribute">@<span class="token attr-name">my-attr</span></span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token builtin">it</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click increment @my-attr then put it into the next <output/>">
      Click Me
    </button>
    <output>--</output>
  </figure>
  <p>
    If you click the above button a few times and then inspect it using your
    browsers developer tools, you'll note that it has a
    <code>my-attr</code> attribute on it that holds a string value of the click
    count.
  </p>
  <p>
    The <a href="/commands/increment"><code>increment</code> command</a> is
    discussed <a href="#math">below</a>.
  </p>
  <h4 id="special-names-%26-symbols" tabindex="-1">
    <a
      class="header-anchor"
      href="#special-names-%26-symbols"
      aria-hidden="true"
      >§</a
    >
    Special Names &amp; Symbols
  </h4>
  <p>
    One of the interesting aspects of hyperscript is its use of implicit names
    for things, often with multiple ways to refer to the same thing. This might
    sound crazy, and it kind of is, but it helps to make scripts much more
    readable!
  </p>
  <p>
    We have already seen the use of the <code>it</code> symbol above, to put the
    result of an <code>increment</code> command into an element.
  </p>
  <p>
    It turns out that <code>it</code> is an alias for <code>result</code>, which
    we could have used instead:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: It</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">increment</span></span> <span class="token punctuation">:</span>x <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token builtin">result</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click increment :x then put result into the next <output/>">
      Click Me
    </button>
    <output>--</output>
  </figure>
  <p>It may be equivalent, but it doesn't read as nicely does it?</p>
  <p>That's why hyperscript supports the <code>it</code> symbol as well.</p>
  <p>
    Another funny thing you might have noticed is the appearance of
    <code>the</code> in this script.
  </p>
  <p>
    <code>the</code> is whitespace before any expression in hyperscript and can
    be used to make your code read more nicely.
  </p>
  <p>
    For example, if we wanted to use <code>result</code> rather than it, we
    would write <code>the result</code> instead, which reads more nicely:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: The</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">increment</span></span> <span class="token punctuation">:</span>x <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token keyword">the</span> <span class="token builtin">result</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button
      _="on click increment :x then put the result into the next <output/>"
    >
      Click Me
    </button>
    <output>--</output>
  </figure>
  <p>
    This is exactly equivalent to the previous example, but reads better.
    Hyperscript is all about readability!
  </p>
  <p>In this case, we'd probably stick with <code>it</code> :)</p>
  <h5 id="zoo" tabindex="-1">
    <a class="header-anchor" href="#zoo" aria-hidden="true">§</a> The
    Hyperscript Zoo
  </h5>
  <p>
    In addition to <code>result</code> and <code>it</code>, hyperscript has a
    number of other symbols that are automatically available, depending on the
    context, that make your scripting life more convenient.
  </p>
  <p>Here is a table of available symbols:</p>
  <div class="box">
    <dl class="syntaxes">
      <dt>
        <code class="syntax">result</code> <code class="syntax">it</code>
        <code class="syntax">its</code>
      </dt>
      <dd>
        <p>
          the result of the last command, if any (e.g. a <code>call</code> or
          <code>fetch</code>)
        </p>
      </dd>
      <dt>
        <code class="syntax">me</code> <code class="syntax">my</code>
        <code class="syntax">I</code>
      </dt>
      <dd>
        <p>the element that the current event handler is running on</p>
      </dd>
      <dt><code class="syntax">event</code></dt>
      <dd>
        <p>the event that triggered the event current handler, if any</p>
      </dd>
      <dt><code class="syntax">body</code></dt>
      <dd>
        <p>the body of the current document, if any</p>
      </dd>
      <dt><code class="syntax">target</code></dt>
      <dd>
        <p>the target of the current event, if any</p>
      </dd>
      <dt><code class="syntax">detail</code></dt>
      <dd>
        <p>
          the detail of the event that triggered the current handler, if any
        </p>
      </dd>
      <dt><code class="syntax">sender</code></dt>
      <dd>
        <p>the element that sent the current event, if any</p>
      </dd>
      <dt><code class="syntax">cookies</code></dt>
      <dd>
        <p>an <a href="/expressions/cookies">api</a> to access cookies</p>
      </dd>
    </dl>
  </div>
  <p>
    Note that the <code>target</code> is the element that the event
    <em>originally</em> occurred on.
  </p>
  <p>
    Event handlers, discussed <a href="#on">below</a>, may be placed on parent
    elements to take advantage of
    <a
      href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture"
      >event bubbling</a
    >
    which can reduce redundancy in code.
  </p>
  <p>
    Note that JavaScript global symbols such as <code>window</code> &amp;
    <code>localStorage</code> are also available.
  </p>
  <h3 id="logging-to-the-console" tabindex="-1">
    <a class="header-anchor" href="#logging-to-the-console" aria-hidden="true"
      >§</a
    >
    Logging To The Console
  </h3>
  <p>
    If you wish to print something to the <code>console</code> you can use the
    <a href="/commands/log"><code>log</code> command</a>:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"Hello Console!"</span>
</code></pre>
  <p>Simplicity itself.</p>
  <h4 id="objects" tabindex="-1">
    <a class="header-anchor" href="#objects" aria-hidden="true">§</a> Objects
  </h4>
  <p>
    Hyperscript is not an object-oriented language: it is, rather,
    event-oriented. However it still allows you to work with objects in an easy
    and convenient manner, which facilitates interoperability with all the
    functionality of JavaScript, including the DOM APIs, JavaScript libraries
    and so on.
  </p>
  <p>Here is how you can work with objects in hyperscript:</p>
  <h4 id="properties" tabindex="-1">
    <a class="header-anchor" href="#properties" aria-hidden="true">§</a>
    Properties
  </h4>
  <p>
    Hyperscript offers a few different ways to access properties of objects. The
    first two should be familiar to JavaScript developers:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> x <span class="token keyword">to</span> <span class="token punctuation">{</span>name <span class="token punctuation">:</span> <span class="token string">"Joe"</span><span class="token punctuation">,</span> age<span class="token punctuation">:</span> <span class="token number">35</span><span class="token punctuation">}</span>    <span class="token comment">-- create an object with some properties</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> x<span class="token operator">.</span>name                          <span class="token comment">-- standard "dot" notation</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> x<span class="token punctuation">[</span><span class="token string">'name'</span><span class="token punctuation">]</span>                       <span class="token comment">-- standard array-index notation</span>
</code></pre>
  <p>
    The next mechanism is known as a
    <a href="/expressions/possessive">possessive expression</a> and uses the
    standard english <code>'s</code> to express a property access:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> x <span class="token keyword">to</span> <span class="token punctuation">{</span>name <span class="token punctuation">:</span> <span class="token string">"Joe"</span><span class="token punctuation">,</span> age<span class="token punctuation">:</span> <span class="token number">35</span><span class="token punctuation">}</span>    <span class="token comment">-- create an object with some properties</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> x<span class="token operator">'s</span> name                        <span class="token comment">-- access the name property using a possessive</span>
</code></pre>
  <p>
    There are two special cases for the possessive expression, the symbols
    <code>my</code> and <code>its</code>, both of which can be used without the
    <code>'s</code> for possessive expressions:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">get</span></span> <span class="token keyword">the</span> <span class="token keyword">first</span> <span class="token selector">&lt;div/&gt;</span> <span class="token keyword">then</span>          <span class="token comment">-- get the first div in the DOM, setting the `results` variable</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> <span class="token builtin">my</span> innerHTML <span class="token keyword">to</span> <span class="token builtin">its</span> innerHTML  <span class="token comment">-- use possessive expressions to set the current elements innerHTML</span>
                                   <span class="token comment">-- to the innerHTML of that div</span>
</code></pre>
  <p>
    Finally, you can also use the <a href="/expressions/of">of expression</a> to
    get a property as well:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> x <span class="token keyword">to</span> <span class="token punctuation">{</span>name <span class="token punctuation">:</span> <span class="token string">"Joe"</span><span class="token punctuation">,</span> age<span class="token punctuation">:</span> <span class="token number">35</span><span class="token punctuation">}</span>    <span class="token comment">-- create an object with some properties</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token keyword">the</span> name <span class="token keyword">of</span> x                   <span class="token comment">-- access the name property using an of expression</span>
</code></pre>
  <p>
    The <code>of</code> operator flips the order of the property &amp; the
    element that the property is on, which can sometimes clarify your code.
  </p>
  <p>
    Which of these options you choose for property access is up to you. We
    recommend the possessive form in most cases as being the most
    "hyperscripty", with the <code>of</code> form being chosen when it helps to
    clarify some code by putting the final property at the front of the
    expression.
  </p>
  <h5 id="flat-mapping" tabindex="-1">
    <a class="header-anchor" href="#flat-mapping" aria-hidden="true">§</a> Flat
    Mapping
  </h5>
  <p>
    Inspired by <a href="https://jquery.org">jQuery</a>, another feature of
    property access in hyperscript is that, when a property of an Array-like
    object is accessed, it will
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap"
      >flat-map</a
    >
    the results to a single, linear array of that property applied to all values
    within the array.
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> allDivs <span class="token keyword">to</span> <span class="token selector">&lt;div/&gt;</span>                      <span class="token comment">-- get all divs</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> allParents <span class="token keyword">to</span> <span class="token keyword">the</span> parent <span class="token keyword">of</span> allDivs    <span class="token comment">-- get all parents of those divs as an array</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> allChildren <span class="token keyword">to</span> <span class="token keyword">the</span> children <span class="token keyword">of</span> allDivs <span class="token comment">-- get all children of those divs as an array</span>
</code></pre>
  <p>
    On an array, only the <code>length</code> property will not perform a flat
    map in this manner.
  </p>
  <h5 id="null-safety" tabindex="-1">
    <a class="header-anchor" href="#null-safety" aria-hidden="true">§</a> Null
    Safety
  </h5>
  <p>
    Finally, all property accesses in hyperscript are null safe, so if the
    object that the property is being accessed on is null, the result of the
    property access will be null as well, without a need to null-check:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> example <span class="token keyword">to</span> <span class="token boolean">null</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> example<span class="token operator">.</span>prop     <span class="token comment">-- logs null, because `example` is null</span>
</code></pre>
  <p>
    This null-safe behavior is appropriate for a scripting language intended for
    front-end work.
  </p>
  <h4 id="creating-new-objects" tabindex="-1">
    <a class="header-anchor" href="#creating-new-objects" aria-hidden="true"
      >§</a
    >
    Creating New Objects
  </h4>
  <p>
    If you want to make new objects, you can use the
    <a href="/commands/make"><code>make</code> command</a>:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">make</span> a</span> URL <span class="token keyword">from</span> <span class="token string">"/path/"</span><span class="token punctuation">,</span> <span class="token string">"https://origin.example.com"</span>
</code></pre>
  <p>
    Which is equal to the JavaScript
    <code>new URL("/path/", "https://origin.example.com")</code>
  </p>
  <p>
    If you wish to assign an identifier to the new object you can use the
    <code>called</code> modifier:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">make</span> a</span> URL <span class="token keyword">from</span> <span class="token string">"/path/"</span><span class="token punctuation">,</span> <span class="token string">"https://origin.example.com"</span> <span class="token keyword">called</span> myURL
<span class="token keyword"><span class="token hs-start bold">log</span></span> myURL
</code></pre>
  <p>
    You can also use
    <a href="/expressions/#query-literals"><code>query literals</code></a
    >, discussed <a href="#dom-literals">below</a>, to create new HTML content:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">make</span> an</span> <span class="token selector">&lt;a.navlink/&gt;</span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token builtin">it</span> <span class="token keyword">after</span> <span class="token builtin">me</span>
</code></pre>
  <h4 id="arrays" tabindex="-1">
    <a class="header-anchor" href="#arrays" aria-hidden="true">§</a> Arrays
  </h4>
  <p>Hyperscript arrays work very similarly to JavaScript arrays:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> myArr <span class="token keyword">to</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> myArr<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>           <span class="token comment">-- logs "1"</span>
</code></pre>
  <p>
    You can use the <code>first</code>, <code>last</code> and
    <code>random</code> keywords, discussed <a href="#positional">below</a>,
    with arrays:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> myArr <span class="token keyword">to</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token keyword">the</span> <span class="token keyword">first</span> <span class="token keyword">of</span> myArr  <span class="token comment">-- logs "1"</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token keyword">the</span> <span class="token keyword">last</span> <span class="token keyword">of</span> myArr   <span class="token comment">-- logs "3"</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token keyword">random</span> <span class="token keyword">in</span> myArr     <span class="token comment">-- logs a random element from the array</span>
</code></pre>
  <h5 id="closures" tabindex="-1">
    <a class="header-anchor" href="#closures" aria-hidden="true">§</a> Closures
  </h5>
  <p>
    Hyperscript does not encourage the use of closures or callbacks nearly as
    much as JavaScript. Rather, it uses
    <a href="#async">async transparency</a> to handle many of the situations in
    which JavaScript would use them.
  </p>
  <p>
    However, there is one area where closures provide a lot of value in
    hyperscript: data structure manipulation. The hyperscript syntax for
    closures is inspired by <a href="https://www.haskell.org/">haskell</a>,
    starting with a <code>\</code> character, then the arguments, then an arrow
    <code>-&gt;</code>, followed by an expression:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> strs <span class="token keyword">to</span> <span class="token punctuation">[</span><span class="token string">"a"</span><span class="token punctuation">,</span> <span class="token string">"list"</span><span class="token punctuation">,</span> <span class="token string">"of"</span><span class="token punctuation">,</span> <span class="token string">"strings"</span><span class="token punctuation">]</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> lens <span class="token keyword">to</span> strs<span class="token operator">.</span>map<span class="token punctuation">(</span> <span class="token operator">\</span> s <span class="token operator">-&gt;</span> s<span class="token operator">.</span>length <span class="token punctuation">)</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> lens
</code></pre>
  <h3 id="control-flow" tabindex="-1">
    <a class="header-anchor" href="#control-flow" aria-hidden="true">§</a>
    Control Flow
  </h3>
  <p>
    Conditional control flow in hyperscript is done with the
    <a href="/commands/if">if command</a> or the <code>unless</code> modifier.
    The conditional expression in an if statement is not parenthesized.
    Hyperscript uses <code>end</code> rather than curly-braces to delimit the
    conditional body.
  </p>
  <p>
    The else-branch can use either the <code>else</code> keyword or the
    <code>otherwise</code> keyword.
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: "If" command</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">increment</span></span> <span class="token punctuation">:</span>x
            <span class="token keyword"><span class="token hs-start bold">if</span></span> <span class="token punctuation">:</span>x <span class="token operator">&lt;=</span> <span class="token number">3</span>
              <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token punctuation">:</span>x <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span>
            <span class="token keyword"><span class="token hs-start bold">else</span></span>
              <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'3 is the max...'</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span>
            <span class="token keyword"><span class="token hs-start bold">end</span></span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click increment :x
              if :x <= 3
                put :x into the next <output/>
              else
                put '3 is the max...' into the next <output/>
              end"
      >
        Click Me
      </button>
      <output>--</output>
    </p>
  </figure>
  <p>
    As mentioned in the introduction, <code>end</code> is often omitted when it
    isn't needed in order to make scripts smaller:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">increment</span></span> <span class="token punctuation">:</span>x
              <span class="token keyword"><span class="token hs-start bold">if</span></span> <span class="token punctuation">:</span>x <span class="token operator">&lt; </span><span class="token number">3</span>
                <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token punctuation">:</span>x <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span>
              otherwise
                <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'3 is the max...'</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    You can chain <code>if/else</code> commands together in the usual manner.
  </p>
  <p>
    All commands also support an <code>unless</code> modifier to conditionally
    execute them. This allows for a very succinct way of expressing branching
    logic.
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">set</span></span> error <span class="token keyword">to</span> functionCouldReturnError<span class="token punctuation">(</span><span class="token punctuation">)</span>
              <span class="token keyword"><span class="token hs-start bold">log</span></span> error unless <span class="token keyword">no</span> error</span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Log Result
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    See in the following example how the <code>.bordered</code> class is used to
    alter the behaviour of the second button.
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: "unless" modifier</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">toggle</span></span><span class="token class-ref selector"> .bordered</span> <span class="token keyword"><span class="token hs-start bold">on</span></span> <span class="token id-ref selector">#second-button</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Toggle Next Border
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>second-button<span class="token punctuation">"</span></span>
        <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">toggle</span></span><span class="token class-ref selector"> .red</span> unless <span class="token builtin">I</span> <span class="token keyword">match</span><span class="token class-ref selector"> .bordered</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Toggle My Background
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click toggle .bordered on #second-button">
      Toggle Next Border
    </button>
    <button
      id="second-button"
      _="on click toggle .red unless I match .bordered"
    >
      Toggle My Background
    </button>
  </figure>
  <style>
    .bordered {
      border-width: thick;
      border-color: green;
      border-style: solid;
    }
  </style>
  <h4 id="comparisons-%26-logical-operators" tabindex="-1">
    <a
      class="header-anchor"
      href="#comparisons-%26-logical-operators"
      aria-hidden="true"
      >§</a
    >
    Comparisons &amp; Logical Operators
  </h4>
  <p>
    In addition to the usual comparison operators from JavaScript, such as
    <code>==</code> and <code>!=</code>, hyperscript supports
    <a href="/expressions/comparison-operator"
      >a rich set of natural language style comparisons</a
    >
    for use in <code>if</code> commands:
  </p>
  <p>A small sampling is shown below:</p>
  <div class="box">
    <dl class="syntaxes">
      <dt>
        <code class="syntax"
          ><b class="chip syntaxvar"><var>a</var></b> is
          <b class="chip syntaxvar"><var>b</var></b></code
        >
      </dt>
      <dd>
        <p>
          Same as
          <code class="syntax"
            ><b class="chip syntaxvar"><var>a</var></b> ==
            <b class="chip syntaxvar"><var>b</var></b></code
          >.
        </p>
      </dd>
      <dt>
        <code class="syntax"
          ><b class="chip syntaxvar"><var>a</var></b> is not
          <b class="chip syntaxvar"><var>b</var></b></code
        >
      </dt>
      <dd>
        <p>
          Same as
          <code class="syntax"
            ><b class="chip syntaxvar"><var>a</var></b> !=
            <b class="chip syntaxvar"><var>b</var></b></code
          >.
        </p>
      </dd>
      <dt>
        <code class="syntax"
          >no <b class="chip syntaxvar"><var>a</var></b></code
        >
      </dt>
      <dd>
        <p>
          Same as
          <code class="syntax"
            ><b class="chip syntaxvar"><var>a</var></b> == null or
            <b class="chip syntaxvar"><var>a</var></b> == undefined or
            [[a.length]] == 0</code
          >.
        </p>
      </dd>
      <dt>
        <code class="syntax"
          ><b class="chip syntaxvar"><var>element</var></b> matches
          <b class="chip syntaxvar"><var>selector</var></b></code
        >
      </dt>
      <dd>
        <p>Does a CSS test, i.e. <code>if I match .selected</code>.</p>
      </dd>
      <dt>
        <code class="syntax"
          ><b class="chip syntaxvar"><var>a</var></b> exists</code
        >
      </dt>
      <dd>
        <p>
          Same as
          <code class="syntax"
            >not (no <b class="chip syntaxvar"><var>a</var></b
            >)</code
          >.
        </p>
      </dd>
      <dt>
        <code class="syntax"
          ><b class="chip syntaxvar"><var>x</var></b> is greater than
          <b class="chip syntaxvar"><var>y</var></b></code
        >
      </dt>
      <dt>
        <code class="syntax"
          ><b class="chip syntaxvar"><var>x</var></b> is less than
          <b class="chip syntaxvar"><var>y</var></b></code
        >
      </dt>
      <dd>
        <p>Same as <code>&gt;</code> and <code>&lt;</code>, respectively.</p>
      </dd>
      <dt>
        <code class="syntax"
          ><b class="chip syntaxvar"><var>collection</var></b> is empty</code
        >
      </dt>
      <dd>
        <p>Tests if a collection is empty.</p>
      </dd>
    </dl>
  </div>
  <p>
    If the left hand side of the operator is <code>I</code>, then
    <code>is</code> can be replaced with <code>am</code>:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">get</span></span> chosenElement<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword"><span class="token hs-start bold">if</span></span> <span class="token builtin">I</span> <span class="token keyword">am</span> <span class="token keyword">the</span> <span class="token builtin">result</span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">remove</span></span> <span class="token builtin">me</span> <span class="token keyword"><span class="token hs-start bold">end</span></span>
</code></pre>
  <p>
    Using these natural language alternatives allows you to write very readable
    scripts.
  </p>
  <p>
    Comparisons can be combined via the <code>and</code>, <code>or</code> and
    <code>not</code> expressions in the usual manner:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">if</span></span> <span class="token builtin">I</span> <span class="token keyword">am</span> <span class="token selector">&lt;:checked/&gt; and the closest &lt;form/&gt; is &lt;:focus/&gt;</span>
  <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlight</span> <span class="token keyword">to</span> <span class="token keyword">the</span> <span class="token keyword">closest</span> <span class="token selector">&lt;form/&gt;</span>
</code></pre>
  <h4 id="loops" tabindex="-1">
    <a class="header-anchor" href="#loops" aria-hidden="true">§</a> Loops
  </h4>
  <p>
    The <a href="/commands/repeat">repeat command</a> is the looping mechanism
    in hyperscript.
  </p>
  <p>
    It supports a large number of variants, including a short hand
    <code>for</code> version:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token comment">-- a basic for loop</span>
<span class="token keyword"><span class="token hs-start bold">repeat for</span></span> x <span class="token keyword">in</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>
  <span class="token keyword"><span class="token hs-start bold">log</span></span> x
<span class="token keyword"><span class="token hs-start bold">end</span></span>

<span class="token comment">-- you may omit the 'repeat' keyword for a for loop</span>
<span class="token keyword"><span class="token hs-start bold">for</span></span> x <span class="token keyword">in</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>
  <span class="token keyword"><span class="token hs-start bold">log</span></span> x
<span class="token keyword"><span class="token hs-start bold">end</span></span>

<span class="token comment">-- you may repeat without an explicit loop variable and use</span>
<span class="token comment">-- the implicit `it` symbol</span>
<span class="token keyword"><span class="token hs-start bold">repeat in</span></span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span>
  <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token builtin">it</span>
<span class="token keyword"><span class="token hs-start bold">end</span></span>

<span class="token comment">-- you may use a while clause to loop while a condition is true</span>
<span class="token keyword"><span class="token hs-start bold">repeat while</span></span> x <span class="token operator">&lt; </span><span class="token number">10</span>
  <span class="token keyword"><span class="token hs-start bold">log</span></span> x
<span class="token keyword"><span class="token hs-start bold">end</span></span>

<span class="token comment">-- you may use an until clause to loop until a condition is true</span>
<span class="token keyword"><span class="token hs-start bold">repeat until</span></span> x <span class="token keyword">is</span> <span class="token number">10</span>
  <span class="token keyword"><span class="token hs-start bold">log</span></span> x
<span class="token keyword"><span class="token hs-start bold">end</span></span>

<span class="token comment">-- you may use the times clause to repeat a fixed number of times</span>
<span class="token keyword"><span class="token hs-start bold">repeat</span></span> <span class="token number">3</span> <span class="token keyword">times</span>
  <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">'looping'</span>
<span class="token keyword"><span class="token hs-start bold">end</span></span>

<span class="token comment">-- you may use the index clause on any of the above</span>
<span class="token comment">-- to bind the loop index to a given symbol</span>
<span class="token keyword"><span class="token hs-start bold">for</span></span> x <span class="token keyword">in</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span> index i
  <span class="token keyword"><span class="token hs-start bold">log</span></span> i<span class="token punctuation">,</span> <span class="token string">"is"</span><span class="token punctuation">,</span> x
<span class="token keyword"><span class="token hs-start bold">end</span></span>

<span class="token comment">-- you can loop forever if you like</span>
<span class="token keyword"><span class="token hs-start bold">repeat forever</span></span>
  <span class="token keyword"><span class="token hs-start bold">if</span></span> <span class="token builtin">I</span> <span class="token keyword">match</span> <span class="token punctuation">:</span>focus
    break
  <span class="token keyword"><span class="token hs-start bold">end</span></span>
  <span class="token keyword"><span class="token hs-start bold">wait</span></span> <span class="token number">2s</span>
<span class="token keyword"><span class="token hs-start bold">end</span></span>

</code></pre>
  <p>
    Loops support both the <a href="/commands/break"><code>break</code></a> and
    <a href="/commands/continue"><code>continue</code></a> commands.
  </p>
  <p>
    You can also use events to signal when a loop ends, see
    <a href="#async_loops">the async section on loops</a>
  </p>
  <h4 id="aggregate_operations" tabindex="-1">
    <a class="header-anchor" href="#aggregate_operations" aria-hidden="true"
      >§</a
    >
    Aggregate Operations
  </h4>
  <p>
    Note that loops are often not required in hyperscript. Many commands will
    automatically deal with arrays and collections for you.
  </p>
  <p>
    For example, if you want to add the class <code>.foo</code> to all elements
    that have the class <code>.bar</code> on it, you can simply write this:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .foo</span> <span class="token keyword">to</span><span class="token class-ref selector"> .bar</span>
</code></pre>
  <p>
    The <a href="/commands/add"><code>add</code></a> command will take care of
    looping over all elements with the class <code>.bar</code>.
  </p>
  <p>No need to loop explicitly over the results.</p>
  <h3 id="math" tabindex="-1">
    <a class="header-anchor" href="#math" aria-hidden="true">§</a> Math
    Operations
  </h3>
  <p>Hyperscript supports most of the regular math operators:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> x <span class="token keyword">to</span> <span class="token number">10</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> y <span class="token keyword">to</span> <span class="token number">20</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> sum <span class="token keyword">to</span> x <span class="token operator">+</span> y
<span class="token keyword"><span class="token hs-start bold">set</span></span> diff <span class="token keyword">to</span> x<span class="token operator"> - </span>y
<span class="token keyword"><span class="token hs-start bold">set</span></span> product <span class="token keyword">to</span> x <span class="token operator">*</span> y
</code></pre>
  <p>
    with one exception, the modulo operator uses the keyword <code>mod</code>:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> x <span class="token keyword">to</span> <span class="token number">10</span> mod <span class="token number">3</span>
</code></pre>
  <p>
    Hyperscript does not have a notion of mathematical operator precedence.
    Instead, math operators must be fully parenthesized when used in combination
    with other math operators:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> x <span class="token keyword">to</span> <span class="token number">10</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> y <span class="token keyword">to</span> <span class="token number">20</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> sumOfSquares <span class="token keyword">to</span> <span class="token punctuation">(</span>x <span class="token operator">*</span> x<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token punctuation">(</span>y <span class="token operator">*</span> y<span class="token punctuation">)</span>
</code></pre>
  <p>
    If you did not fully parenthesize this expression it would be a parse error.
  </p>
  <p>
    This clarifies any mathematical logic you are doing and encourages simpler
    expressions, which, again helps readability.
  </p>
  <p>
    Hyperscript also offers an
    <a href="/commands/increment"><code>increment</code></a> and
    <a href="/commands/decrement"><code>decrement</code></a> command for
    modifying numbers:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> x <span class="token keyword">to</span> <span class="token number">1</span>
<span class="token keyword"><span class="token hs-start bold">increment</span></span> x
puts x <span class="token comment">-- prints 2 to the console</span>
</code></pre>
  <p>
    A nice thing about the <code>increment</code> and
    <code>decrement</code> commands is that they will automatically handle
    string to number conversions and, therefore, can be used with numbers stored
    in attributes on the DOM:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click
   <span class="token keyword"><span class="token hs-start bold">increment</span></span> <span class="token attribute">@<span class="token attr-name">data-counter</span></span>
   <span class="token keyword"><span class="token hs-start bold">if</span></span> <span class="token attribute">@<span class="token attr-name">data-counter</span></span> <span class="token keyword">as</span> <span class="token builtin">Int</span> <span class="token keyword">is</span> greater than <span class="token number">4</span>
     <span class="token keyword"><span class="token hs-start bold">add</span></span> <span class="token attribute">@<span class="token attr-name">disabled</span></span> <span class="token comment">-- disable after the 5th click</span>
</code></pre>
  <h3 id="strings" tabindex="-1">
    <a class="header-anchor" href="#strings" aria-hidden="true">§</a> Strings
  </h3>
  <p>
    Hyperscript supports strings that use either a single quotes or double
    quotes:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> hello <span class="token keyword">to</span> <span class="token string">'hello'</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> world <span class="token keyword">to</span> <span class="token string">"world"</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> helloWorld <span class="token keyword">to</span> hello <span class="token operator">+</span> <span class="token string">" "</span> <span class="token operator">+</span> world
</code></pre>
  <p>and also supports JavaScript style template strings:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">set</span></span> helloWorld <span class="token keyword">to</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>hello<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>world<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>
</code></pre>
  <p>
    The <a href="/commands/append"><code>append</code></a> command can append
    content to strings (as well as to arrays and the DOM):
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript">  <span class="token keyword"><span class="token hs-start bold">get</span></span> <span class="token string">"hello"</span>      <span class="token comment">-- set result to "hello"</span>
  <span class="token keyword"><span class="token hs-start bold">append</span></span> <span class="token string">" world"</span>  <span class="token comment">-- append " world" to the result</span>
  <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token builtin">it</span>           <span class="token comment">-- log it to the console</span>
</code></pre>
  <h3 id="conversions" tabindex="-1">
    <a class="header-anchor" href="#conversions" aria-hidden="true">§</a>
    Conversions
  </h3>
  <p>
    To convert values between different types, hyperscript has an
    <a href="/expressions/as"><code>as</code> operator</a>:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Converting Values</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click
             <span class="token keyword"><span class="token hs-start bold">get</span></span> <span class="token keyword">the</span> <span class="token punctuation">(</span>value <span class="token keyword">of</span> <span class="token keyword">the</span> next <span class="token selector">&lt;input/&gt;</span><span class="token punctuation">)</span> <span class="token keyword">as</span> an <span class="token builtin">Int</span>
             <span class="token keyword"><span class="token hs-start bold">increment</span></span> <span class="token builtin">it</span>
             <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token builtin">it</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Add 1 To :
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span><span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p
      data-dashlane-rid="7700d311f13b19a0"
      data-dashlane-classification="other"
    >
      <button
        _="on click
               get the (value of the next <input/>) as an Int
               increment it
               put it into the next <output/>"
      >
        Add 1 To :
      </button>
      <input
        data-dashlane-rid="e3a1f275f3d94562"
        data-dashlane-classification="other"
      />
      <output>--</output>
    </p>
  </figure>
  <p>
    Here we get the input value, which is a String, and we convert it to an
    Integer. Note that we need to use parenthesis to ensure that the
    <code>as</code> expression does not bind too tightly.
  </p>
  <p>
    We then increment the number and put it into the next
    <code>output</code> element.
  </p>
  <p>Out of the box hyperscript offers a number of useful conversions:</p>
  <ul>
    <li><code>Array</code> - convert to Array</li>
    <li><code>Date</code> - convert to Date</li>
    <li><code>Float</code> - convert to float</li>
    <li><code>Fragment</code> - converts a string into an HTML Fragment</li>
    <li><code>HTML</code> - converts NodeLists and arrays to an HTML string</li>
    <li><code>Int</code> - convert to integer</li>
    <li><code>JSON</code> - convert to a JSON String</li>
    <li><code>Number</code> - convert to number</li>
    <li><code>Object</code> - convert from a JSON String</li>
    <li><code>String</code> - convert to String</li>
    <li>
      <code>Values</code> - converts a Form (or other element) into a struct
      containing its input names/values
    </li>
    <li>
      <code>Fixed&lt;:N&gt;</code> - convert to a fixed precision string
      representation of the number, with an optional precision of <code>N</code>
    </li>
  </ul>
  <p>
    You can also <a href="/expressions/as">add your own conversions</a> to the
    language as well.
  </p>
  <h3 id="calling-functions" tabindex="-1">
    <a class="header-anchor" href="#calling-functions" aria-hidden="true">§</a>
    Calling Functions
  </h3>
  <p>
    There are many ways to invoke functions in hyperscript. Two commands let you
    invoke a function and automatically assign the result to the
    <code>result</code> variable:
    <a href="/commands/call"><code>call</code> and <code>get</code></a
    >:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">call</span></span> alert<span class="token punctuation">(</span><span class="token string">'hello world!'</span><span class="token punctuation">)</span>
<span class="token keyword"><span class="token hs-start bold">get</span></span> <span class="token keyword">the</span> nextInteger<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token builtin">it</span> <span class="token comment">-- using the 'it' alias for 'result`</span>
</code></pre>
  <p>You can also invoke functions as stand-alone commands:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"Getting the selection"</span>
getSelection<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"Got the selection"</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token builtin">it</span>
</code></pre>
  <p>
    Finally, you can use the
    <a href="/commands/pseudo-commands"><code>pseudo-command</code></a> syntax,
    which allows you to put the method name first on the line in a method call,
    to improve readability in some cases:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript">reload<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">the</span> location <span class="token keyword">of</span> <span class="token keyword">the</span> window
writeText<span class="token punctuation">(</span><span class="token string">'evil'</span><span class="token punctuation">)</span> <span class="token keyword">into</span> <span class="token keyword">the</span> navigator<span class="token operator">'s</span> clipboard
reset<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">the</span> <span class="token id-ref selector">#contact-form</span>
</code></pre>
  <p>
    These are called "pseudo-commands" because this syntax makes method calls
    look like a normal command in hyperscript.
  </p>
  <h3 id="event" tabindex="-1">
    <a class="header-anchor" href="#event" aria-hidden="true">§</a> Events &amp;
    Event Handlers
  </h3>
  <p>
    <a
      href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events"
      >Events</a
    >
    are at the core of hyperscript, and
    <a href="/features/on">event handlers</a> are the primary entry point into
    most hyperscript code.
  </p>
  <p>
    hyperscript's event handlers allow you to respond to any event (not just DOM
    events, as with <code>onClick</code> handlers) and provide a slew of
    features for making working with events easier.
  </p>
  <p>Here is an example:</p>
  <figure class="box">
    <figcaption class="allcaps">Example: Event Handlers</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span><span class="token punctuation">&gt;</span></span>
.clicked::after {
content: " ... Clicked!"
}
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .clicked</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Add The "clicked" Class To Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <style>
      .clicked::after {
        content: " ... Clicked!";
      }
    </style>
    <button _="on click add .clicked">Add The "clicked" Class To Me</button>
  </figure>
  <p>
    The script above, again, found on the <code>_</code> attribute, does, well,
    almost exactly what it says:
  </p>
  <blockquote>
    <p>
      On the 'click' event for this button, add the 'clicked' class to this
      button
    </p>
  </blockquote>
  <p>
    This is the beauty of hyperscript: you probably knew what it was doing
    immediately, when reading it.
  </p>
  <p>
    Event handlers have a <em>very</em> extensive syntax that allows you to, for
    example:
  </p>
  <ul>
    <li>
      Control the queuing behavior of events (how do you want events to queue up
      when an event handler is running?)
    </li>
    <li>
      Respond to events only in certain cases, either with counts (e.g.
      <code>on click 1</code>) or with event filters (<code
        >on keyup[key is 'Escape']</code
      >)
    </li>
    <li>Control debounce and throttle behavior</li>
    <li>
      Respond to events from other elements or from <code>elsewhere</code> (i.e.
      outside the current element)
    </li>
  </ul>
  <p>
    You can read all the gory details on the
    <a href="/features/on">event handler</a> page, but chances are, if you want
    some special handling of an event, hyperscript has a nice, clear syntax for
    doing so.
  </p>
  <h4 id="event_queueing" tabindex="-1">
    <a class="header-anchor" href="#event_queueing" aria-hidden="true">§</a>
    Event Queueing
  </h4>
  <p>
    By default, the event handler will be run synchronously, so if the event is
    triggered again before the event handler finished, the new event will be
    queued and handled only when the current event handler finishes.
  </p>
  <p>You can modify this behavior in a few different ways:</p>
  <h5 id="on_every" tabindex="-1">
    <a class="header-anchor" href="#on_every" aria-hidden="true">§</a> The Every
    Modifier
  </h5>
  <p>
    An event handler with the <code>every</code> modifier will execute the event
    handler for every event that is received, even if the preceding handler
    execution has not finished.
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> every click <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .clicked</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Add The "clicked" Class To Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    This is useful in cases where you want to make sure you get the handler
    logic for every event going immediately.
  </p>
  <h5 id="on_queue" tabindex="-1">
    <a class="header-anchor" href="#on_queue" aria-hidden="true">§</a> The Queue
    Modifier
  </h5>
  <p>
    The <code>every</code> keyword is a prefix to the event name, but for other
    queuing options, you postfix the event name with the
    <code>queue</code> keyword.
  </p>
  <p>You may pick from one of four strategies:</p>
  <ul>
    <li>
      <code>none</code> - Any events that arrive while the event handler is
      active will be dropped
    </li>
    <li>
      <code>all</code> - All events that arrive will be added to a queue and
      handled in order
    </li>
    <li>
      <code>first</code> - The first event that arrives will be queued, all
      others will be dropped
    </li>
    <li>
      <code>last</code> - The last event that arrives will be queued, all others
      will be dropped
    </li>
  </ul>
  <p><code>queue last</code> is the default behavior</p>
  <figure class="box">
    <figcaption class="allcaps">Example: Queue All</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click queue all
                  <span class="token keyword"><span class="token hs-start bold">increment</span></span> <span class="token punctuation">:</span>count
                  <span class="token keyword"><span class="token hs-start bold">wait</span></span> <span class="token number">1s</span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token builtin">it</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me Quickly...
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click queue all
                    increment :count
                    wait 1s then put it into the next <output/>"
      >
        Click Me Quickly...
      </button>
      <output>--</output>
    </p>
  </figure>
  <p>
    If you click quickly on the button above you will see that the count slowly
    increases as each event waits 1 second and then completes, and the next
    event that has queued up executes.
  </p>
  <h4 id="event_destructuring" tabindex="-1">
    <a class="header-anchor" href="#event_destructuring" aria-hidden="true"
      >§</a
    >
    Event Destructuring
  </h4>
  <p>
    You can
    <a href="https://hacks.mozilla.org/2015/05/es6-in-depth-destructuring/"
      >destructure</a
    >
    properties found either on the <code>event</code> or in the
    <code>event.detail</code> properties by appending a parenthesized list of
    names after the event name.
  </p>
  <p>
    This will create a local variable of the same name as the referenced
    property:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Event Parameters</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> mousedown<span class="token punctuation">(</span>button<span class="token punctuation">)</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token keyword">the</span> button <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me With Different Buttons...
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on mousedown(button) put the button into the next <output/>">
      Click Me With Different Buttons...
    </button>
    <output>--</output>
  </figure>
  <p>
    Here the <code>event.button</code> property is being destructured into a
    local variable, which we then put into the next <code>output</code> element
  </p>
  <h4 id="event_filters" tabindex="-1">
    <a class="header-anchor" href="#event_filters" aria-hidden="true">§</a>
    Event Filters
  </h4>
  <p>
    You can filter events by adding a bracketed expression after the event name
    and destructured properties (if any).
  </p>
  <p>
    The expression should return a boolean value <code>true</code> if the event
    handler should execute.
  </p>
  <p>
    Note that symbols referenced in the expression will be resolved as
    properties of the event, then as symbols in the global scope.
  </p>
  <p>
    This lets you, for example, test for a middle click on the click event, by
    referencing the <code>button</code> property on that event directly:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Event Filters</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> mousedown<span class="token punctuation">[</span>button<span class="token operator">==</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .clicked</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Middle-Click To Add The "clicked" Class To Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on mousedown[button==1] add .clicked">
      Middle-Click To Add The "clicked" Class To Me
    </button>
  </figure>
  <h4 id="halting_events" tabindex="-1">
    <a class="header-anchor" href="#halting_events" aria-hidden="true">§</a>
    Halting Events
  </h4>
  <p>
    An event handler can exit with the
    <a href="/commands/halt"><code>halt</code></a> command. By default this
    command will halt the current event bubbling, call
    <code>preventDefault()</code> and exit the current event handlers. However,
    there are forms available to stop only the event from bubbling, but continue
    on in the event handler:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/hyperscript<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-hyperscript">
  <span class="token keyword"><span class="token hs-start bold">on</span></span> mousedown
    <span class="token keyword"><span class="token hs-start bold">halt</span></span> <span class="token keyword">the</span> <span class="token builtin">event</span> <span class="token comment">-- prevent text selection...</span>
    <span class="token comment">-- do other stuff...</span>
  <span class="token keyword"><span class="token hs-start bold">end</span></span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    You may also use the <a href="/commands/halt"><code>exit</code></a> command
    to exit a function, discussed below.
  </p>
  <h4 id="sending-events" tabindex="-1">
    <a class="header-anchor" href="#sending-events" aria-hidden="true">§</a>
    Sending Events
  </h4>
  <p>
    hyperscript not only makes it easy to respond to events, but also makes it
    very easy to send events to other elements using the
    <a href="/commands/send"><code>send</code></a> and
    <a href="/commands/send"><code>trigger</code></a> commands. Both commands do
    the same thing: sending an event to an element (possibly the current
    element!) to handle.
  </p>
  <p>Here are a few examples:</p>
  <figure class="box">
    <figcaption class="allcaps">Example: Send, Trigger</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">send</span></span> foo <span class="token keyword">to</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>Send Foo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">trigger</span></span> bar <span class="token keyword"><span class="token hs-start bold">on</span></span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>Send Bar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> foo <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'I got a foo event!'</span> <span class="token keyword">into</span> <span class="token builtin">me</span>
         <span class="token keyword"><span class="token hs-start bold">on</span></span> bar <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'I got a bar event!'</span> <span class="token keyword">into</span> <span class="token builtin">me</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
No Events Yet...
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button _="on click send foo to the next <output/>">Send Foo</button>
      <button _="on click trigger bar on the next <output/>">Send Bar</button>
      <output
        _="on foo put 'I got a foo event!' into me
           on bar put 'I got a bar event!' into me"
      >
        No Events Yet...
      </output>
    </p>
  </figure>
  <p>
    You can also pass arguments to events via the
    <code>event.detail</code> property, and use the destructuring syntax
    discussed above to parameterize events:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Send with arguments</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">send</span></span> showMessage<span class="token punctuation">(</span>message<span class="token punctuation">:</span><span class="token string">'Foo!'</span><span class="token punctuation">)</span> <span class="token keyword">to</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>Send Foo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">send</span></span> showMessage<span class="token punctuation">(</span>message<span class="token punctuation">:</span><span class="token string">'Bar!'</span><span class="token punctuation">)</span> <span class="token keyword">to</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>Send Bar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> showMessage<span class="token punctuation">(</span>message<span class="token punctuation">)</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">The message '</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>message<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">' was sent to me</span><span class="token template-punctuation string">`</span></span> <span class="token keyword">into</span> <span class="token builtin">me</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
No Events Yet...
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click send showMessage(message:'Foo!') to the next <output/>"
      >
        Send Foo
      </button>
      <button
        _="on click send showMessage(message:'Bar!') to the next <output/>"
      >
        Send Bar
      </button>
      <output
        _="on showMessage(message) put `The message '${message}' was sent to me` into me"
      >
        No Events Yet...
      </output>
    </p>
  </figure>
  <p>
    As you can see, working with events is very natural in hyperscript. This
    allows you to build clear, readable event-driven code without a lot of fuss.
  </p>
  <h4 id="synthetic-events" tabindex="-1">
    <a class="header-anchor" href="#synthetic-events" aria-hidden="true">§</a>
    Synthetic Events
  </h4>
  <p>
    hyperscript includes a few synthetic events that make it easier to use more
    complex APIs in JavaScript.
  </p>
  <h5 id="mutation" tabindex="-1">
    <a class="header-anchor" href="#mutation" aria-hidden="true">§</a> Mutation
    Events
  </h5>
  <p>
    You can listen for mutations on an element with the
    <code>on mutation</code> form. This will use the
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver"
      >Mutation Observer</a
    >
    API, but will act more like a regular event handler.
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">'</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> mutation <span class="token keyword">of</span> <span class="token attribute">@<span class="token attr-name">foo</span></span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">"Mutated"</span> <span class="token keyword">into</span> <span class="token builtin">me</span></span><span class="token punctuation">'</span></span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    This div will listen for mutations of the <code>foo</code> attribute on this
    div and, when one occurs, will put the value "Mutated" into the element.
  </p>
  <p>
    Here is a div that is set to <code>content-editable='true'</code> and that
    listens to mutations and updates a mutation count below:
  </p>
  <figure class="box" data-dashlane-rid="fd80dae31243e319">
    <figcaption class="allcaps">Example: Content Editable Mutations</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">contenteditable</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span>
   <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> mutation <span class="token keyword">of</span> anything <span class="token keyword"><span class="token hs-start bold">increment</span></span> <span class="token punctuation">:</span>mutationCount <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token builtin">it</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Hello World
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <div
      contenteditable="true"
      _="on mutation of anything increment :mutationCount then put it into the next <output/>"
      data-dashlane-rid="203a98739e081ea3"
    >
      Hello World
    </div>
    <output>1</output>
  </figure>
  <h5 id="intersection" tabindex="-1">
    <a class="header-anchor" href="#intersection" aria-hidden="true">§</a>
    Intersection Events
  </h5>
  <p>
    Another synthetic event is the <code>intersection</code> event that uses the
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
      >Intersection Observer</a
    >
    API. Again, hyperscript makes this API feel more event-driven:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>img</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> intersection<span class="token punctuation">(</span>intersecting<span class="token punctuation">)</span> having threshold <span class="token number">0.</span><span class="token number">5</span>
        <span class="token keyword"><span class="token hs-start bold">if</span></span> intersecting <span class="token keyword"><span class="token hs-start bold">transition</span></span> opacity <span class="token keyword">to</span> <span class="token number">1</span>
        <span class="token keyword"><span class="token hs-start bold">else</span></span> <span class="token keyword"><span class="token hs-start bold">transition</span></span> opacity <span class="token keyword">to</span> <span class="token number">0</span> </span><span class="token punctuation">"</span></span></span>
    <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>https://placebear.com/200/300<span class="token punctuation">"</span></span><span class="token punctuation">/&gt;</span></span>
</code></pre>
  <p>
    This image will become visible when 50% or more of it has scrolled into
    view. Note that the <code>intersecting</code> property is destructured into
    a local symbol, and the <code>having threshold</code> modifier is used to
    specify that 50% of the image must be showing.
  </p>
  <p>Here is a demo:</p>
  <p>
    <img
      _="on intersection(intersecting) having threshold 0.5
         if intersecting transition opacity to 1
         else transition opacity to 0 "
      src="https://placebear.com/200/300"
      style="opacity: 0;"
    />
  </p>
  <h3 id="init" tabindex="-1">
    <a class="header-anchor" href="#init" aria-hidden="true">§</a> Init Blocks
  </h3>
  <p>
    If you have logic that you wish to run when an element is initialized, you
    can use the <code>init</code> block to do so:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">init</span></span> <span class="token keyword"><span class="token hs-start bold">transition</span></span> <span class="token builtin">my</span> opacity <span class="token keyword">to</span> <span class="token number">100</span><span class="token operator">%</span> <span class="token keyword">over</span> <span class="token number">3</span> <span class="token keyword">seconds</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Fade Me In
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    The <code>init</code> keyword should be followed by a set of commands to
    execute when the element is loaded.
  </p>
  <h3 id="functions" tabindex="-1">
    <a class="header-anchor" href="#functions" aria-hidden="true">§</a>
    Functions
  </h3>
  <p>
    Functions in hyperscript are defined by using the
    <a href="/features/def"><code>def</code> keyword</a>.
  </p>
  <p>
    Functions defined on elements will be available to the element the function
    is defined on, as well as any child elements.
  </p>
  <p>Functions can also be defined in a hyperscript <code>script</code> tag:</p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/hyperscript<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-hyperscript">
  <span class="token keyword"><span class="token hs-start bold">def</span></span> waitAndReturn<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword"><span class="token hs-start bold">wait</span></span> <span class="token number">2s</span>
    <span class="token keyword"><span class="token hs-start bold">return</span></span> <span class="token string">"I waited..."</span>
  <span class="token keyword"><span class="token hs-start bold">end</span></span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    This will define a global function, <code>waitAndReturn()</code> that can be
    invoked from anywhere in hyperscript.
  </p>
  <p>Hyperscript can also be loaded remotely in <code>._hs</code> files.</p>
  <p>
    When loaded in this manner, the script tags <strong>must</strong> appear
    before loading hyperscript:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/hyperscript<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/functions._hs<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>https://unpkg.com/hyperscript.org<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    Hyperscript is fully interoperable with JavaScript, and global hyperscript
    functions can be called from JavaScript as well as vice-versa:
  </p>
  <pre
    class=" language-js"
    tabindex="0"
  ><code class=" language-js"><span class="token keyword">var</span> str <span class="token operator">=</span> <span class="token function">waitAndReturn</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
str<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"String is: "</span> <span class="token operator">+</span> val<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre>
  <p>
    Hyperscript functions can take parameters and return values in the expected
    way:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/hyperscript<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-hyperscript">
  <span class="token keyword"><span class="token hs-start bold">def</span></span> <span class="token keyword"><span class="token hs-start bold">increment</span></span><span class="token punctuation">(</span>i<span class="token punctuation">)</span>
    <span class="token keyword"><span class="token hs-start bold">return</span></span> i <span class="token operator">+</span> <span class="token number">1</span>
  <span class="token keyword"><span class="token hs-start bold">end</span></span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    You may exit a function using
    <a href="/commands/return"><code>return</code></a> if you wish to return a
    value or <a href="/commands/halt"><code>exit</code></a> if you do not want
    to return a value.
  </p>
  <h4 id="function_namespacing" tabindex="-1">
    <a class="header-anchor" href="#function_namespacing" aria-hidden="true"
      >§</a
    >
    Namespacing
  </h4>
  <p>
    You can namespace a function by prefixing it with dot separated identifiers.
    This allows you to place functions into a specific namespace, rather than
    polluting the global namespace:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/hyperscript<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-hyperscript">
  <span class="token keyword"><span class="token hs-start bold">def</span></span> utils<span class="token operator">.</span><span class="token keyword"><span class="token hs-start bold">increment</span></span><span class="token punctuation">(</span>i<span class="token punctuation">)</span>
    <span class="token keyword"><span class="token hs-start bold">return</span></span> i <span class="token operator">+</span> <span class="token number">1</span>
  <span class="token keyword"><span class="token hs-start bold">end</span></span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-hyperscript">
  console<span class="token operator">.</span><span class="token keyword"><span class="token hs-start bold">log</span></span><span class="token punctuation">(</span>utils<span class="token operator">.</span><span class="token keyword"><span class="token hs-start bold">increment</span></span><span class="token punctuation">(</span><span class="token number">41</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token operator">/</span><span class="token operator">/</span> access <span class="token builtin">it</span> <span class="token keyword">from</span> JavaScript
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <h3 id="exceptions" tabindex="-1">
    <a class="header-anchor" href="#exceptions" aria-hidden="true">§</a>
    Exception Handling
  </h3>
  <p>
    Both functions and event handlers may have a <code>catch</code> block
    associated with them:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">def</span></span> example
  <span class="token keyword"><span class="token hs-start bold">call</span></span> mightThrowAnException<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword"><span class="token hs-start bold">catch</span></span> e
  <span class="token keyword"><span class="token hs-start bold">log</span></span> e
<span class="token keyword"><span class="token hs-start bold">end</span></span>

<span class="token keyword"><span class="token hs-start bold">on</span></span> click
  <span class="token keyword"><span class="token hs-start bold">call</span></span> mightThrowAnException<span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword"><span class="token hs-start bold">catch</span></span> e
  <span class="token keyword"><span class="token hs-start bold">log</span></span> e
<span class="token keyword"><span class="token hs-start bold">end</span></span>
</code></pre>
  <p>
    This allows you to handle exceptions that occur during the execution of the
    function or event handler.
  </p>
  <p>
    If you do not include a <code>catch</code> block on an event handler and an
    uncaught exception occurs, an <code>exception</code> event will be triggered
    on the current element and can be handled via an event handler, with the
    <code>error</code> set to the message of the exception:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> exception<span class="token punctuation">(</span>error<span class="token punctuation">)</span>
     <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"An error occurred: "</span> <span class="token operator">+</span> error
</code></pre>
  <p>
    Note that exception handling in hyperscript respects the
    <a href="#async">async-transparent</a> behavior of the language.
  </p>
  <h4 id="finally" tabindex="-1">
    <a class="header-anchor" href="#finally" aria-hidden="true">§</a> Finally
    Blocks
  </h4>
  <p>
    Both functions and event handlers also support a <code>finally</code> block
    to ensure that some cleanup code is executed:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click
  <span class="token keyword"><span class="token hs-start bold">add</span></span> <span class="token attribute">@<span class="token attr-name">disabled</span></span> <span class="token keyword">to</span> <span class="token builtin">me</span>
  <span class="token keyword"><span class="token hs-start bold">fetch</span></span> <span class="token url">/example</span>
  <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token keyword">the</span> <span class="token builtin">result</span> <span class="token keyword">after</span> <span class="token builtin">me</span>
finally
  <span class="token keyword"><span class="token hs-start bold">remove</span></span> <span class="token attribute">@<span class="token attr-name">disabled</span></span> <span class="token keyword">from</span> <span class="token builtin">me</span>
</code></pre>
  <p>
    In this code we ensure that the <code>disabled</code> property is removed
    from the current element.
  </p>
  <h4 id="throw" tabindex="-1">
    <a class="header-anchor" href="#throw" aria-hidden="true">§</a> Throwing
    Exceptions
  </h4>
  <p>
    You may throw an exception using the familiar <code>throw</code> keyword:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click
  <span class="token keyword"><span class="token hs-start bold">if</span></span> <span class="token builtin">I</span> <span class="token keyword">do not match</span><span class="token class-ref selector"> .selected</span>
    <span class="token keyword"><span class="token hs-start bold">throw</span></span> <span class="token string">"I am not selected!"</span>
  <span class="token operator">..</span><span class="token operator">.</span>
</code></pre>
  <h2 id="working-with-the-dom" tabindex="-1">
    <a class="header-anchor" href="#working-with-the-dom" aria-hidden="true"
      >§</a
    >
    Working With The DOM
  </h2>
  <p>
    The primary use case for hyperscript is adding small bits of interactivity
    to the DOM and, as such, it has a lot of syntax for making this easy and
    natural.
  </p>
  <p>
    We have glossed over a lot of this syntax in previous examples (we hope it
    was intuitive enough!) but now we will get into the details of what they all
    do:
  </p>
  <h3 id="finding-things" tabindex="-1">
    <a class="header-anchor" href="#finding-things" aria-hidden="true">§</a>
    Finding Elements
  </h3>
  <p>
    There are two sides to DOM manipulation: finding stuff and mutating it. In
    this section we will focus on how to find things in the DOM.
  </p>
  <h4 id="dom-literals" tabindex="-1">
    <a class="header-anchor" href="#dom-literals" aria-hidden="true">§</a> DOM
    Literals
  </h4>
  <p>
    You are probably used to things like number literals (e.g. <code>1</code>)
    or string literals (e.g. <code>"hello world"</code>).
  </p>
  <p>
    Since hyperscript is designed for DOM manipulation, it supports special
    literals that make it easy to work with the DOM.
  </p>
  <p>Some are inspired by CSS, while others are our own creation.</p>
  <p>Here is a table of the DOM literals:</p>
  <div class="box">
    <dl class="syntaxes">
      <dt>
        <code class="syntax"
          >.<b class="chip syntaxvar"><var>class name</var></b></code
        >
      </dt>
      <dt>
        <code class="syntax"
          >.{<b class="chip syntaxvar"><var>expression</var></b
          >}</code
        >
      </dt>
      <dd>
        <p>
          A <dfn>class literal</dfn> starts with a <code>.</code> and returns
          all elements with that class.
        </p>
      </dd>
      <dt>
        <code class="syntax"
          >#<b class="chip syntaxvar"><var>ID</var></b></code
        >
      </dt>
      <dt>
        <code class="syntax"
          >#{<b class="chip syntaxvar"><var>expression</var></b
          >}</code
        >
      </dt>
      <dd>
        <p>
          An <dfn>ID literal</dfn> starts with a <code>#</code> and returns the
          element with that id.
        </p>
      </dd>
      <dt>
        <code class="syntax"
          >&lt;<b class="chip syntaxvar"><var>css selector</var></b> /&gt;</code
        >
      </dt>
      <dd>
        <p>
          A <dfn>query literal</dfn> is contained within a <code>&lt;</code> and
          <code>/&gt;</code>, returns all elements matching the CSS selector.
        </p>
      </dd>
      <dt>
        <code class="syntax"
          >@<b class="chip syntaxvar"><var>attribute name</var></b></code
        >
      </dt>
      <dd>
        <p>
          An <dfn>attribute literal</dfn> starts with an <code>@</code> (hence,
          <em>at</em>tribute, get it?) and returns the value of that attribute.
        </p>
      </dd>
      <dt>
        <code class="syntax"
          >*<b class="chip syntaxvar"><var>style property</var></b></code
        >
      </dt>
      <dd>
        <p>
          A <dfn>style literal</dfn> starts with an <code>*</code> (a reference
          to <a href="https://css-tricks.com/">CSS Tricks</a>) and returns the
          value of that style property.
        </p>
      </dd>
      <dt><code class="syntax">1em</code></dt>
      <dt><code class="syntax">0%</code></dt>
      <dt>
        <code class="syntax"
          ><b class="chip syntaxvar"><var>expression</var></b> px</code
        >
      </dt>
      <dd>
        <p>
          A <dfn>measurement literal</dfn> is an expression followed by a CSS
          unit, and it appends the unit as a string. So, the above expressions
          are the same as <code>"1em"</code>, <code>"0%"</code> and
          <code class="syntax"
            >`${<b class="chip syntaxvar"><var>expression</var></b
            >}px`</code
          >.
        </p>
      </dd>
    </dl>
  </div>
  <p>Here are a few examples of these literals in action:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token comment">-- adds the 'disabled' class to the element with the id 'myDiv'</span>
<span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .disabled</span> <span class="token keyword">to</span> <span class="token id-ref selector">#myDiv</span>

<span class="token comment">-- adds the 'highlight' class to all divs with the class 'tabs' on them</span>
<span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlight</span> <span class="token keyword">to</span> <span class="token selector">&lt;div.tabs/&gt;</span>

<span class="token comment">-- sets the width of the current element to 35 pixels</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> <span class="token builtin">my</span> <span class="token operator">*</span>width <span class="token keyword">to</span> <span class="token number">35</span>px

<span class="token comment">-- adds the `disabled` attribute to the current element</span>
<span class="token keyword"><span class="token hs-start bold">add</span></span> <span class="token attribute">@<span class="token attr-name">disabled</span></span> <span class="token keyword">to</span> <span class="token builtin">me</span>
</code></pre>
  <p>
    Class literals, ID Literals and Query Literals all support a templating
    syntax.
  </p>
  <p>
    This allows you to look up elements based on a variable rather than a fixed
    value:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token comment">-- adds the 'disabled' class to the element with the id 'myDiv'</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> idToDisable <span class="token keyword">to</span> <span class="token string">'myDiv'</span>
<span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .disabled</span> <span class="token keyword">to</span> #<span class="token punctuation">{</span>idToDisable<span class="token punctuation">}</span>

<span class="token comment">-- adds the 'highlight' class to all elements with the 'tabs' class</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> classToHighlight <span class="token keyword">to</span> <span class="token string">'tabs'</span>
<span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlight</span> <span class="token keyword">to</span> .<span class="token punctuation">{</span>classToHighlight<span class="token punctuation">}</span>

<span class="token comment">-- removes all divs w/ class .hidden on them from the DOM</span>
<span class="token keyword"><span class="token hs-start bold">set</span></span> elementType <span class="token keyword">to</span> <span class="token string">'div'</span>
<span class="token keyword"><span class="token hs-start bold">remove</span></span> <span class="token selector">&lt;${elementType}.hidden/&gt;</span>
</code></pre>
  <p>
    All these language constructs make it very easy to work with the DOM in a
    concise, enjoyable manner.
  </p>
  <p>Compare the following JavaScript:</p>
  <pre
    class=" language-js"
    tabindex="0"
  ><code class=" language-js">document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">'#example-btn'</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">'click'</span><span class="token punctuation">,</span> <span class="token parameter">e</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    document<span class="token punctuation">.</span><span class="token function">querySelectorAll</span><span class="token punctuation">(</span><span class="token string">".elements-to-remove"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> value<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre>
  <p>with the corresponding hyperscript:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword">from</span> <span class="token id-ref selector">#example-btn</span>
  <span class="token keyword"><span class="token hs-start bold">remove</span></span><span class="token class-ref selector"> .elements-to-remove</span>
</code></pre>
  <p>
    You can see how the support for CSS literals directly in hyperscript makes
    for a much cleaner script, allowing us to focus on the logic at hand.
  </p>
  <h4 id="in" tabindex="-1">
    <a class="header-anchor" href="#in" aria-hidden="true">§</a> Finding Things
    In Other Things
  </h4>
  <p>
    Often you want to find things <em>within</em> a particular element. To do
    this you can use the <code>in</code> expression:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token comment">-- add the class 'highlight' to all paragraph tags in the current element</span>
<span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlight</span> <span class="token keyword">to</span> <span class="token selector">&lt;p/&gt;</span> <span class="token keyword">in</span> <span class="token builtin">me</span>
</code></pre>
  <h4 id="closest" tabindex="-1">
    <a class="header-anchor" href="#closest" aria-hidden="true">§</a> Finding
    The Closest Matching (Parent) Element
  </h4>
  <p>
    Sometimes you wish to find the closest element in a parent hierarchy that
    matches some selector. In JavaScript you might use the
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/closest"
      ><code>closest()</code> function</a
    >
  </p>
  <p>
    To do this in hyperscript you can use the
    <a href="/expressions/closest"><code>closest</code></a> expression:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token comment">-- add the class 'highlight' to the closest table row to the current element</span>
<span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlight</span> <span class="token keyword">to</span> <span class="token keyword">the</span> <span class="token keyword">closest</span> <span class="token selector">&lt;tr/&gt;</span>
</code></pre>
  <p>
    Note that <code>closest</code> starts with the current element and recurses
    up the DOM from there. If you wish to start at the parent instead, you can
    use this form:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token comment">-- add the class 'highlight' to the closest div to the current element, excluding the current element</span>
<span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlight</span> <span class="token keyword">to</span> <span class="token keyword">the</span> <span class="token keyword">closest</span> parent <span class="token selector">&lt;div/&gt;</span>
</code></pre>
  <h4 id="positional" tabindex="-1">
    <a class="header-anchor" href="#positional" aria-hidden="true">§</a> Finding
    Things By Position
  </h4>
  <p>
    You can use the
    <a href="/expressions/positional">positional expressions</a> to get the
    first, last or a random element from a collection of things:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token comment">-- add the class 'highlight' to the first paragraph tag in the current element</span>
<span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlight</span> <span class="token keyword">to</span> <span class="token keyword">the</span> <span class="token keyword">first</span> <span class="token selector">&lt;p/&gt;</span> <span class="token keyword">in</span> <span class="token builtin">me</span>
</code></pre>
  <h4 id="relative_positional" tabindex="-1">
    <a class="header-anchor" href="#relative_positional" aria-hidden="true"
      >§</a
    >
    Finding Things Relative To Other Things
  </h4>
  <p>
    You can use the
    <a href="/expressions/relative-positional"
      >relative positional expressions</a
    >
    <code>next</code> and <code>previous</code> to get an element relative to
    either the current element, or to another element:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token comment">-- add the class 'highlight' to the next paragraph found in a forward scan of the DOM</span>
<span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlight</span> <span class="token keyword">to</span> <span class="token keyword">the</span> next <span class="token selector">&lt;p/&gt;</span>
</code></pre>
  <p>
    Note that <code>next</code> and <code>previous</code> support wrapping, if
    you want that.
  </p>
  <h3 id="updating_things" tabindex="-1">
    <a class="header-anchor" href="#updating_things" aria-hidden="true">§</a>
    Updating The DOM
  </h3>
  <p>
    Using the expressions above, you should be able to find the elements you
    want to update easily.
  </p>
  <p>Now, on to updating them!</p>
  <h4 id="set-and-put" tabindex="-1">
    <a class="header-anchor" href="#set-and-put" aria-hidden="true">§</a> Set
    &amp; Put
  </h4>
  <p>
    The most basic way to update contents in the DOM is using the
    <a href="/commands/set"><code>set</code></a> and
    <a href="/commands/put"><code>put</code></a> commands. Recall that these
    commands can also be used to set local variables.
  </p>
  <p>
    When it comes to updating DOM elements, the <code>put</code> command is much
    more flexible, as we will see.
  </p>
  <p>
    First, let's just set the <code>innerHTML</code> of an element to a string:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Setting innerHTML</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">set</span></span> <span class="token builtin">my</span> innerHTML <span class="token keyword">to</span> <span class="token string">'Clicked!'</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click set my innerHTML to 'Clicked!'">Click Me</button>
  </figure>
  <p>Using the <code>put</code> command would look like this:</p>
  <figure class="box">
    <figcaption class="allcaps">
      Example: Setting properties with "put"
    </figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'Clicked!'</span> <span class="token keyword">into</span> <span class="token builtin">my</span> innerHTML</span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click put 'Clicked!' into my innerHTML">Click Me</button>
  </figure>
  <p>
    In fact, the <code>put</code> command is smart enough to default to
    <code>innerHTML</code> when you put something into an element, so we can
    omit the <code>innerHTML</code> entirely:
  </p>
  <figure class="box">
    <figcaption class="allcaps">
      Example: Putting things into elements
    </figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'Clicked!'</span> <span class="token keyword">into</span> <span class="token builtin">me</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click put 'Clicked!' into me">Click Me</button>
  </figure>
  <p>
    The <code>put</code> command can also place content in different places
    based on how it is used:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Put X before Y</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'Clicked!'</span> <span class="token keyword">before</span> <span class="token builtin">me</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click put 'Clicked!' before me">Click Me</button>
  </figure>
  <p>The <code>put</code> command can be used in the following ways:</p>
  <div class="box">
    <dl class="syntaxes">
      <dt>
        <code class="syntax"
          >put <b class="chip syntaxvar"><var>content</var></b> before
          <b class="chip syntaxvar"><var>element</var></b></code
        >
      </dt>
      <dd>
        <p>
          Puts the content in front of the element, using
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/Element/before"
            ><code>Element.before</code></a
          >.
        </p>
      </dd>
      <dt>
        <code class="syntax"
          >put <b class="chip syntaxvar"><var>content</var></b> at the start of
          <b class="chip syntaxvar"><var>element</var></b></code
        >
      </dt>
      <dd>
        <p>
          Puts the content at the beginning of the element, using
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend"
            ><code>Element.prepend</code></a
          >.
        </p>
      </dd>
      <dt>
        <code class="syntax"
          >put <b class="chip syntaxvar"><var>content</var></b> at the end of
          <b class="chip syntaxvar"><var>element</var></b></code
        >
      </dt>
      <dd>
        <p>
          Puts the content at the end of the element, using
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/Element/append"
            ><code>Element.append</code></a
          >.
        </p>
      </dd>
      <dt>
        <code class="syntax"
          >put <b class="chip syntaxvar"><var>content</var></b> after
          <b class="chip syntaxvar"><var>element</var></b></code
        >
      </dt>
      <dd>
        <p>
          Puts the content after the element, using
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/Element/after"
            ><code>Element.after</code></a
          >.
        </p>
      </dd>
    </dl>
  </div>
  <p>
    This flexibility is why we generally recommend the <code>put</code> command
    when updating content in the DOM.
  </p>
  <h5 id="setting-attributes" tabindex="-1">
    <a class="header-anchor" href="#setting-attributes" aria-hidden="true">§</a>
    Setting Attributes
  </h5>
  <p>
    One exception to this rule is when setting attributes, which we typically
    recommend using <code>set</code>.
  </p>
  <p>It just reads better to us:</p>
  <figure class="box">
    <figcaption class="allcaps">Example: Setting attributes</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">set</span></span> <span class="token attribute">@<span class="token attr-name">disabled</span></span> <span class="token keyword">to</span> <span class="token string">'disabled'</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Disable Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click set @disabled to 'disabled'">Disable Me</button>
  </figure>
  <p>
    <code>set</code> is recommended for setting values into normal variables as
    well.
  </p>
  <h4 id="add-remove-toggle" tabindex="-1">
    <a class="header-anchor" href="#add-remove-toggle" aria-hidden="true">§</a>
    Add, Remove &amp; Toggle
  </h4>
  <p>
    A very common operation in front end scripting is adding or removing classes
    or attributes from DOM elements. hyperscript supports the
    <a href="/commands/add"><code>add</code></a
    >, <a href="/commands/remove"><code>remove</code></a> and
    <a href="/commands/toggle"><code>toggle</code></a> commands do help do this.
  </p>
  <p>Here are some examples adding, removing and toggling classes:</p>
  <figure class="box">
    <figcaption class="allcaps">Example: "add" command</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .red</span> <span class="token keyword">to</span> <span class="token builtin">me</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click add .red to me">Click Me</button>
  </figure>
  <figure class="box">
    <figcaption class="allcaps">Example: "remove" command</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>red<span class="token punctuation">"</span></span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">remove</span></span><span class="token class-ref selector"> .red</span> <span class="token keyword">from</span> <span class="token builtin">me</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button class="red" _="on click remove .red from me">Click Me</button>
  </figure>
  <figure class="box">
    <figcaption class="allcaps">Example: "toggle" command</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">toggle</span></span><span class="token class-ref selector"> .red</span> <span class="token keyword"><span class="token hs-start bold">on</span></span> <span class="token builtin">me</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click toggle .red on me">Click Me</button>
  </figure>
  <p>
    You can also add, remove and toggle attributes as well. Here is an example:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Toggle an attribute</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">toggle</span></span> <span class="token attribute">@<span class="token attr-name">disabled</span></span> <span class="token keyword"><span class="token hs-start bold">on</span></span> <span class="token id-ref selector">#say-hello</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Toggle Disabled State
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>say-hello<span class="token punctuation">"</span></span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click alert<span class="token punctuation">(</span><span class="token string">'hello!'</span><span class="token punctuation">)</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Say Hello
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click toggle @disabled on #say-hello">
      Toggle Disabled State
    </button>
    <button id="say-hello" _="on click alert('hello!')">Say Hello</button>
  </figure>
  <p>
    Finally, you can toggle the visibility of elements by toggling a style
    literal:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Toggle an attribute</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">toggle</span></span> <span class="token keyword">the</span> <span class="token operator">*</span>display <span class="token keyword">of</span> <span class="token keyword">the</span> next <span class="token selector">&lt;p/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Toggle The Next Paragraph
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
Hyperscript is rad!
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click toggle the *display of the next <p/>">
      Toggle The Next Paragraph
    </button>
    <p>Hyperscript is rad!</p>
  </figure>
  <h5 id="removing" tabindex="-1">
    <a class="header-anchor" href="#removing" aria-hidden="true">§</a> Removing
    Content
  </h5>
  <p>
    You can also use the
    <a href="/commands/remove"><code>remove</code> command</a> to remove content
    from the DOM:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Remove an element</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">remove</span></span> <span class="token builtin">me</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Remove Me
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click remove me">Remove Me</button>
  </figure>
  <p>
    The remove command is smart enough to figure out what you want to happen
    based on what you tell it to remove.
  </p>
  <h4 id="show-hide" tabindex="-1">
    <a class="header-anchor" href="#show-hide" aria-hidden="true">§</a> Showing
    &amp; Hiding Things
  </h4>
  <p>
    You can show and hide things with the
    <a href="/commands/show"><code>show</code></a> and
    <a href="/commands/hide"><code>hide</code></a> commands:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Show, Hide</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click
             <span class="token keyword"><span class="token hs-start bold">hide</span></span> <span class="token builtin">me</span>
             <span class="token keyword"><span class="token hs-start bold">wait</span></span> <span class="token number">2s</span>
             <span class="token keyword"><span class="token hs-start bold">show</span></span> <span class="token builtin">me</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
             Peekaboo
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click
               hide me
               wait 2s
               show me"
      >
        Peekaboo
      </button>
    </p>
  </figure>
  <p>
    By default, the <code>show</code> and <code>hide</code> commands will use
    the <code>display</code> style property. You can instead use
    <code>visibility</code> or <code>opacity</code> with the following syntax:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Show/hide strategies</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click
             <span class="token keyword"><span class="token hs-start bold">hide</span></span> <span class="token builtin">me</span> <span class="token keyword">with</span> <span class="token operator">*</span>opacity
             <span class="token keyword"><span class="token hs-start bold">wait</span></span> <span class="token number">2s</span>
             <span class="token keyword"><span class="token hs-start bold">show</span></span> <span class="token builtin">me</span> <span class="token keyword">with</span> <span class="token operator">*</span>opacity</span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
             Peekaboo
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click
               hide me with *opacity
               wait 2s
               show me with *opacity"
      >
        Peekaboo
      </button>
    </p>
  </figure>
  <p>
    You can also apply a conditional to the <code>show</code> command to
    conditionally show elements that match a given condition by using a
    <code>when</code> clause:
  </p>
  <figure class="box">
    <figcaption class="allcaps">
      Example: Filter elements with `show ... when`
    </figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> keyup <span class="token keyword"><span class="token hs-start bold">show</span></span> <span class="token selector">&lt;li/&gt;</span> <span class="token keyword">in</span> <span class="token id-ref selector">#color-list</span>
                   when <span class="token builtin">its</span> innerHTML <span class="token keyword">contains</span> <span class="token builtin">my</span> value</span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>color-list<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>Red<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>Blue<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>Blueish Green<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>Green<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">&gt;</span></span>Yellow<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p
      data-dashlane-rid="c8524b16e632175f"
      data-dashlane-classification="other"
    >
      <input
        _="on keyup show <li/> in #color-list
                     when its innerHTML contains my value"
        data-dashlane-rid="d0cf806a0df4ded3"
        data-dashlane-classification="other"
      />
    </p>
    <ul id="color-list">
      <li>Red</li>
      <li>Blue</li>
      <li>Blueish Green</li>
      <li>Green</li>
      <li>Yellow</li>
    </ul>
  </figure>
  <p>
    We mentioned this above, but as a reminder, you can toggle visibility using
    the <code>toggle</code> command:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Toggle visibility</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">toggle</span></span> <span class="token keyword">the</span> <span class="token operator">*</span>display <span class="token keyword">of</span> <span class="token keyword">the</span> next <span class="token selector">&lt;p/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Toggle The Next Paragraph
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
Hyperscript is rad!
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click toggle the *display of the next <p/>">
      Toggle The Next Paragraph
    </button>
    <p>Hyperscript is rad!</p>
  </figure>
  <h4 id="transitions" tabindex="-1">
    <a class="header-anchor" href="#transitions" aria-hidden="true">§</a>
    Transitions
  </h4>
  <p>
    You can transition a style from one state to another using the
    <a href="/commands/transition"><code>transition</code> command</a>. This
    allows you to animate transitions between different states:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: "transition" command</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">transition</span></span> <span class="token builtin">my</span> <span class="token operator">*</span>font-size <span class="token keyword">to</span> <span class="token number">30</span>px
             <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">wait</span></span> <span class="token number">2s</span>
             <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">transition</span></span> <span class="token builtin">my</span> <span class="token operator">*</span>font-size <span class="token keyword">to</span> initial</span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Transition My Font Size
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click transition my *font-size to 30px
               then wait 2s
               then transition my *font-size to initial"
      >
        Transition My Font Size
      </button>
    </p>
  </figure>
  <p>
    The above example makes use of the special <code>initial</code> symbol,
    which you can use to refer to the initial value of an elements style when
    the first transition begins.
  </p>
  <h5 id="settling" tabindex="-1">
    <a class="header-anchor" href="#settling" aria-hidden="true">§</a>
    Class-Based Transitions
  </h5>
  <p>
    The <code>transition</code> command is blocking: it will wait until the
    transition completes before the next command executes.
  </p>
  <p>
    Another common way to trigger transitions is by adding or removing classes
    or setting styles directly on an element.
  </p>
  <p>
    However, commands like <code>add</code>, <code>set</code>, etc. do
    <em>not</em> block on transitions.
  </p>
  <p>
    If you wish to wait until a transition completes after adding a new class,
    you should use the
    <a href="/commands/settle"><code>settle</code> command</a> which will let
    any transitions that are triggered by adding or removing a class finish
    before continuing.
  </p>
  <figure class="box">
    <figcaption class="allcaps">
      Example: Wait for transitions/animations to finish
    </figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>transition: all 800ms ease-in<span class="token punctuation">"</span></span>
       <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .red</span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">settle</span></span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">remove</span></span><span class="token class-ref selector"> .red</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Flash Red
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        style="transition: all 800ms ease-in"
        _="on click add .red then settle then remove .red"
      >
        Flash Red
      </button>
    </p>
  </figure>
  <p>
    If the above code did not have the <code>settle</code> command, the button
    would not flash red because the class <code>.red</code> would be added and
    then removed immediately
  </p>
  <p>
    This would not allow the 800ms transition to <code>.red</code> to complete.
  </p>
  <h3 id="measuring" tabindex="-1">
    <a class="header-anchor" href="#measuring" aria-hidden="true">§</a>
    Measuring Things
  </h3>
  <p>
    Sometimes you want to know the dimensions of an element in the DOM in order
    to perform some sort of translation or transition. Hyperscript has a
    <a href="/commands/measure"><code>measure</code> command</a> that will give
    you measurement information for an element:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Measure an Element</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">measure</span></span> <span class="token builtin">my</span> top <span class="token keyword">then</span>
                  <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">My top is </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>top<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me To Measure My Top
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click measure my top then
                    put `My top is ${top}` into the next <output/>"
      >
        Click Me To Measure My Top
      </button>
      <output>--</output>
    </p>
  </figure>
  <p>
    You can also use the pseudo-style literal form
    <code>*computed-&lt;style property&gt;</code> to get the computed (actual)
    style property value for an element:
  </p>
  <figure class="box">
    <figcaption class="allcaps">
      Example: Get A Styles Computed Value
    </figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">get</span></span> <span class="token builtin">my</span> <span class="token operator">*</span>computed-width
                  <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">My width is </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token keyword">the</span> <span class="token builtin">result</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click Me To Get My Computed Width
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click get my *computed-width
                    put `My width is ${the result}` into the next <output/>"
      >
        Click Me To Get My Computed Width
      </button>
      <output>--</output>
    </p>
  </figure>
  <h2 id="remote-content" tabindex="-1">
    <a class="header-anchor" href="#remote-content" aria-hidden="true">§</a>
    Remote Content
  </h2>
  <p>
    Hyperscript is primarily designed for front end scripting, local things like
    toggling a class on a div and so on, and is designed to pair well with
    <a href="https://htmx.org">htmx</a>, which uses a hypermedia approach for
    interacting with servers.
  </p>
  <p>
    Broadly, we recommend that approach: you stay firmly within the original
    REST-ful model of the web, keeping things simple and consistent, and you can
    use hyperscript for small bits of front end functionality. htmx and
    hyperscript integrate seamlessly, so any hyperscript you return to htmx will
    be automatically initialized without any additional work on your part.
  </p>
  <h3 id="fetch" tabindex="-1">
    <a class="header-anchor" href="#fetch" aria-hidden="true">§</a> Fetch
  </h3>
  <p>
    However, there are times when calling out to a remote server is useful from
    a scripting context, and hyperscript supports the
    <a href="/commands/fetch"><code>fetch</code> command</a> for doing so:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Issue a Fetch Request</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">fetch</span></span> <span class="token url">/clickedMessage</span> <span class="token keyword">then</span>
                  <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token keyword">the</span> <span class="token builtin">result</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Fetch It
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click fetch /clickedMessage then
                    put the result into the next <output/>"
      >
        Fetch It
      </button>
      <output>--</output>
    </p>
  </figure>
  <p>
    The fetch command uses the
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"
      >fetch API</a
    >
    and allows you configure the fetch as you want, including passing along
    headers, a body, and so forth.
  </p>
  <p>
    Additionally, you may notice that the <code>fetch</code> command, in
    contrast with the <code>fetch()</code> function, does not require that you
    deal with a Promise. Instead, the hyperscript runtime deals with the promise
    for you: you can simply use the <code>result</code> of the fetch as if the
    fetch command was blocking.
  </p>
  <p>
    This is thanks to the <a href="#async">async transparency</a> of
    hyperscript, discussed below.
  </p>
  <h3 id="go" tabindex="-1">
    <a class="header-anchor" href="#go" aria-hidden="true">§</a> Going Places
  </h3>
  <p>
    While using ajax is exciting, sometimes you simply wish to navigate the
    browser to a new location. To support this hyperscript has a
    <a href="/commands/go"><code>go</code> command</a> that allows you to
    navigate locally or to new URLs, depending on how it is used:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Going Around The Document</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click
            <span class="token keyword"><span class="token hs-start bold">go</span></span> <span class="token keyword">to</span> <span class="token keyword">the</span> top <span class="token keyword">of</span> <span class="token keyword">the</span> <span class="token builtin">body</span> smoothly
            <span class="token keyword"><span class="token hs-start bold">wait</span></span> <span class="token number">2s</span>
            <span class="token keyword"><span class="token hs-start bold">go</span></span> <span class="token keyword">to</span> <span class="token keyword">the</span> bottom <span class="token keyword">of</span> <span class="token builtin">me</span> smoothly</span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
            Take A Trip
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click
              go to the top of the body smoothly
              wait 2s
              go to the bottom of me smoothly"
      >
        Take A Trip
      </button>
    </p>
  </figure>
  <p>You can also use it to navigate to another web page entirely:</p>
  <figure class="box">
    <figcaption class="allcaps">Example: Going Elsewhere</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">go</span></span> <span class="token keyword">to</span> url https<span class="token punctuation">:</span><span class="token operator">/</span><span class="token operator">/</span>htmx<span class="token operator">.</span>org</span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
            Go Check Out htmx
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <button _="on click go to url https://htmx.org">Go Check Out htmx</button>
  </figure>
  <h2 id="async" tabindex="-1">
    <a class="header-anchor" href="#async" aria-hidden="true">§</a> Async
    Transparency
  </h2>
  <p>
    One of the most distinctive features of hyperscript is that it is "async
    transparent". What that means is that, for the most part, you, the script
    writer, do not need to worry about asynchronous behavior. In the
    <a href="#fetch"><code>fetch</code></a> section, for example, we did not
    need to use a <code>.then()</code> callback or an
    <code>await</code> keyword, as you would need to in JavaScript: we simply
    fetched the data and then inserted it into the DOM.
  </p>
  <p>
    To make this happen, the hyperscript runtime handles
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"
      >Promises</a
    >
    under the covers for you, resolving them internally, so that asynchronous
    behavior simply looks linear.
  </p>
  <p>
    This dramatically simplifies many coding patterns and effectively
    <a
      href="http://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/"
      >decolors functions</a
    >
    (and event handlers) in hyperscript.
  </p>
  <p>
    Furthermore, this infrastructure allows hyperscript to work extremely
    effectively with events, allowing for <em>event driven</em> control flow,
    explained below.
  </p>
  <h3 id="wait" tabindex="-1">
    <a class="header-anchor" href="#wait" aria-hidden="true">§</a> Waiting
  </h3>
  <p>
    In JavaScript, if you want to wait some amount of time, you can use the
    venerable <code>setTimeout()</code> function:
  </p>
  <pre
    class=" language-javascript"
    tabindex="0"
  ><code class=" language-javascript">console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Start..."</span><span class="token punctuation">)</span>
<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"Finish..."</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre>
  <p>
    This code will print <code>"Start"</code> to the console and then, after a
    second (1000 milliseconds) it will print <code>"Finish"</code>.
  </p>
  <p>
    To accomplish this in JavaScript requires a closure, which acts as a
    callback. Unfortunately this API is awkward, containing a lot of syntactic
    noise and placing crucial information, how long the delay is, at the end. As
    this logic becomes more complex, that delay information gets further and
    further away from where, syntactically, the delay starts.
  </p>
  <p>
    Contrast that with the equivalent hyperscript, which uses the
    <a href="/commands/wait"><code>wait</code> command</a>:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"Start..."</span>
<span class="token keyword"><span class="token hs-start bold">wait</span></span> <span class="token number">1s</span>
<span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"Finish..."</span>
</code></pre>
  <p>
    You can see how this reads very nicely, with a linear set of operations
    occurring in sequence.
  </p>
  <p>
    Under the covers, the hyperscript runtime is still using that
    <code>setTimeout()</code> API, but you, the script writer, are shielded from
    that complexity, and you can simply write linear, natural code.
  </p>
  <p>
    This flexible runtime allows for even more interesting code. The
    <code>wait</code> command, for example, can wait for an <em>event</em> not
    just a timeout:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Waiting On Events</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'Started...'</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span>
                    <span class="token keyword"><span class="token hs-start bold">wait for</span></span> a <span class="token keyword"><span class="token hs-start bold">continue</span></span>   <span class="token comment">-- wait for a continue event...</span>
                    <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'Finished...'</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span>
                    <span class="token keyword"><span class="token hs-start bold">wait</span></span> <span class="token number">2s</span>
                    <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">''</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Start
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">send</span></span> <span class="token keyword"><span class="token hs-start bold">continue</span></span> <span class="token keyword">to</span> <span class="token keyword">the</span> previous <span class="token selector">&lt;button/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Continue
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click put 'Started...' into the next <output/>
                      wait for a continue   -- wait for a continue event...
                      put 'Finished...' into the next <output/>
                      wait 2s
                      put '' into the next <output/>"
      >
        Start
      </button>
      <button _="on click send continue to the previous <button/>">
        Continue
      </button>
      <output>--</output>
    </p>
  </figure>
  <p>
    Now we are starting to see how powerful the async transparent runtime of
    hyperscript can be: with it you are able to integrate events directly into
    your control flow while still writing scripts in a natural, linear fashion.
  </p>
  <p>Let's add a timeout to that previous example:</p>
  <figure class="box">
    <figcaption class="allcaps">
      Example: Waiting On Events With A Timeout
    </figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'Started...'</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span>
                  <span class="token keyword"><span class="token hs-start bold">wait for</span></span> a <span class="token keyword"><span class="token hs-start bold">continue</span></span> <span class="token keyword">or</span> <span class="token number">3s</span>   <span class="token comment">-- wait for a continue event...</span>
                  <span class="token keyword"><span class="token hs-start bold">if</span></span> <span class="token keyword">the</span> <span class="token builtin">result</span><span class="token operator">'s</span> type <span class="token keyword">is</span> <span class="token string">'continue'</span>
                    <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'Finished...'</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span>
                  otherwise
                    <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'Timed Out...'</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span>
                  <span class="token keyword"><span class="token hs-start bold">end</span></span>
                  <span class="token keyword"><span class="token hs-start bold">wait</span></span> <span class="token number">2s</span>
                  <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'--'</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Start
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">send</span></span> <span class="token keyword"><span class="token hs-start bold">continue</span></span> <span class="token keyword">to</span> <span class="token keyword">the</span> previous <span class="token selector">&lt;button/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Continue
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="on click put 'Started...' into the next <output/>
                    wait for a continue or 3s   -- wait for a continue event...
                    if the result's type is 'continue'
                      put 'Finished...' into the next <output/>
                    otherwise
                      put 'Timed Out...' into the next <output/>
                    end
                    wait 2s
                    put '--' into the next <output/>"
      >
        Start
      </button>
      <button _="on click send continue to the previous <button/>">
        Continue
      </button>
      <output>--</output>
    </p>
  </figure>
  <p>
    If you click the Continue button within 3 seconds, the
    <code>wait</code> command resume, setting the <code>result</code> to the
    event, so <code>the result's type</code> will be <code>"continue"</code>.
  </p>
  <p>
    If, on the other hand, you don't click the Continue button within 3 seconds,
    the <code>wait</code> command resume based on the timeout, setting the
    <code>result</code> to <code>null</code>, so
    <code>the result's type</code> will be null.
  </p>
  <h3 id="toggling" tabindex="-1">
    <a class="header-anchor" href="#toggling" aria-hidden="true">§</a> Toggling
  </h3>
  <p>
    Previously we looked at the <code>toggle</code> command. It turns out that
    it, too, can work with events:
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Toggle A Class With Events</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> mouseenter <span class="token keyword"><span class="token hs-start bold">toggle</span></span><span class="token class-ref selector"> .red</span> <span class="token keyword">until</span> mouseleave</span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Mouse Over Me To Turn Me Red!
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <div _="on mouseenter toggle .red until mouseleave">
      Mouse Over Me To Turn Me Red!
    </div>
  </figure>
  <p>
    You can, of course, toggle the class on other elements, or toggle an
    attribute, or use different events: the possibilities are endless.
  </p>
  <h3 id="async_loops" tabindex="-1">
    <a class="header-anchor" href="#async_loops" aria-hidden="true">§</a> Loops
  </h3>
  <p>
    You can add async behavior to a loop by adding a <code>wait</code> command
    in the body, but loops can also have a <em>loop condition</em> based on
    receiving an event.
  </p>
  <p>Consider this hyperscript:</p>
  <figure class="box">
    <figcaption class="allcaps">Example: An Event-Driven Loop</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>pulsar<span class="token punctuation">"</span></span>
      <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">repeat until event</span></span> stop
                  <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .pulse</span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">settle</span></span>
                  <span class="token keyword"><span class="token hs-start bold">remove</span></span><span class="token class-ref selector"> .pulse</span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">settle</span></span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Click me to Pulse...
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">send</span></span> stop <span class="token keyword">to</span> <span class="token keyword">the</span> previous <span class="token selector">&lt;button/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
Cancel
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        class="pulsar"
        _="on click repeat until event stop
                    add .pulse then settle
                    remove .pulse then settle"
      >
        Click me to Pulse...
      </button>
      <button _="on click send stop to the previous <button/>">Cancel</button>
    </p>
  </figure>
  <style>
    button.pulsar {
      transition: all 1s ease-in;
    }
    .pulsar.pulse {
      background-color: indianred;
    }
  </style>
  <p>
    The loop will check if the given event, <code>stop</code>, has been received
    at the start of every iteration. If not, the loop will continue. This allows
    the cancel button to send an event to stop the loop.
  </p>
  <p>
    However, note that the CSS transition is allowed to finish smoothly, rather
    than abruptly, because the event listener that terminates the loop is only
    consulted once a complete loop is made, adding and removing the class and
    settling cleanly.
  </p>
  <h3 id="async-keyword" tabindex="-1">
    <a class="header-anchor" href="#async-keyword" aria-hidden="true">§</a> The
    <code>async</code> keyword
  </h3>
  <p>
    Sometimes you do want something to occur asynchronously. Hyperscript
    provides an <code>async</code> keyword that will tell the runtime
    <em>not</em> to synchronize on a value.
  </p>
  <p>
    So, if you wanted to invoke a method that returns a promise, say
    <code>returnsAPromise()</code> but not wait on it to return, you write code
    like this:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">call</span></span> <span class="token keyword"><span class="token hs-start bold">async</span></span> returnsAPromise<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'I called it...'</span> <span class="token keyword">into</span> <span class="token keyword">the</span> next <span class="token selector">&lt;output/&gt;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Get The Answer...
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    Hyperscript will immediately put the value "I called it..." into the next
    output element, even if the result from <code>returnsAPromise()</code> has
    not yet resolved.
  </p>
  <h2 id="js-migration" tabindex="-1">
    <a class="header-anchor" href="#js-migration" aria-hidden="true">§</a> Using
    JavaScript
  </h2>
  <p>
    Hyperscript is directly integrated with JavaScript, providing ways to use
    them side by side and migrate with ease.
  </p>
  <h3 id="js-comments" tabindex="-1">
    <a class="header-anchor" href="#js-comments" aria-hidden="true">§</a> Shared
    Comment Syntax
  </h3>
  <p>
    <code>//</code> and <code>/* ... */</code> comments are supported, and ideal
    for migrating lines of code from JavaScript to Hyperscript "in-place". The
    multi-line comment may be used to "block out" code and write documentation
    comments.
  </p>
  <h3 id="js-call" tabindex="-1">
    <a class="header-anchor" href="#js-call" aria-hidden="true">§</a> Calling
    JavaScript
  </h3>
  <p>
    Any JavaScript function may be called directly from Hyperscript. See:
    <a href="#calling-functions">calling functions</a>.
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">call</span></span> alert<span class="token punctuation">(</span><span class="token string">'Hello from JavaScript!'</span><span class="token punctuation">)</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Click me.
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <h3 id="js-inline" tabindex="-1">
    <a class="header-anchor" href="#js-inline" aria-hidden="true">§</a> Inline
    JavaScript
  </h3>
  <p>
    Inline JavaScript may be defined using the
    <a href="/features/js"><code>js</code> keyword</a>.
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">init</span></span> <span class="token keyword"><span class="token hs-start bold">js</span></span> alert<span class="token punctuation">(</span><span class="token string">'Hello from JavaScript!'</span><span class="token punctuation">)</span> <span class="token keyword"><span class="token hs-start bold">end</span></span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>Return values are supported.</p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">js</span></span> <span class="token keyword"><span class="token hs-start bold">return</span></span> <span class="token string">'Success!'</span> <span class="token keyword"><span class="token hs-start bold">end</span></span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token builtin">it</span> <span class="token keyword">into</span> <span class="token builtin">my</span><span class="token operator">.</span>innerHTML</span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
 Click me.
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>Parameters are supported.</p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">set</span></span> foo <span class="token keyword">to</span> <span class="token number">1</span> <span class="token keyword"><span class="token hs-start bold">js</span></span><span class="token punctuation">(</span>foo<span class="token punctuation">)</span> alert<span class="token punctuation">(</span><span class="token string">'Adding 1 to foo: '</span><span class="token operator">+</span><span class="token punctuation">(</span>foo<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword"><span class="token hs-start bold">end</span></span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
 Click me.
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    JavaScript at the top-level may be defined using the same
    <a href="/commands/js"><code>js</code> command</a>, exposing it to the
    global scope.
  </p>
  <p>
    You may use inline JavaScript for performance reasons, since the Hyperscript
    runtime is more focused on flexibility, rather than performance.
  </p>
  <p>
    This feature is useful in <a href="#workers">workers</a>, when you want to
    pass JavaScript across to the worker's implementation:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/hyperscript<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-hyperscript">
  <span class="token keyword"><span class="token hs-start bold">worker</span></span> CoinMiner
    <span class="token keyword"><span class="token hs-start bold">js</span></span>
      function mineNext<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token operator">/</span><span class="token operator">/</span> a JavaScript implementation<span class="token operator">.</span><span class="token operator">..</span>
      <span class="token punctuation">}</span>
    <span class="token keyword"><span class="token hs-start bold">end</span></span>
    <span class="token keyword"><span class="token hs-start bold">def</span></span> nextCoin<span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token keyword"><span class="token hs-start bold">return</span></span> mineNext<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword"><span class="token hs-start bold">end</span></span>
  <span class="token keyword"><span class="token hs-start bold">end</span></span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <h2 id="advanced-features" tabindex="-1">
    <a class="header-anchor" href="#advanced-features" aria-hidden="true">§</a>
    Advanced Features
  </h2>
  <p>
    We have covered the basics (and not-so-basics) of hyperscript. Now we come
    to the more advanced features of the language.
  </p>
  <h3 id="behaviors" tabindex="-1">
    <a class="header-anchor" href="#behaviors" aria-hidden="true">§</a>
    Behaviors
  </h3>
  <p>
    Behaviors allow you to bundle together some hyperscript code (that would
    normally go in the _ attribute of an element) so that it can be "installed"
    on any other. They are defined with
    <a href="/features/behavior">the <code>behavior</code> keyword</a>:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">behavior</span></span> Removable
  <span class="token keyword"><span class="token hs-start bold">on</span></span> click
    <span class="token keyword"><span class="token hs-start bold">remove</span></span> <span class="token builtin">me</span>
  <span class="token keyword"><span class="token hs-start bold">end</span></span>
<span class="token keyword"><span class="token hs-start bold">end</span></span>
</code></pre>
  <p>They can accept arguments:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">behavior</span></span> Removable<span class="token punctuation">(</span>removeButton<span class="token punctuation">)</span>
  <span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword">from</span> removeButton
    <span class="token keyword"><span class="token hs-start bold">remove</span></span> <span class="token builtin">me</span>
  <span class="token keyword"><span class="token hs-start bold">end</span></span>
<span class="token keyword"><span class="token hs-start bold">end</span></span>
</code></pre>
  <p>They can be installed as shown:</p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>banner<span class="token punctuation">"</span></span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">install</span></span> Removable<span class="token punctuation">(</span>removeButton<span class="token punctuation">:</span> <span class="token id-ref selector">#close-banner</span><span class="token punctuation">)</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  ...
</code></pre>
  <p>
    For a better example of a behavior, check out
    <a href="https://gist.github.com/dz4k/6505fb82ae7fdb0a03e6f3e360931aa9"
      >Draggable._hs</a
    >.
  </p>
  <h3 id="workers" tabindex="-1">
    <a class="header-anchor" href="#workers" aria-hidden="true">§</a> Web
    Workers
  </h3>
  <p>
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers"
      >WebWorkers</a
    >
    can be defined inline in hyperscript by using the
    <a href="/features/worker"><code>worker</code> keyword</a>.
  </p>
  <p>
    The worker does not share a namespace with other code, it is in its own
    isolated sandbox. However, you may interact with the worker via function
    calls, passing data back and forth in the normal manner.
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/hyperscript<span class="token punctuation">"</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-hyperscript">
  <span class="token keyword"><span class="token hs-start bold">worker</span></span> Incrementer
    <span class="token keyword"><span class="token hs-start bold">def</span></span> <span class="token keyword"><span class="token hs-start bold">increment</span></span><span class="token punctuation">(</span>i<span class="token punctuation">)</span>
      <span class="token keyword"><span class="token hs-start bold">return</span></span> i <span class="token operator">+</span> <span class="token number">1</span>
    <span class="token keyword"><span class="token hs-start bold">end</span></span>
  <span class="token keyword"><span class="token hs-start bold">end</span></span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value hyperscript language-hyperscript"><span class="token keyword"><span class="token hs-start bold">on</span></span> click <span class="token keyword"><span class="token hs-start bold">call</span></span> Incrementer<span class="token operator">.</span><span class="token keyword"><span class="token hs-start bold">increment</span></span><span class="token punctuation">(</span><span class="token number">41</span><span class="token punctuation">)</span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token string">'The answer is: '</span> <span class="token operator">+</span> <span class="token builtin">it</span> <span class="token keyword">into</span> <span class="token builtin">my</span><span class="token operator">.</span>innerHTML</span><span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>
  Call a Worker...
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>This makes it very easy to define and work with web workers.</p>
  <p>
    Note that you can use the inline js feature discussed next if you want to
    use JavaScript in your worker. You might want to do this if you need better
    performance on calculations than hyperscript provides, for example.
  </p>
  <h3 id="sockets" tabindex="-1">
    <a class="header-anchor" href="#sockets" aria-hidden="true">§</a> Web
    Sockets
  </h3>
  <p>
    <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
      >Web Sockets</a
    >
    allow for two-way communication with a web server, and are becoming
    increasingly popular for building web applications. Hyperscript provides a
    simple way to create them, as well as a simple
    <a href="https://en.wikipedia.org/wiki/Remote_procedure_call"
      >Remote Procedure Call (RPC)</a
    >
    mechanism layered on top of them, by using the
    <a href="/features/socket"><code>socket</code> keyword</a>.
  </p>
  <p>Here is a simple web socket declaration in hyperscript:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">socket</span></span> MySocket ws<span class="token punctuation">:</span><span class="token operator">/</span><span class="token operator">/</span>myserver<span class="token operator">.</span>com<span class="token operator">/</span>example
  <span class="token keyword"><span class="token hs-start bold">on</span></span> message <span class="token keyword">as</span> json
    <span class="token keyword"><span class="token hs-start bold">log</span></span> message
<span class="token keyword"><span class="token hs-start bold">end</span></span>
</code></pre>
  <p>
    This socket will log all messages that it receives as a parsed JSON object.
  </p>
  <p>
    You can send messages to the socket by using the normal
    <a href="/commands/send"><code>send</code></a> command:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">send</span></span> myMessage<span class="token punctuation">(</span>foo<span class="token punctuation">:</span> <span class="token string">"bar"</span><span class="token punctuation">,</span> doh<span class="token punctuation">:</span> <span class="token number">42</span><span class="token punctuation">)</span> <span class="token keyword">to</span> MySocket
</code></pre>
  <p>
    You can read more about the RPC mechanism on the
    <a href="/features/socket#rpc"><code>socket</code> page</a>.
  </p>
  <h3 id="event-source" tabindex="-1">
    <a class="header-anchor" href="#event-source" aria-hidden="true">§</a> Event
    Source
  </h3>
  <p>
    <a href="https://en.wikipedia.org/wiki/Server-sent_events"
      >Server Sent Events</a
    >
    are a simple way for your web server to push information directly to your
    clients that is
    <a href="https://caniuse.com/eventsource"
      >supported by all modern browsers</a
    >.
  </p>
  <p>
    They provide real-time, uni-directional communication from your server to a
    browser. Server Sent Events cannot send information back to your server. If
    you need two-way communication, consider using
    <a href="/features/socket/">sockets</a> instead.
  </p>
  <p>
    You can declare an SSE connection by using the
    <a href="/features/event-source"><code>eventsource</code> keyword</a> and
    can dynamically change the connected URL at any time without having to
    reconnect event listeners.
  </p>
  <p>Here is an example event source in hyperscript:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">eventsource</span></span> ChatUpdates <span class="token keyword">from</span> http<span class="token punctuation">:</span><span class="token operator">/</span><span class="token operator">/</span>myserver<span class="token operator">.</span>com<span class="token operator">/</span>chat-updates

  <span class="token keyword"><span class="token hs-start bold">on</span></span> message <span class="token keyword">as</span> string
    <span class="token keyword"><span class="token hs-start bold">put</span></span> <span class="token builtin">it</span> <span class="token keyword">into</span> <span class="token id-ref selector">#div</span>
  <span class="token keyword"><span class="token hs-start bold">end</span></span>

  <span class="token keyword"><span class="token hs-start bold">on</span></span> open
    <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token string">"connection opened."</span>
  <span class="token keyword"><span class="token hs-start bold">end</span></span>

<span class="token keyword"><span class="token hs-start bold">end</span></span>
</code></pre>
  <p>
    This event source will put all <code>message</code> events in to the
    <code>#div</code> and will log when an <code>open</code> event occurs. This
    feature also publishes events, too, so you can listen for Server Sent Events
    from other parts of your code.
  </p>
  <h2 id="debugging" tabindex="-1">
    <a class="header-anchor" href="#debugging" aria-hidden="true">§</a>
    Debugging
  </h2>
  <p>
    Debugging hyperscript can be done a few different ways. The simplest and
    most familiar way for most developers to debug hyperscript is the use of the
    <a href="/commands/log"><code>log</code></a> command to log intermediate
    results. This is the venerable "print debugging":
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript"><span class="token keyword"><span class="token hs-start bold">get</span></span> <span class="token selector">&lt;div.highlighted/&gt;</span> <span class="token keyword">then</span> <span class="token keyword"><span class="token hs-start bold">log</span></span> <span class="token keyword">the</span> <span class="token builtin">result</span>
</code></pre>
  <p>
    This is a reasonable way to start debugging but it is, obviously, fairly
    primitive.
  </p>
  <h3 id="beeping" tabindex="-1">
    <a class="header-anchor" href="#beeping" aria-hidden="true">§</a> Beeping
  </h3>
  <p>
    An annoying aspect of print debugging is that you are often required to
    extract bits of expressions in order to print them out, which can interrupt
    the flow of code. Consider this example of hyperscript:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript">  <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlighted</span> <span class="token keyword">to</span> <span class="token selector">&lt;p/&gt; in &lt;div.hilight/&gt;</span>
</code></pre>
  <p>
    If this wasn't behaving as you expect and you wanted to debug the results,
    you might break it up like so:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript">  <span class="token keyword"><span class="token hs-start bold">set</span></span> highlightDiv <span class="token keyword">to</span> <span class="token selector">&lt;div.hilight/&gt;</span>
  <span class="token keyword"><span class="token hs-start bold">log</span></span> highlightDiv
  <span class="token keyword"><span class="token hs-start bold">set</span></span> highlightParagraphs <span class="token keyword">to</span> <span class="token selector">&lt;p/&gt;</span> <span class="token keyword">in</span> highlightDiv
  <span class="token keyword"><span class="token hs-start bold">log</span></span> highlightParagraphs
  <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlighted</span> <span class="token keyword">to</span> highlightParagraphs
</code></pre>
  <p>
    This is a fairly violent code change and it obscures what the actual logic
    is.
  </p>
  <p>
    To avoid this, hyperscript offers a
    <a href="/expressions/beep"><code>beep!</code></a> operator. The
    <code>beep!</code> operator can be thought of as a pass-through expression:
    it simply passes the value of whatever expression comes afterwards through
    unmodified.
  </p>
  <p>
    However, along the way, it logs the following information to the console:
  </p>
  <ul>
    <li>The source code of the expression</li>
    <li>The value of the expression</li>
    <li>The type of the expressions</li>
  </ul>
  <p>
    So, considering the above code, rather than breaking things up, we might
    just try this:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript">  <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlighted</span> <span class="token keyword">to</span> <span class="token selector">&lt;p/&gt; in beep! &lt;div.hilight/&gt;</span>
</code></pre>
  <p>
    Here we have added a <code>beep!</code> just before the
    <code>&lt;div.hilight/&gt;</code> expression. Now when the code runs we will
    see the following in the console:
  </p>
  <pre><code>///_ BEEP! The expression (&lt;div.hilight/&gt;) evaluates to: [div.hilight] of type ElementCollection
</code></pre>
  <p>
    You can see the expressions source, its value (which you can right click on
    and assign to a temporary value to work with in most browsers) as well as
    the type of the value. All of this had no effect on the evaluation of the
    expression or statement.
  </p>
  <p>
    Let's store the <code>ElementCollection</code> as a temporary value,
    <code>temp1</code>.
  </p>
  <p>
    We could now move the <code>beep!</code> out to the
    <code>in</code> expression like so:
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript">  <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlighted</span> <span class="token keyword">to</span> beep<span class="token operator">!</span> <span class="token selector">&lt;p/&gt; in &lt;div.hilight/&gt;</span>
</code></pre>
  <p>And we might see results like this:</p>
  <pre><code>///_ BEEP! The expression (&lt;p/&gt; in &lt;div.hilight/&gt;) evaluates to: [] of type Array
</code></pre>
  <p>
    Seeing this, we realize that no paragraphs elements are being returned by
    the <code>in</code> expression, which is why the class is not being added to
    them.
  </p>
  <p>
    In the console we check the length of the original
    <code>ElementCollection</code>:
  </p>
  <pre><code>&gt; temp1.length
0
</code></pre>
  <p>
    And, sure enough, the length is zero. On inspecting the divs in question, it
    turns out we had misspelled the class name <code>hilight</code> rather than
    <code>highlight</code>.
  </p>
  <p>
    After making the fix, we can remove the <code>beep!</code> (which is
    <em>obviously</em> not supposed to be there!):
  </p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript">  <span class="token keyword"><span class="token hs-start bold">add</span></span><span class="token class-ref selector"> .highlighted</span> <span class="token keyword">to</span> <span class="token selector">&lt;p/&gt; in &lt;div.highlight/&gt;</span>
</code></pre>
  <p>And things work as expected.</p>
  <p>
    As you can see, <code>beep!</code> allows us to do much more sophisticated
    print debugging, while not disrupting code nearly as drastically as
    traditional print debugging would require.
  </p>
  <p>
    You can also use <code>beep!</code>
    <a href="/commands/beep">as a command</a> to assist in your debugging.
  </p>
  <h3 id="hdb---the-hyperscript-debugger" tabindex="-1">
    <a
      class="header-anchor"
      href="#hdb---the-hyperscript-debugger"
      aria-hidden="true"
      >§</a
    >
    HDB - The Hyperscript Debugger
  </h3>
  <p>
    An even more sophisticated debugging technique is to use
    <a href="/hdb">hdb</a>, the Hyperscript Debugger, which allows you to debug
    by inserting <code>breakpoint</code> commands in your hyperscript.
  </p>
  <p>
    <strong
      >Note: The hyperscript debugger is in alpha and, like the rest of the
      language, is undergoing active development</strong
    >
  </p>
  <p>
    To use it you need to include the <code>lib/hdb.js</code> file. You can then
    add <code>breakpoint</code> commands in your hyperscript to trigger the
    debugger.
  </p>
  <figure class="box">
    <figcaption class="allcaps">Example: Debugging</figcaption>
    <pre
      class=" language-html"
      tabindex="0"
    ><code class=" language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token special-attr"><span class="token attr-name">_</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>
on click
tell next &lt;output/&gt;
  breakpoint
  put <span class="token punctuation">'</span>You can click &lt;kbd&gt;&lt;samp&gt;Step Over&lt;/samp&gt;&lt;/kbd&gt; to execute the command<span class="token punctuation">'</span> into you
  put <span class="token punctuation">'</span>Click the &lt;kbd&gt;&lt;samp&gt;&amp;rdca;&lt;/kbd&gt;&lt;/samp&gt; button to skip to a command<span class="token punctuation">'</span>   into you
  put <span class="token punctuation">'</span>Click &lt;kbd&gt;&lt;samp&gt;Continue&lt;/samp&gt;&lt;/kbd&gt; when you’re done<span class="token punctuation">'</span>                into you
  put <span class="token punctuation">'</span>--<span class="token punctuation">'</span>                                                                     into you
<span class="token punctuation">"</span></span></span><span class="token punctuation">&gt;</span></span>Debug<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>output</span><span class="token punctuation">&gt;</span></span>--<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>output</span><span class="token punctuation">&gt;</span></span>
</code></pre>
    <p>
      <button
        _="
  on click
  tell next <output/>
    breakpoint
    put 'You can click <kbd><samp>Step Over</samp></kbd> to execute the command' into you
    put 'Click the <kbd><samp>⤷</kbd></samp> button to skip to a command'   into you
    put 'Click <kbd><samp>Continue</samp></kbd> when you’re done'                into you
    put '--'                                                                     into you
"
      >
        Debug
      </button>
      <output>--</output>
    </p>
  </figure>
  <h2 id="extending" tabindex="-1">
    <a class="header-anchor" href="#extending" aria-hidden="true">§</a>
    Extending
  </h2>
  <p>
    Hyperscript has a pluggable grammar that allows you to define new features,
    commands and certain types of expressions.
  </p>
  <p>
    Here is an example that adds a new command, <code>foo</code>, that logs `"A
    Wild Foo Was Found!" if the value of its expression was "foo":
  </p>
  <pre
    class=" language-javascript"
    tabindex="0"
  ><code class=" language-javascript"><span class="token comment">// register for the command keyword "foo"</span>
_hyperscript<span class="token punctuation">.</span><span class="token function">addCommand</span><span class="token punctuation">(</span><span class="token string">'foo'</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">parser<span class="token punctuation">,</span> runtime<span class="token punctuation">,</span> tokens</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

  <span class="token comment">// A foo command  must start with "foo".</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">!</span>tokens<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span><span class="token string">'foo'</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span>

  <span class="token comment">// Parse an expression.</span>
  <span class="token keyword">const</span> expr <span class="token operator">=</span> parser<span class="token punctuation">.</span><span class="token function">requireElement</span><span class="token punctuation">(</span><span class="token string">'expression'</span><span class="token punctuation">,</span> tokens<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token comment">// All expressions needed by the command to execute.</span>
    <span class="token comment">// These will be evaluated and the result will be passed back to us.</span>
    args<span class="token operator">:</span> <span class="token punctuation">[</span>expr<span class="token punctuation">]</span><span class="token punctuation">,</span>

    <span class="token comment">// Implement the logic of the command.</span>
    <span class="token comment">// Can be synchronous or asynchronous.</span>
    <span class="token comment">// @param {Context} context The runtime context, contains local variables.</span>
    <span class="token comment">// @param {*} value The result of evaluating expr.</span>
    <span class="token keyword">async</span> <span class="token function">op</span><span class="token punctuation">(</span><span class="token parameter">context<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token operator">==</span> <span class="token string">"foo"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"A Wild Foo Was Found!"</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// Return the next command to execute.</span>
      <span class="token keyword">return</span> runtime<span class="token punctuation">.</span><span class="token function">findNext</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre>
  <p>With this command defined you can now write the following hyperscript:</p>
  <pre
    class=" language-hyperscript"
    tabindex="0"
  ><code class=" language-hyperscript">  <span class="token keyword"><span class="token hs-start bold">def</span></span> testFoo<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword"><span class="token hs-start bold">set</span></span> str <span class="token keyword">to</span> <span class="token string">"foo"</span>
    foo str
  <span class="token keyword"><span class="token hs-start bold">end</span></span>
</code></pre>
  <p>And "A Wild Foo Was Found!" would be printed to the console.</p>
  <h2 id="security" tabindex="-1">
    <a class="header-anchor" href="#security" aria-hidden="true">§</a> Security
  </h2>
  <p>
    Hyperscript allows you to define logic directly in your DOM. This has a
    number of advantages, the largest being
    <a href="https://htmx.org/essays/locality-of-behaviour/"
      >Locality of Behavior</a
    >
    making your system more coherent.
  </p>
  <p>
    One concern with this approach, however, is security. This is especially the
    case if you are injecting user-created content into your site without any
    sort of HTML escaping discipline.
  </p>
  <p>
    You should, of course, escape all 3rd party untrusted content that is
    injected into your site to prevent, among other issues,
    <a href="https://en.wikipedia.org/wiki/Cross-site_scripting">XSS attacks</a
    >. The <code>_</code>, <code>script</code> and
    <code>data-script</code> attributes, as well as inline
    <code>&lt;script&gt;</code> tags should all be filtered.
  </p>
  <p>
    Note that it is important to understand that hyperscript is
    <em>interpreted</em> and, thus, does not use eval (except for the inline js
    features). You (or your security team) may use a
    <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP">CSP</a> that
    disallows inline scripting. This will have <em>no effect</em> on hyperscript
    functionality, and is almost certainly not what you (or your security team)
    intends.
  </p>
  <p>
    To address this, if you don't want a particular part of the DOM to allow for
    hyperscript interpretation, you may place a
    <code>disable-scripting</code> or
    <code>data-disable-scripting</code> attribute on the enclosing element of
    that area.
  </p>
  <p>
    This will prevent hyperscript from executing within that area in the DOM:
  </p>
  <pre
    class=" language-html"
    tabindex="0"
  ><code class=" language-html">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">data-disable-scripting</span><span class="token punctuation">&gt;</span></span>
    &lt;%= user_content %&gt;
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
</code></pre>
  <p>
    This approach allows you enjoy the benefits of
    <a href="https://htmx.org/essays/locality-of-behaviour/"
      >Locality of Behavior</a
    >
    while still providing additional safety if your HTML-escaping discipline
    fails.
  </p>
  <h2 id="history" tabindex="-1">
    <a class="header-anchor" href="#history" aria-hidden="true">§</a> Language
    History
  </h2>
  <p>
    The initial motivation for hyperscript came when I ported
    <a href="https://intercoolerjs.org">intercooler.js</a> to htmx. Intercooler
    had a feature,
    <a href="https://intercoolerjs.org/attributes/ic-action.html"
      ><code>ic-action</code></a
    >
    that allowed for some simple client-side interactions. One of my goals with
    htmx was to remove non-core functionality from intercooler, and really focus
    it in on the hypermedia-exchange concept, so <code>ic-action</code> didn't
    make the cut.
  </p>
  <p>
    However, I couldn't shake the feeling that there was something there: an
    embedded, scripty way of doing light front end coding. It even had some
    proto-async transparent features. But, with my focus on htmx, I had to set
    it aside.
  </p>
  <p>
    As I developed htmx, I included an extensive
    <a href="https://htmx.org/reference/#events">event model</a>. Over time, I
    realized that I wanted to have a clean way to utilize these events naturally
    and directly within HTML. HTML supports <code>on*</code> attributes for
    handling standard DOM events (e.g. <code>onClick</code>) of course, but they
    don't work for custom events like <code>htmx:load</code>.
  </p>
  <p>
    The more I looked at it, the more I thought that there was a need for a
    small, domain specific language that was event oriented and made DOM
    scripting efficient and fun. I had programmed in
    <a href="https://en.wikipedia.org/wiki/HyperTalk">HyperTalk</a>, the
    scripting language for
    <a href="https://en.wikipedia.org/wiki/HyperCard">HyperCard</a>, when I was
    younger and remembered that it integrated events very well into the
    language. So I dug up some old documentation on it and began work on
    hyperscript, a HyperTalk-derived scripting language for the web.
  </p>
  <p>
    And here we are. I hope you find the language useful, or, at least, funny.
    :)
  </p>
</div>
```
