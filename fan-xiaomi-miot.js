
import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

// https://velog.io/@jerrynim_/lit-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-2n-property

class fanXiaomiMiotCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }
  
  btns = {};
  models = {}

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define entity");
    }
    this.config = config;
  }

  async connectedCallback() {
    super.connectedCallback()
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
          label: 'dm_service.speed_level'
        },
        // speed: {
        //   prop: 'fan.fan_level',
        //   value: [1,2,3,4],
        //   icon: ['mdi:numeric-1-box-outline','mdi:numeric-2-box-outline','mdi:numeric-3-box-outline','mdi:numeric-4-box-outline']
        // },
        speed_down: {
          prop: 'dm_service.speed_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-down',
          backward: true
        },
        speed_up: {
          prop: 'dm_service.speed_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-up',
        },
        speed_slider: {
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
          prop: 'dm_service.swing_updown_manual',
          value: 2,
          icon: 'mdi:chevron-down',
        },
        swing_up: {
          prop: 'dm_service.swing_updown_manual',
          value: 1,
          icon: 'mdi:chevron-up',
        },
        swing_left: {
          prop: 'dm_service.swing_lr_manual',
          value: 1,
          icon: 'mdi:chevron-left',
        },
        swing_right: {
          prop: 'dm_service.swing_lr_manual',
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
      dmaker_fan_p5: {
        power: {
          prop: 'fan.on',
          value: false,
          state: ['off', 'on'],
          icon: 'mdi:fan',
          label: 'fan.speed_level'
        },
        speed_down: {
          prop: 'fan.speed_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-down',
          backward: true
        },
        speed_up: {
          prop: 'fan.speed_level',
          value: 1,
          min: 1,
          max: 100,
          step: this.config.percentage_step ?? 25,
          icon: 'mdi:chevron-up',
        },
        speed_slider: {
          prop: 'fan.speed_level',
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
          prop: 'fan.horizontal_angle',
          value: [30,60,90,120,140],
          icon: 'mdi:arrow-left-right',
        },
        swing_left: {
          prop: {
            siid: 2,
            piid: 7
          },
          value: -7,
          icon: 'mdi:chevron-left',
        },
        swing_right: {
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
      }
    }

    const model = this.config.model ?? 'dmaker_fan_p220';
    this.btns = this.models[model];
  
  }



  render() {
    const state = this.hass.states[this.config.entity];
    const stateStr = state ? state.state : 'unavailable';
    const model = this.config.model ?? 'dmaker_fan_p220';
    if (stateStr == 'unavailable') {
      return html`<div class="not-found">Entity ${this.config.entity} not found.</div>`;
    } else {
      const hideTitle = this.config?.hide_title ? 'hide' : '';
      return html`
        <ha-card class="${model}">
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
    if (btn.name == 'speed_slider') {
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
    if (typeof this.btns[btn.label] == 'undefined') {
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
    // console.log(type, btn.name, _field, _value, typeof _value);
    if (typeof btn.prop == 'object') {
      this.hass.callService('xiaomi_miot', "set_miot_property", {
        entity_id: state.entity_id,
        siid: btn.prop.siid,
        piid: btn.prop.piid,
        value: _value
      });
    } else {
      this.hass.callService('xiaomi_miot', "set_property", {
        entity_id: state.entity_id,
        field: _field,
        value: _value
      });
    }

    // 속도 조절시 전원이 꺼져있으면 켜기
    if (btn.name == 'speed_slider' && state.attributes[this.btns.power.prop] == false) {
      this._toggle('click', state, this.btns.power, true);
    }
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
      @keyframes rotate_image{
        100% {
            transform: rotate(360deg);
        }
      }
      ha-card {
        background: var(--ha-card-background, var(--card-background-color, white) );
        border-radius: var(--ha-card-border-radius, 4px);
        box-shadow: var( --ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) );
        color: var(--primary-text-color);
        padding: var(--card-padding, 10px);
        display: grid;
        grid-template-rows: var(--card--grid-rows, min-content, 30px, 30px, 30px);
        grid-template-columns: var(--card--grid-columns, repeat(5, 1fr));
        grid-template-areas: var(--card--grid-areas, "n n n n n" "p s hs ha t" "o m vs va h" "ao aot af aft a");
        gap: var(--card-grid-gap, 6px 6px);
        align-items: center;
        place-content: space-between;
      }
      ha-card.dmaker_fan_p5 {
        grid-template-rows: var(--card--grid-rows, min-content, 30px);
        grid-template-columns: var(--card--grid-columns, repeat(7, 1fr));
        grid-template-areas: var(--card--grid-areas, "n n n n n n n" "p s hs ha o m a");
      }
      ha-card>div {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--box-background-color, var(--secondary-background-color));
        color: var(--secondary-text-color);
        --color: var(--primary-text-color);
        border-radius: 5px;
        border: none;
        width: 100%;
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
      ha-card>div:active.speed_slider { 
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
      ha-card>div.power.active .icon-waper {
        --animation: rotate_image 1.5s linear infinite;
        --transform-origin: 50% 50%;
      }
      .title {        grid-area: n; color: var(--primary-text-color) }
      .power {        grid-area: p; }
      .mode {         grid-area: m; }
      .speed {        grid-area: s; }
      .speed_down {   grid-area: s; position: relative; width: 50%; }
      .speed_up {     grid-area: s; position: relative; width: 50%; left: 50%;}
      .speed_slider { grid-area: n; opacity: 0.5; }
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
      .power .label:after {
        content: "%";
        font-size: 80%;
      }
      .off_delay_time .state:after {
        content: "m";
        font-size: 80%;
      }
      .vswing_angle .state:after,
      .hswing_angle .state:after {
        content: "°";
      }
      .hswing_angle .icon-waper,
      .vswing_angle .icon-waper {
        transform: scale(0.7);
      }
      .not-found {
        background-color: var(--error-color);
        font-family: sans-serif;
        font-size: 14px;
        padding: 8px;
        border-radius: 5px;
        border: none;
        min-height: 40px;
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
        border-radius: 5px;
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

  // static getConfigElement() {
  //   return document.createElement("fanxiaomimiot-card-editor");
  // }
  // static getStubConfig() {
  //   return { entity: "sun.sun" }
  // }

}
customElements.define("fanxiaomimiot-card", fanXiaomiMiotCard);
console.info(`%cFAN-XIAOMI-MIOT v0.0.8 IS INSTALLED`,"color: green; font-weight: bold","");


// class fanXiaomiMiotCardEditor extends LitElement {

//   setConfig(config) {
//     this._config = config;
//   }

//   entityChanged(ev) {
//     const _config = Object.assign({}, this._config);
//     _config.entity = ev.target.value;
//     this._config = _config;

//     const event = new CustomEvent("config-changed", {
//       detail: { config: _config },
//       bubbles: true,
//       composed: true,
//     });
//     this.dispatchEvent(event);
//   }

//   render() {
//     if (!this.hass || !this._config) {
//       return html``;
//     }

//     return html`
//     Entity:
//     <input
//     .value=${this._config.entity}
//     @focusout=${this.entityChanged}
//     ></input>
//     `;
//   }
// }
// customElements.define("fanxiaomimiot-card-editor", fanXiaomiMiotCardEditor);

// window.customCards = window.customCards || [];
// window.customCards.push({
//   type: "fanxiaomimiot-card",
//   name: "fan Xiaomi Miot card",
//   preview: false, // Optional - defaults to false
//   description: "A custom card made by me!" // Optional
// });

// https://gist.github.com/thomasloven/1de8c62d691e754f95b023105fe4b74b
