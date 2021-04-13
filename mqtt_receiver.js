var mqtt = require('mqtt');
var Topic = 'tele/tasmotaRicaricaNissan/+';
var Broker_URL = 'mqtt://192.168.0.70';

var options = {
	clientId: 'MyMQTT',
	port: 1883,
	keepalive : 60,
    username : "mosq",
    password : "sunnyBroker"
};

var mqttClient  = mqtt.connect(Broker_URL, options);
mqttClient.on('connect', mqtt_connect);
mqttClient.on('reconnect', mqtt_reconnect);
mqttClient.on('error', mqtt_error);
mqttClient.on('message', mqtt_messsageReceived);
mqttClient.on('close', mqtt_close);

function mqtt_connect()
{
    console.log("Connecting MQTT");
    mqttClient.subscribe(Topic, mqtt_subscribe);
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
	mqttClient  = mqtt.connect(Broker_URL, options);
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
    if (message != "Online"){
        var msg = JSON.parse(message);
        console.log(msg);
        if ('ENERGY' in msg){
            console.log("Energia totale:" + msg.ENERGY.Total + "kWh");
        }
    }
}

function mqtt_close()
{
	console.log("Close MQTT");
}
module.exports = mqttClient;