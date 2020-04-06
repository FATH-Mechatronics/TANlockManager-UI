<template>
  <v-layout column xs12>
    <v-flex>
      <RoleList @on-role-selected="onRoleSelected" @on-new-role="onNewRole" />
      <ModifyRole :role="role" @on-edit-role="onEditRole" />
      <RoleEditDialog :role="role" :dialog="roleEditDialog" @closed="roleEditDialog = false" />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import RoleList from "../components/Permission/RoleList.vue";
import ModifyRole from "../components/Permission/ModifyRole.vue";
import RoleEditDialog from "../components/Dialogs/RoleEditDialog.vue";
import { Component, Vue } from "vue-property-decorator";
import Role from "../model/Role";
@Component({
  components: {
    RoleList,
    ModifyRole,
    RoleEditDialog
  },
  head: {
    title: "Roles"
  }
})
class RolePage extends Vue {
  role: Role = null;
  roleEditDialog: boolean = false;

  onRoleSelected(arg: Role[]) {
    console.log("RoleSelected", arg);
    if (arg.length == 1) {
      this.role = new Role(arg[0]).clone();
      console.log("ClonedROLE", this.role);
    } else {
      this.role = null;
    }
    this.$forceUpdate();
  }

  onNewRole() {
    console.log("ON NEW ROLE");
    this.role = new Role();
    this.role.name = "new ROLE";
    this.roleEditDialog = true;
  }

  onEditRole() {
    console.log("EDIT ROLE");
    this.roleEditDialog = true;
  }
}

export default RolePage;
</script>
