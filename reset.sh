#! /bin/bash

mongo textarray --eval "db.dropDatabase()"

redis-cli FLUSHDB