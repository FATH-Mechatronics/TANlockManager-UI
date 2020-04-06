<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="clickOutside">
    <v-card>
      <v-card-title class="headline">Edit User "{{oldUsername}}"</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="editForm">
          <v-text-field v-model="username" label="Username (only for create)"/>
          <v-text-field v-model="password" label="Password (only when change)" type="password"/>

          <v-card-actions>
            <v-btn color="error" @click.stop="removeUser()">Delete</v-btn>
            <v-spacer/>
            <v-btn color="warning" @click.stop="clickOutside()">Cancel</v-btn>
            <v-btn @click.stop="submitUser()" :disable="!valid">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import User from "../../model/User";

  @Component({
    async mounted() {
      if (this.user != null) {
        this.$axios.get(`/data/user/${this.user.user}`).then(res => {
          this.username = res.data.user;
          this.password = "";
        });
      }
    }
  })
  class UserEditDialogComponent extends Vue {
    valid: boolean = false;

    username: string = "";
    password: string = "";

    @Prop({default: () => new User()})
    user: User;

    @Prop({
      default: () => {
        return false;
      }
    })
    dialog: boolean;

    submitUser(): void {
      if (this.user.user.length > 0) {
        console.log("Upgrade USER");
        if (this.username.length > 0) {
          let oldUser = this.user.user;
          this.user.user = this.username;
          if (this.password.length > 0) {
            this.user.pass = this.password;
          } else {
            this.user.pass = undefined;
          }
          this.$axios
            .put(`/data/user/${oldUser}`, this.user.flat())
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
        console.log("NEW USER");
        if (this.username.length > 0 && this.password.length > 0) {
          this.user.user = this.username;
          this.user.pass = this.password;
          this.$axios
            .post(`/data/user`, this.user.flat())
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

    removeUser(): void {
      this.$axios.delete(`/data/user/${this.user.user}`).then(res => {
        this.clickOutside();
        location.reload();
      });
    }

    clickOutside() {
      this.$emit("closed", null);
    }

    get oldUsername() {
      if (this.user != null) {
        return this.user.user;
      }
      return "";
    }
  }

  export default UserEditDialogComponent;
</script>
