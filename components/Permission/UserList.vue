<template>
  <v-card style="margin: 1em 0;">
    <v-card-title class="headline">
      User List
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
        :items="users"
        :search="search"
        :multi-sort="true"
        show-select
        single-select
        item-key="user"
        v-model="selected"
      >
        <template v-slot:item.roles="{ item }">
          <v-chip v-for="role in item.roles" v-bind:key="role.id" class="mr-1">{{role.name}}</v-chip>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn :disabled="selected_val.length > 0" @click.stop="createNewUser">Create User</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import User from "../../model/User";

  @Component({
    async mounted() {
      return this.$axios.get(`/data/user`).then(res => {
        this.users = res.data;
      });
    }
  })
  class UserList extends Vue {
    users: User[] = [];
    groups: String[] = [];
    search: string = "";
    headers = [{text: "User", value: "user"}, {text: "Roles", value: "roles"}];
    selected_val: User[] = [];


    get selected() {
      return this.selected_val;
    }

    set selected(sel) {
      this.selected_val = sel;
      this.$emit("on-users-selected", sel);
    }

    createNewUser() {
      this.$emit("on-new-user");
    }
  }

  export default UserList;
</script>
