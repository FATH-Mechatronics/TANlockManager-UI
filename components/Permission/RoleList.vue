<template>
  <v-card style="margin: 1em 0;">
    <v-card-title class="headline">
      Role List
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
        :items="roles"
        :search="search"
        :multi-sort="true"
        show-select
        single-select
        item-key="id"
        v-model="selected"
      >
      <template v-slot:item.permissions="{ item }">
        <v-chip v-for="permission in item.permissions" v-bind:key="permission.permission" class="mr-1 mt-1">{{permission.displayname}}</v-chip>
      </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="selected_val.length > 0" @click.stop="createNewRole">Create Role</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Role from "../../model/Role";
@Component({
  async mounted() {
    return this.$axios.get(`/data/role`).then(res => {
      this.roles = res.data;
    });
  }
})
class RoleList extends Vue {
  roles: Role[] = [];
  search: string = "";
  headers = [{ text: "Name", value: "name" }, {text: "Permissions", value:"permissions"}];
  selected_val: Role[] = [];


  get selected(){
    return this.selected_val;
  }

  set selected(sel){
    this.selected_val = sel;
    this.$emit("on-role-selected", sel);
  }

  createNewRole(){
    this.$emit("on-new-role");
  }
}
export default RoleList;
</script>
