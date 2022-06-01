.PHONY: help show-container-logs build-container run-container run-services create-network clean run-local
help:
	@echo "show-container-logs - display logs for containers."
	@echo "run-local - Local environment setup with demo-app"
	@echo "clean - cleans everything."

show-container-logs:
	@docker-compose logs -f

build-container:
	@echo "Building container..."
	@docker-compose build demo-app
	@echo "Done"

run-container: build-container
	@echo "Running demo-app..."
	@docker-compose up -d demo-app

run-services: run-container
	@echo "Starting demo-app..."

create-network:
	@echo "Creating network..."
	@docker network create arcana
	@echo "Done"

clean:
	@echo "Cleaning..."
	@docker-compose down
	@echo "Cleaned"

run-local:
	@(make create-network && make run-services) || make run-services
