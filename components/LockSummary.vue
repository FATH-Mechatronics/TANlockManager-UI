<template>
  <v-card>
    <v-card-title class="headline">Summary</v-card-title>
    <v-card-text>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs3>
            <v-card color="secondary lighten-1" to="/newlocks" style="text-align:center;">
              <v-card-title>New TANlocks</v-card-title>
              <v-card-text>
                <v-progress-circular
                  :value="percentNew"
                  rotate="-90"
                  color="warning"
                  class="mb-1"
                  size="64"
                  width="8"
                ></v-progress-circular>
                <br/>
                <span class="subtitle-1">{{newCount}}&nbsp;/&nbsp;{{count+newCount}}</span>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs3>
            <v-card color="secondary lighten-1" style="text-align:center;">
              <v-card-title>Alive TANlocks</v-card-title>
              <v-card-text>
                <v-progress-circular
                  :value="percentAlive"
                  rotate="-90"
                  class="mb-1"
                  size="64"
                  width="8"
                ></v-progress-circular>
                <br/>
                <span class="subtitle-1">{{alive}}&nbsp;/&nbsp;{{count}}</span>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs3>
            <v-card color="secondary lighten-1" style="text-align:center;">
              <v-card-title>Cabinet Door Open</v-card-title>
              <v-card-text>
                <v-progress-circular
                  :value="percentOpen"
                  rotate="-90"
                  color="error"
                  class="mb-1"
                  size="64"
                  width="8"
                ></v-progress-circular>
                <br/>
                <span class="subtitle-1">{{open}}&nbsp;/&nbsp;{{count}}</span>
              </v-card-text>
            </v-card>
          </v-flex>

          <v-flex xs3>
            <v-card color="secondary lighten-1" style="text-align:center;">
              <v-card-title>Cabinet Door Closed</v-card-title>
              <v-card-text>
                <v-progress-circular
                  :value="percentClosed"
                  rotate="-90"
                  color="success"
                  class="mb-1"
                  size="64"
                  width="8"
                ></v-progress-circular>
                <br/>
                <span class="subtitle-1">{{closed}}&nbsp;/&nbsp;{{count}}</span>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import TanLock from "../model/TanLock";

  @Component({
    mounted() {
      this.$set(this, "currentTime", new Date().getTime());
    },
    beforeMount() {
    }
  })
  class LockSummaryComponent extends Vue {
    @Prop({
      default: () => []
    })
    locks: TanLock[];

    //HARDCODED 15 Minutes
    confTime: number = 2 * 60_000;
    currentTime: number = 0;

    //HARDCODED Refresh 5 Sec
    interval: any = setInterval(this.updateCurrentTime, 5_000);

    updateCurrentTime() {
      this.currentTime = new Date().getTime();
      this.locks.forEach(l => {
        if (l != null && this.currentTime - l.heartbeat >= this.confTime) {
          l.state = "offline";
        }
      });
    }

    get count() {
      return this.locks.filter(l => l.accepted).length;
    }

    get open() {
      return this.locks
        .filter(l => l.accepted)
        .filter(l => (l.state != "locked" && l.state != "offline") || LockSummaryComponent.doorUnlocked(l))
        .length;
    }

    static doorUnlocked(l: TanLock): boolean {
      return (
        (l.useDoor_1 && l.door_1 == false) || (l.useDoor_2 && l.door_2 == false)
      );
    }

    get closed() {
      return this.locks
        .filter(l => l.accepted)
        .filter(l => l.state == "locked" && !LockSummaryComponent.doorUnlocked(l))
        .length;
    }

    get alive() {
      return this.locks
        .filter(l => l.accepted)
        .filter(l => l.heartbeat >= this.currentTime - this.confTime).length;
    }

    get newCount() {
      return this.locks.filter(l => l.accepted == false).length;
    }

    get percentAlive() {
      if (this.count === 0) return 0;
      return (this.alive / this.count) * 100;
    }

    get percentOpen() {
      if (this.count === 0) return 0;
      return (this.open / this.count) * 100;
    }

    get percentClosed() {
      if (this.count === 0) return 0;
      return (this.closed / this.count) * 100;
    }

    get percentNew() {
      if (this.count + this.newCount === 0) return 0;
      return (this.newCount / (this.count + this.newCount)) * 100;
    }
  }

  export default LockSummaryComponent;
</script>

