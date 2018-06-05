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
docker run -d -v docker-110-mysql-volume:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=hunter2 --name docker-110-mysql mysql
```

This eventually starts a mysql server locally, not bad! We use the `-d` option to run the container as a daemon. We also used the `-v` option to give the volume defined in the Docker image a name.

We can also use another container to connect to the mysql server, using a _dockerized_ version of the mysql client.

```
docker run -it --rm --link docker-110-mysql:mysql mysql sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -uroot -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD"'
```

We get the standard SQL prompt! There's some fancy magic options used here, but we won't worry about those today.

How about we create a schema and insert some data? We can copy and paste the following into the mysql prompt.

```sql
CREATE DATABASE hello_docker;

USE hello_docker;

CREATE TABLE doggos (
  name varchar(255),
  is_rare_pupper bool
);

INSERT INTO doggos VALUES ('Floof Missile', true);
```

Now let's delete both containers, type in `exit` to stop the client (the container is deleted because we used `--rm`), and then `docker rm -f docker-110-mysql` for the container running as a daemon.

But what about that data we just added, where will that go?!

This is where the Docker volumes come in.

If we have a [look at the Dockerfile for mysql](https://github.com/docker-library/mysql/blob/fc3e856313423dc2d6a8d74cfd6b678582090fc7/8.0/Dockerfile), we see the `EXPOSE` directive again, this time set to the standard mysql port.

There's a number of other directives in this Dockerfile, but specifically there's `VOLUME` on line 65. It comes with a path as an argument.

MySQL as a database persists it's data to disk, can you guess where? Yeah! `/var/lib/mysql`. Which we gave a name when we started mysql earlier.

By using `VOLUME` what we're saying to Docker is that our container may read and write data to this directory, and if we give the volume a name later, please keep it seperate from the container.

Try running `docker volume ls`. We get a list of volumes, and there should be one called `docker-110-mysql-volume`.

How about we run mysql again, giving it the same name for the volume, and then connect with the client.

```
docker run -d -v docker-110-mysql-volume:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=hunter2 --name docker-110-mysql mysql
```

```
docker run -it --rm --link docker-110-mysql:mysql mysql sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -uroot -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD"'
```

If we run the following we should still see all the schema we saved earlier.

```sql
USE hello_docker;

SELECT * FROM doggos;
```

OK, that's quite a lot to cover. Here's a doggo story to recover.

![Follow the ball with your eyes doggos!](https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fi.redditmedia.com%2FuY9NtsBDO7dsP4gH7qSJxQc2vcl89SYn_kAE22vE2hM.jpg%3Fw%3D750%26s%3D18f72300ef253317c5289567bb37d1c3?source=uncomplicated.systems&width=1024&height=700)

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
