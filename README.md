# nodes-health
Small application to filter gmc nodes

### What exactly it does
- nodes-health, saves new nodes in `files/bootnodes-not-filtered.json`
- Filters `files/bootnodes-not-filtered.json` for nodes ip/port in the `/files/bootnodes-ip-and-port.json`
- Runs scan for opened and close ports and saves as `files/bootnodes-opened.json' and `files/bootnodes-closed.json' files
- Looks for nodes with opened port in the `files/bootnodes-opened.json' file and finds those nodes in the `files/bootnodes-not-filtered.json` file
- Saves the final result in the `www/music-bootnodes/bootnodes.json`. 

### Deploy

#### Systemd services

```json
[Unit]
Description=Gmc

[Service]
ExecStart=/usr/bin/gmc --rpc --rpcapi="admin,db,eth,net,web3,personal" --rpcport "8545" --rpcaddr "127.0.0.1" --fast --cache=512 --rpccorsdomain "localhost"
User=www-data
Group=www-data

[Install]
WantedBy=default.target
```

```json
[Unit]
Description=Check gmc nodes health and save as bootnodes.json
After=network.target

[Service]
ExecStart=/usr/bin/node .
WorkingDirectory=/var/www/nodes-health/
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nodes-health
User=www-data
Group=www-data
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```
#### Scripts & Cron

```sh
#!/bin/bash
cd /var/www/nodes-health/www/music-bootnodes
git add .
git commit -a -m "autoupdate `date +%F-%T`"
git push
```

```sh
*/5 * * * * su -s /bin/bash www-data -c '/usr/local/bin/autopush'
```
#### Nodes Repository

- [music-bootnodes](https://github.com/cryptofuture/music-bootnodes)



