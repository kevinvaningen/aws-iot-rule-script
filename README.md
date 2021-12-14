
# AWS IOT Rules insert script

This script uses the [https://www.npmjs.com/package/aws-cli-js] library.  It works nicely with exported AWS sessions from your environment variables, like when using [https://github.com/99designs/aws-vault].

## Background and documentation
Read my blog on [https://kevin-van-ingen.medium.com/managing-aws-iot-rules-through-cli-scripts-aa8d37fd3e46]

## Environment vars
The script uses five environment params as strings.

Setting environment variables can be performed like this:

```
export TIMESTREAM_INSERT_ROLE=
export TIMESTREAM_ERROR_LOG_ROLE=
export TIMESTREAM_DB_NAME=
export TIMESTREAM_TABLE_NAME=
export TIMESTREAM_ERROR_LOG_GROUP=
```


