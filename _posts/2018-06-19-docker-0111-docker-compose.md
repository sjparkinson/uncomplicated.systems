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

We've previously used the `docker` command line tool to build and run Docker images.

This works great when everything you need to run fits into a single `Dockerfile`, but what if your application needs a database, should that also be installed in the image?

Let's think about how we'd develop a web application locally using Docker. It'll have a web process running the application, and a database of some sort. I'll call the collection of these two processes the _system_.

If we take a look at the [best pratices for writing a Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#decouple-applications), we find there's a whole section on decoupling applications.

> Each container should have only one concern. Decoupling applications into multiple containers makes it easier to scale horizontally and reuse containers.

In essence, we should try and run only one [_process_](https://en.wikipedia.org/wiki/Process_(computing)) in each container.

That's fine! We'll need two images to define our system, one for the web process, and one for the database.
