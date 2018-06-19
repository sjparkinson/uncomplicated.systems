---
published: true
layout: post
title: "Docker 111 – Docker Compose \U0001F433"
---

> 🚧 Under construction.

> ℹ️ This is part of a series of internal Docker workshops for the Financial Times.
> 
> * [Docker 101 – How do I use Docker? 🐳](https://uncomplicated.systems/2018/05/23/docker-101.html)
> * [Docker 110 – Dockerfiles & Volumes 🐳](https://uncomplicated.systems/2018/06/05/docker-0110-dockerfiles-and-volumes.html)
> * [Docker 111 – Docker Compose 🐳](https://uncomplicated.systems/2018/06/19/docker-0111-docker-compose.html)

We've previously used the `docker` command line tool (CLI) to build and run Docker images.

In this workshop we'll cover using the `docker-compose` CLI, and discuss using a _multi-stage_ build to keep the size of our Docker images small.

![A small Chiwawa](https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fuser-images.githubusercontent.com%2F51677%2F41594791-84faf78c-73bc-11e8-8da0-e0e9c811779e.png?source=uncomplicated.systems&width=512)

Using `docker` works fine when everything you need to run fits into a single `Dockerfile`, but what if your application needs a database, should that also be installed in the image?

Let's think about how to develop a web application locally using Docker. It'll have a web process running the application, and a database of some sort. We'll call the collection of these two processes the _system_.

If we take a look at the [best pratices for writing a Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#decouple-applications), we find there's a whole section on decoupling applications.

> Each container should have only one concern. Decoupling applications into multiple containers makes it easier to scale horizontally and reuse containers.

In essence, we should try and run only one [_process_](https://en.wikipedia.org/wiki/Process_(computing)) in each container.

That's fine! We'll need two images to define our system, one for the web process, and one for the database.

[In the previous workshop](https://uncomplicated.systems/2018/06/05/docker-0110-dockerfiles-and-volumes.html) we made a MySQL database of doggos. Taking that database, let's write an application that lists all the rare puppers as HTML.

![I promise you, I haven't eaten in days! – Thoughts of a dog.](https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fuser-images.githubusercontent.com%2F51677%2F41595542-14828a44-73bf-11e8-896e-ddfadf33bfef.png?source=uncomplicated.systems)

