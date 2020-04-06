<template>
  <v-card style="margin: 1em 0;">
    <v-card-title class="headline">Modify Role</v-card-title>
    <v-card-text>
      <PickList
        style="margin: auto;"
        :options="permissions"
        :choosenOptions="selectedPermissions"
        value="displayname"
        titleLeft="Assigned Permissions"
        titleRight="Available Permissions"
        @on-selected="onSelected"
      />
      <!--<v-layout>
        <v-data-table :items="permissions" :headers="headers" show-select v-model="selectedPermissions" dense ></v-data-table>
        <div style="margin: auto;">
          <v-btn block>Apply</v-btn>
          <br />
          <v-btn block class="warning">Abort</v-btn>
          <br />
          <v-btn block class="error">Delete Role</v-btn>
        </div>
      </v-layout>-->
      <!--<PickList :options="groups" title="Groups" event="on-group-selected" @on-group-selected="onGroupSelected" />-->
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn :disabled="role==null" @click.end="applyRole">Apply Permission</v-btn>
      <v-btn :disabled="role==null" class="error" @click.end="editRole">Edit / Delete Role</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
  import PickList from "../Customs/PickList.vue";
  import {Component, Vue, Prop} from "vue-property-decorator";
  import Permission from "../../model/Permission";
  import Role from "../../model/Role";

  @Component({
    async mounted() {
      return this.$axios.get(`/data/permission`).then(res => {
        res.data.forEach(perm => this.permissions.push(perm));
      });
    },
    components: {
      PickList
    }
  })
  class ModifyRole extends Vue {
    permissions: Permission[] = [];

    @Prop({default: () => null})
    role: Role;

    get selectedPermissions(): any[] {
      if (this.role == null) {
        return [];
      } else {
        return this.role.permissions;
      }
    }

    onSelected(selected) {
      console.log("SELECTED PERMS: " + selected);
    }

    applyRole() {
      this.role = new Role(this.role);
      this.$axios
        .put(`/data/role/${this.role.id}`, this.role.slim())
        .then(res => {
          /*if (res.data.ip != this.baseIp) {
              this.$router.push(`/locks/${res.data.ip}`);
              }*/
          //this.clickOutside();
          location.reload();
        })
        .catch(message => alert(`${message}`));
    }

    editRole() {
      this.$emit("on-edit-role");
    }
  }

  export default ModifyRole;
</script>
