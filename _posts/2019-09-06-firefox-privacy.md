## Setting up Firefox for privacy

Here's how to setup Firefox on your desktop on or Android to better guard your privacy while browsing the web.

### Firefox on the desktop

To get Pretty Good Protection™️ using Firefox, you can use a combination of custom Tracking Protection settings and a number of `about:config` tweaks.

I've been using this configuration on my work and personal laptops and haven't really experienced any noteworthy issues with browsing the internet.

> ⚠️ **Word of warning**, making these changes appears to clear your cookies, so expect to sign in to everything again.

Once you've configured everything use [CloudFlare's Browser Experience Security Check tool](https://www.cloudflare.com/ssl/encrypted-sni/) to validate it's all configured correctly.

#### Configuring Firefox Tracking Protection

Open up `about:preferences#privacy`.

Under the _content blocking_ section select the custom option and check _everything_. In the trackers drop-down select "In all windows", and in the cookies drop-down select "All third-party cookies".

![Content blocking settings in Firefox](https://www.ft.com/__origami/service/image/v2/images/raw/{{ "https://i.imgur.com/S00wFLT.png" | url_encode }}?source=uncomplicated.systems)

Then under _trackers_ you'll also want to click the _change block list_ link and select the "Level 2 block list".

![Tracker block lists in Firefox](https://www.ft.com/__origami/service/image/v2/images/raw/{{ "https://i.imgur.com/VTGxEOc.png" | url_encode }}?source=uncomplicated.systems)

#### Changes to `about:config`

Open up the advanced preferences page in Firefox by visiting `about:config`, and promise to be careful!

![The warning page on Firefox's advances preferences page](https://www.ft.com/__origami/service/image/v2/images/raw/{{ "https://i.imgur.com/Phh1YQ2.png" | url_encode }}?source=uncomplicated.systems)

Then find and update the values for each of the following preferences.

* Set `privacy.firstparty.isolate` to `true`
* Set `privacy.resistFingerprinting` to `true`
* Set `browser.cache.offline.enable` to `false`
* Set `browser.send_pings` to `false`
* Set `browser.urlbar.speculativeConnect.enabled` to `false`
* Set `dom.battery.enabled` to `false`
* Set `geo.enabled` to `false`
* Set `media.navigator.enabled` to `false`
* Set `network.http.referer.trimmingPolicy` to `2`
* Set `network.http.referer.XOriginPolicy` to `2`
* Set `network.http.referer.XOriginTrimmingPolicy` to `2`
* Set `network.security.esni.enabled` to `true`
* Set `webgl.disabled` to `true`
* Set `media.peerconnection.enabled` to `false`

Restart your browser to get all of these settings to take effect. Then check it's all working at https://www.cloudflare.com/ssl/encrypted-sni/.

The source for all these tweaks comes from <https://wiki.mozilla.org/Privacy/Privacy_Task_Force/firefox_about_config_privacy_tweeks>, which also contains more information about what each preference does.

#### Configuring DNS over HTTPS

Firefox can be configured to use DNS over HTTPS (DoH). This will protect you from [ISPs that log the DNS queries you make](https://dnsprivacy.org/wiki/display/DP/DNS+Privacy+-+The+Problem).

TTR stands for [Trusted Recursive Resolver](https://wiki.mozilla.org/Trusted_Recursive_Resolver).

In `about:config` again, set `network.trr.mode` to _3_ and update `network.trr.bootstrapAddress` to `1.1.1.1` (used to do the initial lookup for the IP address of the host defined in `network.trr.uri`).

The default DoH provider is CloudFlare. If you would like to change this you can update the value of `network.trr.uri`. The curl project are maintaining a list of DoH providers at <https://github.com/curl/curl/wiki/DNS-over-HTTPS>.

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