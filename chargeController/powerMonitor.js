/**
 * Power Monitor
 * * Monitora la potenza per determinare lo stato di ricarica
 */

function PowerMonitor(){
    this.power = 0.0;
    this.update = function(powerVal){
        this.power = powerVal;
    }
    this.getPower = function(){
        return this.power;
    }
    this.getStatus = function(){
        if(this.power > MAX_POWER){
            return "Overload";
        }
        else if(this.power >= STANDBY_POWER){
            return "Charging";
        }
        else if (this.power == 0){
            return "Off";
        }
        else if (this.power < STANDBY_POWER){
            return "Standby";
        }
    }
}

module.exports = PowerMonitor;