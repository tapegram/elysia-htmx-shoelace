import { JWTOption } from '@elysiajs/jwt';
import { HtmxContext } from '@gtramontina.com/elysia-htmx';
import 'elysia';

// Extend the Elysia Context type
declare module 'elysia' {
  interface Context {
    hx: HtmxContext;
  }
}
