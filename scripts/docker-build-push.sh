#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${1:-todo-app}"
TAG="${2:-latest}"

echo "==> Building Docker image: ${IMAGE_NAME}:${TAG}"
docker build -t "${IMAGE_NAME}:${TAG}" .

echo "==> Tagging and pushing Docker image..."
if [ -n "${DOCKER_HUB_USER:-}" ]; then
  docker tag "${IMAGE_NAME}:${TAG}" "${DOCKER_HUB_USER}/${IMAGE_NAME}:${TAG}"
  docker push "${DOCKER_HUB_USER}/${IMAGE_NAME}:${TAG}"
  echo "==> Successfully pushed ${DOCKER_HUB_USER}/${IMAGE_NAME}:${TAG}"
else
  echo "==> DOCKER_HUB_USER not set. Image built locally as ${IMAGE_NAME}:${TAG}"
fi
