// Previously this project used vinxi/http for server-side cookie helpers.
// TanStack Start v1.168+ replaced vinxi with its own server utilities.
//
// Use these instead of vinxi/http:
//   import { getCookie, setCookie, deleteCookie, getRequest } from '@tanstack/react-start/server';
//
// The new API does NOT require an H3Event parameter — just call directly:
//   getCookie('my-cookie')
//   setCookie('my-cookie', 'value', { httpOnly: true, secure: true, ... })
//   deleteCookie('my-cookie', { path: '/' })
