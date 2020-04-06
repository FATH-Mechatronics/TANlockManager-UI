<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="clickOutside">
    <v-card>
      <v-card-title class="headline">
        Edit TANlock
        <v-spacer/>
        <v-switch v-model="accepted" label="Accepted"/>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="editForm">
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

          <v-switch v-model="https" label="HTTPS" class="mr-3 mt-0"/>

          <v-card-actions>
            <v-btn color="error" @click.stop="removeLock()">Delete</v-btn>
            <v-spacer/>
            <v-btn color="warning" @click.stop="clickOutside()">Cancel</v-btn>
            <v-btn @click.stop="submitLock()" :disable="!valid">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import {Route} from "vue-router";
  import TanLock from "../../model/TanLock";

  @Component({
    async mounted() {
      this.$axios.get(`/data/lock/${this.lock.id}`).then(res => {
        this.ip = res.data.ip;
        this.name = res.data.name;
        this.apiKey = res.data.apiKey;
        this.https = res.data.https;
        this.accepted = res.data.accepted;
      });
    }
  })
  class LockEditDialogComponent extends Vue {
    valid: boolean = false;

    ip: string = "";
    name: string = "";
    apiKey: string = "";
    https: boolean = true;
    accepted: boolean = false;

    @Prop({default: () => new TanLock()})
    lock: TanLock;

    @Prop({
      default: () => {
        return false;
      }
    })
    dialog: boolean;

    submitLock(): void {
      if (this.ip.length > 0 && this.name.length > 0) {
        this.$axios
          .put(`/data/lock/${this.lock.id}`, {
            ip: this.ip,
            name: this.name,
            apiKey: this.apiKey,
            https: this.https,
            accepted: this.accepted
          })
          .then(res => {
            /*if (res.data.ip != this.baseIp) {
              this.$router.push(`/locks/${res.data.ip}`);
            }*/
            this.$router.go(-1);
          })
          .catch(message => alert(`${message}`));
      } else {
        alert("You are missing inputs");
      }
    }

    removeLock(): void {
      this.$axios.delete(`/data/lock/${this.lock.id}`).then(res => {
        //this.$router.push(`/locks`);
        this.$router.go(-1);
      });
    }

    clickOutside() {
      this.$emit("closed", null);
    }
  }

  export default LockEditDialogComponent;
</script>
