# GITS RabbitRPC Client

by: [kumangxxx](https://github.com/kumangxxx)
visit the [repo](https://github.com/kumangxxx/gits-rabbit-rpc-client)

This is a simple helper library to to call RabbitMQ RPC API. It make use of RabbitMQ 'topic' exchange.

# Installation
```
$ npm install --save gits-rabbit-rpc
```

# How to use
```
const rabbitrpc = require('gits-rabbit-rpc');
...
rabbitrpc.setup('amqps://user:password@host', (err) => {
    if (err) console.log(err);
    else console.log('connected to rabbit rpc');

    console.log('calling api');
    rabbitrpc.callExchange(exchange_name, routing_key, json_parameter_string, timeout, (err, result) => {
        if (err) console.log(err);
        if (result) console.log(result);
    });
});

```