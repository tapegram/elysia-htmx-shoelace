import { CookieRequest } from '@elysiajs/cookie';
import { HtmxContext } from '@gtramontina.com/elysia-htmx';
import 'elysia';

// Extend the Elysia Context type
declare module 'elysia' {
    interface Context {
        cookie: CookieRequest; 
        hx: HtmxContext;
        auth: AuthContext;
    }
}