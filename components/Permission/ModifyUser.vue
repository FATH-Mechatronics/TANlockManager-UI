<template>
  <v-card style="margin: 1em 0;">
    <v-card-title class="headline">Modify User</v-card-title>
    <v-card-text>
      <PickList
        style="margin: auto;"
        :options="roles"
        :choosenOptions="selectedRoles"
        titleLeft="Assigned Roles"
        titleRight="Available Roles"
        @on-selected="onSelected"
        value="name"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn :disabled="user==null" @click.end="applyUser">Apply Rule</v-btn>
      <v-btn :disabled="user==null" class="error" @click.end="editUser">Edit / Delete User</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
  import PickList from "../Customs/PickList.vue";
  import {Component, Vue, Prop} from "vue-property-decorator";
  import User from "../../model/User";
  import Role from "../../model/Role";

  @Component({
    async mounted() {
      return this.$axios.get(`/data/role`).then(res => {
        this.roles = res.data;
      });
    },
    components: {
      PickList
    }
  })
  class ModifyUser extends Vue {
    roles: Role[] = [];
    _selectedRoles: Role[] = [];

    @Prop({
      default: () => null
    })
    user: User;

    get selectedRoles(): Role[] {
      if (this.user == null) {
        return [];
      } else {
        return this.user.roles;
      }
    }

    onSelected(selected: Role[]) {
      console.log("SELECTED ROLES: " + selected);
    }

    applyUser() {
      this.user = new User(this.user);
      this.$axios
        .put(`/data/user/${this.user.user}`, this.user.flat())
        .then(res => {
          /*if (res.data.ip != this.baseIp) {
              this.$router.push(`/locks/${res.data.ip}`);
              }*/
          //this.clickOutside();
          location.reload();
        })
        .catch(message => alert(`${message}`));
    }

    editUser() {
      this.$emit("on-edit-user");
    }
  }

  export default ModifyUser;
</script>
