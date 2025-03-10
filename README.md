# lovelace-fan-xiaomi-miot
 [```Xiaomi Miot Auto```](https://github.com/al-one/hass-xiaomi-miot)통합구성요소로 구성한 것에 한해 작동합니다.<br><br>
![screenshot](https://user-images.githubusercontent.com/41262994/175013447-350e34b2-5536-4004-98e7-066998bd47ea.jpg)<br>

## 지원 장치
 * fan
   * [```dmaker.fan.p220(p221)```](https://home.miot-spec.com/spec/dmaker.fan.p220)
   * [```dmaker.fan.p33```](https://home.miot-spec.com/spec/dmaker.fan.p33)
   * [```dmaker.fan.p45```](https://home.miot-spec.com/spec/dmaker.fan.p45) 
   * [```dmaker.fan.p5```](https://home.miot-spec.com/spec/dmaker.fan.p5)
   * [```zhimi.fan.za4```](https://home.miot-spec.com/spec/zhimi.fan.za4) - 타이머 지원 안함
   
 * heater
   * [```zhimi.heater.za2```](https://home.miot-spec.com/spec/zhimi.heater.za2)
 * humidifier
   * [```deerma.humidifier.jsq2g```](https://home.miot-spec.com/spec/deerma.humidifier.jsq2g), [```deerma.humidifier.jsq2w```](https://home.miot-spec.com/spec/deerma.humidifier.jsq2w)
 * dehumidifier
   * [```dmaker.derh.22l```](https://home.miot-spec.com/spec/dmaker.derh.22l)
 <br>

## 설치
HACS > fontend > Custom repositories add > `dugurs/lovelace-fan-xiaomi-miot`<br>
HACS > fontend > ➕ EXPLORE & DOWNLOAD REPOSITORIES > `fan-xiaomi-miot` > DOWNLOAD THIS REPOSITORY


## 사용
사용자정의 카드 추가로 아래와 같이 넣으면 됩니다.<br>
entity는 사용자 구성에 맞게 수정 해주셔야 합니다.
```
type: custom:fanxiaomimiot-card
entity: fan.dmaker_p220_72de_fan
model: dmaker_fan_p220
```
![image](https://user-images.githubusercontent.com/41262994/173026796-56a217eb-b1ab-4bde-9178-920794e66428.png)<br>
![dmaker.fan.p220](https://user-images.githubusercontent.com/41262994/174616733-31410f29-41a9-4aa7-99f2-c2c86dbd27d6.png)<br>
![dmaker.fan.p5](https://user-images.githubusercontent.com/41262994/174618681-d80eeb25-60b0-47b3-82b6-66b94a08f72e.png)<br>
![zhimi.heater.za2](https://user-images.githubusercontent.com/41262994/206959834-12edd70b-7ff9-4e91-af44-de1b87c4fc78.jpg)<br>
![deerma.humidifier.jsq2](https://user-images.githubusercontent.com/41262994/209661974-e9c78951-24e4-4adc-8233-f7fb8fda5b6b.png)<br>





## 옵션
| option | 설정값(예)        | 기본값       | 내용              |
| :-----: | :---------: | :---------: | ----------------------- |
| hide_title | true |   | 상단 타이틀을 숨길수 있습니다. |
| percentage_step | 20 | 25 | 속도조절 스탭을 설정합니다. |
| off_delay_time | [0,30,60,120] | [0,30,60,120,180,240,300,360,420,480] |  선풍기 모델의 off 타이머 단계를 원하는 시간(분)으로 설정할수 있습니다. |
| model | dmaker_fan_p33, dmaker_fan_p45, dmaker_fan_p5, zhimi_heater_za2, deerma_humidifier_jsq2w, deerma_humidifier_jsq2g, ... | dmaker_fan_p220 | 모델을 설정 합니다. |
* dmaker.fan.p221은 dmaker_fan_p220로 model 설정 하세요.
* dmaker.fan.p33은 테스트되지 않아 오작동 할 수 있습니다.


## model 추가 설명
```
  off_delay_time: {
    prop: {
      entity_id: this.config.entity.replace(/^fan\./i, 'number.').replace(/_fan$/i, '_off_delay_time'),
      siid: 3,
      piid: 1
    },
    value: [0,30,60,120,180,240,300,360,420,480],
    icon: 'mdi:camera-timer'
  }
```
#값 가져오기 
  - prop 가 문자열이면
    - button info 엔터터에서 속성정보를 가져옴.
  - prop.entity_id 가 설정되어있으면, 
    - prop.entity_id의 state를 읽어옴
  - prop에 siid, piid만 있으면 
    - 값은 읽어오지 못함, 
    - 토글시 xiaomi_miot.set_miot_property 서비스 실행, 값은 value 로 전달하는데 step가 더하기 적용, backward가 true면 빼기, step가 0이면 그대로
#토글시
  - prop entity_id 만 설졍되어 있으면 entity_id변경
  - siid 가 있으면 xiaomi_miot.set_miot_property 서비스 실행
  - service 가 있으면 service 실행
  - 전달 값은
    - step이 있으면 더하기 적용, backward가 true면 빼기, step 0 설정이 있으면 value 전달
    - value가 배열이면 순차 전달
#기타
  - state 배열설정은 value 배열과 같이 설정 한느데, 읽은 값에 index적용해 문자열로 표시핼때 필요
  - icon 문자열로 설정하면 아이콘 고정, 배열로 설정하면 값에 index적용
  - click ''설정시 토글 안됨.




## card-mod
https://github.com/thomasloven/lovelace-card-mod<br>
card_mod를 이용한 색상 변수를 사용할수 있습니다.
```
type: custom:fanxiaomimiot-card
entity: fan.dmaker_p220_72de_fan
model: dmaker_fan_p220
hide_title: true
card_mod:
  style: |
    :host {
      --box-background-color: rgba(125,125,125,0.1);
      --box-active-background-color: rgba(200,200,0, 0.3);
      --icon-active-color: var(--state-icon-active-color);
    }
```

아래는 card_mod style 기본 값입니다.<br>
필요한것만 넣어 수정 해주시면 됩니다.
```
card_mod:
  style: |
    :host {
      --box-background-color: var(--secondary-background-color);
      --box-active-background-color: var(--primary-color);
      --icon-active-color: var(--primary-text-color);
      --card-grid-gap: 6px 6px;
      --card-padding: 10px;
      --card-primary-text-color: var(--primary-text-color);
      --card-background: var(--card-background-colo);
      --card-border-radius: 4px;
      --card-box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
      --card--grid-rows: min-content, 30px, 30px, 30px;
      --card--grid-columns: repeat(5, 1fr);
      --card--grid-areas: "n n n n n" "p s hs ha t" "o m vs va h" "ao aot af aft a";
    }
```

card_mod 설정 예: 타이틀과 온도 켜기끄기 라인을 완전히 쉼기고 싶다면..
```
type: custom:fanxiaomimiot-card
entity: fan.dmaker_p220_72de_fan
model: dmaker_fan_p220
card_mod:
  style: |
    :host {
      --card--grid-areas: "p s hs ha t" "o m vs va h";
    }
    .title,
    .auto_on,
    .auto_on_temp_minus,
    .auto_on_temp_plus,
    .auto_off,
    .auto_off_temp_minus,
    .auto_off_temp_plus,
    .alarm,
    .locked {
      display: none;
    }
```
![image2](https://user-images.githubusercontent.com/41262994/173027850-e94fe368-b6e1-4054-9270-83315d291c34.png)


버튼별 className은 다음을 참고 하세요.
```
.title {        grid-area: n; }
.power {        grid-area: p; }
.mode {         grid-area: m; }
.speed_down {   grid-area: s; }
.speed_up {     grid-area: s; }
.speed_slider { grid-area: n; }
.off_delay_time { grid-area: o; }
.hswing {       grid-area: hs; }
.hswing_angle { grid-area: ha; }
.swing_left {   grid-area: ha; }
.swing_right {  grid-area: ha; }
.vswing {       grid-area: vs; }
.vswing_angle { grid-area: va; }
.swing_down {   grid-area: va; }
.swing_up {     grid-area: va; }
.auto_on {      grid-area: ao; }
.auto_on_temp_minus {grid-area: aot; }
.auto_on_temp_plus  {grid-area: aot; }
.auto_off {     grid-area: af; }
.auto_off_temp_minus{grid-area: aft; }
.auto_off_temp_plus {grid-area: aft; }
.temperature  { grid-area: t; }
.humidity {     grid-area: h; }
.alarm {        grid-area: a; }
.locked {       grid-area: a; }
```


## card_mod 설정 예..
```
type: custom:fanxiaomimiot-card
entity: fan.dmaker_p5_8433_fan
model: dmaker_fan_p5
card_mod:
  style: |
    :host {
      --card--grid-columns: repeat(5, 1fr);
      --card--grid-areas: "n n n n n" "p hs ha o a";
    }
    :host .mode {
      grid-area: a;
      position: relative; width: 50%; left: 50%;
    }
    .speed_down,
    .speed_up,
    .locked {
      display: none;
    }
```
![card_mod example](https://user-images.githubusercontent.com/41262994/175018180-2801b281-5db1-4cca-bef7-181668b318f7.png)
