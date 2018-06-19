---
published: true
layout: post
title: "Docker 111 – Docker Compose \U0001F433"
---

> ℹ️ This is part of a series of internal Docker workshops for the Financial Times.
> 
> * [Docker 101 – How do I use Docker? 🐳](https://uncomplicated.systems/2018/05/23/docker-101.html)
> * [Docker 110 – Dockerfiles & Volumes 🐳](https://uncomplicated.systems/2018/06/05/docker-0110-dockerfiles-and-volumes.html)
> * [Docker 111 – Docker Compose 🐳](https://uncomplicated.systems/2018/06/19/docker-0111-docker-compose.html)

> 🚧 Under construction.

We've previously used the `docker` command line tool to build and run Docker images.

This works great when everything you need to run fits into a single `Dockerfile`, but what if your application needs a database, should that also be installed in the image?
