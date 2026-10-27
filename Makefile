# Makefile conecta-senior-front
.PHONY: build publish up down logs run-dev

build:
	docker build -t conecta-senior-front:latest .

publish:
	docker-compose up -d --build front

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

run-dev:
	docker compose up front-dev --build

