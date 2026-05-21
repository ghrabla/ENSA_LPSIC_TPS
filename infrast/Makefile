.PHONY: up down restart build build-no-cache init logs php nginx postgres mariadb redis mysql psql redis-cli hosts help data-init data-up data-down data-setup

DATA_CORE_PATH=$(realpath ../data-core)
DATA_COMPOSE = ./data/docker-compose.yml

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Start all containers (except data-core)
	docker compose up -d
	docker compose -f odoo/docker-compose.yml up -d

down: ## Stop and remove all containers
	docker compose down
	docker compose -f odoo/docker-compose.yml down

restart: ## Restart all containers
	docker compose restart

build: ## Build all containers
	docker compose build

build-no-cache: ## Build all containers without cache
	docker compose build --no-cache

init: hosts ## Initialize the development environment
	docker compose build
	docker compose up -d
	@echo "Development environment is ready!"

logs: ## View container logs
	docker compose logs -f

php: ## Enter PHP container
	docker compose exec php bash

nginx: ## Enter Nginx container
	docker compose exec nginx sh

postgres: ## Enter Postgres container
	docker compose exec postgres bash

mariadb: ## Enter MariaDB container
	docker compose exec mariadb bash

redis: ## Enter Redis container
	docker compose exec redis bash

mysql: ## Enter MySQL CLI
	docker compose exec mariadb mysql -udone -pdone

psql: ## Enter PostgreSQL CLI
	docker compose exec postgres psql -U done -d done

redis-cli: ## Enter Redis CLI
	docker compose exec redis redis-cli

odoo: ## Enter Odoo container
	docker exec -it done_odoo16 bash

airflow: ## Enter Airflow container
	docker exec -it done_airflow bash

data-up: ## Start Airflow services
	DATA_CORE_PATH=$(DATA_CORE_PATH) docker compose -f $(DATA_COMPOSE) up -d

data-init: ## Initialize/recreate Airflow services (also sets up .env if needed)
	@if [ ! -f "$(DATA_CORE_PATH)/airflow/.env" ]; then \
		cp $(DATA_CORE_PATH)/airflow/.env.example $(DATA_CORE_PATH)/airflow/.env; \
		echo "Created .env file in data-core/airflow from .env.example"; \
		echo "Please review and modify $(DATA_CORE_PATH)/airflow/.env as needed"; \
	else \
		echo ".env file already exists in data-core/airflow"; \
	fi
	@DATA_CORE_PATH=$(DATA_CORE_PATH) docker compose -f $(DATA_COMPOSE) up --force-recreate --build -d

data-down:
	@DATA_CORE_PATH=$(DATA_CORE_PATH) docker compose -f $(DATA_COMPOSE) down -v


hosts: ## Update /etc/hosts with local domains
	@echo "Updating hosts file... (you may be asked for sudo password)"
	@sudo ./scripts/update-hosts.sh

re: init down up
