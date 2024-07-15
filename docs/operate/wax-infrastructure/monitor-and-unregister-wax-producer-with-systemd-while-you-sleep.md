---
title: Monitor and Unregister WAX Producer with systemd while you Sleep
original: https://bountyblok.medium.com/monitor-and-unregister-wax-producer-with-systemd-while-you-sleep-a97b45a45449
---

![image](https://github.com/user-attachments/assets/3270300b-e1ac-4c20-919a-ec1c42fbc5d6)

## Introduction

Monitoring a block producer for missed rounds is crucial in maintaining the integrity and performance of a blockchain network. Block producers are responsible for validating and producing new blocks, ensuring the network operates smoothly and securely. If a producer misses rounds, it can lead to delays in block creation, potential security vulnerabilities, and a loss of reputation within the network.

In this article, we will set up a system to monitor a WAX block producer and unregister it if it stops signing blocks. We’ll achieve this by creating a bash script and running it as a systemd service.

Before we begin, it’s important to understand why a block producer might miss rounds. There are several potential causes, including datacenter outages, which can disrupt the continuous operation of servers. Power supply issues, such as a triggered fuse (happened to us), can take down essential equipment like routers and networks, leading to connectivity problems.

Additionally, hardware failures, software bugs, or configuration errors can also result in missed rounds.

## OK LET’S GO

When a block producer goes offline they no longer appear in the logs so we can use this as a tracking mechanism to detect downtime.

Special thanks to Mike D | WAXDAO ❤

### Step 1: Create the Bash Script

First, we need to create a bash script that will monitor the nodeos.log file and check if our producer appears in the logs.

1. Create the script /usr/local/bin/monitor_producer.sh:

```
sudo nano /usr/local/bin/monitor_producer.sh 
```

Yes, nano 💀

2. Add the following content to the script:

```
#!/bin/bash

# Use environment variables passed from the systemd service file
LOG_FILE=${LOG_FILE}
PRODUCER_NAME=${PRODUCER_NAME}
UNREG_SCRIPT=${UNREG_SCRIPT}
MAX_COUNT=${MAX_COUNT}

# Initialize a counter for the producer
count=0

# Function to run the unregister script
unregister_producer() {
    echo "$(date): Producer $PRODUCER_NAME missed a round. Running unregister script."
    $UNREG_SCRIPT
    exit 0
}

# Validate log file existence
if [ ! -f "$LOG_FILE" ]; then
    echo "Log file $LOG_FILE not found. Exiting."
    exit 1
fi

tail -f "$LOG_FILE" | while read -r line; do
    if [[ $line == *"producer_plugin"* && $line == *"on_incoming_block"* ]]; then
        ((count++))
        echo "$(date): Current count = $count"

        if [[ $line == *"$PRODUCER_NAME"* ]]; then
            count=0
            echo "$(date): Resetting count, block signed by $PRODUCER_NAME"
        fi

        if [ $count -ge $MAX_COUNT ]; then
            unregister_producer
        fi
    fi
done
```

3. Make the script executable:

```
sudo chmod +x /usr/local/bin/monitor_producer.sh
```

### Step 2: Create the Systemd Service File

Next, we will create a systemd service file to manage the script.

1. Create the service file:

```
sudo nano /etc/systemd/system/monitor_producer.service
```

Still nano 💀💀 

2. Add the following content to the service file:

```
[Unit]
Description=Monitor Producer Script
After=network.target

[Service]
Environment="LOG_FILE=/path/to/nodeos.log"
Environment="PRODUCER_NAME=your_producer_name"
Environment="UNREG_SCRIPT=/path/to/unregprod.sh"
Environment="WAX_API_URL=https://api.waxsweden.org"
Environment="MAX_COUNT=350"
ExecStart=/usr/local/bin/monitor_producer.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

**WAX_API_URL**: You can find a list of WAX API Endpoints here: https://validate.eosnation.io/wax/reports/endpoints.html

**MAX_COUNT**: 350 lines rationale is because there’s about 20 other Block producers who will produce 12 blocks each in 1 round which ~= 240 lines in the logs. So 350 is just a number larger than 240 but less than 480 which implies that we want to unregister after 1 round missed.

If you want to only unregprod after 3 rounds are missed you would need to increase this number to something higher like 750+.

### Step 3: Enable and Start the Service

After creating the service file, we need to enable and start the service.

1. Reload systemd and start the new service:

```
sudo systemctl daemon-reload
sudo systemctl enable monitor_producer.service
sudo systemctl status monitor_producer.service
```

2. View the service logs in real-time:

```
sudo journalctl -u monitor_producer.service -f
```

### Step 4: Unregprod Script

At this point you are listening to logs for missed rounds but now we need to setup the unregprod script.

This script will do 2 things: unlock your cleos and unregister your producer.

1. Create the script:

```
sudo nano /usr/local/bin/unregprod.sh
```

2. Add the following content to the script:

```
#!/bin/bash

# Read the wallet password from a secure file
WALLET_PASSWORD=$(cat /path/to/wallet_password.txt)
WAX_API_URL=${WAX_API_URL}
PRODUCER_NAME=${PRODUCER_NAME}

# Unlock the wallet
cleos wallet unlock --password $WALLET_PASSWORD

# Unregister the producer
cleos --url $WAX_API_URL system unregprod $PRODUCER_NAME
```

Ensure that only the owner (the user running the service) can read the wallet pwd file — for this example we set it to root:

```
sudo chown root:root /usr/local/bin/wallet_password.txt
sudo chmod 600 /usr/local/bin/wallet_password.txt
```

3. Make the script executable:

```
sudo chmod +x /usr/local/bin/unregprod.sh
```

## Other Solutions

There are other tools available such as unregbot by sentnl.io, another WAX Mainnet Block Producer. [Unregbot](https://github.com/ankh2054/unregbot) is an automated producer unregistration tool that monitors missing blocks for mainnet and testnet producers. If missing rounds are detected, it will automatically unregister the producer and optionally send a message via Pushover. It can be run via Docker or by executing the JavaScript code, requiring a configured unregistration private key (not the owner or active key).

You can find out more here: https://github.com/ankh2054/unregbot ❤

## Summary

By following these steps, you will set up a systemd service that monitors your WAX block producer and unregisters it if it stops signing blocks.

The wallet password is securely stored in a file with restricted permissions and read by the script, ensuring better security and maintainability.

This setup ensures if your block producer is no longer signing or producing blocks it will go ahead and unregister from the top 21 to minimize the network impact and give you and your team time to figure out the cause.

Feel free to adjust the paths and variables to fit your specific environment and requirements.

