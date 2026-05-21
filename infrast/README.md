# Mason

## Requirements

- Docker and Docker Compose
- Make utility
- Git
- sudo privileges (for hosts file updates)

## Available Services

- **PHP**: 8.3 with FPM
- **Nginx**: Latest stable Alpine
- **PostgreSQL**: 15
- **MariaDB**: 10.4
- **Redis**: Latest
- **MailHog**: For email testing

### Data Environment (Optional)
- **Apache Airflow**: Workflow orchestration and data pipeline management
- **PostgreSQL**: Airflow metadata database (internal only)
- **Redis**: Celery broker for distributed task execution
- **Local Warehouse DB**: Additional PostgreSQL instance for data warehousing
- **Local Analytics DB**: Additional PostgreSQL instance for analytics

## Ports

- Web: 80
- PostgreSQL: 5432
- MariaDB: 3306
- MailHog: 1025 (SMTP), 8025 (Web UI)

### Data Environment Ports
- Airflow: 4000
- Flower (Celery monitoring): 5555
- Data PostgreSQL: 5433 (internal)

## Useful Commands

```bash
make up          # Start containers
make down        # Stop containers
make restart     # Restart containers
make logs        # View logs
make php         # Access PHP container
make mysql       # Access MariaDB CLI
make psql        # Access PostgreSQL CLI
make redis-cli   # Access Redis CLI
make hosts       # Update /etc/hosts with local domains
```

### Data Environment Commands
```bash
make data-init   # Initialize/recreate data environment
make data-up     # Start data services
make data-down   # Stop data services

# To enable Flower monitoring, use:
# docker compose -f data/docker-compose.yml --profile flower up -d
```

## Quick Start

1. Clone the repository
2. Run `make init` (this will build containers, start services, and configure hosts)
3. Access your local domains through the browser

## Data Environment
A development data pipeline environment was added to simplify usage during development. This includes setting up Airflow using the official Docker Compose configuration with additional local databases for warehousing and analytics.

### Side-by-side clone layout

Place `mason` and `data-core` next to each other on disk:

```text
~/w/repos/
  mason/
  data-core/
```

The data environment includes:
- **Airflow**: Main workflow orchestration
- **PostgreSQL**: Airflow metadata database (airflow/airflow)
- **Redis**: Celery broker for distributed tasks
- **Local Warehouse DB**: Additional PostgreSQL for data warehousing (warehouse_user/warehouse_pass)
- **Local Analytics DB**: Additional PostgreSQL for analytics (analytics_user/analytics_pass)
- **Flower**: Optional Celery monitoring interface
```

### To use the data pipelines:

1. Initialize once (creates `.env` and builds image):
   ```bash
   make data-init
   ```
2. Start/stop thereafter:
   ```bash
   make data-up
   make data-down
   ```
3. Access Airflow at http://localhost:4000 (admin/admin123)

## Register `mason` Commands Globally

Add the following to your `.bashrc` or `.zshrc` file:

```bash
mason() {
    local ORIGINAL_DIR=$(pwd)
    
    local MASON_DIR="$HOME/done/mason"
    
    if [ ! -d "$MASON_DIR" ]; then
        echo "Error: Mason directory not found at $MASON_DIR"
        return 1
    fi
    
    if [ ! -f "$MASON_DIR/Makefile" ]; then
        echo "Error: Makefile not found at $MASON_DIR/Makefile"
        return 1
    fi
    
    cd "$MASON_DIR"
    
    if [ $# -eq 0 ]; then
        echo "Usage: mason <make-command>"
        echo "Example: mason up"
        make help 2>/dev/null || echo "No help target defined in Makefile"
    else
        make "$@"
    fi
    
    cd "$ORIGINAL_DIR"
}

if [ -n "$ZSH_VERSION" ]; then
    compdef _make mason
elif [ -n "$BASH_VERSION" ]; then
    complete -F _make mason
fi
```

Then reload your configuration using: `source ~/.bashrc` or `source ~/.zshrc`.

After configuration, you can use commands like:
```bash
mason up       # Start containers from any directory
mason down     # Stop containers from any directory
mason hosts    # Update hosts file from any directory
```

## Notes

- The `make init` command automatically updates your hosts file (requires sudo)
- You can manually update hosts at any time using `make hosts`
- All domain configurations are managed through nginx configuration files in `docker/nginx/conf.d/`
- Data environment runs independently from main services and can be started/stopped separately
