---
published: true
layout: post
title: "Docker 110 – Dockerfiles & Volumes \U0001F433"
---

> ℹ️ This post is written for an internal workshop on Docker at the FT.

> Why 110? Well, 101 is 5 from binary to decimal, and 110 is just 6 🤷.

We've already covered the basics in a 101, looking at the Docker command line tool and the basics of making images and Docker files.
 
This workshop leads on from that, covering volumes and looking at Dockerfiles in more detail.

![The Docker logo](https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Faticdn.s3-eu-west-1.amazonaws.com%2F2017%2F04%2FDocker-Logo.png?source=uncomplicated.systems&width=1024)

## Quick Recap

We make a Docker image by writing a `Dockerfile` and building it with `docker build --tag hello-world .`.

We can then run that image using `docker run hello-world`, which starts what we call a container.

If the image is a web thing, it'll probabily have _exposed_ ports. To make requests to the container we need to publish the container's ports using the `-p 8080:80` command line option.

For example, `docker run -p 8080:80 httpd`.

Finally there's the Docker registries, where we can upload and download images. When you do `docker pull hello-world` it uses [Docker Hub](https://hub.docker.com) as the default registry, sort of like the GitHub of Docker images.

## What are Volumes?

They are mentioned a bunch, you may have heard of heard of them already. So what are they?

## Advanced Dockerfiles

https://docs.docker.com/engine/reference/builder/

Docker image layers, what are they?

### `FROM`

### `RUN`

### `COPY`

### `VOLUME`

### `EXPOSE`

### `ENTRYPOINT`

## Best Pratices

* **Don't** run as root, use the `USER` directive to change the default user for the image
* **Do** keep images small, cleanup in `RUN` commands to reduce the size of the layers

