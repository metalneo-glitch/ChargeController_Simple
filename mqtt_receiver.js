var mqtt = require('mqtt');
var Topic = '+/tasmotaRicaricaNissan/+'; //subscribe to all topics
var Broker_URL = 'mqtt://192.168.0.70';
// Acquisizione mqtt
var options = {
	clientId: 'MyMQTT',
	port: 1883,
	keepalive : 60,
    username : "mosq",
    password : "sunnyBroker"
};

var client  = mqtt.connect(Broker_URL, options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect()
{
    console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
}

function mqtt_subscribe(err, granted)
{
    console.log("Subscribed to " + Topic);
    if (err) {console.log(err);}
}

function mqtt_reconnect(err)
{
    console.log("Reconnect MQTT");
    if (err) {console.log(err);}
	client  = mqtt.connect(Broker_URL, options);
}

function mqtt_error(err)
{
    console.log("Error!");
	if (err) {console.log(err);}
}

function after_publish()
{
	//do nothing
}

function mqtt_messsageReceived(topic, message, packet)
{
	//console.log('Topic=' +  topic + '  Message=' + message);
    console.log("message received");
}

function mqtt_close()
{
	console.log("Close MQTT");
}