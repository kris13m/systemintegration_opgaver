FROM docker.io/library/postgres:17.4
COPY ./init.sql /docker-entrypoint-initdb.d/