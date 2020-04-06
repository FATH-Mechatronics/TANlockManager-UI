<template>
  <v-layout style="margin: .5em 0;">
    <v-data-table
      :headers="headers"
      :items="doors"
      disable-sort
      disable-pagination
      hide-default-footer
      dense
    >
      <template v-slot:item.state="{ item }">
        <v-icon :color="doorColor(item.state)">mdi-checkbox-blank-circle</v-icon>
      </template>
    </v-data-table>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import TanLock from "../../model/TanLock";

  @Component({
    components: {},
    async mounted() {
      /*return axios
        .all([
          this.$axios.get(`/data/cage/${this.cage.id}/cabinet`),
          this.$axios.get(`/data/cage`),
          this.$axios.get(`/data/lock`)
        ])
        .then(
          axios.spread((resCabinet, resCage, resLock) => {
            this.cabinets = resCabinet.data;
            this.cages = resCage.data;
            this.locks = resLock.data;
          })
        );*/

      this.$socketio.on("tanlockEvent", (msg: TanLock) => {
        if (msg != undefined && msg.accepted === true) {
          if (this.lock.id === msg.id) {
            this.lock.door_1 = msg.door_1;
            this.lock.useDoor_1 = msg.useDoor_1;
            this.lock.door_2 = msg.door_2;
            this.lock.useDoor_2 = msg.useDoor_2;
            this.$forceUpdate();
          }
        }
      });
    }
  })
  class DoorContact extends Vue {
    @Prop({
      default: () => {
        return new TanLock();
      }
    })
    lock: TanLock;

    headers = [
      {text: "DoorContact", value: "door"},
      {text: "State", value: "state"}
    ];

    get doors(): { door: string; state: boolean }[] {
      let l = [];
      if (this.lock.useDoor_1) {
        l.push({door: "DC1", state: this.lock.door_1});
      }
      if (this.lock.useDoor_2) {
        l.push({door: "DC2", state: this.lock.door_2});
      }
      return l;
    }

    doorColor(state) {
      if (state === true) {
        return "green";
      } else {
        return "red";
      }
    }
  }

  export default DoorContact;
</script>
