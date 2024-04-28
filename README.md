This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To use the callback of user creation, you need to expose your local server to the internet. You can do this using [ngrok](https://ngrok.com/). After installing ngrok, run the following command:

```bash
ngrok http --domain=jackal-cunning-evenly.ngrok-free.app 3000
```

This will expose your local server running on port 3000 to the internet through the specified domain.