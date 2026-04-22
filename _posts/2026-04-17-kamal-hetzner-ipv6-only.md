## Deploying to IPv6-only Hetzner Cloud with Kamal

I've been working on a small Rails project recently, and I've gone for Hetzner Cloud to deploy it, what looks to be the omakase option for new Rails 8 projects.

To make life a little more challenging I went for the IPv6-only option. The 50¢ a month cost saving is a nice perk... But really I wanted to know if it was even possible. There are a few sharp edges, so this post is mostly so future-me (or you) doesn't have to spend an evening re-discovering them.

### The shape of the setup

The final picture looks like this:

* A single Hetzner CX23 VPS, IPv6-only, locked down on first boot with cloud-init
* Ansible handles everything stateful on the host
  * Docker with IPv6 enabled
  * `cloudflared`, to route traffic from Cloudflare to the VPS over an encrypted tunnel
  * an OpenTelemetry Collector running as a systemd service for monitoring
  * and NAT64 via `systemd-resolved` so the host can send telemetry to Honeycomb, which is IPv4-only
* [Kamal](https://kamal-deploy.org/) handles the app deploys

No inbound 80/443, no TLS to configure on the host, and almost no IPv4.

### cloud-init for the initial lockdown

Hetzner supports cloud-init when creating the VPS, which stops it from being reachable as `root` over SSH with a password. The important bits:

```yaml
disable_root: true
ssh_pwauth: false
users:
  - name: kamal
    groups: users,admin,docker
    sudo: ALL=(ALL) NOPASSWD:ALL
    lock_passwd: true
    ssh_authorized_keys:
      - ssh-ed25519 AAAA...

runcmd:
  - ufw default deny incoming
  - ufw default allow outgoing
  - ufw allow 22/tcp
  - ufw --force enable
```

That's enough to have a working, firewalled box with a single non-root user and SSH key auth.

### Ansible, with the Rails master key as the vault password

Everything else is configured with Ansible as the kamal user, using a small playbook.

To keep secrets simple I'm using the Rails master key file as the Ansible Vault password file, configured with `vault_password_file` in `ansible.cfg`:

```ini
[defaults]
inventory = ansible/inventory.yml
vault_password_file = config/credentials/production.key
```

The Cloudflare tunnel token and the Honeycomb ingest key are both encrypted inline in `inventory.yml` using `ansible-vault encrypt_string`, unlocked by the same key that Rails already needs to boot. Something like:

```yaml
production:
  hosts:
    2001:0db8:85a3:0000:0000:8a2e:0370:7334: ~
  vars:
    ansible_user: kamal
    ansible_python_interpreter: /usr/bin/python3
    cloudflared_token: !vault |
        $ANSIBLE_VAULT;1.1;AES256
```

The full Ansible playbook is included at the bottom of this post, but the important bits are in the next sections.

### Docker, but make it IPv6

Docker is IPv4 by default, and on an IPv6-only host that bites you the first time a container tries to reach anything on the public internet. The fix is to set some config in `/etc/docker/daemon.json`:

```json
{
  "ipv6": true,
  "ip6tables": true,
  "default-address-pools": [
    { "base": "172.20.0.0/16", "size": 24 },
    { "base": "fd00:dead:beef::/48", "size": 64 }
  ],
  "dns": ["2606:4700:4700::1111", "2001:4860:4860::8888"]
}
```

Don't ask me about the dead beef, I'm not sure either... Claude came up with it.

### Cloudflare Tunnel, the IPv6-only way

To connect Cloudflare to the VPS, I'm using `cloudflared`. It saves setting up Let's Encrypt, and will allow for some rudimentary load balancing and failover if needed.

`cloudflared` itself is happy on IPv6, but it defaults to IPv4. The undocumented-ish flag you want is `--edge-ip-version 6`. Update the `ExecStart` in the systemd service to include the option:

{% raw %}
```ini
ExecStart=/usr/bin/cloudflared --no-autoupdate tunnel \
  --edge-ip-version 6 run --token {{ cloudflared_token }}
```
{% endraw %}

With the tunnel established, the origin doesn't need an inbound port open for HTTP. UFW can remain at "22/tcp only", use Hetzner's firewall rules to lock that down to your ISP's IP range or something.

### Kamal, and the `localhost:5555` trick

This is the bit that took me the longest to work out.

Kamal needs a container registry it can pull from on the VPS, and unfortunately GitHub Container Registry (ghcr.io) doesn't support IPv6.

The trick is to [set Kamal up to use a local container registry](https://kamal-deploy.org/docs/configuration/docker-registry/#using-a-local-container-registry). Kamal then uses SSH port forwarding to enable the VPS to pull from your local "registry". It also means one less secret!

```yaml
# config/deploy.yml
service: example
image: app
servers:
  web:
    hosts:
      - 2001:0db8:85a3:0000:0000:8a2e:0370:7334
    options:
      add-host: "host.docker.internal:host-gateway" # For the OpenTelemetry collector
proxy:
  ssl: false
  forward_headers: true
  host: example.com
registry:
  server: localhost:5555
env:
  secret:
    - RAILS_MASTER_KEY
builder:
  arch: amd64
ssh:
  user: kamal
```

* `ssl: false` on the proxy because Cloudflare is terminating TLS and the `cloudflared` tunnel between Cloudflare and the VPS is already encrypted
* `forward_headers: true` keeps the original `X-Forwarded-*` headers intact

### Get Honeycomb working with NAT64

It turns out that Honeycomb is IPv4-only.

Thankfully, [NAT64](https://nat64.net/) is the glue. The public NAT64 resolvers synthesise IPv6 addresses for IPv4-only hosts, and your IPv6 network routes them through the NAT64 gateway.

I didn't want *all* DNS and traffic going through NAT64 though, that seems unkind to Kasper, who runs the service for free. Thankfully `systemd-resolved` supports per-domain DNS routing:

```ini
# /etc/systemd/resolved.conf.d/nat64.conf
[Resolve]
DNS=2a00:1098:2b::1 2a01:4f9:c010:3f02::1 2a01:4f8:c2c:123f::1
Domains=~honeycomb.io
```

Telemetry bound for Honeycomb then resolves to a synthetic IPv6 address, routes through the public NAT64 gateway (protected by TLS), and comes out the other side as IPv4.

### Gotchas

A few gotchas that cost me more time than they should have:

* **GitHub Container Registry is IPv4-only**.
* **Docker and cloudflared need IPv6 set explicitly**, and to do so it's a bit clunky.
* **Claude was not especially helpful with this**, it confidently suggested IPv4 fallbacks, NAT64 configurations for the wrong resolver, and invented a Kamal option that didn't exist. I guess the IPv6-only setup is still too niche.
* **Honeycomb not supporting IPv6 was a surprise**, but NAT64 is a good workaround, and as a bonus that service also happens to run on Hetzner.

### The full Ansible playbook

[Send me an email](mailto:samuel.parkinson@hey.com) if you find anything that could be improved!

{% raw %}
```yaml
---
- name: Configure Kamal server
  hosts: all
  become: true
  gather_facts: false
  tasks:
    - name: Configure apt
      tags: [apt]
      block:
        - name: Add Cloudflare apt repository
          ansible.builtin.deb822_repository:
            name: cloudflared
            types: deb
            uris: https://pkg.cloudflare.com/cloudflared
            suites: any
            components: main
            signed_by: https://pkg.cloudflare.com/cloudflare-main.gpg
          register: cloudflared_repo

        - name: Upgrade apt packages
          ansible.builtin.apt:
            update_cache: true
            upgrade: safe
            cache_valid_time: "{{ 0 if cloudflared_repo.changed else 3600 }}"
            lock_timeout: 300

        - name: Install packages
          ansible.builtin.apt:
            name:
              - ufw
              - fail2ban
              - unattended-upgrades
              - curl
              - git
              - ca-certificates
              - cloudflared
              - docker.io
            state: present
            lock_timeout: 300

        - name: Write unattended-upgrades reboot config
          ansible.builtin.copy:
            src: unattended-upgrades-reboot.conf
            dest: /etc/apt/apt.conf.d/52unattended-upgrades-reboot
            owner: root
            group: root
            mode: "0644"
          tags: [apt]

    - name: Configure swap
      tags: [swap]
      block:
        - name: Allocate swap file
          ansible.builtin.command: fallocate -l 2G /swapfile
          args:
            creates: /swapfile
          register: swap_allocated

        - name: Set swap file permissions
          ansible.builtin.file:
            path: /swapfile
            owner: root
            group: root
            mode: "0600"

        - name: Format swap file
          when: swap_allocated.changed
          ansible.builtin.command: mkswap /swapfile

        - name: Add swap to fstab
          ansible.posix.mount:
            path: none
            src: /swapfile
            fstype: swap
            opts: sw
            state: present

        - name: Get active swap devices
          ansible.builtin.command: swapon --show=NAME --noheadings
          register: swap_active
          changed_when: false

        - name: Activate swap file
          ansible.builtin.command: swapon /swapfile
          when: "'/swapfile' not in swap_active.stdout_lines"

        - name: Set swappiness
          ansible.posix.sysctl:
            name: vm.swappiness
            value: "10"
            state: present

    - name: Configure fail2ban
      tags: [fail2ban]
      block:
        - name: Write fail2ban jail config
          ansible.builtin.copy:
            src: fail2ban-jail.local
            dest: /etc/fail2ban/jail.local
            owner: root
            group: root
            mode: "0644"
          notify: Restart fail2ban

        - name: Start fail2ban
          ansible.builtin.systemd_service:
            name: fail2ban
            enabled: true
            state: started

    - name: Configure UFW
      tags: [ufw]
      block:
        - name: Set UFW incoming policy
          community.general.ufw:
            direction: incoming
            policy: deny

        - name: Set UFW outgoing policy
          community.general.ufw:
            direction: outgoing
            policy: allow

        - name: Allow SSH
          community.general.ufw:
            rule: allow
            port: "22"
            proto: tcp

        - name: Enable UFW
          community.general.ufw:
            state: enabled

    - name: Configure nat64
      tags: [nat64]
      block:
        - name: Create resolved drop-in directory
          ansible.builtin.file:
            path: /etc/systemd/resolved.conf.d
            state: directory
            owner: root
            group: root
            mode: "0755"

        - name: Write nat64 config
          ansible.builtin.copy:
            src: nat64-resolved.conf
            dest: /etc/systemd/resolved.conf.d/nat64.conf
            owner: root
            group: root
            mode: "0644"
          notify: Restart systemd-resolved

    - name: Configure cloudflared
      tags: [cloudflared]
      block:
        - name: Install cloudflared service
          ansible.builtin.command: cloudflared service install --token {{ cloudflared_token }}
          args:
            creates: /etc/systemd/system/cloudflared.service
          no_log: true

        - name: Override cloudflared ExecStart
          community.general.ini_file:
            path: /etc/systemd/system/cloudflared.service
            section: Service
            option: ExecStart
            value: "/usr/bin/cloudflared --no-autoupdate tunnel --edge-ip-version 6 run --token {{ cloudflared_token }}"
            no_extra_spaces: true
            owner: root
            group: root
            mode: "0644"
          no_log: true
          notify: Restart cloudflared

        - name: Start cloudflared
          ansible.builtin.systemd_service:
            name: cloudflared
            enabled: true
            state: started

    - name: Configure otelcol-contrib
      tags: [otel]
      block:
        - name: Check installed otelcol-contrib version
          ansible.builtin.command: dpkg-query -W -f='${Version}' otelcol-contrib
          register: otelcol_installed
          changed_when: false
          failed_when: false

        - name: Install otelcol-contrib package
          ansible.builtin.apt:
            deb: "https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v{{ otelcol_version }}/otelcol-contrib_{{ otelcol_version }}_linux_amd64.deb"
          when: otelcol_installed.stdout != otelcol_version
          notify: Restart otelcol-contrib

        - name: Create otelcol-contrib override directory
          ansible.builtin.file:
            path: /etc/systemd/system/otelcol-contrib.service.d
            state: directory
            owner: root
            group: root
            mode: "0755"

        - name: Write otelcol-contrib systemd override
          ansible.builtin.copy:
            dest: /etc/systemd/system/otelcol-contrib.service.d/override.conf
            owner: root
            group: root
            mode: "0644"
            content: |
              [Service]
              User=root
              Group=root
          notify: Restart otelcol-contrib

        - name: Write otelcol-contrib config
          ansible.builtin.template:
            src: otelcol-config.yaml.j2
            dest: /etc/otelcol-contrib/config.yaml
            owner: root
            group: otelcol-contrib
            mode: "0640"
          no_log: true
          notify: Restart otelcol-contrib

        - name: Allow OTLP from Docker networks
          community.general.ufw:
            rule: allow
            src: 172.20.0.0/16
            proto: tcp
            port: "4317,4318"

        - name: Start otelcol-contrib
          ansible.builtin.systemd_service:
            name: otelcol-contrib
            enabled: true
            state: started

    - name: Configure Docker
      tags: [docker]
      block:
        - name: Write Docker daemon config
          ansible.builtin.copy:
            src: docker-daemon.json
            dest: /etc/docker/daemon.json
            owner: root
            group: root
            mode: "0644"
          notify: Restart docker

        - name: Start Docker
          ansible.builtin.systemd_service:
            name: docker
            enabled: true
            state: started

        - name: Flush pending Docker handlers
          ansible.builtin.meta: flush_handlers

        - name: Create Kamal Docker network
          community.docker.docker_network:
            name: kamal
            driver: bridge
            enable_ipv6: true
            state: present

  handlers:
    - name: Restart fail2ban
      ansible.builtin.systemd_service:
        name: fail2ban
        state: restarted

    - name: Restart systemd-resolved
      ansible.builtin.systemd_service:
        name: systemd-resolved
        state: restarted

    - name: Restart cloudflared
      ansible.builtin.systemd_service:
        name: cloudflared
        state: restarted
        daemon_reload: true

    - name: Restart otelcol-contrib
      ansible.builtin.systemd_service:
        name: otelcol-contrib
        state: restarted
        daemon_reload: true

    - name: Restart docker
      ansible.builtin.systemd_service:
        name: docker
        state: restarted
```
{% endraw %}
