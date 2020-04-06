<template>
    <v-data-table :headers="headers" :items="tans" :search="search" item-key="user">
      <template v-slot:item.ttl="{ item }">{{ new Date(item.ttl).toLocaleString() }}</template>
    </v-data-table>
</template>
<script lang="ts">
//import TanCreationDialog from "./Dialogs/TanCreationDialog.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
import { Route } from "vue-router";

import TanLock from "../model/TanLock";
import User from "../model/User";
import permissionHide from "../commons/permissionHide";
import Tan from "../model/Tan";

@Component({
  components: {},
  async mounted() {
    this.$axios
      .get(`/data/lock/${this.lock.id}/tan`)
      .then(res => {
        this.tans = res.data;
      })
      .catch(err => {});
  }
})
class TanListComponent extends Vue {
  @Prop({
    default: () => {
      return new TanLock();
    }
  })
  lock: TanLock;
  tans: Tan[] = [];
  search = "";
  get headers() {
    return [
      { text: "User", value: "user" },
      { text: "TTL", value: "ttl" },
      { text: "Note", value: "note"},
      { text: "Action", value: "action" }
    ];
  }

  hiddenStyle = permissionHide.hiddenStyle;
  hasPermission = permissionHide.hasPermission;
}

export default TanListComponent;
</script>
