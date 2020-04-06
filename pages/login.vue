<template>
  <v-card style>
    <v-form @keyup.native.enter="doLogin">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-text-field v-model="user" label="Username"/>
        <v-text-field v-model="password" type="password" label="Password"/>
        <v-chip v-if="err" class="error">Error while Login</v-chip>
      </v-card-text>
      <v-card-actions>
        <v-btn style="display: none;">Forgot Password</v-btn>
        <v-spacer/>
        <v-btn class="primary" @click.stop="doLogin">Login</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";

  @Component({
    layout: "login",
    async mounted() {
      this.clearCredentials();
    },
    head: {
      title: "Login"
    }
  })
  class LoginPage extends Vue {
    user: string = "";
    password: string = "";
    err: boolean = false;

    doLogin(): void {
      this.$axios
        .post("/auth/login", {user: this.user, password: this.password})
        .then(res => {
          this.$socketio.open();
          this.$router.push("/")
        })
        .catch(err => (this.err = true));
    }

    clearCredentials(): void {
      localStorage.clear();
      this.$socketio.doReconnect = false;
      this.$socketio.close();
    }
  }

  export default LoginPage;
</script>
