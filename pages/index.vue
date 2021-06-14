<template>
  <v-layout column xs12>
    <v-flex>
      <LockSummary :locks="locks"/>
      <LockList :locks="locks.filter(l=>l.accepted)"/>
      <LogView/>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import LockSummary from "../components/LockSummary.vue";
  import LockList from "../components/LockList.vue";
  import LogView from "../components/LogView.vue";
  import {Component, Vue} from "vue-property-decorator";
  import TanLock from "../model/TanLock";

  @Component({
    components: {
      LockSummary,
      LockList,
      LogView
    },
    async mounted() {
      return this.$axios
        .get(`/data/lock/all`)
        .then(res => {
          if (res) {
            this.locks = res.data;
          }
        });
    },
    beforeMount() {
      this.$socketio.socket.on("tanlockEvent", msg => {
        if (msg != undefined) {
          let l: TanLock = this.locks.find(obj => obj.id === msg.id);
          if (l != undefined) {
            l.name = msg.name;
            l.heartbeat = msg.heartbeat;
            l.ip = msg.ip;
            l.accepted = msg.accepted;
            l.state = msg.state;
            l.door_1 = msg.door_1;
            l.useDoor_1 = msg.useDoor_1;
            l.door_2 = msg.door_2;
            l.useDoor_2 = msg.useDoor_2;
            console.log("Modded Lock");
          } else {
            this.locks.push(msg);
            console.log("New Lock");
          }
          this.$forceUpdate();
        }
      });
    },
    head: {
      title: "Dashboard"
    }
  })
  class IndexPage extends Vue {
    locks: TanLock[] = [];
  }

  export default IndexPage;
</script>

