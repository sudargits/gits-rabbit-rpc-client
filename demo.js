'use strict';

var rabbitrpc = require('./index');

rabbitrpc.setup('amqps://admin:VHLNRBHTEOUASKOY@portal-ssl1078-1.bmix-dal-yp-151044e0-030b-4406-8efc-84656da093b9.nancys-us-ibm-com.composedb.com:19324/bmix-dal-yp-151044e0-030b-4406-8efc-84656da093b9', (err) => {
    if (err) console.log(err);
    else console.log('connected to rabbit rpc');

    console.log('calling api');
    rabbitrpc.callExchange('api', 'user.api.all', '', 10000, (err, result) => {
        if (err) console.log(err);
        if (result) console.log(result);
    });
});