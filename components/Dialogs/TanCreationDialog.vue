<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="clickOutside">
    <v-card>
      <v-card-title class="headline">TANs</v-card-title>
      <v-card-text>
        <TanList :lock="lock"/>
        <v-text-field v-model="generated" disabled label="TAN"/>
        <v-text-field v-model="note" label="Note"/>
        <v-select v-model="ttl" label="TTL" item-text="title" item-value="val" :items="ttlOptions"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="warning" @click.stop="clickOutside()">Cancel</v-btn>
        <v-btn
          color="primary"
          :disabled="generated.length === 0"
          @click.stop="submitTan()"
        >Submit Tan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Vue, Prop, Watch} from "vue-property-decorator";
  import TanLock from "../../model/TanLock";
  import TanList from "../TanList.vue";
  import Tan from "../../model/Tan";

  @Component({
    async mounted() {
      /*this.$axios
        .get(`/data/lock/${this.lock.id}/tan`)
        .then(res => {
          this.tans = res.data;
        })
        .catch(err => {});*/
    },
    components: {
      TanList
    }
  })
  class TanCreationDialogComponent extends Vue {
    @Prop({default: () => new TanLock()})
    lock: TanLock;

    @Prop({default: () => []})
    tans: Tan[];

    @Prop({
      default: () => {
        return false;
      }
    })
    dialog: boolean;

    users: string[] = [];

    user: string = "";
    pin: string = "";

    get generated() {
      return this.user + this.pin;
    }

    set generated(str) {
    }

    note: string = "";
    ttl: number = 5 * 60_000;

    ttlOptions = [
      {title: "5 Min", val: 5 * 60_000},
      {title: "15 Min", val: 15 * 60_000},
      {title: "30 Min", val: 30 * 60_000},
      {title: "1 H", val: 60 * 60_000},
      {title: "2 H", val: 2 * 60 * 60_000},
      {title: "5 H", val: 5 * 60 * 60_000}
    ];

    @Watch("dialog")
    onDialogChange(newDialog, oldDialog) {
      if (newDialog && this.lock.id != -1) {
        this.$axios
          .get(`/data/lock/${this.lock.id}/user`)
          .then(res => {
            this.users = res.data;
            this.generateTan();
          })
          .catch(err => {
            console.error("Can't fetch Lock Users");
            this.users = [];
            this.generateTan();
          });
      } else {
        this.generated = "";
      }
    }

    clickOutside() {
      this.$emit("closed", null);
    }

    submitTan() {
      let tan: Tan = new Tan({
        user: this.user,
        pin: this.pin,
        note: this.note,
        lock: this.lock,
        ttl: new Date().getTime() + this.ttl
      });
      this.$axios
        .post(`/data/lock/${tan.lock.id}/tan`, tan)
        .then(res => {
          this.clickOutside();
        })
        .catch(err => {
          alert(err);
        });
    }

    generateTan() {
      let user;
      let len = 4;
      if (this.users.length > 0) {
        len = this.users[0].length;
      }
      do {
        user = this.randomString(len);
      } while (this.users.find(u => u === user) != undefined);
      this.user = user;
      this.pin = this.randomString(len);
    }

    private randomString(len = 4, alpha = ["1", "2", "3", "4"]) {
      let s = "";
      while (s.length < len) {
        s += alpha[Math.floor(Math.random() * alpha.length)];
      }
      return s;
    }
  }

  export default TanCreationDialogComponent;
</script>
