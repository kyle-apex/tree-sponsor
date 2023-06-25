FROM gitpod/workspace-mysql
COPY ./prisma/docker-init.sql /docker-entrypoint-initdb.d/