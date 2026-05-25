#!/bin/sh
set -e

echo "DATABASE_URL_PRODUCT=$DATABASE_URL"

# Run migrations
npx prisma migrate deploy

# Run seed if user-service or product-service
if [ "$SERVICE_NAME" = "user-service" ] || [ "$SERVICE_NAME" = "product-service" ]; then
  npx prisma db seed
fi

# Start the application
exec "$@"
