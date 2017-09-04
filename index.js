const amqp = require('amqplib/callback_api');
const async = require('async');
const uuid = require('uuid/v4');
const url = require('url');

var global_channel;

exports.setup = function(url_string, callback) {
    
    const uri = url.parse(url_string);

    var connect = function(cb) {
        amqp.connect(url_string, { servername: uri.hostname }, function(err, conn) {
            cb(err, conn);
        });
    };

    var open_channel = function(conn, cb) {
        conn.createChannel(function(err, ch) {
            cb(err, ch);
        });
    };

    async.waterfall([connect, open_channel], function(err, channel) {
        if (err) console.log(err);
        if (channel) global_channel = channel;
        callback(err);
    });
};

exports.callExchange = function(exchange_name, route, string_body, timeout, callback) {
    if (!global_channel) { console.log('RabbitRPC channel is not ready'); return; }
    global_channel.assertQueue('', { exclusive: true }, function(err, q) {

        let corr_id = uuid();
        var done = false;
        var timeoutHandle;

        global_channel.consume(q.queue, function(msg) {
            if (msg.properties.correlationId == corr_id && !done) {
                callback(null, msg.content.toString());
                done = true;
                if (timeoutHandle) clearTimeout(timeoutHandle);
            }
        }, { noAck: true });

        global_channel.publish(exchange_name, route, new Buffer(string_body), { correlationId: corr_id, replyTo: q.queue, contentType: "text/plain" });
        timeoutHandle = setTimeout(function() {
            if (!done) {
                callback({ code: 502, message: 'Request time out'});
                done = true;
            }
        }, timeout || 5000);
    });
};

exports.channel = global_channel;