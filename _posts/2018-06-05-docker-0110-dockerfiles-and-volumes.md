---
published: true
layout: post
title: "Docker 110 – Dockerfiles & Volumes \U0001F433"
---

> Why 110? Well, 101 is 5 from binary to decimal, and 110 is just 6 🤷.

We've already covered the basics in a 101, looking at the docker command line tool and the basics of making images and Docker files.
 
This workshop leads on from that, covering volumes and looking at Dockerfiles in more detail.

## Quick Recap

We make a Docker image by writing a `Dockerfile` and building it with `docker build -t my-image .`.

We can then run that image using `docker run --rm -it my-image`, which starts what we call a container.

If the image is a web thing, it'll probabily have ports. To make requests to the container we need to _expose_ the container's ports using the `-p 8080:80` command line option.

## What are Volumes?

They are mentioned a bunch, you may have heard of heard of them already. So what are they?

