## Setting up Firefox for privacy

Here's how to setup Firefox on your desktop on or Android to better guard your privacy while browsing the web.

### Firefox on the desktop

* Custom Tracking Protection
* `about:config` privacy settings, https://wiki.mozilla.org/Privacy/Privacy_Task_Force/firefox_about_config_privacy_tweeks
* uBlock Origin
* DNS over HTTPS, `network.trr.mode` set to _3_

### Firefox on Android

Use the [Firefox Preview for Android](https://play.google.com/store/apps/details?id=org.mozilla.fenix). This edition of Firefox on Android includes the same [content blocking](https://support.mozilla.org/en-US/kb/content-blocking) features that are available on the desktop.

Configure Private DNS in the Android network and internet settings ([also know as DNS over TLS](https://en.wikipedia.org/wiki/DNS_over_TLS)).

1. Go to Settings → Network & internet → Advanced → Private DNS
2. Select the "Private DNS provider hostname" option
3. Then enter either `1dot1dot1dot1.cloudflare-dns.com` or `dns.google` and hit Save

This setup won't be as good as the desktop setup, but it's a good compromise and only uses built-in features.