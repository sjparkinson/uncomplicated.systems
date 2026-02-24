## Let's have a bash at Bash

This is going to be really fun. It'll be like going back in time forty years. We'll be  using websites with _litterally no CSS_.

<img width="720" height="479" src="/assets/images/677493e6-5081-4167-944a-36f079b38b34.png" alt="" loading="eager" fetchpriority="high">

This tutorial is intended to be an introduction to shell scripting. There are several scripting languages out in the wild, and in this tutorial we're going to focus on using [Bash](https://en.wikipedia.org/wiki/Bash_%28Unix_shell%29) (`bash`).

Others you will encounter while programming include the Bourne shell (`sh`), Z shell (`zsh`), and the fish shell (`fish`). It's sort of like the editors we use to write code, some people like `vim` or `emacs` and everyone else likes Visual Studio Code.

If you are writing a shell script for others to use, you will want to use either `bash` or `sh`, as those are the most widely available shell scripting languages 👩‍💻.

> The Unix shell has been around longer than most of its users have been alive. It has survived so long because it’s a power tool that allows people to do complex things with just a few keystrokes. More importantly, it helps them combine existing programs in new ways and automate repetitive tasks so they aren’t typing the same things over and over again.

From <https://swcarpentry.github.io/shell-novice/>.

### Manual files

At the heart of working with the shell is a command called `man`, for manual. This is a lifesaver.

Almost every popular command will be published with their own manual. Running `man <command>` will display the manual, and give you an idea of how you can use the command.


### Command synopsis (or sometimes usage)

Every command will come with a synopsis. It is worth learning how to decipher them. Let's break down the one for `mkdir`, a command used to make directories.

```
mkdir [-pv] [-m  mode] directory_name  ...
```

Do not panic! There are conventions we can lean on to understand this alien text 👽.

I've seen it mention that a commands synopsis is vaguely regex based. Writing this tutorial is the first time I've even consider that might be true. What really matters is those strong conventions that you should be able to learn.

First let's look at `mkdir`, this is the name of the command we're looking at using.

Then we have `[-pv]`, the square brackets mean that what is inside is _optional_, i.e. we don't need to include them when using `mkdir`. What's inside the brackets are **two** options we can pass to `mkdir` to change it's behaviour when it runs. The details should be provided for each one further down in the manual. You can pass them together (`-pv`), or separately `-p -v`.

We have another option `[-m mode]`, and this one shows that it accepts a value (called `mode`). Again, it's usage should be documented further down in the manual.

We then have `directory_name ...`. Because `directory_name` it is not prefixed with an option (either `--something` or `-s`) it is called a _positional argument_. It's followed by `...` which means this is a _variadic positional argument_, i.e. you can pass `mkdir` one or more directories.

### Some useful/interesting tips

