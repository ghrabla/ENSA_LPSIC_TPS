#!/bin/bash

set -e

echo "Starting Airflow initialization..."

# Resource check - ported from airflow compose file
echo "Checking system resources..."
one_meg=1048576
mem_available=$(($(getconf _PHYS_PAGES) * $(getconf PAGE_SIZE) / one_meg))
cpus_available=$(grep -cE 'cpu[0-9]+' /proc/stat 2>/dev/null || echo "unknown")

if (( mem_available < 4000 )) 2>/dev/null; then
    echo "⚠️  Warning: Less than 4GB memory available (you have ${mem_available}MB)"
fi

if (( cpus_available < 2 )) 2>/dev/null; then
    echo "⚠️  Warning: Less than 2 CPUs available (you have ${cpus_available})"
fi

# Create necessary directories
mkdir -v -p /opt/airflow/{logs,dags,plugins,config}

# Change ownership of files
chown -R "${AIRFLOW_UID}:0" /opt/airflow/
chown -v -R "${AIRFLOW_UID}:0" /opt/airflow/{logs,dags,plugins,config}

# Wait for database to be ready
echo "Waiting for database to be ready..."
airflow db check

airflow db migrate


# Create admin user (credentials come from environment variables)
echo "Creating admin user..."
airflow users create \
    --username "${_AIRFLOW_WWW_USER_USERNAME:-admin}" \
    --firstname Admin \
    --lastname User \
    --role Admin \
    --email admin@example.com \
    --password "${_AIRFLOW_WWW_USER_PASSWORD:-admin123}"
