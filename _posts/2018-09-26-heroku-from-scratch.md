---
layout: post
title: Heroku from Scratch
features:
  highlight: true
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

Once we're all done, we should then save our work in a commit.

```
git add .
git commit -m 'Initial commit 🚀.'
```

### Creating the Heroku app

We're going to use the CLI to do all this 😱.

First things first, we need to login!

```
heroku login --sso
```

Then we want to make a new app in Heroku.

```
heroku create
```

This will add a new remote to your git configuration for the project, called `heroku`.

You'll also get a URL (like I got https://infinite-eyrie-31643.herokuapp.com/), this is where our application will run.

And that's all it takes...

There are other things we could do, like renaming the application, and putting it in a better team, but we won't bother about that for now.

### Deploying 🚀

[There's a few ways of deploying to Heroku](https://devcenter.heroku.com/categories/deployment), we're going to [deploy to Heroku directly, using git](https://devcenter.heroku.com/articles/git#deploying-code).

Given we've already committed our code, and created the Heroku app, the only thing we need to do is use git to push our code to Heroku.

```
git push heroku master
```

We'll then see the build logs as Heroku prepares our application for deployment.

To double check everything is running, run `heroku ps` to ensure that we have a `web` process running.

Finally, let's actually check our app is on the internet.

```
heroku open
```

And that's all there is to it 🎉.

Go ahead, make some changes to `app.js` and push them to Heroku!
