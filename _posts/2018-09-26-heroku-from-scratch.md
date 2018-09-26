---
layout: post
title: Heroku from Scratch
---

> ℹ️ This post is for an internal workshop at the Financial Times.

We're going to put togther a Heroku application, from scratch.

We'll use the Heroku CLI, Node.js, Yarn (😱), and the express web framework.

1. [Heroku – Getting Started with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)

2. [Heroku – Preparing a Codebase for Heroku Deployment](https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment)

3. [Express – Hello World](https://expressjs.com/en/starter/hello-world.html)

If we begin by building a basic hello world application using Express locally, we can then prepare the code for deployment to Heroku, then finally create the app and ship it ⛴.


First we'll make a folder and generate our `package.json` to kick start the project.

> If you don't have Yarn already, [check out their install page](https://yarnpkg.com/en/docs/install) (basically `brew install yarn`).

```
mkdir hello-world
cd hello-world
yarn init --yes --private
```

You should now have a `package.json`, with not much in it.

We can then add Express as a dependency.

```
yarn add express
```

Which updates our `package.json`, and creates `node_modules/` and `yarn.lock`.

We should add `node_modules/` to the list of ignored files for git.

GitHub maintain a brillant repository of `.gitignore` files sorted by programming language, so let's borrow the one for Node.js.

Copy and paste the contents of [Node.gitignore](https://github.com/github/gitignore/blob/master/Node.gitignore "github/gitignore Node.gitignore") into a local file called `.gitignore`.
