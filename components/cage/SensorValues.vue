<template>
  <v-layout column style="margin: .5em 0;">
    <v-data-table
      :headers="headers"
      :items="sensors"
      disable-sort
      disable-pagination
      hide-default-footer
      dense
    >
      <template v-slot:item.value="{ item }">{{ item.value | fixed(2) }} {{ getSensorScale(item) }}</template>
    </v-data-table>
  </v-layout>
</template>
<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import TanLock from "../../model/TanLock";
  import CabinetLogEntry from "../../model/CabinetLogEntry";

  @Component({
    components: {},
    async mounted() {
      if (this.lock != null) {
        this.$axios.get(`/data/lock/${this.lock.id}/sensor`).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            if (Array.isArray(res.data[i])) {
              for (let j = 0; j < res.data[i].length; j++) {
                this.sensors.push(res.data[i][j]);
              }
            } else {
              this.sensors.push(res.data[i]);
            }
          }
        })
          .catch(err => {
          });
        this.$socketio.socket.on("sensorUpdate", (msg: CabinetLogEntry) => {
          if (msg != undefined) {
            if (this.lock.id === msg.lock_id) {
              this.sensors.splice(0);
              for (let i = 0; i < msg.value.length; i++) {
                if (Array.isArray(msg.value[i])) {
                  for (let j = 0; j < msg.value[i].length; j++) {
                    this.sensors.push(msg.value[i][j]);
                  }
                } else {
                  this.sensors.push(msg.value[i]);
                }
              }
            }
          }
        });
      }
    },
    beforeMount() {
      /*this.$socketio.socket.on("tanlockEvent", msg => {
        if (msg != undefined && msg.accepted === true) {
          if (this.cabinet.frontLock === msg.ip) {
            this.lockstate.front = msg.state;
            this.$forceUpdate();
          } else if (this.cabinet.backLock === msg.ip) {
            this.lockstate.back = msg.state;
            this.$forceUpdate();
          }
        }
      });*/
    }
  })
  class SensorValuesComponent extends Vue {
    @Prop({
      default: () => {
        return null;
      }
    })
    lock: TanLock;

    headers = [
      {text: "Sensor", value: "sensor"},
      {text: "Value", value: "value"}
    ];

    sensors: { sensor: string; value: string }[] = [];

    getSensorScale(sensor) {
      return sensor.scale || "";
    }
  }

  export default SensorValuesComponent;
</script>
