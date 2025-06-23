# ---- Build Stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm ci; fi

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Remove dev dependencies to reduce size
RUN npm prune --production && yarn cache clean || true

# ---- Runtime Stage ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json
COPY credentials.json /app/credentials.json

# Copy only necessary files from build stage
COPY --from=build /app/package.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]
