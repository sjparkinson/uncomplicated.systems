---
published: true
layout: post
title: "Docker 110 – Dockerfiles & Volumes \U0001F433"
---

> ℹ️ This post is written for an internal workshop on Docker at the FT.

> Why 110? Well, 101 is 5 from binary to decimal, and 110 is just 6 🤷.

[We've already covered the basics in a 101](/2018/05/23/docker-101.html), looking at the Docker command line tool and the basics of making images and Dockerfiles.
 
This workshop follows on from that, covering volumes and looking at Dockerfiles in more detail.

## Quick Recap

We make a Docker image by writing a `Dockerfile` and building it with `docker build --tag hello-world .`.

We can then run that image using `docker run hello-world`, which starts what we call a container.

If the image is a web thing, it'll probabily have _exposed_ ports. To make requests to the container we need to publish the container's ports using the `-p 8080:80` command line option.

For example, `docker run -p 8080:80 httpd`.

Finally there's the Docker registries, where we can upload and download images. When you do `docker pull hello-world` it uses [Docker Hub](https://hub.docker.com) as the default registry, sort of like the GitHub of Docker images.

## What are Volumes?

They are mentioned a bunch in most thing docker related, you may have heard of heard of them already.

So what are they?

Let's answer a question with a question..., how can I run a database in Docker, or anything else that needs persistance for that matter?

If we have a look at [the Docker Hub page for mysql](https://hub.docker.com/_/mysql/) we can work out how to run it locally...

```
docker run -it -p 3306:3306 -e MYSQL_ROOT_PASSWORD=hunter2 --name docker-110-mysql mysql
```

This eventually starts a mysql server locally, not bad!

We can also use another container to connect to the mysql server, using a _dockerized_ version of the mysql client.

```
docker run -it --link docker-110-mysql:mysql --rm mysql sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -uroot -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD"'
```

We get the standard SQL prompt!

How about we create a schema and add some data?

```sql
CREATE DATABASE hello_docker;

USE hello_docker;

CREATE TABLE doggos (
  name varchar(255),
  is_rare_pupper bool
);

INSERT INTO doggos VALUES ('Floof Missile', true);
```

We can now quit both containers. So what about that data we just added? Where does that go?!

This is where Docker volumes come in.

## More Dockerfiles

In the 101 we used the `FROM` and `COPY` directives in a Dockerfile. We'll look at those again, and a number of the other commonly used directives in Dockerfiles.

You can find the full list of directives at <https://docs.docker.com/engine/reference/builder/>.

### `FROM`

### `RUN`

### `COPY`

### `VOLUME`

### `EXPOSE`

### `ENTRYPOINT`

## Best Pratices

* **Don't** run as root, use the `USER` directive to change the default user for the image
* **Do** keep images small, cleanup in `RUN` commands to reduce the size of the layers
