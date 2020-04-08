<template>
  <v-layout
    column
    style="text-align: center; padding: 0; margin: .25em .25em; display: inline-block; white-space: nowrap;"
    align-self-start
    class="secondary darken-1"
    @click.stop="goToCabinet()"
  >
    <pre style="padding: 0 0.5em; text-align: left;">{{filledName}}</pre>
    <TextState :lock="locks[0]" classsuffix="lighten-1"/>
    <div>
      <div :style="firstSensorsStyle" class="white black--text">
        <pre v-for="sensor in sensors.front" v-bind:key="sensor.sensor"> {{getSensorLable(sensor)}} {{fillSensorValue(sensor)}} </pre>
      </div>
      <div
        style="padding: 0.25em 0; text-align: left; display: inline-block; height: 100%;"
        class="grey lighten-3 black--text"
        v-if="locks[1] != null"
      >
        <pre v-for="sensor in sensors.back" v-bind:key="sensor.sensor"> {{getSensorLable(sensor)}} {{fillSensorValue(sensor)}} </pre>
      </div>
    </div>
    <TextState :lock="locks[1]" classsuffix="darken-1"/>
  </v-layout>
</template>

<script lang="ts">
  import TextState from "../LockStates/TextState.vue";
  import {Component, Vue, Prop} from "vue-property-decorator";

  import {setTimeout} from "timers";
  import Cabinet from "../../model/Cabinet";
  import CabinetLogEntry from "../../model/CabinetLogEntry";
  import TanLock from "../../model/TanLock";
  import Cage from "../../model/Cage";

  @Component({
    components: {
      TextState
    },
    async mounted() {
      this.$axios.get(`/data/lock/${this.cabinet.frontLock}/sensor`).then(res => {
        for (let i = 0; i < res.data.length; i++)
          this.rawSensors.front.push(res.data[i]);

        if (this.cabinet.backLock != null && this.cabinet.backLock != -1) {
          this.$axios
            .get(`/data/lock/${this.cabinet.backLock}/sensor`)
            .then(res => {
              for (let i = 0; i < res.data.length; i++)
                this.rawSensors.back.push(res.data[i]);
              console.log("second RES");
              this.populateSensors();
              this.iterateSensorGroups();
            });
        } else {
          this.populateSensors();
          this.iterateSensorGroups();
        }
      });
    },
    beforeMount() {
      this.$socketio.on("tanlockEvent", msg => {
        if (msg != undefined && msg.accepted === true) {
          if (this.cabinet.frontLock === msg.id) {
            this.locks[0] = msg;
            this.$forceUpdate();
          } else if (this.cabinet.backLock === msg.id) {
            this.locks[1] = msg;
            this.$forceUpdate();
          }
        }
      });

      this.$socketio.on("sensorUpdate", (msg: CabinetLogEntry) => {
        if (msg != undefined) {
          if (this.cabinet.frontLock === msg.lock_id) {
            this.rawSensors.front = msg.value;
          } else if (this.cabinet.backLock === msg.lock_id) {
            this.rawSensors.back = msg.value;
          }
        }
      });
    }
  })
  class CabinetComponent extends Vue {
    @Prop({
      default: () => {
        return new Cabinet({id: -1, name: "foo"});
      }
    })
    cabinet: Cabinet;

    @Prop({
      default: () => []
    })
    locks: TanLock[];

    cages: Cage[] = [];

    rawSensors: { front: []; back: [] } = {front: [], back: []};
    sensors: { front: any[]; back: any[] } = {front: [], back: []};

    groupCurrent: { front: any; back: any } = {front: {}, back: {}};

    cabinetEdit: Cabinet = new Cabinet();

    dialog = false;

    get cabinetLink() {
      return "/cabinets/" + this.cabinet.id;
    }

    get cabinetColor() {
      if (
        this.locks[0].state === "locked" &&
        (this.locks[1] == null || this.locks[1].state === "locked")
      ) {
        return "secondary lighten-1";
      }
      return "error";
    }

    get filledName() {
      let fillName = this.cabinet.name.slice(0, 15);
      while (fillName.length < 15) {
        fillName += " ";
      }
      return fillName;
    }

    get firstSensorsStyle() {
      if (this.locks[1] == null) {
        return "padding: 0.25em 0; text-align: left;";
      }
      return "padding: 0.25em 0; text-align: left; float: left;";
    }

    fillSensorValue(sensor) {
      if (!sensor) {
        return "NV";
      }
      let fillValue = sensor.value + this.getSensorScale(sensor);
      let fillLength = this.locks[1] == null ? 14 : 6;
      fillLength -= this.getSensorLable(sensor).length;
      if (fillValue.length > fillLength) {
        fillValue = fillValue.slice(0, fillLength);
      }
      while (fillValue.length < fillLength) {
        fillValue = " " + fillValue;
        //console.log('"' + fillValue + '"', fillValue.length);
      }
      return fillValue;
    }

    goToCabinet() {
      this.$router.push(this.cabinetLink);
      return;
    }

    getSensorLable(sensor) {
      if (!sensor) {
        return "NL";
      }
      return sensor.lable || sensor.sensor;
    }

    getSensorScale(sensor) {
      if (!sensor) {
        return "ns";
      }
      return sensor.scale || "";
    }

    populateSensors() {
      for (let i = 0; i < this.rawSensors.front.length; i++) {
        if (Array.isArray(this.sensors.front[i])) {
          this.sensors.front[i] = this.rawSensors.front[i][0];
        } else {
          this.sensors.front[i] = this.rawSensors.front[i];
        }
      }
      for (let i = 0; i < this.rawSensors.back.length; i++) {
        if (Array.isArray(this.rawSensors.back[i])) {
          this.sensors.back[i] = this.rawSensors.back[i][0];
        } else {
          this.sensors.back[i] = this.rawSensors.back[i];
        }
      }
    }

    iterateSensorGroups() {
      for (let i = 0; i < this.rawSensors.front.length; i++) {
        let sensor: any | any[] = this.rawSensors.front[i];
        if (Array.isArray(sensor)) {
          if (this.groupCurrent[i]) {
            this.groupCurrent[i] = (this.groupCurrent[i] + 1) % sensor.length;
          } else {
            this.groupCurrent[i] = 1 % sensor.length;
          }
          this.sensors.front[i] = sensor[this.groupCurrent[i]];
        } else {
          this.sensors.front[i] = sensor;
        }
      }
      for (let i = 0; i < this.rawSensors.back.length; i++) {
        let sensor = this.rawSensors.back[i];
        if (Array.isArray(sensor)) {
          this.sensors.back[i] = sensor[this.groupCurrent[i]];
        } else {
          this.sensors.back[i] = sensor;
        }
      }
      this.updateAlive();
      this.$forceUpdate();
      setTimeout(this.iterateSensorGroups, 2000);
    }

    updateAlive() {
      if (this.locks[0] != null && new Date().getTime() - this.locks[0].heartbeat >= 120_000) {
        this.locks[0].state = "offline";
      }
      if (this.locks[1] != null && new Date().getTime() - this.locks[1].heartbeat >= 120_000) {
        this.locks[1].state = "offline";
      }
    }
  }

  export default CabinetComponent;
</script>
