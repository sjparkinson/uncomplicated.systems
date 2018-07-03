---
published: true
layout: post
title: "Docker 0111 – Docker Compose"
features:
  twitter: true
  highlight: true
---

> ℹ️ This is part of a series of internal Docker workshops for the Financial Times.
> 
> * [Docker 0101 – How do I use Docker?](/2018/05/23/docker-101.html)
> * [Docker 0110 – Dockerfiles & Volumes](/2018/06/05/docker-0110-dockerfiles-and-volumes.html)
> * [Docker 0111 – Docker Compose](/2018/06/19/docker-0111-docker-compose.html)

We've previously used the `docker` command line tool to build and run Docker images.

Today we'll cover using the  `docker-compose` command line tool, and discuss using a _multi-stage_ build to keep the size of our Docker images down.

![](https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fuser-images.githubusercontent.com%2F51677%2F41594791-84faf78c-73bc-11e8-8da0-e0e9c811779e.png?source=uncomplicated.systems&width=512)

Using `docker` works fine when everything you need to run fits into a single `Dockerfile`, but what if your application needs a database, should that also be installed in the image?

Let's think about how to develop a web application locally using Docker.

It'll have a web process running the application, and a database of some sort. We'll call the collection of these two processes the _system_.

If we take a look at the [best practices for writing a Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#decouple-applications), we find there's a whole section on decoupling applications.

> Each container should have only one concern. Decoupling applications into multiple containers makes it easier to scale horizontally and reuse containers.

In essence, we should try and run only one [_process_](https://en.wikipedia.org/wiki/Process_(computing)) in each container.

Following that advice, we'll need two images to define our system, one for the web process, and one for the database.

[In the previous workshop](https://uncomplicated.systems/2018/06/05/docker-0110-dockerfiles-and-volumes.html) we made a MySQL database of dogs.

Taking that database, let's write an application that lists them all in HTML.

<blockquote class="twitter-tweet" data-lang="en" data-dnt="true" data-align="center" data-link-color="#0f5499"><p lang="en" dir="ltr">the human is hosting a get together this evening. and i am told there will be snacks. so my goal. will be to convince every single guest. that i have not eaten. in several weeks</p>&mdash; Thoughts of Dog (@dog_feelings) <a href="https://twitter.com/dog_feelings/status/1008090737240571904?ref_src=twsrc%5Etfw">June 16, 2018</a></blockquote>

Pretending we're on Blue Peter for a moment, [there's a Go based application ready to build](https://github.com/sjparkinson/docker-0111).

```
git clone https://github.com/sjparkinson/docker-0111.git
```

In this repository we have a few files and directories.

* `application/` contains the Go HTTP server which will make a connection to a MySQL database
* `database/` contains a SQL file, that we'll use to seed our database with some example data
* and `docker-compose.yml` contains a bunch of configuration that we'll now run through

### Docker Compose

Time to talk about `docker-compose`, a command line tool that'll help us when we work on systems with many processes locally. By defining the system in a `docker-compose.yml` configuration file, we can start and stop a system made of several Docker images with just a single command, `docker-compose up` and `docker-compose down`.

Compare that to using the `docker` command line tool to start a system using more than one image. It'd be a `docker` command in the terminal for each image that we'd have to start or stop.

```yaml
version: '3'

services:

  application:
    build:
      context: ./application
      dockerfile: development.Dockerfile
    environment:
      MYSQL_USERNAME: root
      MYSQL_PASSWORD: hunter2
      MYSQL_ADDRESS: database:3306
      MYSQL_DATABASE: docker_0111
    volumes:
      - ./application:/go/src/github.com/Financial-Times/docker-0111-application/
    ports:
      - "8080:8080"
    depends_on:
      - database

  database:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: hunter2
      MYSQL_DATABASE: docker_0111
    volumes:
      - ./database:/docker-entrypoint-initdb.d
```

Here we see a set of services defined in the configuration, two in fact. We have one that defines configuration for our `application`, and another for our `database`.

You might notice, there's a similarity between a service's `docker-compose.yml` configuration, and the command line arguments we'd use if we wanted to run the same image using the `docker` command line tool.

This is much of what `docker-compose` allows us to simplify! By saving the verbose `docker` command line calls into `docker-compose.yml` we have a tool that can manage calling `docker` for us.

No need for us to remember `docker run -it --rm -v vol:/var/lib/data -p 8080:8080 our-image`.

We also define `depends_on`, which tells Docker Compose that we must have a database container running before our application container starts.

There are also entries for `volumes`, `ports`, and `environment` variables. These fields map to the options we'd pass to the `docker` command line tool.

If we have a look at our application, [to get it talking with our database](https://github.com/sjparkinson/docker-0111/blob/master/docker-compose.yml#L12), we're telling the application to point to a server at the `database` hostname.

Time for an aside on Docker networks.

### Docker Networks

When using Docker Compose, there are several useful features it also enables for us, without having to specify any configuration.

One of those features is networking between containers.

In order for our `application` container to have a connection to our `database` container we need to make a link between the two with a [Docker network](https://docs.docker.com/network/).

If we were using the `docker` command line tool we would define this with the `--network` option, but we'd also need to run `docker network create` first. Docker Compose configures this all for us!

We can then connect to our database from our application by using `database` as a hostname, which is the name of the service as defined in our `docker-compose.yml` configuration.

### Using Docker Compose

Now we've cloned our repository let's start up our system.

```
docker-compose up
```

We can add the `-d` option to start everything as a daemon (just like `docker run -d`).

To stop everything we do just the opposite, `docker-compose down`.

This brings up, and then stops all the services we've defined in our `docker-compose.yml`.

You'll notice that it also builds the image for our application too.

If we wanted to reset our database (say we deleted our initial table my mistake), we can recreate the volumes using `docker up --renew-anon-volumes`.

We can be more specific about the services we're starting/stopping by using `docker-compose start` and `docker-compose stop`, passing in the names of the services we're interested in.

If we want to run a command inside a container we can use `docker-compose run`. Let's try running `dep ensure` on our code (it's a way of installing dependencies in Go).

```
docker-compose run application dep ensure
```

Because we've defined a volume for our `application/` directory, any changes made inside this container actually get made to the files in our cloned directory too.

Perfect for developing locally! The same is true if we make changes locally, they will be reflected in the filesystem of the container.

How about connecting to the database with a SQL client? We can use `docker-compose run` again, and pass it arguments similar to our last workshop.

```
docker-compose run database sh -c 'exec mysql -hdatabase -P3306 -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"'
```

If we inspect what containers we have running, with `docker ps`, you'll find that the MySQL container does not have it's port published.

So we actually have a private MySQL database locally, but we can connect to it if we're working in a container within the Docker network that Docker Compose made for us.

One final thing we get when using Docker Compose is a process supervision tool for our containers, by using the `restart` configuration we can specify if `docker-compose` should start a container again if it crashes.

That wraps up a wizz through tour of the `docker-compose` command line tool, and covers the basics of a `docker-compose.yml` file.

Time to go away and build those Docker developer environments!

### Multi-stage Dockerfile Builds

In this project we have two Dockerfiles for the application, `development.Dockerfile` and `production.Dockerfile`.

I **wouldn't** consider this naming best practice, but it will give us a great comparison between standard Dockerfiles and multi-stage Dockerfiles. 

In `development.Dockerfile` we have a typical Go based image, that copies in our source code, installs dependencies, and builds the application.

In `production.Dockerfile`, we see the same directives, **but** we also have a second `FROM` directive. That's the sign we're dealing with a multi-stage Dockerfile.

Docker handles this by building two images from the one Dockerfile, but it throws away that first image when it's done.

We give the first `FROM` directive a name with the `AS` keyword, which we can use to reference this first image when we're building the second.

In the second image (everything after `FROM alpine:latest`), we can pass the `COPY` directive a `--from` option with the name of the first image. `COPY` then copies files from the filesystem of the first image, **not** our local filesystem.

If we run the following commands to make the two images, we can then compare the size of the resulting two images.

```
docker build -t docker-0110-development -f application/development.Dockerfile application/
docker build -t docker-0110-production -f application/production.Dockerfile application/
```

The result is our `docker-0110-development` image comes out at ~440MB, while our `docker-0110-production` images comes out at only ~14MB!
