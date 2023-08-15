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
  mapping = {}

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

  async loadJSON(url) {
    const response = await fetch(url);
    this.mapping = await response.json();
    console.log('mapping:',this.mapping);
  }

  async setBtns() {
    
    this.models = {
      dmaker_fan_p220: {
        power : {
          prop: 'fan.on',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:fan',
          label: 'dm_service.speed_level'
        },
        // speed: {
        //   prop: 'fan.fan_level',
        //   value: [1,2,3,4],
        //   icon: ['mdi:numeric-1-box-outline','mdi:numeric-2-box-outline','mdi:numeric-3-box-outline','mdi:numeric-4-box-outline']
        // },
        down: {
          prop: 'dm_service.speed_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-down',
          backward: true
        },
        up: {
          prop: 'dm_service.speed_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-up',
        },
        slider: {
          prop: 'dm_service.speed_level',
          value: 1,
          min: 1,
          max: 100,
          step: 1
        },
        mode: {
          prop: 'fan.mode',
          value: [0,1,2,3],
          state: ['Straight Wind', 'Natural Wind', 'Smart', 'Sleep'],
          icon: ['mdi:weather-windy', 'mdi:leaf', 'mdi:fan-auto', 'mdi:power-sleep']
        },
        off_delay_time: {
          prop: 'off_delay_time',
          value: this.config.off_delay_time ?? [0,30,60,120,180,240,300,360,420,480],
          icon: 'mdi:camera-timer'
        },
        hswing: {
          prop: 'fan.horizontal_swing',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:arrow-left-right'
        },
        hswing_angle: {
          prop: 'horizontal_swing_included_angle-2-5',
          value: [30,60,90,120,140],
          icon: 'mdi:arrow-left-right',
          // click: 'hswing',
          // dblclick: 'hswing_angle'
        },
        vswing: {
          prop: 'fan.vertical_swing',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:arrow-up-down'
        },
        vswing_angle: {
          prop: 'vertical_swing_included_angle-2-8',
          value: [35,65,95],
          icon: 'mdi:arrow-up-down',
          // click: 'vswing',
          // dblclick: 'vswing_angle'
        },
        swing_down: {
          // prop: 'dm_service.swing_updown_manual',
          prop: {
            siid: 8,
            piid: 2
          },
          value: 2,
          icon: 'mdi:chevron-down',
        },
        swing_up: {
          // prop: 'dm_service.swing_updown_manual',
          prop: {
            siid: 8,
            piid: 2
          },
          value: 1,
          icon: 'mdi:chevron-up',
        },
        swing_left: {
          // prop: 'dm_service.swing_lr_manual',
          prop: {
            siid: 8,
            piid: 3
          },
          value: 1,
          icon: 'mdi:chevron-left',
        },
        swing_right: {
          // prop: 'dm_service.swing_lr_manual',
          prop: {
            siid: 8,
            piid: 3
          },
          value: 2,
          icon: 'mdi:chevron-right',
        },
        temperature: {
          prop: 'temperature-9-1',
          value: 1,
          icon: 'mdi:thermometer',
          click: ''
        },
        humidity: {
          prop: 'relative_humidity-9-2',
          value: 1,
          icon: 'mdi:water-percent',
          click: ''
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
        auto_on: {
          prop: 'dm_service.on',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:fan-auto',
          label: 'auto_on_temp_minus'
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
          label: 'auto_off_temp_minus'
        },
        auto_off_temp_minus: {
          prop: 'dm_service-8.temperature',
          value: 14,
          min: 14,
          max: 35,
          step: 1,
          icon: 'mdi:chevron-down',
          backward: true
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
          label: 'fan.status'
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
          prop: 'fan.fan_level',
          value: 1,
          min: 1,
          max: 100,
          step: 1
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
        hswing: {
          prop: 'fan.horizontal_swing',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:arrow-left-right'
        },
        hswing_angle: {
          prop: 'horizontal_swing_included_angle-2-5',
          value: [30,60,90,120,140],
          icon: 'mdi:arrow-left-right',
          // click: 'hswing',
          // dblclick: 'hswing_angle'
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
          label: 'fan-2.stepless_fan_level'
        },
        down: {
          prop: 'fan-2.stepless_fan_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-down',
          backward: true
        },
        up: {
          prop: 'fan-2.stepless_fan_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-up',
        },
        slider: {
          prop: 'fan-2.stepless_fan_level',
          value: 1,
          min: 1,
          max: 100,
          step: 1
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
        hswing: {
          prop: 'fan.horizontal_swing',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:arrow-left-right'
        },
        hswing_angle: {
          prop: 'horizontal_swing_included_angle-2-5',
          value: [30,60,90,120,140],
          icon: 'mdi:arrow-left-right',
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
            piid: 7
          },
          value: -7,
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
            piid: 7
          },
          value: 7,
          icon: 'mdi:chevron-right',
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
          label: 'fan.fan_level'
        },
        down: {
          prop: 'fan.fan_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-down',
          backward: true
        },
        up: {
          prop: 'fan.fan_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-up',
        },
        slider: {
          prop: 'fan.fan_level',
          value: 1,
          min: 1,
          max: 100,
          step: 1
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
        hswing: {
          prop: 'fan.horizontal_swing',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:arrow-left-right'
        },
        hswing_angle: {
          prop: 'horizontal_swing_included_angle-2-4',
          value: [30,60,90,120],
          icon: 'mdi:arrow-left-right',
        },
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
          step: 1
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
          step: 1
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
          step: 1
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
    // console.log('rander:',Date.now());
    const state = this.hass.states[this.config.entity];
    const stateStr = state ? state.state : 'unavailable';
    const model = this.config.model ?? 'dmaker_fan_p220';
    const deviceType = model.split('_')[1];
    if (stateStr == 'unavailable') {
      return html`
        <ha-card class="${deviceType} ${model} state_${stateStr} error">
          <div class="not-found">Unavailable entity ${this.config.entity}</div>
        </ha-card>
      `;
    } else {
      const hideTitle = this.config?.hide_title ? 'hide' : '';
      return html`
        <ha-card class="${deviceType} ${model} state_${stateStr}">
          <div class="title ${hideTitle}">
            ${state.attributes.friendly_name}
          </div>

          ${Object.entries(this.btns).map(([key,btn]) => {
            btn.name = key;
            return this.setUi(state, btn);
          })}

        </ha-card>
      `;
    }
  }


  setUi(state, btn) {
    if (btn.name == 'slider') {
      return this.setSpeedSlider(state, btn);
    } else {
      return this.setBtn(state, btn);
    }
  }

  setBtn(state, btn) {
    if (btn.hide == true) {
      return;
    }
    let box = document.createElement('div');
    box.className = btn.name;
    box.innerHTML = `
      <span class="icon-waper">
        <ha-icon icon="${this.setIcon(state, btn)}"></ha-icon>
      </span>
      <span class="state">${this.setState(state, btn)}</span>
      <span class="label">${this.setLabel(state, btn)}</span>
    `;
    // box.ondblclick = () => {
    //   this._toggle('dblclick', state, btn);
    // }
    box.addEventListener("click", () => {
      this._toggle('click', state, btn);
    });
    if (typeof btn.value == 'boolean') {
      if (state.attributes[btn.prop]) {
        box.classList.add('active');
      }
    }
    if (btn.name == 'off_delay_time') {
      if (state.attributes['off_delay_time'] != undefined) {
        box.classList.add((state.attributes['off_delay_time'] != 0) ? 'active' : 'inactive');
      } else if (state.attributes['countdown.countdown_time'] != undefined) {
        box.classList.add((state.attributes['countdown.countdown_time'] != 0) ? 'active' : 'inactive');
      }
    } else if (btn.name == 'mode') {
      box.classList.add((state.attributes['fan.mode'] !== btn.state.indexOf('Straight Wind')) ? 'active' : 'inactive');
    } else if (btn.name == 'hswing_angle') {
      box.classList.add((state.attributes['fan.horizontal_swing']) ? 'show' : 'hide');
    } else if (btn.name == 'vswing_angle') {
      box.classList.add((state.attributes['fan.vertical_swing']) ? 'show' : 'hide');
    } else if (btn.name == 'swing_left' || btn.name == 'swing_right') {
      box.classList.add((state.attributes['fan.horizontal_swing']) ? 'hide' : 'show');
    } else if (btn.name == 'swing_up' || btn.name == 'swing_down') {
      box.classList.add((state.attributes['fan.vertical_swing']) ? 'hide' : 'show');
    }
    return box;
  }

  setSpeedSlider(state, btn) {
    const box = document.createElement('div');
    box.className = btn.name;
    const min = btn.min ?? 1;
    const max = btn.max ?? 100;
    const step = btn.step ?? 1;
    const val = this.setState(state, btn);
    box.innerHTML = `
      <input type="range" min="${min}" max="${max}" step="${step}" value="${val}">
    `;
    const inp = box.querySelector("input[type=range]");
    inp.addEventListener("change", () => {
      // alert(this.value);
      // console.log('slider set value: ',inp.value);
      this._toggle('click', state, btn, Number(inp.value));
    });
    return box;
  }

  setIcon(state, btn) {
    let i, attr = state.attributes[btn.prop]
    if (typeof btn.icon == 'string') {
      return btn.icon;
    } else if (typeof btn.value == 'boolean') {
      i = state.attributes[btn.prop] ? 1 : 0;
    } else if (typeof btn.icon == 'object') {
      i = btn.value.indexOf(state.attributes[btn.prop]);
    }
    return btn.icon[i];
  }
  setState(state, btn) {
    let i;
    if (typeof btn.state == 'undefined') {
      return state.attributes[btn.prop];
    } else if (typeof btn.value == 'boolean') {
      i = state.attributes[btn.prop] ? 1 : 0;
    } else if (typeof btn.state == 'object') {
      i = btn.value.indexOf(state.attributes[btn.prop]);
    } else {
      return state.attributes[btn.prop];
    }
    return btn.state[i];
  }
  setLabel(state, btn) {
    if (typeof btn.label == 'undefined') {
      return '';
    }
    if (typeof btn.label == 'object') {
      if (typeof btn.label.edtity_id != 'undefined') {
        return this.hass.states[btn.label.edtity_id].state;
      }
    } else if (typeof this.btns[btn.label] == 'undefined') {
      return state.attributes[btn.label];
    } else {
      btn = this.btns[btn['label']];
      return this.setState(state, btn);
    }
  }
  _toggle(type, state, btn, value) {
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
    if (typeof value != 'undefined') {
      _value = value;
    } else if (typeof btn.value == 'boolean') {
      _value = !state.attributes[btn.prop];
    } else if (typeof btn.value == 'number') {
      if (typeof btn.step == 'undefined' || btn.step == 0) {
        _value = btn.value;
      } else {
        _value = state.attributes[btn.prop];
        _value += (btn.backward == true) ? -btn.step : btn.step;
        if (_value > btn.max ) {
          _value = btn.max;
        } else if(_value < btn.min) {
          _value = btn.min;
        }
      }
    } else if (typeof btn.value == 'object') {
      let i = btn.value.indexOf(state.attributes[btn.prop]);
      i += (btn.backward == true) ? -1 : 1;
      if (btn.value.length <= i) {
        i = 0;
      } else if (i < 0) {
        i = btn.value.length - 1
      }
      _value = btn.value[i];
    } else {
      _value = btn.value;
    }
    if (typeof btn.valueCalc != 'undefined') {
      _value = calculateEquation(`${value} ${btn.valueCalc}`);
    }
    // console.log(type, btn.name, _field, _value, typeof _value);
    if (typeof btn.prop == 'object') {
      if (typeof btn.prop.service != 'undefined') {
        this.hass.callService(btn.prop.service, btn.prop.service_value, btn.prop.data);
      } else if (typeof btn.prop.aiid != 'undefined') {
        if (typeof btn.prop.entity_id == 'undefined') {
          btn.prop.entity_id = state.entity_id;
        }
        this.hass.callService('xiaomi_miot', "call_action", btn.prop);
      } else {
        if (typeof btn.prop.entity_id == 'undefined') {
          btn.prop.entity_id = state.entity_id;
        }
        if (typeof btn.prop.value == 'undefined') {
          btn.prop.value = btn.value;
        }
        console.log('btn.prop:', btn.prop);
        this.hass.callService('xiaomi_miot', "set_miot_property", btn.prop);
      }
    } else {
      this.hass.callService('xiaomi_miot', "set_property", {
        entity_id: state.entity_id,
        field: _field,
        value: _value
      });
    }

    // 속도 조절시 전원이 꺼져있으면 켜기
    if (btn.name == 'slider' && state.attributes[this.btns.power.prop] == false) {
      this._toggle('click', state, this.btns.power, true);
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
      ha-card.dmaker_fan_p5 {
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
      .off_delay_time.active .state {
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
      
      ha-card.error {
        grid-template-rows: min-content;
        grid-template-columns: 1fr;
        grid-template-areas: "n";
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
console.info(`%cXIAOMI-MIOT CARD v0.0.22 IS INSTALLED`,"color: green; font-weight: bold","");
