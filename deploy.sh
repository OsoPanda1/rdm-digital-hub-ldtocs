#!/bin/bash
# RDM Digital Hub — Quick Deploy
# Usage: ./deploy.sh [--build] [--migrate] [--restart] [--all]
cd "$(dirname "$0")/deploy"
exec bash scripts/deploy.sh "$@"
