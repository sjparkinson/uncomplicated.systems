## Setting up Firefox for privacy

Here's how to setup Firefox on your desktop on or Android to better guard your privacy while browsing the web.

### Firefox on the desktop

* Custom Tracking Protection
* `about:config` privacy settings, https://wiki.mozilla.org/Privacy/Privacy_Task_Force/firefox_about_config_privacy_tweeks

#### Changes to `about:config`

Open up the advanced settings page in Firefox by visiting `about:config`.

#### Configuring DNS over HTTPS

Firefox can be configured to use DNS over HTTPS (DoH). This will protect you from [ISPs that log the DNS queries you make](https://dnsprivacy.org/wiki/display/DP/DNS+Privacy+-+The+Problem).

TTR stands for [Trusted Recursive Resolver](https://wiki.mozilla.org/Trusted_Recursive_Resolver).

In `about:config` again, set `network.trr.mode` to _2_. This will make Firefox use DNS over HTTPS by default, but will fallback to regular DNS if it doesn't work, helpful for open networks that require you to sign in to connect when otherwise the internal portal would not resolve.

It's worth noting that this doesn't stop software running on the rest of your computer from making unencrypted DNS lookups, it only protects lookups in the browser.

#### Install uBlock Origin

> An efficient blocker: easy on memory and CPU footprint, and yet can load and enforce thousands more filters than other popular blockers out there.

This is an effective extension to block online advertising that supplements the built in Firefox content blocking.

<https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/>

### Firefox on Android

Use the [Firefox Preview for Android](https://play.google.com/store/apps/details?id=org.mozilla.fenix). This edition of Firefox on Android includes the same [content blocking](https://support.mozilla.org/en-US/kb/content-blocking) features that are available on the desktop.

Configure Private DNS in the Android network and internet settings ([also know as DNS over TLS](https://en.wikipedia.org/wiki/DNS_over_TLS)).

1. Go to Settings → Network & internet → Advanced → Private DNS
2. Select the "Private DNS provider hostname" option
3. Then enter either `1dot1dot1dot1.cloudflare-dns.com` or `dns.google` and hit Save

This setup won't be as good as the desktop setup, but it's a good compromise and only uses built-in features.