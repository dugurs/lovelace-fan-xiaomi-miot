
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";


class fanXiaomiMiotCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  btns = [
    {
      name: 'power',
      prop: 'fan.on',
      value: false,
      state: ['off', 'on'],
      icon: 'mdi:fan'
    },
    {
      name: 'mode',
      prop: 'fan.mode',
      value: [0,1,2,3],
      state: ['Straight Wind', 'Natural Wind', 'Smart', 'Sleep'],
      icon: ['mdi:weather-windy', 'mdi:leaf', 'mdi:fan-auto', 'mdi:power-sleep']
    },
    {
      name: 'speed',
      prop: 'fan.fan_level',
      value: [1,2,3,4],
      icon: ['mdi:numeric-1-box-outline','mdi:numeric-2-box-outline','mdi:numeric-3-box-outline','mdi:numeric-4-box-outline']
    },
    {
      name: 'off_delay_time',
      prop: 'off_delay_time',
      value: [0,30,60,120,180,240,300,360],
      icon: 'mdi:camera-timer'
    },
    {
      name: 'hswing',
      prop: 'fan.horizontal_swing',
      value: false,
      state: ['off', 'on'],
      icon: 'mdi:arrow-left-right'
    },
    {
      name: 'hswing_angle',
      prop: 'horizontal_swing_included_angle-2-5',
      value: [30,60,90,120,140],
      icon: 'mdi:arrow-left-right',
      // click: 'hswing',
      // dblclick: 'hswing_angle'
    },
    {
      name: 'vswing',
      prop: 'fan.vertical_swing',
      value: false,
      state: ['off', 'on'],
      icon: 'mdi:arrow-up-down'
    },
    {
      name: 'vswing_angle',
      prop: 'vertical_swing_included_angle-2-8',
      value: [35,65,95],
      icon: 'mdi:arrow-up-down',
      // click: 'vswing',
      // dblclick: 'vswing_angle'
    },
    {
      name: 'swing_down',
      prop: 'dm_service.swing_updown_manual',
      value: 2,
      icon: 'mdi:chevron-down',
    },
    {
      name: 'swing_up',
      prop: 'dm_service.swing_updown_manual',
      value: 1,
      icon: 'mdi:chevron-up',
    },
    {
      name: 'swing_left',
      prop: 'dm_service.swing_lr_manual',
      value: 1,
      icon: 'mdi:chevron-left',
    },
    {
      name: 'swing_right',
      prop: 'dm_service.swing_lr_manual',
      value: 2,
      icon: 'mdi:chevron-right',
    },
    {
      name: 'temperature',
      prop: 'temperature-9-1',
      value: 1,
      icon: 'mdi:thermometer',
      click: ''
    },
    {
      name: 'humidity',
      prop: 'relative_humidity-9-2',
      value: 1,
      icon: 'mdi:water-percent',
      click: ''
    },
    {
      name: 'alarm',
      prop: 'alarm',
      value: false,
      state: ['off', 'on'],
      icon: ['mdi:volume-off','mdi:volume-high']
    },
    {
      name: 'locked',
      prop: 'physical_controls_locked',
      value: false,
      state: ['off', 'on'],
      icon: ['mdi:lock-open-variant','mdi:lock-open']
    },
    {
      name: 'auto_on',
      prop: 'dm_service.on',
      value: false,
      state: ['off', 'on'],
      icon: 'mdi:fan-auto',
      label: 'auto_on_temp_minus'
    },
    {
      name: 'auto_on_temp_minus',
      prop: 'dm_service.temperature',
      value: 15,
      min: 15,
      max: 36,
      step: 1,
      icon: 'mdi:chevron-down',
      backward: true
    },
    {
      name: 'auto_on_temp_plus',
      prop: 'dm_service.temperature',
      value: 15,
      min: 15,
      max: 36,
      step: 1,
      icon: 'mdi:chevron-up',
    },
    {
      name: 'auto_off',
      prop: 'dm_service.off',
      value: false,
      state: ['off', 'on'],
      icon: 'mdi:fan-off',
      label: 'auto_off_temp_minus'
    },
    {
      name: 'auto_off_temp_minus',
      prop: 'dm_service-8.temperature',
      value: 14,
      min: 14,
      max: 35,
      step: 1,
      icon: 'mdi:chevron-down',
      backward: true
    },
    {
      name: 'auto_off_temp_plus',
      prop: 'dm_service-8.temperature',
      value: 14,
      min: 14,
      max: 35,
      step: 1,
      icon: 'mdi:chevron-up',
    },
  ]

  btnskey = {};

  render() {
    const entityId = this.config.entity;
    const state = this.hass.states[entityId];
    const stateStr = state ? state.state : 'unavailable';
    for (let key in this.btns) {
      this.btnskey[this.btns[key].name] = Number(key);
    }
    // console.log('btnskey:', this.btnskey);
    if (stateStr == 'unavailable') {
      return html`<div class="not-found">Entity ${entityId} not found.</div>`;
    } else {
      const hideTitle = this.config?.hide_title ? 'hide' : '';
      return html`
        <ha-card>
          <div class="title ${hideTitle}">
            ${state.attributes.friendly_name}
          </div>

          ${this.btns.map(btn => {
            return this.setUi(state, btn);
          })}

        </ha-card>
      `;
    }
  }

  setUi(state, btn) {
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
    box.onclick = () => {
      this._toggle('click', state, btn);
    }
    if (typeof btn.value == 'boolean') {
      if (state.attributes[btn.prop]) {
        box.classList.add('active');
      }
    }
    if (btn.name == 'off_delay_time') {
      box.classList.add((state.attributes['off_delay_time'] != 0) ? 'active' : 'inactive');
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
    if (typeof this.btnskey[btn.label] == 'undefined') {
      return state.attributes[btn.label];
    } else {
      btn = this.btns[this.btnskey[btn['label']]];
      return this.setState(state, btn);
    }
  }
  _toggle(type, state, btn) {
    // if (state.state == 'off' && btn.name != 'power') {
    //   return;
    // }
    if (btn[type] == '') {
      return;
    }
    if (typeof btn[type] != 'undefined') {
      btn = this.btns[this.btnskey[btn[type]]];
    }
    let _field = btn.prop;
    let _value = '';
    if (typeof btn.value == 'boolean') {
      _value = !state.attributes[btn.prop];
    } else if (typeof btn.value == 'number') {
      if (typeof btn.step == 'undefined' || btn.step == 0) {
        _value = btn.value;
      } else {
        _value = state.attributes[btn.prop];
        _value += (btn.backward == true) ? -btn.step : btn.step;
        if (_value > btn.max || _value < btn.min) {
          return;
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
    // console.log(type, btn.name, _field, _value);
    this.hass.callService("xiaomi_miot", "set_property", {
      entity_id: state.entity_id,
      field: _field,
      value: _value
    });
  }
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define entity");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 1;
  }


  static get styles() {
    return css`
      :host {
      }
      ha-card {
        background: var(--card-background, var(--card-background-color, white) );
        border-radius: var(--card-border-radius, 4px);
        box-shadow: var(--card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) );
        color: var(--card-primary-text-color, --primary-text-color);
        padding: var(--card-padding, 10px);
        display: grid;
        grid-template-rows: var(--card--grid-rows, min-content, 30px, 30px, 30px);
        grid-template-columns: var(--card--grid-columns, repeat(5, 1fr));
        grid-template-areas: var(--card--grid-areas, "n n n n n" "p s hs ha t" "o m vs va h" "ao aot af aft a");
        gap: var(--card-grid-gap, 6px 6px);
        align-items: center;
        place-content: space-between;
      }
      ha-card>div {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--box-background-color, rgba(125,125,125,0.1));
        border-radius: 5px;
        border: none;
        width: 100%;
        height: 100%;
        min-height: 40px;
        cursor: pointer;
        transition: all 0.4s;
      }
      ha-card>div:active {
        background-color: var(--box-active-background-color, rgba(127,127,0, 0.3));
      }
      ha-card>div.active {
        background-color: var(--box-active-background-color, rgba(127,127,0, 0.3));
      }
      ha-card>div.active .icon-waper ha-icon {
        color: var(--icon-active-color, --primary-text-color);
      }
      .title {        grid-area: n; }
      .power {        grid-area: p; }
      .mode {         grid-area: m; }
      .speed {        grid-area: s; }
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
      .locked {       grid-area: a; position: relative; width: 50%; left: 50%; }

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
      .off_delay_time.active .state {
        display: inline;
      }
      .off_delay_time .state:after {
        content: "m";
        font-size: 80%;
      }
      .vswing_angle .state:after,
      .hswing_angle .state:after {
        content: "°";
      }
      .not-found {
        background-color: yellow;
        font-family: sans-serif;
        font-size: 14px;
        padding: 8px;
      }
    `;
  }
}
customElements.define("fanXiaomiMiot-card", fanXiaomiMiotCard);
console.info(`%cFAN-XIAOMI-MIOT v0.0.4 IS INSTALLED`,"color: green; font-weight: bold","");