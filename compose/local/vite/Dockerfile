FROM node:lts

# Create a non-root user
RUN useradd -m appuser
USER appuser

# Add a HEALTHCHECK instruction
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:5173/ || exit 1

WORKDIR /work
COPY /finance_frontend/package.json .

RUN yarn install && yarn cache clean
COPY /finance_frontend/src ./src
COPY /finance_frontend/public ./public
COPY /finance_frontend/tsconfig.json .

CMD [ "yarn", "dev" ]
