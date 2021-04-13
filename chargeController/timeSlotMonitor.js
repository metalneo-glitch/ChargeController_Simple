/**
 * Time Slot Monitor
 * * Determina in quale fascia oraria di energia elettrica ci si trova.
 * * F1 - LUN-VEN  08:00-19:00
 * * F2 - LUN-VEN   07:00-08:00 19:00-23:00
 * *      SAB       07:00-23:00
 * * F3 - LUN-SAB   23:00-07:00
 * *      DOM       00:00-23:59
 * *      FESTIVI     00:00-23:59     
 */

function TimeSlotMonitor(){
    this.currentDate;
    this.triggerDate;
    this.remainingTime;
    this.update = function(){
        this.currentDate = new Date();
        this.triggerDate = new Date();
        this.triggerDate.setHours(23);
        this.triggerDate.setMinutes(0);
        this.remainingTime = new Date(this.triggerDate - this.currentDate);
    }
    this.isEconomyTime = function(){
        return (this.currentDate > this.triggerDate || this.currentDate.getDay() == 0); //Week start on Sunday/0. 
    }
    this.getRemaingTime = function(){
        return this.remainingTime.getTime();
    }
    this.getRedeableRemaingTime = function(){
        return this.remainingTime.getHours()-1 + " ore e " + this.remainingTime.getMinutes() + " minuti";
    }
    this.getTriggerDate = function(){
        return this.triggerDate;
    }
}

timeSlotMonitor.update();
module.exports = TimeSlotMonitor;