## Securing a Linux Server

Some basic tasks to run through when logging into a new server. There is plenty more that can be done to harden a server but you need to start somewhere.

1. Disable root login over SSH
2. Disable password login over SSH
3. Change SSH port
4. Setup IPTables
5. Install fail2ban

> You should now have a server that is locked down and ready to use, however this is not the end of your security journey. Stay on top of updates (and always test them in a non-production environment first), always close ports that you don’t need, check your logs regularly, and know your servers inside-and-out.
