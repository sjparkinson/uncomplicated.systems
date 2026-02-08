## Running GeForce Now on macOS

Lately, I stream my computer games using [GeForce NOW](https://www.nvidia.com/en-gb/geforce-now/), so I can play nearly all of my Steam library on macOS.

But every time I set up a new macOS computer with GeForce NOW, I encounter an annoying stutter that can't be resolved with any setting in the GeForce NOW app. The cause is Apple Wireless Direct Link (which powers features such as AirDrop). The `awdl0` network interface is used and will occasionally hop Wi-Fi channels, causing the stutter.

I first noticed it playing [Deep Rock Galactic](https://store.steampowered.com/app/548430/Deep_Rock_Galactic/), where running around in the space station feels janky and unresponsive right after the game starts.

A community-found "fix" has been to disable the `awdl0` interface with `sudo ifconfig awdl0 down` before running GeForce NOW. But recent versions of macOS re-enable the interface fairly frequently during the hour or so you're playing a game.

For a while I've been running something like the following bash script before starting a game; it does the trick, but it never felt great. And if I forget to cancel it after I'm finished playing, AirDrop and other features don't work, which is irritating.

```bash
#!/bin/bash
while true; do
  if ifconfig awdl0 2>/dev/null | grep -q "status: active"; then
    ifconfig awdl0 down
  fi
  sleep 1
done
```

But this weekend seemed like a great time to try out Claude and turn it into a more robust bit of software that could run in the background:

<https://github.com/sjparkinson/geforcenow-awdl0>

The rough set of requirements I aimed for were:

* Must always be running, but use minimal resources
  * Which mostly means being event-based where possible
* Monitor for GeForce NOW running in full-screen mode (a good-enough proxy for a game being streamed)
* Disable the `awdl0` interface while a game is being streamed, and keep it disabled

Initially I started the project in Rust; as a neat bit of systems programming it seemed like a good fit. And by [sjparkinson/geforcenow-awdl0 @ `887b64`](https://github.com/sjparkinson/geforcenow-awdl0/tree/887b648b0d510a542c74c9e82cc94f73d8e034e5) I had something working!

Using Claude to build this out really impressed me; I was able to knock something out in a language I'm not that great at yet within an afternoon. In my favour, the requirements were simple, and I was able to run the build and tests on macOS within GitHub Actions for an OK-ish feedback loop. Rust's compiler errors were a real help, and simply copying them into the chat for Claude to resolve was enough to make meaningful progress.

But I wasn't happy with the number of Cargo dependencies involved, mainly the bindings, which led me to consider swapping the project to Swift the next day. Again, Claude had no trouble with this refactor, and I was able to get a really clean set of project dependencies.

There are a few other projects out there that do the same thing[^1][^2], but I'm always a bit hesitant to run random software like this. So it was great to use this as an excuse to learn some Swift and Rust and try out the vibe-coding thing properly in a low-risk project.

To help with the trusting the binary I also tried out the [GitHub Attestation feature](https://github.blog/news-insights/product-news/introducing-artifact-attestations-now-in-public-beta/). You can download a binary from a build and run `gh attestation verify --owner sjparkinson ./geforcenow-awdl0` to know it's been built from the source. Trusting the source code written by Claude is totally different matter though...

[^1]: <https://github.com/james-howard/AWDLControl>
[^2]: <https://github.com/oliverames/ping-warden>
