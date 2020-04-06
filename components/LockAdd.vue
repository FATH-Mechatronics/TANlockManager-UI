<template>
  <v-card :style="hiddenStyle($user.get(),'WRITE_LOCK')">
    <v-card-title class="headline">Add TANlock</v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form">
        <v-text-field
          v-model="ip"
          label="IP Adress"
          required
          rule="ip.length > 0 || 'You have to enter an IP'"
        />
        <v-text-field
          v-model="name"
          label="Name"
          required
          rule="name.length > 0 || 'You have to enter a name for the lock'"
        />
        <v-text-field v-model="apiKey" label="API Key"/>

        <v-layout row wrap justify-space-around>
          <v-switch v-model="https" label="HTTPS" class="mr-3 mt-0"/>
          <v-btn class="mr-3" color="error" @click="clear()">Clear</v-btn>
          <v-btn color="success" @click="submit()" :disabled="!valid">Add</v-btn>
        </v-layout>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import permissionHide from "../commons/permissionHide";

  @Component({})
  class LockAddComponent extends Vue {
    valid: boolean = false;

    ip: string = "";
    name: string = "";
    apiKey: string = "";
    https: boolean = true;

    submit(): void {
      if (this.ip.length > 0 && this.name.length > 0) {
        this.$axios
          .post(`/data/lock`, {
            ip: this.ip,
            name: this.name,
            apiKey: this.apiKey,
            https: this.https
          })
          .then(this.clear)
          .catch(message => alert("The TANlock with this IP is already known."));
      } else {
        alert("You are missing inputs");
      }
    }

    clear(): void {
      this.ip = "";
      this.name = "";
      this.apiKey = "";
      this.https = true;
    }

    hiddenStyle = permissionHide.hiddenStyle;
  }

  export default LockAddComponent;
</script>
