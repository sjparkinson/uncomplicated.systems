---
published: true
layout: post
title: "Docker 110 – Dockerfiles & Volumes \U0001F433"
---

> ℹ️ This is part of a series of internal Docker workshops for the Financial Times.
> 
> * [Docker 101 – How do I use Docker? 🐳](https://uncomplicated.systems/2018/05/23/docker-101.html)
> * [Docker 110 – Dockerfiles & Volumes 🐳](https://uncomplicated.systems/2018/06/05/docker-0110-dockerfiles-and-volumes.html)
> * [Docker 111 – Docker Compose 🐳](https://uncomplicated.systems/2018/06/19/docker-0111-docker-compose.html)

[We've already covered the basics in a 101](/2018/05/23/docker-101.html), looking at the Docker command line tool and the basics of making images and Dockerfiles.
 
This workshop follows on from that, covering volumes and looking at Dockerfiles in more detail.

![Majestic doggo's will feature](https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fmedia.wired.com%2Fphotos%2F5a55457ef41e4c2cd9ee6cb5%2Fmaster%2Fw_512%2Cc_limit%2FDoggo-TopArt-104685145.jpg?source=uncomplicated.systems)

## Quick Recap

We make a Docker image by writing a `Dockerfile` and building it with `docker build --tag hello-world .`.

We can then run that image using `docker run hello-world`, which starts what we call a container.

If the image is a web thing, it'll probabily have _exposed_ ports. To make requests to the container we need to publish the container's ports using the `-p` command line option.

For example, `docker run -p 8080:80 httpd`.

Finally there's the Docker registries, where we can upload and download images. When you do `docker pull hello-world` it uses [Docker Hub](https://hub.docker.com) as the default registry, sort of like the GitHub of Docker images.

## What are Volumes?

You may have heard of heard of them already. So what are they?

Let's answer a question with a question. How can I run a database in Docker, or anything else that needs persistance for that matter?

If we have a look at [the Docker Hub page for the MySQL database](https://hub.docker.com/_/mysql/) we can work out how to run it locally.

```
docker run -d -v docker-110-mysql-volume:/var/lib/mysql -p 3306:3306 -e MYSQL_DATABASE=docker -e MYSQL_ROOT_PASSWORD=hunter2 --name docker-110-mysql mysql
```

This eventually starts a mysql server, not bad!

We use the `-d` option to run the container as a daemon. We also used the `-v` option to give the volume defined in the Docker image a name.

We can also use another container to connect to the mysql server, using a _dockerized_ version of the mysql client.

```
docker run -it --rm --link docker-110-mysql:mysql mysql sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -uroot -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD" --database "$MYSQL_ENV_MYSQL_DATABASE"'
```

We get the standard SQL prompt! There's some fancy magic Docker options used here, but we won't worry about those today.

How about we create a schema and insert some data? We can copy and paste the following into the mysql prompt.

```sql
CREATE TABLE doggos (
  name varchar(255),
  is_rare_pupper bool
);

INSERT INTO doggos VALUES ('Floof Missile', true);
```

Now let's delete both containers, type in `exit` to stop the client (the container is deleted because we used `--rm`), and then `docker rm -f docker-110-mysql` for the MySQL container running as a daemon.

But what about that data we just added, where will that go!?

This is where Docker volumes come in.

If we have a [look at the Dockerfile for mysql](https://github.com/docker-library/mysql/blob/fc3e856313423dc2d6a8d74cfd6b678582090fc7/8.0/Dockerfile), we see the `EXPOSE` directive again, this time set to the standard MySQL port.

There's a number of other directives in this Dockerfile, but specifically there's `VOLUME` on line 65. It comes with a path in the container as an argument.

MySQL as a database persists it's data to disk, can you guess where? Yeah! `/var/lib/mysql`. Which we gave a name when we started MySQL earlier.

By using `VOLUME` we're saying to Docker that our container may read and write data to this directory and it'd be handy to keep it around.

Try running `docker volume ls`. We get a list of volumes, and there should be one called `docker-110-mysql-volume`.

How about we run MySQL again, giving it the same name for the volume.

```
docker run -d -v docker-110-mysql-volume:/var/lib/mysql -p 3306:3306 -e MYSQL_DATABASE=docker -e MYSQL_ROOT_PASSWORD=hunter2 --name docker-110-mysql mysql
```

Then let's connected to it using the client again.

```
docker run -it --rm --link docker-110-mysql:mysql mysql sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -uroot -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD" --database "$MYSQL_ENV_MYSQL_DATABASE"'
```

If we run the following we should still see all the schema we saved earlier.

```sql
SELECT * FROM doggos;
```

It's a new container (from the same image), but we're giving it a named volume and we get all the same data we had in the previous container that we deleted. Awesome!

In summary, we can use volumes for persisting part of a container's filesystem, and we can name that volume for even more persistance.

[Understanding Union Filesystems, Storage and Volumes](https://blog.docker.com/2015/10/docker-basics-webinar-qa/) looks like a good webinar, which should cover all this in more detail.

OK, that's quite a lot of information, time for a breather. Here's a doggo story to recover.

<blockquote class="twitter-tweet" data-lang="en" data-dnt="true" data-align="center" data-link-color="#0f5499"><p lang="en" dir="ltr">i had a long talk. with my fren. about how to spot. a fake ball throw. the optimal strategy. is to follow the ball. with your eyes. instead of your heart</p>&mdash; Thoughts of Dog (@dog_feelings) <a href="https://twitter.com/dog_feelings/status/957385573571944455?ref_src=twsrc%5Etfw">January 27, 2018</a></blockquote>

I'd also highly recomend searching [Google images for "dogs that have eaten a bee"](https://www.google.com/search?q=dogs+that+have+eaten+a+bee&hl=en&tbm=isch). Credit to Rhys for this search.

## More Dockerfiles

In the 101 we used the `FROM` and `COPY` directives in a Dockerfile. We'll look at those again, and a number of the other commonly used directives.

You can find the full list of directives at <https://docs.docker.com/engine/reference/builder/>.

### `FROM`

Here we specify the image we want to start from, often this will be an operating system, e.g. `FROM ubuntu` or even `FROM amazonlinux`.

There's also a special image called `scratch`, this is actually no image at all. It's often used with Go based programs to make a _very_ small image.

Try not to reinvent the wheel, do take a look for [existing offical images](https://hub.docker.com/explore/) so you only need to add your configuration.

### `RUN`

When we want to do _something_ when building the image we use the `RUN` directive.

You can pass it a shell command as an argument.

For example, `RUN apt-get install httpd`, which would then install Apache httpd in the image, or `RUN path/to/some-build-script.sh` to run a shell script.

### `COPY`

If we need a file in the image, we can copy files from our local file system when we're building the image using the `COPY` directive.

ℹ️ There is also an `ADD` directive, but unless you need to just stick with `COPY`.

For example, `COPY path/to/some-config.json /var/lib/my-app/config.json`.

It takes two arguments, the local path to copy from, and the path inside the image to copy to.

### `VOLUME`

This directive takes one command, a path.

### `EXPOSE`

Using the `EXPOSE` directive, we can pass it a port number to open up a container for network based applications.

For example, `EXPOSE 80`. Which we can then publish on our local machine using the `-p` option, `docker run -p 8080:80 httpd`.

### `ENTRYPOINT`

The `ENTRYPOINT` directive is the command docker will call when we use `docker run`.

For example the MySQL client image will use something like `ENTRYPOINT [ "mysql" ]`.

## Docker Image Layers

Now we've got a better idea of what we can put in a Dockerfile, it's worth having a discussion on what makes up an image.

Copy the following into a Dockerfile.

```docker
FROM alpine:3.7

RUN apk add --no-cache python

RUN echo 'print "Hello!"' > /hello.py && \
    chmod 755 /hello.py
    
ENTRYPOINT [ "python", "/hello.py" ]
```

We can then build the image with `docker build -t hello .`. Notice how the output lists each command, along with a hash like `---> d99238ddfb1d` after it has run?

```
Step 1/4 : FROM alpine:3.7
3.7: Pulling from library/alpine
ff3a5c916c92: Pull complete 
Digest: sha256:e1871801d30885a610511c867de0d6baca7ed4e6a2573d506bbec7fd3b03873f
Status: Downloaded newer image for alpine:3.7
 ---> 3fd9065eaf02
Step 2/4 : RUN apk add --no-cache python
 ---> Running in 308032ec5b57
[...]
(10/10) Installing python2 (2.7.14-r2)
Executing busybox-1.27.2-r7.trigger
OK: 51 MiB in 21 packages
Removing intermediate container 308032ec5b57
 ---> d99238ddfb1d
Step 3/4 : RUN echo 'print "Hello!"' > /hello.py &&     chmod 755 /hello.py
 ---> Running in da796c337c29
Removing intermediate container da796c337c29
 ---> 6948bef351c2
Step 4/4 : ENTRYPOINT [ "python", "/hello.py" ]
 ---> Running in e3ff553f8d24
Removing intermediate container e3ff553f8d24
 ---> a89a4201375f
Successfully built a89a4201375f
```

Each of these is what we call a layer. The final image then is just a combination of layers.

What is a layer though? Consider it a snapshot of the container's filesystem after running the directive, it is also read-only.

An image is made up of several of these read-only layers, with one final read-write layer made available on top of it all.

This helps to avoid duplication. Two diffrent images can share layers.

For example, if we have two images that both use `FROM ubuntu` we only need to download and store one copy of that layer.

You can find a deeper dive into this topic at <https://medium.com/@jessgreb01/digging-into-docker-layers-c22f948ed612>.

## Time to Make Something!

Brining all of this new Docker Stuff™ togther, let's make a slightly more complex image.

We're going to write a Rust command line tool, it'll print a greeting message.

Rust is a programming language that is starting to power the Firefox browser. The main thing is you probabily don't have it installed already!

Let's start by building upon an operating system.

```docker
FROM alpine:3.7
```

Alpine is a linux based operating system that works really well for Docker images. 

- It is _tiny_ so we don't spend ages downloading it
- It is also _very_ well maintained

Much like updating servers, Docker images need to be kept up-to-date so that they have all the latest security patches! But if the image you depend on isn't maintained this can be difficult.

Now to install the Rust compiler. We install the package using a `RUN` directive.

```docker
RUN apk add --no-cache rust
```

We can check this works by running `docker build -t rust-hello .`.

If we visit the Rust homepage at <https://www.rust-lang.org/en-US/index.html>, there's a nice greetings program we can use.

Let's copy and paste that into a file called `greetings.rs`, and then include it in our image.

```docker
COPY greetings.rs /greetings.rs
```

Finally we need to compile the Rust program, and set our image's entrypoint so that we call the program when we use `docker run` with our image.

```docker
RUN rustc -o /greetings /greetings.rs

ENTRYPOINT [ "/greetings" ]
```

Bringing it all togther...

```docker
FROM alpine:3.7

RUN apk add --no-cache rust

COPY greetings.rs /greetings.rs

RUN rustc -o /greetings /greetings.rs

ENTRYPOINT [ "/greetings" ]
```

Building it with `docker build -t rust-hello .`, and running it with `docker run rust-hello`.

We've used a few Docker best pratices here, as detailed below. There are more, and you'll come across them over time, but these are some good starting points.

Much like programming, there's always room to refactor images. Always look for places where you can reduce the number of layers.

One change we could make is to combine the two `RUN` directives into one, moving the `COPY` command above it. This would remove a layer, wahoo!

However, depending on how often we change `greetings.rs` it may also _really_ slow down how long it takes to build the image.

There's a balance between the number of layers in an image, and making use of the layer caching that Docker does.

The common pattern is to install packages first, as these don't change much, then copy files and build programs as they will frequently change.

This then means when we build the image, we can use the cached layers for our first `RUN` directive to skip straight to the `COPY` command.

You can see this in action if you run `docker build -t rust-hello .` again, there should be several `---> Using cache` logs, and it'll be a very quick build!

It's worth pointing out once again, you shouldn't have Rust installed on your machine, only Docker. Pretty cool!

## Best Pratices

- **Don't** run as root, use the `USER` directive to change the default user for the image
- **Do** keep images small, cleanup in `RUN` commands to reduce the size of the layers
- **Do** specify image tags when you can, e.g. `FROM httpd:2.4`


Try using the `USER` directive to run this greetings program as a non-root user!

> ➡️ Find the next post in this series at [Docker 111 – Docker Compose 🐳](https://uncomplicated.systems/2018/06/19/docker-0111-docker-compose.html).

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
