---
layout: post
title: Heroku from Scratch
---

> ℹ️ This post is for an internal workshop at the Financial Times.

We're going to put togther a Heroku application, from scratch.

We'll use the Heroku CLI, Node.js, Yarn (😱), and the express web framework.

And we'll begin by building a basic hello world application using Express, we can then prepare the code for deployment to Heroku, and finally create the app in Heroku and ship it ⛴.

### Making the application

> If you don't have Yarn already, [check out their install page](https://yarnpkg.com/en/docs/install) (basically `brew install yarn`).

First we'll make a folder and generate our `package.json` to kick start the project.

```
mkdir hello-world
cd hello-world
git init
yarn init --yes --private
```

You should now have a `package.json`, with not much in it.

We can then add Express as a dependency.

```
yarn add express
```

Which updates our `package.json`, and creates `node_modules/` and `yarn.lock`.

We should add `node_modules/` to the list of ignored files for git.

[GitHub maintain a brillant repository of `.gitignore` files](https://github.com/github/gitignore) sorted by programming language, so let's borrow the one for Node.js.

Copy and paste the contents of [Node.gitignore](https://github.com/github/gitignore/blob/master/Node.gitignore "github/gitignore Node.gitignore") into a local file called `.gitignore`.

Now to write our application!

Add the following to a new file called `app.js`. This is just copy and pasted from https://expressjs.com/en/starter/hello-world.html.

```js
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

We'll also add a new `scripts` section to our `package.json` file, so that we can use `yarn start` to make developing locally easier.

Add the following to `package.json`.

```json
"scripts": {
  "start": "node app.js"
}
```

Time to take it for a spin, run `yarn start` and you should see something like the following.

```
yarn run v1.9.4
$ node app.js
Example app listening on port 3000!
```

Open up <http://localhost:3000> to see if it worked.

Let's also add support for compression of our responses.

[Express has a handy guide](https://expressjs.com/en/advanced/best-practice-performance.html#use-gzip-compression) to run through.

First we need another dependency, `compression`.

```
yarn add compression
```

Then all we need to do is register the middleware in `app.js` and we're done.

Make the following changes to `app.js`.

```diff
 const express = require("express");
+const compression = require("compression");
 
 const app = express();
 const port = 3000;
 
+app.use(compression());
+
 app.get("/", (req, res) => res.send("Hello World!"));
 
 app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

Then test it again with `yarn start` and opening <http://localhost:3000>.

### Preparing it for Heroku

> If you haven't got it already, [please install the Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) (again probabily `brew install heroku/brew/heroku`).

While we've got something working locally, there's a few things we'll need to change to make sure Heroku can run it too.

For this section we'll follow the well documented guide published by Heroku, [Preparing a Codebase for Heroku Deployment](https://devcenter.heroku.com/articles/preparing-a-codebase-for-heroku-deployment).

After this workshop, it's also well worth checking out the Heroku guide on [the Node.js best pratices for running on the platform](https://devcenter.heroku.com/articles/node-best-practices).

### Creating the Heroku app



### Deploying 🚀


