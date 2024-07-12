#!/usr/bin/env bash

# URL de Elasticsearch
ELASTIC_URL="http://elastic:changeme@elasticsearch:9200"

# Nombre del índice a verificar
INDEX_NAME="fondos"

# Comprobar si el índice existe
curl -X GET "$ELASTIC_URL/$INDEX_NAME?pretty"