* Most commands will have a `--help` option, some may have a `help` command (e.g. `heroku help apps`)
* Most commands will also have a `--version` option
* Command line options often come with a long and short name, e.g. `--version` or `-V`
* Sometimes manuals have links in them, to [some very interesting parts of the internet](https://public-inbox.org/git/)
* Between macOS and Linux there are a lot of shared commands, _however_ they don't always work the same way, for example the `-i` option in `sed` behaves differently on each platform

### Further reading

* [Utility Argument Syntax](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html#tag_12), "introduces terminology used [...] for describing the arguments processed by the utilities"

### Commands

These are a collection of commands that are worth knowing exist. There are lots more, and if you know what you want to do, usually a quick search of Stack Overflow can find you the name of a command you could use. 

📝 The descriptions for all these commands come from running `man <command>`. Yeah I totally ran `man man`, don't think I've _ever_ done that before.

* `man`, format and display the on-line manual pages
* `sed`, stream editor
* `grep`, file pattern searcher
* `tar`, manipulate tape archives (📼 what!?)
* `sort`, sort or merge records (lines) of text and binary files
* `uniq`, report or filter out repeated lines in a file
* `cat`, concatenate and print files
* `mv`, move files
* `ln`, make links
* `mkdir`, make directories
* `echo`, write arguments to the standard output
* `cp`, copy files
* `rm`, remove directory entries
* `awk`, pattern-directed scanning and processing language
* `xargs`, construct argument list(s) and execute utility
* `curl`, transfer a URL
* `less`, opposite of more... (not helpful, but this is a useful command)
* `ls`, list directory contents
* `find`, walk a file hierarchy
* `env`, set environment and execute command, or print environment
* `which`, locate a program file in the user's path

### Variables, conditionals, loops, and functions

> The shell is actually a programming language: it has variables, loops, decision-making, and so on.

From _The UNIX Programming Environment_, Prentice Hall, Inc.

### Variables

It's as simple as `VARIABLE=value`. There are some other form depending on the shell language, but that one reliably works.

```bash
#!/usr/bin/env bash

FOO=bar
echo "$FOO"
```

That's all there is to get started with variables in shell scripts!

### Conditionals

These are a little weird. I _always_ have to check the manual for if statements in Bash.

They are going to look something like...

```bash
if TEST-COMMANDS; then CONSEQUENT-COMMANDS; fi
```

There are loads of things we can use for `TEST-COMMANDS`. See <https://www.tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html#tab_07_01> for the basics.

Let's have a hello world example that only runs if a file exists at `~/.hello`.

```bash
#!/usr/bin/env bash

if [ -a ~/.hello ]; then
  echo 'Hello world!'
fi
```

Again, it's weird. But it does work.

### Loops

Bash supports `for`, `while`, and `until` loops. Check out [chapter 9 of the Bash Guide for Beginners for the syntax](https://www.tldp.org/LDP/Bash-Beginners-Guide/html/chap_09.html).

`for` loops are great for running commands over a list of something.

`while` is perfect for running until some condition is met, as if you were running an `if` statement over and over again, looping as long as the condition is executes successfully.

`until` is a `while` loop except the loop continues _until_ the condition executes successfully.

If you want to keep running a command over and over again, here's a handy one line Bash script you can use in the terminal.

```bash
while true; do COMMANDS; done
```

### Functions

Functions you may come across, but they are not so common in small scripts.

Here's a hello world example wrapped in a function.

```bash
#/usr/bin/env bash

hello() {
  echo "Hello world!"
}

hello
```

Okay, a little odd, but it works.

Functions can also accept arguments, hold on to your seats for this one...

```bash
#/usr/bin/env bash

hello() {
  echo "Hello $1!"
}

hello Sam
```

What a world we live in. When we come across passing arguments to shell scripts later, you'll likely spot some similarities to how functions access arguments.

### Unix pipes and redirection

Let's talk about plumbing! In the Unix sense.

This is actually a massive and fascinating area of working on the command line. We're only going to scratch the surface.

Shell scripts, like any other program, can read from `stdin` and write to `stdout` and `stderr`.

Pipes are a way of chaining the output of one process into the input of another process. This is _really_ powerful, and enables us to compose commands together in ways the original engineers may never even have considered.

The syntax involves using the vertical bar character (<kbd>|</kbd>). Also known as pipes in Unix terminology.

If we have a file called `repositories.txt` with lots of repositories, something like...

```
Financial-Times/next
Financial-Times/tako
sjparkinson/vdot
sjparkinson/uncomplicated.systems
sjparkinson/vdot
```

If we want to turn that into an ordered list of deduplicated repositories, we can combine two programs to get the result. We'll use `sort` to order the list of repositories, and then when everything is ordered, we can use `uniq` to remove any duplicates.

```bash
sort repositories.txt | uniq
```

The `stdout` stream from our call to `sort` is _piped_ into the `stdin` stream for our call to `uniq`.

Now, if we want to save the result to a new file, we can use redirection. This involves the angle bracket characters (<kbd><</kbd>, <kbd>></kbd>  and also `>>`).

Let's save the result to a file called `unique-repositories.txt`.

```bash
sort repositories.txt | uniq > unique-repositories.txt
```

This takes the `stdout` stream from calling `uniq` and _redirects_ it into our file called `unique-repositories.txt`.

Using a single <kbd>></kbd> means we will either create or overwrite the `unique-repositories.txt` file. If instead we use `>>`, that will _append_ the output from `uniq` to our file.

### Further reading

* <https://en.wikipedia.org/wiki/Pipeline_%28Unix%29>
* <https://en.wikipedia.org/wiki/Standard_streams>
* <https://en.wikipedia.org/wiki/Redirection_(computing)>
* <https://en.wikipedia.org/wiki/Unix_philosophy>, this one is well worth a read

### Writing a script

### Shebang

To write an executable shell script (i.e. one you can run on the terminal like `./my-script.sh`), it needs to start with a shebang, which tells the terminal how to run your script.

Here's a hello world example written in Bash.

```bash
#!/usr/bin/env bash

echo 'Hello world!'
```

The shebang is `#!/usr/bin/env bash`. You may also see `#!/bin/bash`. You might also have seen `#!/usr/bin/env node` before.

Wikipedia has a great page on shebangs, <https://en.wikipedia.org/wiki/Shebang_(Unix)>.

### Arguments

You can pass arguments to a script from the command line, and read their values in your script.

Let's say we call our script with `./our-script.sh foo-bar fizz-buzz`.

We can read these two _positional arguments_ with a magic-ish variable notation. The number we use matches the position of the argument we want to read.

```bash
#!/usr/bin/env bash

echo "$1"
echo "$2"
```

Which will print the following to `stdout`.

```
foo-bar
fizz-buzz
```

### Activity time!

Let's try to take some of what we've learnt and write a shell script.

Write a script in Bash that adds `.spec` to the name of all `.js` files in a given directory passed to the script.

For example a file called `foo-bar.js` should become `foo-bar.spec.js`.

We should be able to pass the script a path as an argument, e.g. `./js-spec-rename.sh test/`.

**Bonus question**, what would we change about how we use the script to simplify it dramatically?

**Super  bonus activity**, use [shellcheck](https://github.com/koalaman/shellcheck) to lint your script.

**Super super bonus activity**, try writing some test for your script! Check out <https://github.com/sstephenson/bats> for a testing framework written in Bash.

### Useful resources

* [Bash Guide for Beginners](https://www.tldp.org/LDP/Bash-Beginners-Guide/html/index.html)
* [Introduction to if](https://www.tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html), I _always_ have to look up how to do if statements in shell scripts
* [BASH Programming - Introduction HOW-TO](http://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO.html), for programming basic-intermediate shell scripts
* [Advanced Bash-Scripting Guide](https://www.tldp.org/LDP/abs/html/), an in-depth exploration of the art of shell scripting
* [Introduction to Linux](http://tldp.org/LDP/intro-linux/html/), a hands on guide
* [Explain Shell](https://explainshell.com/), really good at unpicking convoluted shell commands
* [The Missing Semester of Your CS Education](https://missing.csail.mit.edu/), a great MIT Open Learning course
