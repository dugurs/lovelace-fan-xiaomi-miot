const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

function hasConfigOrEntityChanged(element, changedProps) {
  if (changedProps.has("config")) {
    return true;
  }

  const oldHass = changedProps.get("hass");
  if (oldHass) {
    return (
      oldHass.states[element.config.entity] !== element.hass.states[element.config.entity]
    );
  }

  return true;
}

class fanXiaomiMiotCard extends LitElement {
  static get properties() {
    return {
      config: {},
      hass: {}
    };
  }
  
  btns = {};
  models = {};
  mapping = {};
  states = {};
  hacard = '';

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define entity");
    }
    this.config = config;
  }

  async connectedCallback() {
    super.connectedCallback()
    // const state = this.hass.states[this.config.entity];
    // await this.loadJSON(`/local/custom-lovelace/lovelace-fan-xiaomi-miot/${state.attributes.model}.json`); 
    await this.setBtns();
  }

  async setBtns() {
    
    this.models = {
      dmaker_fan_p220: {
        power : {
          prop: 'fan.on',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:fan',
          label: 'percentage'
        },
        down: {
          prop: 'percentage',
          value: 1,
          min: 25,
          max: 100,
          step: 25,
          icon: 'mdi:chevron-down',
          backward: true
        },
        up: {
          prop: 'percentage',
          value: 1,
          min: 25,
          max: 100,
          step: 25,
          icon: 'mdi:chevron-up',
        },
        slider: {
          prop: 'percentage',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 1
        },
        mode: {
          prop: 'fan.mode',
          value: [0,1,2,3],
          state: ['Straight Wind', 'Natural Wind', 'Smart', 'Sleep'],
          icon: ['mdi:weather-windy', 'mdi:leaf', 'mdi:fan-auto', 'mdi:power-sleep']
        },
        off_delay_time: {
          // prop: {
          //   entity_id: this.config.entity.replace(/^fan\./i, 'number.').replace(/_fan$/i, '_off_delay_time'),
          //   siid: 3,
          //   piid: 1
          // },
          prop: 'off_delay_time',
          value: this.config.off_delay_time ?? [0,30,60,120,180,240,300,360,420,480],
          icon: 'mdi:camera-timer'
        },
        swing_down: {
          prop: {
            siid: 8,
            piid: 2
          },
          value: 2,
          step: 0,
          icon: 'mdi:chevron-down',
        },
        swing_up: {
          prop: {
            siid: 8,
            piid: 2
          },
          value: 1,
          step: 0,
          icon: 'mdi:chevron-up',
        },
        swing_left: {
          prop: {
            siid: 8,
            piid: 3
          },
          value: 1,
          step: 0,
          icon: 'mdi:chevron-left',
        },
        swing_right: {
          prop: {
            siid: 8,
            piid: 3
          },
          value: 2,
          step: 0,
          icon: 'mdi:chevron-right',
        },
        hswing_angle: {
          // prop: {
          //   entity_id: this.config.entity.replace(/^fan\./i, 'select.').replace(/_fan$/i, '_horizontal_swing_included_angle'),
          //   siid: 2,
          //   piid: 5
          // },
          prop: 'horizontal_swing_included_angle-2-5',
          value: [30,60,90,120,140],
          icon: 'mdi:arrow-left-right',
          // click: 'hswing',
          // dblclick: 'hswing_angle'
        },
        hswing: {
          prop: 'fan.horizontal_swing',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:arrow-left-right'
        },
        vswing_angle: {
          // prop: {
          //   entity_id: this.config.entity.replace(/^fan\./i, 'select.').replace(/_fan$/i, '_vertical_swing_included_angle'),
          //   siid: 2,
          //   piid: 8
          // },
          prop: 'vertical_swing_included_angle-2-8',
          value: [35,65,95],
          icon: 'mdi:arrow-up-down',
          // click: 'vswing',
          // dblclick: 'vswing_angle'
        },
        vswing: {
          prop: 'fan.vertical_swing',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:arrow-up-down'
        },
        temperature: {
          // prop: {
          //   entity_id: this.config.entity.replace(/^fan\./i, 'sensor.').replace(/_fan$/i, '_temperature'),
          // },
          prop: 'temperature-9-1',
          value: 1,
          icon: 'mdi:thermometer',
          click: ''
        },
        humidity: {
          // prop: {
          //   entity_id: this.config.entity.replace(/^fan\./i, 'sensor.').replace(/_fan$/i, '_relative_humidity')
          // },
          prop: 'relative_humidity-9-2',
          value: 1,
          icon: 'mdi:water-percent',
          click: ''
        },
        alarm: {
          // prop: {
          //   entity_id: this.config.entity.replace(/^fan\./i, 'switch.').replace(/_fan$/i, '_alarm'),
          // },
          prop: 'alarm',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:volume-off','mdi:volume-high']
        },
        locked: {
          // prop: {
          //   entity_id: this.config.entity.replace(/^fan\./i, 'switch.').replace(/_fan$/i, '_physical_control_locked')
          // },
          prop: 'physical_controls_locked',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:lock-open-variant','mdi:lock-open']
        },
        auto_on: {
          prop: {
            siid: 8,
            piid: 4
          },
          // prop: 'dm_service.on',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:fan-auto',
          label: 'dm_service.temperature'
        },
        auto_on_temp_minus: {
          prop: 'dm_service.temperature',
          value: 15,
          min: 15,
          max: 36,
          step: 1,
          icon: 'mdi:chevron-down',
          backward: true
        },
        auto_on_temp_plus: {
          prop: 'dm_service.temperature',
          value: 15,
          min: 15,
          max: 36,
          step: 1,
          icon: 'mdi:chevron-up',
        },
        auto_off: {
          prop: 'dm_service.off',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:fan-off',
          label: 'dm_service-8.temperature'
        },
        auto_off_temp_minus: {
          prop: 'dm_service-8.temperature',
          value: 14,
          min: 14,
          max: 35,
          step: 1,
          icon: 'mdi:chevron-down',
          backward: true,
        },
        auto_off_temp_plus: {
          prop: 'dm_service-8.temperature',
          value: 14,
          min: 14,
          max: 35,
          step: 1,
          icon: 'mdi:chevron-up',
        },
      },
      
      dmaker_fan_p33: {
        power : {
          prop: 'fan.on',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:fan',
          label: 'percentage'
        },
        // speed: {
        //   prop: 'fan.fan_level',
        //   value: [1,2,3,4],
        //   icon: ['mdi:numeric-1-box-outline','mdi:numeric-2-box-outline','mdi:numeric-3-box-outline','mdi:numeric-4-box-outline']
        // },
        down: {
          prop: 'fan.fan_level',
          value: 1,
          min: 1,
          max: 4,
          step: 1,
          icon: 'mdi:chevron-down',
          backward: true
        },
        up: {
          prop: 'fan.fan_level',
          value: 1,
          min: 1,
          max: 4,
          step: 1,
          icon: 'mdi:chevron-up',
        },
        slider: {
          prop: 'percentage',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 1
        },
        mode: {
          prop: 'fan.mode',
          value: [0,1],
          state: ['Straight Wind', 'Natural Wind'],
          icon: ['mdi:weather-windy', 'mdi:leaf']
        },
        off_delay_time: {
          prop: 'off_delay_time',
          value: this.config.off_delay_time ?? [0,30,60,120,180,240,300,360,420,480],
          icon: 'mdi:camera-timer'
        },
        swing_left: {
          // prop: 'motor-controller',
          prop: { siid: 6, piid: 1 },
          value: 1,
          icon: 'mdi:chevron-left',
        },
        swing_right: {
          // prop: 'motor-controller',
          prop: { siid: 6, piid: 1 },
          value: 2,
          icon: 'mdi:chevron-right',
        },
        hswing_angle: {
          prop: 'horizontal_swing_included_angle-2-5',
          value: [30,60,90,120,140],
          icon: 'mdi:arrow-left-right',
          // click: 'hswing',
          // dblclick: 'hswing_angle'
        },
        hswing: {
          prop: 'fan.horizontal_swing',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:arrow-left-right'
        },
        alarm: {
          prop: 'alarm',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:volume-off','mdi:volume-high']
        },
        locked: {
          prop: 'physical_controls_locked',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:lock-open-variant','mdi:lock-open']
        },
      },
      
      dmaker_fan_p45: {
        power: {
          prop: 'fan.on',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:fan',
          label: 'percentage'
        },
        down: {
          prop: 'fan.speed_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-down',
          backward: true
        },
        up: {
          prop: 'fan.speed_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-up',
        },
        slider: {
          prop: 'percentage',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 1
        },
        mode: {
          prop: 'fan.mode',
          value: [0,1,2],
          state: ['Straight Wind', 'Natural Wind', 'Sleep'],
          icon: ['mdi:weather-windy', 'mdi:leaf', 'mdi:power-sleep']
        },
        off_delay_time: {
          prop: 'off_delay_time',
          value: this.config.off_delay_time ?? [0,30,60,120,180,240,300,360,420,480],
          icon: 'mdi:camera-timer'
        },
        swing_left: {
          // prop: {
          //   service: 'select',
          //   service_value: 'select_option',
          //   data: {
          //     entity_id: this.config.entity.replace(/^fan\./i, 'number.').replace(/_fan$/i, '_horizontal_angle'),
          //     option: '-7'
          //   }
          // },
          prop: {
            siid: 2,
            aiid: 2,
            throw: false
          },
          value: true,
          icon: 'mdi:chevron-left',
        },
        swing_right: {
          // prop: {
          //   service: 'select',
          //   service_value: 'select_option',
          //   data: {
          //     entity_id: this.config.entity.replace(/^fan\./i, 'number.').replace(/_fan$/i, '_horizontal_angle'),
          //     option: '7'
          //   }
          // },
          prop: {
            siid: 2,
            aiid: 3,
            throw: false
          },
          value: true,
          icon: 'mdi:chevron-right',
        },
        hswing_angle: {
          prop: 'horizontal_swing_included_angle-2-5',
          value: [30,60,90,120,150],
          icon: 'mdi:arrow-left-right',
        },
        hswing: {
          prop: 'fan.horizontal_swing',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:arrow-left-right'
        },
        alarm: {
          prop: 'alarm',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:volume-off','mdi:volume-high']
        },
        locked: {
          prop: 'physical_controls_locked',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:lock-open-variant','mdi:lock-open']
        },
      },
      
      dmaker_fan_p5: {
        power: {
          prop: 'fan.on',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:fan',
          label: 'percentage'
        },
        down: {
          prop: 'percentage',
          value: 1,
          min: 25,
          max: 100,
          step: 25,
          icon: 'mdi:chevron-down',
          backward: true
        },
        up: {
          prop: 'percentage',
          value: 1,
          min: 25,
          max: 100,
          step: 25,
          icon: 'mdi:chevron-up',
        },
        slider: {
          prop: 'percentage',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 1
        },
        mode: {
          prop: 'fan.mode',
          value: [0,1],
          state: ['Natural Wind', 'Straight Wind'],
          icon: ['mdi:leaf','mdi:weather-windy']
        },
        off_delay_time: {
          prop: 'off_delay_time',
          value: this.config.off_delay_time ?? [0,30,60,120,180,240,300,360,420,480],
          icon: 'mdi:camera-timer'
        },
        swing_left: {
          prop: {
            siid: 2,
            piid: 7
          },
          value: 7,
          step: 0,
          icon: 'mdi:chevron-left',
        },
        swing_right: {
          prop: {
            siid: 2,
            piid: 7
          },
          value: -7,
          step: 0,
          icon: 'mdi:chevron-right',
        },
        hswing_angle: {
          prop: 'horizontal_swing_included_angle-2-5',
          value: [30,60,90,120,140],
          icon: 'mdi:arrow-left-right',
        },
        hswing: {
          prop: 'fan.horizontal_swing',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:arrow-left-right'
        },
        alarm: {
          prop: 'alarm',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:volume-off','mdi:volume-high']
        },
        locked: {
          prop: 'physical_controls_locked',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:lock-open-variant','mdi:lock-open']
        },
      },

      zhimi_fan_za4: {
        power: {
          prop: 'fan.on',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:fan',
          label: 'percentage'
        },
        down: {
          prop: 'fan.fan_level',
          value: 1,
          min: 1,
          max: 4,
          step: 1,
          icon: 'mdi:chevron-down',
          backward: true
        },
        up: {
          prop: 'fan.fan_level',
          value: 1,
          min: 1,
          max: 4,
          step: 1,
          icon: 'mdi:chevron-up',
        },
        slider: {
          prop: 'percentage',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 1
        },
        mode: {
          prop: 'fan.mode',
          value: [0,1],
          state: ['Straight Wind', 'Natural Wind'],
          icon: ['mdi:weather-windy', 'mdi:leaf']
        },
        // off_delay_time: {
        //   prop: { siid: 6, piid: 1 },
        //   value: this.config.off_delay_time ?? [0,30,60,120,180,240,300,360,420,480],
        //   valueType: 'secouds',
        //   icon: 'mdi:camera-timer',
        //   label: {
        //     entity_id: this.config.entity.replace(/^fan\./i, 'number.').replace(/_fan$/i, '_off_delay_time'),
        //   }
        // },
        swing_left: {
          prop: {
            siid: 2,
            aiid: 1,
            throw: false
          },
          value: true,
          icon: 'mdi:chevron-left',
        },
        swing_right: {
          prop: {
            siid: 2,
            aiid: 2,
            throw: false
          },
          value: true,
          icon: 'mdi:chevron-right',
        },
        hswing_angle: {
          prop: 'horizontal_swing_included_angle-2-4',
          value: [30,60,90,120],
          icon: 'mdi:arrow-left-right',
        },
        hswing: {
          prop: 'fan.horizontal_swing',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:arrow-left-right'
        },
        alarm: {
          prop: 'alarm',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:volume-off','mdi:volume-high']
        },
        locked: {
          prop: 'physical_controls_locked',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:lock-open-variant','mdi:lock-open']
        },
      },

      zhimi_heater_za2: {
        power: {
          prop: 'heater.on',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:radiator-off', 'mdi:radiator'],
          label: 'heater.target_temperature'
        },
        down: {
          prop: 'heater.target_temperature',
          value: 1,
          min: 16,
          max: 28,
          step: 1,
          icon: 'mdi:chevron-down',
          backward: true
        },
        up: {
          prop: 'heater.target_temperature',
          value: 1,
          min: 16,
          max: 28,
          step: 1,
          icon: 'mdi:chevron-up',
        },
        slider: {
          prop: 'heater.target_temperature',
          value: 1,
          min: 16,
          max: 28,
          step: this.config.percentage_step ?? 1
        },
        brightness: {
          prop: 'indicator_light.brightness',
          value: [0,1,2],
          icon: ['mdi:brightness-5','mdi:brightness-4','mdi:brightness-1']
        },
        off_delay_time: {
          prop: 'countdown.countdown_time',
          value: [0,1,2,3,4,5,6,7,8],
          icon: 'mdi:camera-timer'
        },
        alarm: {
          prop: 'alarm',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:volume-off','mdi:volume-high']
        },
        locked: {
          prop: 'physical_controls_locked',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:lock-open-variant','mdi:lock-open']
        },
        temperature: {
          prop: 'environment.temperature',
          value: 1,
          icon: 'mdi:thermometer',
          click: ''
        },
        humidity: {
          prop: 'environment.relative_humidity',
          value: 1,
          icon: 'mdi:water-percent',
          click: ''
        },
      },

      deerma_humidifier_jsq2: {
        power: {
          prop: 'humidifier.on',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:air-humidifier-off','mdi:air-humidifier'],
          label: 'humidifier.target_humidity'
        },
        down: {
          prop: 'humidifier.target_humidity',
          value: 1,
          min: 40,
          max: 70,
          step: 1,
          icon: 'mdi:chevron-down',
          backward: true
        },
        up: {
          prop: 'humidifier.target_humidity',
          value: 1,
          min: 40,
          max: 70,
          step: 1,
          icon: 'mdi:chevron-up',
        },
        slider: {
          prop: 'humidifier.target_humidity',
          value: 1,
          min: 40,
          max: 70,
          step: this.config.percentage_step ?? 1
        },
        fan_level: {
          prop: 'humidifier.fan_level',
          value: [1,2,3,4],
          state: ['1', '2','3','A'],
          icon: ['mdi:fan-speed-1','mdi:fan-speed-2','mdi:fan-speed-3','mdi:fan-auto']
        },
        mode: {
          prop: 'humidifier.mode',
          value: [0,1],
          state: ['None', 'Constant Humidity'],
          icon: ['mdi:waves','mdi:water-sync'],
        },
        status: {
          prop: 'humidifier.status',
          value: [1,2],
          state: ['Idle', 'Busy'],
          icon: ['mdi:blur-off','mdi:blur'],
          click: ''
        },
        fault: {
          prop: 'humidifier.fault',
          value: [0,1,2],
          state: ['No Faults', 'Insufficient Water', 'Water Separation'],
          icon: ['mdi:tray-full','mdi:tray-alert','mdi:tray-remove'],
          click: ''
        },
        indicator_light: {
          prop: 'indicator_light.on',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:brightness-2','mdi:brightness-5']
        },
        alarm: {
          prop: 'alarm',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:volume-off','mdi:volume-high']
        },
        temperature: {
          prop: 'environment.temperature',
          value: 1,
          icon: 'mdi:thermometer',
          click: ''
        },
        humidity: {
          prop: 'environment.relative_humidity',
          value: 1,
          icon: 'mdi:water-percent',
          click: ''
        },
      },

      dmaker_derh_22l: {
        power: {
          prop: 'dehumidifier.on',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:air-humidifier-off','mdi:air-humidifier'],
          label: 'dehumidifier.target_humidity'
        },
        down: {
          prop: 'dehumidifier.target_humidity',
          value: 1,
          min: 30,
          max: 70,
          step: 1,
          icon: 'mdi:chevron-down',
          backward: true
        },
        up: {
          prop: 'dehumidifier.target_humidity',
          value: 1,
          min: 30,
          max: 70,
          step: 1,
          icon: 'mdi:chevron-up',
        },
        slider: {
          prop: 'dehumidifier.target_humidity',
          value: 1,
          min: 30,
          max: 70,
          step: this.config.percentage_step ?? 1
        },
        mode: {
          prop: 'dehumidifier.mode',
          value: [0,1,2],
          state: ['Smart', 'Sleep', 'Clothes Drying'],
          icon: ['mdi:waves','mdi:sleep','mdi:tshirt-crew-outline'],
        },
        off_delay_time: {
          prop: 'off_delay_time',
          value: this.config.off_delay_time ?? [0,30,60,120,180,240,300,360,420,480],
          icon: 'mdi:camera-timer'
        },
        fault: {
          prop: 'dehumidifier.fault',
          value: [0,1,2,3,4,5,6,7,8,9],
          state: ['No Faults', 'Water Full', 'Sensor Fault1', 'Sensor Fault2', 'Communication Fault1', 'Filter Clean', 'Defrost', 'Fan Motor', 'Overload', 'Lack Of Refrigerant'],
          icon: ['mdi:tray-full','mdi:alert-circle-check-outline','mdi:alert-circle-check', 'mdi:access-point-network-off', 'mdi:air-filter', 'mdi:car-defrost-rear', 'mdi:engine-off-outline', 'mdi:debug-step-over', 'mdi:gas-cylinder' ],
          click: ''
        },
        indicator_light: {
          prop: 'indicator_light.on',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:brightness-2','mdi:brightness-5']
        },
        alarm: {
          prop: 'alarm',
          value: false,
          state: ['off', 'on'],
          icon: ['mdi:volume-off','mdi:volume-high']
        },
        dry_after_off: {
          prop: 'dm_service.dry_after_off',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:hair-dryer'
        }
      }
    }

    const model = this.config.model ?? 'dmaker_fan_p220';
    this.btns = this.models[model];
  
  }


  shouldUpdate(changedProps) {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  render() {
    // console.log(this.config.entity);
    this.states = this.hass.states[this.config.entity];
    this.states.domain = this.config.entity.split('.')[0];
    let info_entity_Id = this.config.entity;
    if (this.states.domain == 'fan') {
      info_entity_Id = info_entity_Id.replace(/_air_purifier$/i, '_fan');
    }
    info_entity_Id = info_entity_Id.replace(/^[^\.]+\./i, 'button.').replace(/_[^_]+$/i, '_info')
    this.states._attributes = Object.assign(this.hass.states[info_entity_Id].attributes, this.states.attributes);
    this.states.prop_state = {};
    const stateStr = this.states ? this.states.state : 'unavailable';
    const model = this.config.model ?? 'dmaker_fan_p220';
    const deviceType = model.split('_')[1];
    let friendly_name = this.config.name ?? this.states._attributes.friendly_name;

    this.hacard = document.createElement('ha-card');
    this.hacard.className = `${deviceType} ${model} state_${stateStr}`;

    let hide_prop = [];
    if (typeof this.config.hide_prop == 'undefined') {
      hide_prop = [];
    } else if (typeof this.config.hide_prop == 'string') {
      hide_prop = [this.config.hide_prop];
    } else {
      hide_prop = this.config.hide_prop;
    }
    
    // if (stateStr == 'unavailable') {
    //   this.hacard.classList.add(`error`);
    //   this.hacard.innerHTML =`<div class="not-found">Unavailable entity ${this.config.entity}</div>`;
    //   return html`
    //     ${this.hacard}
    //   `;
    // } else {
    // }
    if (stateStr == 'unavailable') {
      this.hacard.classList.add(`error`);
      friendly_name += ' (사용 불가)';
    }
    const hideTitle = this.config?.hide_title ? 'hide' : '';
    this.hacard.innerHTML =`<div class="title ${hideTitle}">${friendly_name}</div>`;
    Object.entries(this.btns).map(([key,btn]) => {
      btn.name = key;
      if (!hide_prop.includes(btn.name)) {
        this.hacard.append(this.setUi(btn));
      }
    })
    return html`
      ${this.hacard}
    `;
  }


  setUi(btn) {
    if (btn.name == 'get_iids') {
      return;
    }
    if (btn.name == 'slider') {
      return this.setSpeedSlider(btn);
    } else {
      return this.setBtn(btn);
    }
  }

  setSpeedSlider(btn) {
    const box = document.createElement('div');
    box.className = btn.name;
    const min = btn.min ?? 1;
    const max = btn.max ?? 100;
    const step = btn.step ?? 1;
    const val = this.setState(btn);
    box.innerHTML = `
      <input type="range" min="${min}" max="${max}" step="${step}" value="${val}">
    `;
    const inp = box.querySelector("input[type=range]");
    inp.addEventListener("mouseup", () => {
      // console.log('slider set value: ',inp.value);
      if (btn.prop == 'percentage') {
        switch (this.states.domain) {
          case 'fan' :
            this.hass.callService("fan", "set_percentage", {
              entity_id: this.states.entity_id,
              percentage: Number(inp.value)
            });
            break;
          case 'humidifier' :
            this.hass.callService("humidifier", "set_humidity", {
              entity_id: this.states.entity_id,
              humidity: Number(inp.value)
            });
            break;
        }
        const labels = this.hacard.querySelector('.u_percentage');
        if (labels !== null) {
          labels.textContent = inp.value;
        }
      } else {
        this._toggle('click', btn, Number(inp.value));
      }
    });
    return box;
  }

  setBtn(btn) {
    if (btn.hide == true) {
      return;
    }
    btn._disabled = false;
    if (typeof btn.prop == 'object' && typeof btn.prop.entity_id != 'undefined') {
      if (typeof this.hass.states[btn.prop.entity_id] != 'undefined') {
        btn._state = btn._state ?? this.hass.states[btn.prop.entity_id].state;
        btn._prop_id = btn.prop.entity_id.replace(/[ .]/g,'_');
      } else {
        btn._disabled = true;
        btn.click = '';
      }
    } else if (typeof btn.prop == 'string' && typeof this.states._attributes[btn.prop] != 'undefined') {
      btn._state = this.states._attributes[btn.prop];
      btn._prop_id = btn.prop.replace(/[ .]/g,'_');
    }
    this.states.prop_state[btn._prop_id] = btn._state;

    let box = document.createElement('div');
    box.className = btn.name;
    // box.setAttribute("id", btn.name);
    if (btn._disabled === true) {
      box.classList.add('disabled');
    }
    box.innerHTML = `
      <span class="icon-waper">
        <ha-icon icon=""></ha-icon>
      </span>
      <span class="state"></span>
      <span class="label"></span>
    `;
    
    this.setStateNo(btn);
    this.boxRender(btn, box, "icon", this.setIcon(btn));
    this.boxRender(btn, box, "state", this.setState(btn, box, 'state'));
    if (typeof btn.label !== 'undefined') {
      this.boxRender(btn, box, "label", this.setLabel(btn));
    }

    if (btn.name == 'power') {
      let pressTimer;
      const entity_id = this.states.entity_id;
      const hacard = this.hacard;
      // long click
      ['mouseup', 'touchend'].forEach((eventType) => {
        box.addEventListener(eventType, (e) => {
          clearTimeout(pressTimer);
          // Clear timeout
          return false;
        });
      });
      ['mousedown', 'touchstart'].forEach((eventType) => {
        box.addEventListener(eventType, (e) => {
          // Set timeout
          pressTimer = window.setTimeout(function() {
            const event = new Event('hass-more-info', {
              bubbles: true,
              cancelable: false,
              composed: true
            });
            event.detail = { entityId: entity_id };
            hacard.shadowRoot.dispatchEvent(event);
            return event;
          },600);
          return false; 
        });
      });
    }
    if (btn._disabled === false && btn.click != '') {
      box.addEventListener("click", () => {
        this._toggle('click', btn, null, box);
      });
    }
    return box;
  }
  
  setStateNo(btn, value=null, toggle=null) {
    let _value = this.states.prop_state[btn._prop_id] ?? btn._state;
    // 값설정
    // 값이 설정되어 있면 그대로 넘김
    if (value !== null) {
      _value = value;
    // 값 타입이 숫자일때
    } else if (typeof btn.value == 'number') {
      if (typeof btn.step != 'undefined') {
        if (toggle == 'toggle'){
          if (btn.step != 0) {
            _value += (btn.backward == true) ? -btn.step : btn.step;
            if (typeof btn.max != 'undefined' && _value > btn.max ) {
              _value = btn.max;
            } else if(typeof btn.min != 'undefined' &&_value < btn.min) {
              _value = btn.min;
            }
          } else {
            _value = btn.value;
          }
        }
      }
    // 값 타입이 참거짓 일때
    } else if (typeof btn.value == 'boolean') {
      if (_value == 'on' || _value == 'true' || _value == 1) {
        _value = true;
      } else {
        _value = false;
      }
      _value = toggle == 'toggle' ? !_value : _value;
      _value = _value ? 1 : 0;

    // 값 타입이 오브젝트 일때
    } else if (typeof btn.value == 'object') {
      let i = btn.value.indexOf(Number(_value));
      if (toggle == 'toggle'){
        i += (btn.backward == true) ? -1 : 1;
        if (btn.value.length <= i) {
          i = 0;
        } else if (i < 0) {
          i = btn.value.length - 1
        }
      }
      _value = btn.value[i];
    // 값 타입이 그외 일대
    } else {
      _value = btn.value;
    }

    if (typeof btn.valueCalc != 'undefined') {
      _value = this.calculateEquation(`${value} ${btn.valueCalc}`);
    }
    // console.log('setStateNo: ', btn._state, '->', _value);
    btn._state = _value;
    return _value;
  }

  boxRender(btn, box, elem, state) {
    // console.log('boxRender:', btn.name, elem, state);
    if (elem == 'icon') {
      const haIconElement = box.querySelector("ha-icon");
      haIconElement.setAttribute("icon", state);
    } else {
      const stateElement = box.querySelector(`.${elem}`);
      if (elem == 'label') {
        stateElement.classList.add(`u_${btn.label.replace(/[ .]/g, "_")}`);
      }
      stateElement.textContent = state;
      if (state !== '' ) {
        box.className = btn.name;
        this.boxActive(btn, box);
      }
      if (btn._disabled === true ) {
        box.classList.add('disabled');
      }
      
    }
  }
  boxActive(btn, box) {
    // console.log('boxActive: ', btn.name, btn._state);
    box.classList.add(`s_${btn._state}`);
    if (typeof btn.value == 'boolean') {
      if (btn._state == 1 || btn._state == 'on') {
        box.classList.remove('inactive');
        box.classList.add('active');
      }
    } else if (btn.name == 'off_delay_time') {
      box.classList.add(btn._state != 0 ? 'active' : 'inactive');
    } else if (btn.name == 'mode') {
      box.classList.add(btn._state != 0 ? 'active' : 'inactive');
    }
    if (btn.name == 'vswing') {
      const boxElement = this.hacard.querySelector(".vswing_angle");
      boxElement.classList.remove(btn._state == 0 ? 'show' : 'hide');
      boxElement.classList.add(btn._state != 0 ? 'show' : 'hide');
    } else if (btn.name == 'hswing') {
      const boxElement = this.hacard.querySelector(".hswing_angle");
      boxElement.classList.remove(btn._state == 0 ? 'show' : 'hide');
      boxElement.classList.add(btn._state != 0 ? 'show' : 'hide');
    } else if (btn.name == 'fault' && btn._state > 0) {
      box.classList.add('active');
    }
  }

  setState(btn) {
    let i, ret = '';
    // console.log('setState: ', btn);
    // console.log('typeof btn.prop', btn.prop , typeof btn.prop)
    if (typeof btn.prop == 'string') {
      if (typeof btn.state == 'undefined') {
        ret = this.states._attributes[btn.prop];
      } else if (typeof btn.value == 'boolean') {
        i = this.states._attributes[btn.prop] ? 1 : 0;
        ret = btn.state[i]
      } else if (typeof btn.state == 'object') {
        i = btn.value.indexOf(this.states._attributes[btn.prop]);
        ret = btn.state[i]
      } else {
        ret = this.states._attributes[btn.prop];
      }
    } else if (typeof btn.prop == 'object') {
      if (typeof btn.prop.entity_id != 'undefined') {
        // btn._state = btn._state ?? this.hass.states[btn.prop.entity_id].state;
        ret = btn._state;
      }
    }
    return ret;
  }

  setIcon(btn) {
    let i;
    if (typeof btn.icon == 'string') {
      return btn.icon;
    } else if (typeof btn.value == 'boolean') {
      if (typeof btn._state == 'string') {
        i = btn.state.indexOf(btn._state);
      } else {
        i = btn._state != 0 ? 1 : 0;
      }
    } else if (typeof btn.icon == 'object') {
      i = btn.value.indexOf(btn._state);
    }
    i = i ?? 0;
    return btn.icon[i];
  }
  setLabel(btn, box=null) {
    if (typeof btn.label == 'undefined') {
      return '';
    }
    if (typeof this.btns[btn.label] == 'undefined') {
      return this.states._attributes[btn.label];
    } else {
      btn = this.btns[btn['label']];
      return this.setState(btn, box, 'lable');
    }
  }

  _toggle(type, btn, value=null, box=null) {
    // console.log("_toggle:", type, btn.name, value, box);
    // if (state.state == 'off' && btn.name != 'power') {
    //   return;
    // }
    if (btn[type] == '') {
      return;
    }
    if (typeof btn[type] != 'undefined') {
      btn = this.btns[btn[type]];
    }

    let _field = btn.prop;
    let _value = '';
    _value = this.setStateNo(btn, value, 'toggle');


    if (typeof this.states.prop_state[btn._prop_id] != 'undefined') {
      this.states.prop_state[btn._prop_id] = _value;
    }

    if (box !== null) {
      let target = typeof btn.label != 'undefined' ? 'label' : 'state';
      this.boxRender(btn, box, 'icon', this.setIcon(btn));
      this.boxRender(btn, box, target, _value);
    }

    // lable 업데이트
    if (typeof btn.prop == 'string') {
      const labels = this.hacard.querySelector(`.u_${btn.prop.replace(/[ .]/g, "_")}`);
      // console.log('lable 업데이트: ', labels, _value, typeof labels);
      if (labels !== null) {
        labels.textContent = _value;
      }
    }
    
    // 값 적용
    // console.log(type, btn.name, _field, _value, typeof _value);
    // prop 이 오프젝트 타입이면
    if (typeof btn.prop == 'object') {
      
      // SIID 가 설정되어 있으면
      if (typeof btn.prop.siid != 'undefined') {
        // AIID가 설정되어 있으면
        if (typeof btn.prop.aiid != 'undefined') {
          if (typeof btn.prop.entity_id == 'undefined') {
            btn.prop.entity_id = this.states.entity_id;
          }
          this.hass.callService('xiaomi_miot', "call_action", btn.prop);
          return;
        }
        else {
          // if (typeof btn.prop.entity_id == 'undefined') {
          //   btn.prop.entity_id = state.entity_id;
          // }
          if (typeof btn.prop.value == 'undefined') {
            btn.prop.value = _value;
          }
          this.hass.callService('xiaomi_miot', "set_miot_property", {
            entity_id: this.states.entity_id,
            siid: btn.prop.siid,
            piid: btn.prop.piid,
            value: btn.prop.value ?? _value ?? btn.value,
          });
          return;
        }
      } 
      // service 가 설정되어있으면
      else if (typeof btn.prop.service != 'undefined') {
        this.hass.callService(btn.prop.service, btn.prop.service_value, btn.prop.data);
        return;
      } 

      // entity_id 가 설정되어있으면
      else if (typeof btn.prop.entity_id != 'undefined') {
        const prop_domain = btn.prop.entity_id.split('.')[0];
        switch (prop_domain) { 
          case 'switch':
            this.hass.callService('switch', 'toggle', {
              entity_id: btn.prop.entity_id
            });
            break;
        }
      }

    } 
    // prop 가 오브젝트 타입이 아니면 (문자열이면)
    else {
      // fan power off 시 바람세기를 level1으로 설정. 안그럼 다시 켜짐;
      if (this.states.domain == 'fan' && btn.name == 'power') {
        if (_value == 0) {
          this.hass.callService('xiaomi_miot', "set_property", {
            entity_id: this.states.entity_id,
            field: 'fan.fan_level',
            value: 1
          });
        }
      }
      // fan percentage
      if (this.states.domain == 'fan' && btn.prop == 'percentage') {
        this.hass.callService("fan", "set_percentage", {
          entity_id: this.states.entity_id,
          percentage: Number(_value)
        });
      } else {
        if (typeof _value == 'number' && typeof btn.value == 'boolean') {
          _value = _value != 0;
        }
        // console.log('set_property:', this.states.entity_id, _field,_value);
        this.hass.callService('xiaomi_miot', "set_property", {
          entity_id: this.states.entity_id,
          field: _field,
          value: _value
        });
      }
    }

  }

  calculateEquation(equation) {
    return Function('"use strict";return (' + equation + ')')();
  }
  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 1;
  }


  static get styles() {
    return css`
      @keyframes rotate_image{
        100% {
            transform: rotate(360deg);
        }
      }
      ha-card {
        background: var(--ha-card-background, var(--card-background-color, white) );
        box-shadow: var(--ha-card-box-shadow,none);
        box-sizing: border-box;
        border-radius: var(--ha-card-border-radius,12px);
        border-width: var(--ha-card-border-width,1px);
        border-style: solid;
        border-color: var(--ha-card-border-color,var(--divider-color,#e0e0e0));
        color: var(--primary-text-color);
        padding: var(--card-padding, 10px);
        display: grid;
        grid-template-rows: var(--card--grid-rows, 40px);
        grid-template-columns: var(--card--grid-columns, repeat(5, 1fr));
        grid-template-areas: var(--card--grid-areas, "n n n n n" "p s hs ha t" "o m vs va h" "ao aot af aft a");
        gap: var(--card-grid-gap, 6px 6px);
        align-items: center;
        place-content: space-between;
      }
      ha-card.dmaker_fan_p220 {
        grid-template-columns: var(--card--grid-columns, repeat(5, 1fr));
        grid-template-areas: var(--card--grid-areas, "n n n n n" "p s hs ha t" "o m vs va h" "ao aot af aft a");
      }
      ha-card.dmaker_fan_p5 {
        grid-template-columns: var(--card--grid-columns, repeat(6, 1fr));
        grid-template-areas: var(--card--grid-areas, "p n n n n n" "s hs ha o m a");
      }
      ha-card.dmaker_fan_p45 {
        grid-template-columns: var(--card--grid-columns, repeat(6, 1fr));
        grid-template-areas: var(--card--grid-areas, "p n n n n n" "s hs ha o m a");
      }  
      ha-card.zhimi_fan_za4 {
        grid-template-columns: var(--card--grid-columns, repeat(5, 1fr));
        grid-template-areas: var(--card--grid-areas, "p n n n n" "s hs ha m a");
      }
      ha-card.dmaker_fan_p33 {
        grid-template-columns: var(--card--grid-columns, repeat(6, 1fr));
        grid-template-areas: var(--card--grid-areas, "p s n n n n" "hs ha o m a a");
      }
      ha-card.zhimi_heater_za2 {
        grid-template-columns: var(--card--grid-columns, repeat(5, 1fr));
        grid-template-areas: var(--card--grid-areas, "p s n n n" "t h o b a");
      }
      ha-card.deerma_humidifier_jsq2 {
        grid-template-columns: var(--card--grid-columns, repeat(7, 1fr));
        grid-template-areas: var(--card--grid-areas, "p s n n n n n" "m fl st t h f a");
      }
      ha-card.dmaker_derh_22l {
        grid-template-columns: var(--card--grid-columns, repeat(6, 1fr));
        grid-template-areas: var(--card--grid-areas, "p n n n n n" "s m o df f a");
      }
      ha-card>div {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--box-background-color, var(--secondary-background-color));
        color: var(--secondary-text-color);
        --color: var(--primary-text-color);
        border-radius: 5px;
        border-radius: calc(var(--ha-card-border-radius,12px)*0.7);
        border: none;
        height: 100%;
        min-height: 40px;
        cursor: pointer;
        transition: all 0.4s;
        position: relative;
      }
      ha-card>div:active,
      ha-card>div.active {
        background: var(--box-active-background-color, var(--primary-color));
        color: var(--box-active-color, var(--text-primary-color));
      }
      ha-card>div.active.fault {
        background: var(--error-color);
      }
      ha-card.state_off>div.active {
        opacity: 0.5;
      }
      ha-card>div:active.slider { 
        background: none !important;
      }
      /*ha-card>div.active::before {
          content: "";
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
          background-color: var(--paper-item-icon-active-color, #fdd835)
          opacity: 0.6;
      }*/
      ha-card>div.active .icon-waper {
        color: var(--icon-active-color, --primary-text-color);
      }
      ha-card.fan>div.power.active .icon-waper {
        animation: rotate_image 1s linear infinite;
        transform-origin: 50% 50%;
      }
      .title {        grid-area: n; color: var(--primary-text-color) }
      .power {        grid-area: p; }
      .mode {         grid-area: m; }
      .speed {        grid-area: s; }
      .down {         grid-area: s; position: relative; width: 50%; }
      .up {           grid-area: s; position: relative; width: 50%; left: 50%;}
      .slider {       grid-area: n; opacity: 0.5; }
      .off_delay_time { grid-area: o; }
      .hswing {       grid-area: hs; }
      .hswing_angle { grid-area: ha; }
      .swing_left {   grid-area: ha; position: relative; width: 50%; }
      .swing_right {  grid-area: ha; position: relative; width: 50%; left: 50%; }
      .vswing {       grid-area: vs; }
      .vswing_angle { grid-area: va; }
      .swing_down {   grid-area: va; position: relative; width: 50%; }
      .swing_up {     grid-area: va; position: relative; width: 50%; left: 50%; }
      .auto_on {      grid-area: ao; }
      .auto_on_temp_minus {grid-area: aot; position: relative; width: 50%; }
      .auto_on_temp_plus  {grid-area: aot; position: relative; width: 50%; left: 50%; }
      .auto_off {     grid-area: af; }
      .auto_off_temp_minus{grid-area: aft; position: relative; width: 50%; }
      .auto_off_temp_plus {grid-area: aft; position: relative; width: 50%; left: 50%; }
      .temperature  { grid-area: t; cursor: default; }
      .humidity {     grid-area: h; cursor: default; }
      .alarm {        grid-area: a; position: relative; width: 50%; }
      .indicator_light,
      .locked {       grid-area: a; position: relative; width: 50%; left: 50%; }
      .brightness {   grid-area: b; }
      .fan_level {    grid-area: fl; }
      .dry_after_off {grid-area: df; }
      .status {       grid-area: st; cursor: default; }
      .fault {        grid-area: f; cursor: default; }

      .disabled {
        cursor: default;
        opacity: 0.3;
      }

      .hide,
      .state {
        display: none;
      }
      .hswing_angle .state,
      .vswing_angle .state,
      .auto_on_temp .state,
      .auto_off_temp .state,
      .temperature .state,
      .humidity .state,
      .fan_level .state,
      .off_delay_time .state {
        display: inline;
      }
      .power .label:after {
        content: "%";
        font-size: 80%;
      }
      .heater .power .label:after {
        content: "°C";
      }
      .off_delay_time .state:after {
        content: "m";
        font-size: 80%;
      }
      .heater .off_delay_time .state:after {
        content: "h";
      }
      .vswing_angle .state:after,
      .hswing_angle .state:after {
        content: "°";
      }
      .hswing_angle .icon-waper,
      .vswing_angle .icon-waper {
        transform: scale(0.7);
      }
      
      /*
      ha-card.error {
        grid-template-rows: min-content;
        grid-template-columns: 1fr;
        grid-template-areas: "n";
      }
      */
      ha-card.error>div {
        opacity: 0.3;
      }
      .not-found {
        grid-area: n;
        color: var(--error-color);
        font-style: italic;
      }


      input[type="range"] { 
        margin: auto;
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        position: relative;
        overflow: hidden;
        height: 100%;
        width: 100%;
        cursor: pointer;
        border-radius: calc(var(--ha-card-border-radius,12px)*0.7);
      }
      
      input[type="range"]::-webkit-slider-runnable-track {
        --background: #ddd;
      }
      
      /*
      * 1. Set to 0 width and remove border for a slider without a thumb
      * 2. Shadow is negative the full width of the input and has a spread 
      *    of the width of the input.
      */
      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 2%; /* 1 */
        height: 100%;
        background: var(--box-active-background-color, var(--primary-color));
        box-shadow: -2000px 0 0 2000px var(--box-active-background-color, var(--primary-color)); /* 2 */
        border: 0; /* 1 */
      }
      
      input[type="range"]::-moz-range-track {
        height: 0;
        --background: #ddd;
      }
      
      input[type="range"]::-moz-range-thumb {
        background: var(--box-active-background-color, var(--primary-color));
        width: 2%; /* 1 */
        height: 100%;
        border: 0;
        border-radius: 0 !important;
        box-shadow: -2000px 0 0 2000px var(--box-active-background-color, var(--primary-color));
        box-sizing: border-box;
      }
      
      input[type="range"]::-ms-fill-lower { 
        background: var(--box-active-background-color, var(--primary-color));
      }
      
      input[type="range"]::-ms-thumb { 
        --background: #fff;
        border: 0;
        width: 2%; /* 1 */
        height: 100%;
        box-sizing: border-box;
      }
      
      input[type="range"]::-ms-ticks-after { 
        display: none; 
      }
      
      input[type="range"]::-ms-ticks-before { 
        display: none; 
      }
      
      input[type="range"]::-ms-track { 
        --background: #ddd;
        color: transparent;
        height: 100%;
        border: none;
      }
      
      input[type="range"]::-ms-tooltip { 
        display: none;
      }
    `;
  }

}
customElements.define("fanxiaomimiot-card", fanXiaomiMiotCard);
console.info(`%cXIAOMI-MIOT CARD v0.0.26 IS INSTALLED`,"color: green; font-weight: bold","");
