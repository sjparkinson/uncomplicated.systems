---
published: true
layout: post
title: "Docker 0111 – Docker Compose \U0001F433"
twitter: true
---

> 🚧 Under construction.

> ℹ️ This is part of a series of internal Docker workshops for the Financial Times.
> 
> * [Docker 0101 – How do I use Docker?](https://uncomplicated.systems/2018/05/23/docker-101.html)
> * [Docker 0110 – Dockerfiles & Volumes](https://uncomplicated.systems/2018/06/05/docker-0110-dockerfiles-and-volumes.html)
> * [Docker 0111 – Docker Compose](https://uncomplicated.systems/2018/06/19/docker-0111-docker-compose.html)

We've previously used the `docker` command line tool to build and run Docker images.

Today we'll cover using the  `docker-compose` command line tool, and discuss using a _multi-stage_ build to keep the size of our Docker images down.

![A small Chiwawa](https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fuser-images.githubusercontent.com%2F51677%2F41594791-84faf78c-73bc-11e8-8da0-e0e9c811779e.png?source=uncomplicated.systems&width=512)

Using `docker` works fine when everything you need to run fits into a single `Dockerfile`, but what if your application needs a database, should that also be installed in the image?

Let's think about how to develop a web application locally using Docker.

It'll have a web process running the application, and a database of some sort. We'll call the collection of these two processes the _system_.

If we take a look at the [best pratices for writing a Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#decouple-applications), we find there's a whole section on decoupling applications.

> Each container should have only one concern. Decoupling applications into multiple containers makes it easier to scale horizontally and reuse containers.

In essence, we should try and run only one [_process_](https://en.wikipedia.org/wiki/Process_(computing)) in each container.

Following that advice, we'll need two images to define our system, one for the web process, and one for the database.

[In the previous workshop](https://uncomplicated.systems/2018/06/05/docker-0110-dockerfiles-and-volumes.html) we made a MySQL database of doggos.

Taking that database, let's write an application that lists all the rare puppers as HTML.

<blockquote class="twitter-tweet" data-lang="en" data-dnt="true" data-align="center" data-link-color="#0f5499"><p lang="en" dir="ltr">the human is hosting a get together this evening. and i am told there will be snacks. so my goal. will be to convince every single guest. that i have not eaten. in several weeks</p>&mdash; Thoughts of Dog (@dog_feelings) <a href="https://twitter.com/dog_feelings/status/1008090737240571904?ref_src=twsrc%5Etfw">June 16, 2018</a></blockquote>

Like in Blue Peter, [there's a Go based application ready to build](https://github.com/sjparkinson/docker-0111).

```
git clone https://github.com/sjparkinson/docker-0111.git
```

In this repository we have a few files and directories.

* `application/` contains the Go HTTP server which will make a connection to a MySQL database
* `database/` contains a SQL file, that we'll use to seed our database with some example data
* `docker-compose.yml` contains a bunch of configuration that we'll now run through

Time to talk about `docker-compose`, a command line tool that'll help us when we work on systems with many processes locally. By defining the system in a `docker-compose.yml` configuration file, we can start and stop a system made of several Docker images with just a single command, `docker-compose up` and `docker-compose down`.

Compare that to using the `docker` command line tool to start a system using more than one image. It'd be a `docker` command in the terminal for each image that we'd have to start or stop.
