class Thermostat {

  constructor(temperature) {
    this.DEFAULT_TEMPERATURE = 20;
    this.temperature = this.DEFAULT_TEMPERATURE;
    this.powerSavingMode = true;
    this.MINIMUM_TEMPERATURE = 10;
    this.MAX_LIMIT_PSM_ON = 25;
    this.MAX_LIMIT_PSM_OFF = 32;
  }

  getCurrentTemperature() {
    return this.temperature;
  }

  up() {
    if(this.isMaximumTemperature()) {
      return;
    }
    this.temperature += 1
  }

  isMaximumTemperature() {
    if(this.isPowerSavingModeOn() ===false) {
      return this.temperature === this.MAX_LIMIT_PSM_OFF;
    }
    return this.temperature === this.MAX_LIMIT_PSM_ON;
  }

  down() {
    if(this.isMinimumTemperature()) {
      return;
    }
    this.temperature -= 1
  }
  
  isMinimumTemperature() {
    return this.temperature === this.MINIMUM_TEMPERATURE;
  }

  isPowerSavingModeOn() {
    return this.powerSavingMode === true;
  }

  switchPowerSavingModeOff() {
    this.powerSavingMode = false;
  }

  switchPowerSavingModeOn() {
    this.powerSavingMode = true;
  }

  resetTemperature() {
    this.temperature = this.DEFAULT_TEMPERATURE;
  }
};