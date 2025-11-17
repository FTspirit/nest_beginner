## Overview

This is a small NestJS starter app. Key ideas an AI coding agent should know to be productive immediately:

- Framework: NestJS (v11). TypeScript project (see `tsconfig.json` — `nodenext`, `emitDecoratorMetadata`, `experimentalDecorators`).
- Runtime scripts are in `package.json` (use `yarn`): `start`, `start:dev`, `build`, `test`, `test:e2e`, `lint`.

## Big-picture architecture

- App root: `src/app.module.ts` imports feature modules. Controllers are in `src/` and feature folders (e.g. `src/user`).
- Feature layout (example `user`):
  - `src/user/user.controller.ts` — HTTP handlers and route definitions (`@Controller('user')`).
  - `src/user/user.service.ts` — business logic.
  - `src/user/dto/` — DTOs and validation (`RegisterUserDto`, `CreateUserDto`, `UpdateUserDto`).
  - `src/user/entities/` — entity classes (domain shapes).
- Database abstraction: `src/db/db.module.ts` exposes a DynamicModule pattern with a static `register(options)` factory and a provider token `'OPTIONS'` plus `DbService`. The module exports `DbService`. Expect to wire `DbModule.register(...)` where a path/config is available.

## Important patterns & conventions (project-specific)

- Validation: `src/main.ts` registers a global ValidationPipe (`app.useGlobalPipes(new ValidationPipe())`). DTOs use `class-validator` decorators. Example: `src/user/dto/register-user.dto.ts` uses `@IsNotEmpty()` and `@MinLength()`.
  - Note: `ValidationPipe` is enabled globally but with default options (no `transform: true`), so the agent should not assume automatic class-transformer behavior unless it explicitly adds the option.
- Dynamic module DI: `DbModule` provides `'OPTIONS'` via `useValue` and exports `DbService`. Consumers either import the registered module (`DbModule.register({ path: '...' })`) or inject `DbService` if the module is already registered in the import tree.
- File locations:
  - Controllers: `src/**/*.controller.ts`
  - Services: `src/**/*.service.ts`
  - DTOs: `src/**/dto/*.ts` (use class-validator decorators placed here)
  - Entities: `src/**/entities/*.ts`

## Build / test / debug workflows

- Install dependencies: `yarn install`
- Build: `yarn build` (runs `nest build` per package.json)
- Run dev server: `yarn start:dev` (watch mode)
- Run tests: `yarn test` (unit), `yarn test:e2e` (e2e; see `test/jest-e2e.json`), `yarn test:cov` for coverage.
- Lint/format: `yarn lint` and `yarn format` (prettier).

## What to look for when making edits

- If you add validation that depends on automatic transformation (e.g., numeric route params -> numbers), enable `transform: true` on the ValidationPipe in `src/main.ts`.
- When adding a feature that needs DB configuration, prefer adding `DbModule.register({ path: '...' })` to the top-level `imports` (e.g. in `AppModule`) so `DbService` and `'OPTIONS'` become available to feature modules.
- Tests use Jest with `rootDir: 'src'`—place spec files next to source files using `*.spec.ts` to be discovered.

## Quick code examples discovered in the repo

- Global validation is enabled in `src/main.ts`:

  app.useGlobalPipes(new ValidationPipe());

- `RegisterUserDto` uses class-validator in `src/user/dto/register-user.dto.ts`:

  export class RegisterUserDto {
    @IsNotEmpty({ message: 'Account name must not be empty' })
    accountName: string;

    @IsNotEmpty({ message: 'Password must not be empty' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
  }

- `DbModule` dynamic provider (in `src/db/db.module.ts`):

  static register(options: DbModuleOptions): DynamicModule {
    return {
      module: DbModule,
      providers: [DbService, { provide: 'OPTIONS', useValue: options }],
      exports: [DbService],
    };
  }

## Integration & external dependencies

- Uses `class-validator` and `class-transformer` for DTO validation + transformation.
- Nest core packages (@nestjs/*) and testing tools (jest, supertest) are present — use existing npm scripts.

## Where to read next (anchor files)

- `package.json` — scripts and deps
- `tsconfig.json` — compiler semantics (nodenext, decorators)
- `src/main.ts` — app bootstrap and global pipes
- `src/app.module.ts` — module wiring
- `src/user/` — example feature module (controller, service, dto, entity)
- `src/db/db.module.ts` — dynamic module & DI pattern

## Short checklist for the agent before changing behavior

1. Respect existing global ValidationPipe options (do not enable `transform` silently).
2. When adding DB wiring, prefer using `DbModule.register(...)` at app root.
3. Keep tests next to implementation (`*.spec.ts`) so Jest picks them up.

---

If you'd like, I can:
- Merge this into an existing `.github/copilot-instructions.md` if present and preserve its content.
- Add small examples (e.g., how to register `DbModule` in `AppModule`) or enable `transform` on ValidationPipe and run tests.

Please tell me if you want me to iterate or include more granular examples (e.g., how to write an e2e test for `user` endpoints).
