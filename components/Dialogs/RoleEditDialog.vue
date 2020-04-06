<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="clickOutside">
    <v-card>
      <v-card-title class="headline">Edit Role "{{oldRolename}}"</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="editForm">
          <v-text-field v-model="rolename" label="Name" required/>

          <v-card-actions>
            <v-btn color="error" @click.stop="removeRole()">Delete</v-btn>
            <v-spacer/>
            <v-btn color="warning" @click.stop="clickOutside()">Cancel</v-btn>
            <v-btn @click.stop="submitRole()" :disable="!valid">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import Role from "../../model/Role";

  @Component({
    async mounted() {
    }
  })
  class UserEditDialogComponent extends Vue {
    valid: boolean = false;

    _rolename: string = null;

    @Prop({default: () => new Role()})
    role: Role;

    @Prop({
      default: () => {
        return false;
      }
    })
    dialog: boolean;

    submitRole(): void {
      this.role = new Role(this.role);
      if (this.role.id != null) {
        if (this.role.id < 2) {
          alert("INTERNAL ROLE, CAN'T BE EDITED");
          this.clickOutside();
          return;
        }
        console.log("Upgrade Role");
        if (this.rolename.length > 0) {
          this.role.name = this.rolename;
          this.$axios
            .put(`/data/role/${this.role.id}`, this.role.slim())
            .then(res => {
              /*if (res.data.ip != this.baseIp) {
              this.$router.push(`/locks/${res.data.ip}`);
            }*/
              this.clickOutside();
              location.reload();
            })
            .catch(message => alert(`${message}`));
        } else {
          alert("You are missing inputs");
        }
      } else {
        console.log("NEW Role");
        if (this.rolename.length > 0) {
          this.role.name = this.rolename;
          this.$axios
            .post(`/data/role`, this.role.slim())
            .then(res => {
              /*if (res.data.ip != this.baseIp) {
              this.$router.push(`/locks/${res.data.ip}`);
              }*/
              this.clickOutside();
              location.reload();
            })
            .catch(message => alert(`${message}`));
        } else {
          alert("You are missing inputs");
        }
      }
    }

    removeRole(): void {
      if (this.role.id < 2) {
        alert("Internal Role can't be deleted");
        return;
      }
      this.$axios.delete(`/data/role/${this.role.id}`).then(res => {
        this.clickOutside();
        location.reload();
      });
    }

    get rolename() {
      if (this._rolename == null) {
        if (this.role != null) {
          this._rolename = this.role.name;
        } else {
          return "";
        }
      }
      return this._rolename;
    }

    set rolename(rolename: string) {
      this._rolename = rolename;
    }

    get oldRolename() {
      if (this.role != null) {
        return this.role.name;
      }
      return "";
    }

    clickOutside() {
      this._rolename = null;
      this.$emit("closed", null);
    }
  }

  export default UserEditDialogComponent;
</script>
