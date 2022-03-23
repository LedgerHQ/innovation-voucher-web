# Voucher Web

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

```
npm install
cp .env.example .env.local
```

Edit .env.local file

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to EIP-712 sign a voucher redeem operation

## Git hooks

We use [lefthook](https://github.com/evilmartians/lefthook) to manage our git hooks. For the moment, the following hooks are configured:
- Run `npm run lint` before pushing to remote
- Run `npm run prettier` before pushing to remote
- Run `npm run ts:check` before pushing to remote

### How to install

You only need to do this step once. Run `npx @arkweid/lefthook install` in the root of the repository to install the git hooks described in the `lefthook.yml` file.

## How to run manually

You can manually run the installed git hooks by running `npx @arkweid/lefthook run pre-push` or by running the alias defined in the `package.json` file (`npm run lefthook`).
