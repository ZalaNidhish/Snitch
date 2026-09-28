# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Running against the backend

- **Dev:** `npm run dev`. The browser calls `/api` on localhost and Vite proxies it to the backend
  (`https://snitch-beka.onrender.com` by default, override with `VITE_PROXY_TARGET`). Because it is
  same-origin, the httpOnly refresh-token cookie works and there are no CORS issues.
- **Prod build:** calls `https://snitch-beka.onrender.com/api` directly (override with `VITE_API_URL`).
  The backend's `cors()` is a wildcard and its refresh cookie has no `SameSite=None; Secure`, so the
  refresh cookie cannot travel cross-site: when the 15-minute access token expires the user is sent to
  the login page. To get silent refresh in production either serve the frontend and API from the same
  origin (proxy/rewrite `/api`), or enable credentialed CORS + `sameSite:"none", secure:true` on the
  backend and set `VITE_WITH_CREDENTIALS=true`.
- See `.env.example` for all options.
- Note: the backend only accepts sizes `XS, M, L, XL, XXL`; images max 5 files x 1 MB.
