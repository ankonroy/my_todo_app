# TodoApp (Backend)

Live demo: https://my-todo-app-whr8.onrender.com/

A small Todo application backend built with NestJS, Mongoose (MongoDB), EJS server-rendered views and session-based authentication. This repository contains the API and server-rendered frontend pages (login, register, todos, profile).

**Features**

- **User registration & login** (session-based, stored in MongoDB)
- **Create / Read / Update / Delete todos** (per-user)
- **Server-rendered EJS views** for quick UI (index, login, register, todos, profile)
- **Session persistence with MongoDB** via `connect-mongo`
- **Deploy-ready** (Dockerfile + `render.yaml` included)

**Tech stack**

- NestJS (TypeScript)
- MongoDB / Mongoose
- EJS (Views)
- express-session + connect-mongo (session store)
- Passport (used for auth helpers)

**Live site**

The app is hosted at: https://my-todo-app-whr8.onrender.com/

**Quick Start (Local)**

Prerequisites:

- Node.js >= 18
- npm >= 9
- MongoDB (local or remote Atlas)

1. Clone the repo and install deps:

```bash
npm ci
```

2. Create a `.env` (or export env vars) — common vars used by the app:

```
MONGODB_URI=mongodb://localhost:27017/todoapp
SESSION_SECRET=replace-with-a-secure-secret
DB_NAME=todoapp
PORT=3000
NODE_ENV=development
```

3. Run in development (watch mode):

```bash
npm run start:dev
```

4. Build and run production:

```bash
npm run build
npm run start:prod
```

Or use the provided Dockerfile to build a container:

```bash
# build
docker build -t todoapp-backend .

# run (example, using local Mongo)
docker run -e MONGODB_URI="mongodb://host.docker.internal:27017/todoapp" -e SESSION_SECRET="your-secret" -p 3000:3000 todoapp-backend
```

**Render Deploy**

This repo includes `render.yaml` to deploy on Render. The service expects `NODE_ENV=production` and `MONGODB_URI` to be set in Render's environment variables. The `startCommand` in the file uses `npm run start:prod`.

**Environment variables**

- `MONGODB_URI` — Connection string for MongoDB (required in production).
- `DB_NAME` — (optional) DB name used for session store, defaults to `todoapp`.
- `SESSION_SECRET` — Secret for session cookies; change in production.
- `PORT` — Port to run on (defaults to 3000).
- `NODE_ENV` — `development` or `production` (affects cookie behavior and trust proxy).

Security notes:

- In production the session cookie is configured with `secure: true` and `sameSite: 'none'` (to support cross-origin frontends). Set `SESSION_SECRET` to a strong secret and keep it out of source control.

**API & Routes (summary)**

- Public pages (server-rendered):
  - `GET /` — Home page (views/index.ejs)
  - `GET /login` — Login page (views/login.ejs)
  - `GET /register` — Registration page (views/register.ejs)

- Auth actions:
  - `POST /login` — Log in (expects `{ email, password }`)
  - `POST /register` — Register new user (expects `{ email, password }`)
  - `GET /logout` — Log out (destroys session)

- Protected pages (require session):
  - `GET /todos` — Todos page (views/todos.ejs)
  - `GET /user` — Profile page (views/user.ejs)

- JSON API (protected via session guard):
  - `GET /api/todos` — Get user's todos
  - `POST /api/todos` — Create a todo (body: `{ title, description }`)
  - `PUT /api/todos/:id` — Update a todo
  - `DELETE /api/todos/:id` — Delete a todo

**Sessions**

Sessions are stored in MongoDB using `connect-mongo`. Cookie name is set to `sessionId`. In `src/session.config.ts` the store pulls the native MongoDB client from Mongoose and configures TTL, `sameSite`, `secure`, and `httpOnly` flags.

**Project structure (high level)**

- `src/` - backend source
  - `auth/` - auth controller/service/dto
  - `todos/` - todos controller/service/dto
  - `users/` - user profiles
  - `schemas/` - Mongoose schemas (User, Todo)
  - `views/` - EJS templates (index, login, register, todos, user)
- `Dockerfile` - multi-stage Docker build
- `render.yaml` - Render.com deployment definition

**Scripts** (see `package.json`)

- `npm run start:dev` — Start in dev/watch mode
- `npm run build` — Build TypeScript to `dist`
- `npm run start:prod` — Run compiled `dist/main`
- `npm run start:render` — Build then run production (convenience for Render)

**Notes & next steps**

- If you plan to add a separate frontend, consider switching session cookie settings and/or adding CORS origins to `src/main.ts`.
- Replace the default `SESSION_SECRET` and secure your MongoDB credentials using environment variables or secrets in your hosting provider.

If you'd like, I can:

- Add a `.env.example` file with recommended values
- Add a small Postman collection or curl commands for the API
- Add CI checks or a GitHub Workflow for builds

---

Happy to make any edits or include additional docs (examples, env file, or API samples). 
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
