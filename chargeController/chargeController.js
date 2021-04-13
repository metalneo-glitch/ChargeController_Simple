const STANDBY_POWER = 100;
const MAX_POWER = 3400;
const CAR_CAPACITY = 40.0; //kWh
var enableDebug = true;
debug = {};

function ChargeController(){
    this.energyTotalVal;
    this.energyStartChargeVal = 0;
    this.energyStopChargeVal = 0;
    this.update = function(energyVal){
        this.energyTotalVal = energyVal;
    }
    this.startCharge = function(percToCharge){
        this.energyStartChargeVal = this.energyTotalVal;
        this.energyCharged = 0;
        this.energyStopChargeVal = Number(CAR_CAPACITY / 100.0 * percToCharge + this.energyStartChargeVal);
    }
    this.getEnergyVal = function(){
        return this.energyTotalVal;
    }
    this.stopCharge = function(){
        this.energyStopChargeVal = this.energyTotalVal;
        this.energyCharged = this.energyTotalVal - this.energyStartChargeVal;
    }
    this.getStatus = function(){
        if(this.energyTotalVal >= this.energyStopChargeVal){
            return "Charged";
        }
        else{
            return "Charging";
        }
    }
    this.getEnergyToCharge = function(){
        return this.energyStopChargeVal - this.energyStartChargeVal;
    }
    this.getChargedEnergy = function(){
        return this.energyTotalVal - this.energyStartChargeVal;
    }
    this.getRemainingEnergy = function(){
        return this.energyStopChargeVal - this.energyTotalVal;
    }
    this.getRemaingTime = function(powerVal){
        let timeLeft = new Date((this.getRemainingEnergy() * 1000) / powerVal * 3600000);
        return timeLeft.getHours()-1 + " ore " + timeLeft.getMinutes() + " min";
    }
    this.getEnergyTotal = function(){
        return this.energyTotalVal;
    }
    this.getEnergyStartChargeVal =  function(){
        return this.energyStartChargeVal;
    }
    this.getEnergyStopChargeVal =  function(){
        return this.energyStopChargeVal;
    }
}
let chargeController = context.get('chargeController') || new ChargeController();



if (msg.topic == "tele/tasmotaContatore/SENSOR"){
    if(msg.payload.ENERGY.Power > MAX_POWER){
        msg.payload = 0;
        msg.rce = "Supero potenza di " + (msg.payload.ENERGY.Power - MAX_POWER) + "W";
        chargeController.stopCharge();
        node.send(msg);
    }
}

if (msg.topic == "tele/tasmotaRicaricaNissan/SENSOR"){
    chargeController.update(msg.payload.ENERGY.Total);
    powerMonitor.update(msg.payload.ENERGY.Power);
    msg2 = {};
    if (chargeController.getStatus() == "Charged" && powerMonitor.getStatus() != "Off"){
        chargeController.stopCharge();
        msg.payload = 0;
        msg.rce = "Ricarica completata (" + chargeController.getChargedEnergy() + "kWh)";
        msg2 = {
            "remainingTime" : "Ricarica terminata",
            "remainingEnergy" : "0",
            "energyToCharge" : 0,
            "percentageDone" : 100
        };
        return [{}, msg2];
    }
    if (chargeController.getStatus() == "Charging"){
        msg2 = {
            "remainingTime" : chargeController.getRemaingTime(powerMonitor.getPower()),
            "remainingEnergy" : chargeController.getRemainingEnergy(),
            "energyToCharge" : chargeController.getEnergyToCharge(),
            "percentageDone" : 0
        };
        return [{}, msg2];
    }
    if (enableDebug){
        debug = {
            "stopCharge" : chargeController.getEnergyStopChargeVal(),
            "startCharge" : chargeController.getEnergyStartChargeVal(),
            "energyTotal" : chargeController.getEnergyTotal()
        }
        return [{}, msg2, debug];
    }
    else{
        return [{}, msg2, {}];
    }
}

let timedOutActivation = context.get('timedOutActivation') || 0;
if (msg.topic == "percToCharge"){
    if (msg.payload > 0){
        if (timeSlotMonitor.isEconomyTime()){
            chargeController.startCharge(msg.payload);
            msg.payload = 1;
            msg.rce = "Avvio ricarica di " + chargeController.getEnergyToCharge() + "kWh";
        }
        else{
            msg.rce = "Ricarica prenotata. Inserzione tra " + timeSlotMonitor.getRedeableRemaingTime();
            msg.payload = 0;
            timedOutActivation = setTimeout(function(){
                chargeController.startCharge(msg.payload);
                msg.payload = 1;
                msg.rce = "Avvio ricarica prenotata di " + chargeController.getEnergyToCharge() + "kWh";
                node.send(msg);
            }, timeSlotMonitor.getRemaingTime());
        }
    }
    else{
        chargeController.stopCharge();
        clearTimeout(timedOutActivation);
        msg.rce = "Ricarica annullata";
    }
    node.send(msg);
}

if (msg.topic == "forceCharge"){
    chargeController.startCharge(100);
    msg.payload = 1;
    msg.rce = "Avvio ricarica forzata";
    node.send(msg);
}

module.exports = chargeController;