Elastic UI
Next-auth verse useAuth

# TypeScript Next.js example

This is a really simple project that shows the usage of Next.js with TypeScript.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/vercel/next.js/tree/canary/examples/with-typescript)

## How to use it?

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-typescript with-typescript-app
# or
yarn create next-app --example with-typescript with-typescript-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/import?filter=next.js&utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Notes

This example shows how to integrate the TypeScript type system into Next.js. Since TypeScript is supported out of the box with Next.js, all we have to do is to install TypeScript.

```
npm install --save-dev typescript
```

To enable TypeScript's features, we install the type declarations for React and Node.

```
npm install --save-dev @types/react @types/react-dom @types/node
```

When we run `next dev` the next time, Next.js will start looking for any `.ts` or `.tsx` files in our project and builds it. It even automatically creates a `tsconfig.json` file for our project with the recommended settings.

Next.js has built-in TypeScript declarations, so we'll get autocompletion for Next.js' modules straight away.

A `type-check` script is also added to `package.json`, which runs TypeScript's `tsc` CLI in `noEmit` mode to run type-checking separately. You can then include this, for example, in your `test` scripts.

Authentication uses https://next-auth.js.org/

SVG Wave Generator used on index: https://codepedia.info/svg-wave-generator/

Category/Event Examples:

Top 10 Patio Trees:
New Prisma Table: Grouping? Ranking?
Category: Patio Trees
Category: Brewery
Event: Patio Trees of 2022

Tree of The Year:
Category: Tree of the Year Winner
Category: Tree of the Year Nominee
Category: 2022 Tree of the Year Nominee
Event: 2022 Tree of the Year Bike Tour

Category: Quiet Moon Trees

Event: 5K Run TreeID
Category: 2022 Hold Out Summer Solstice

Category: TreeFolksYP Happy Hours
Category: Brewery

Check-ins: At a tree if within 300ft?

Monopoly Idea:

- YP members get points if people checkin at their trees
- Sponsorship can be moved once per month
- Multiple sponsorships at the same tree adds some multiplier 2.1X, 3.2X, etc
- You can have a link to share to a particular tree for checkins

At a happy hour:
Event: Happy Hour at Cosmic

- ID Trees at the bar
- Keep a count of new tree id's/check-ins and "Thanks!"
- Add a group picture by a tree?

What do I get for checking in at trees?

- Challenge cirlces like apple watch.
- Fill them up for both check-ins and thanks.
- Points for your friends who already thank the trees?
- Some other virtual prize?

VR: shows tree with its sponsors, likes, comments, etc
