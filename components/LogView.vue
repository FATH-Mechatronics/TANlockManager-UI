<template>
  <v-card style="margin: 1em 0;">
    <v-card-title class="headline">
      Live Events
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="logs"
        :search="search"
        sort-by="time"
        :sort-desc="true"
        dense
      >
        <template v-slot:item.time="{ item }">{{ new Date(item.time).toLocaleString() }}</template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import LogEvent from "../model/LogEvent";

  @Component({
    components: {},
    async mounted() {
      return this.$axios.get(`/data/log`).then(res => {
        if (res) {
          this.logs = res.data;
        }
      });
    },
    beforeMount() {
      this.$socketio.socket.on("logEvent", (msg) => {
        this.logs.push(msg);
      });
    }
  })
  class LogView extends Vue {
    logs: LogEvent[] = [];
    search: string = "";

    get headers() {
      return [
        {text: "Name", value: "name"},
        {text: "Timestamp", value: "time"},
        {text: "Message", value: "value"}
      ];
    }

    /*lockLink(item) {
      return "/locks/" + item.ip;
    }*/
  }

  export default LogView;
</script>
