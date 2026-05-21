#!/bin/bash
if [ "$EUID" -ne 0 ]; then 
    echo "Please run with sudo"
    exit 1
fi
NGINX_CONF_DIR="./docker/nginx/conf.d"
TEMP_HOSTS=$(mktemp)
cp /etc/hosts $TEMP_HOSTS
for conf_file in $NGINX_CONF_DIR/*.conf; do
    server_name=$(grep "server_name" "$conf_file" | awk "{print \$2}" | sed "s/;//")
    if [ ! -z "$server_name" ]; then
        if ! grep -q "$server_name" /etc/hosts; then
            echo "127.0.0.1 $server_name" >> $TEMP_HOSTS
        fi
    fi
done
mv $TEMP_HOSTS /etc/hosts
sudo chmod 644 /etc/hosts
echo "Hosts file updated successfully!"
rm -f $TEMP_HOSTS 2>/dev/null
