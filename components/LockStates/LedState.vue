<template>
  <v-tooltip :disabled="(lock.state == 'hidden')" bottom>
    <template v-slot:activator="{on}">
      <div v-on="on">
        <v-icon
          style="vertical-align: bottom;"
          :color="orangeLed"
        >mdi-checkbox-blank-circle{{orangeOutline}}
        </v-icon>
        <v-icon
          style="vertical-align: bottom;"
          :color="greenLed"
        >mdi-checkbox-blank-circle{{greenOutline}}
        </v-icon>
        <v-icon
          style="vertical-align: bottom;"
          :color="redLed"
        >mdi-checkbox-blank-circle{{redOutline}}
        </v-icon>
      </div>
    </template>
    <span>{{toolTipText}}</span>
  </v-tooltip>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";
  import TanLock from "../../model/TanLock";

  @Component
  class LedStateComponent extends Vue {
    components = {};
    @Prop({default: () => new TanLock()})
    lock: TanLock;

    get orangeLed() {
      if (this.lock.state === "error") return "error";
      if (this.lock.state === "unknown") return "grey";
      if (this.lock.state === "hidden") return "transparent";
      return "yellow";
    }

    get greenLed() {
      if (this.lock.state === "error") return "error";
      if (this.lock.state === "unknown") return "grey";
      if (this.lock.state === "hidden") return "transparent";
      return "blue";
    }

    get redLed() {
      if (this.lock.state === "error") return "error";
      if (this.lock.state === "unknown") return "grey";
      if (this.lock.state === "hidden") return "transparent";
      return "red";
    }

    get orangeOutline() {
      if (this.lock.state === "locked" || this.lock.state === "unlocked") return "-outline";
      return "";
    }

    get greenOutline() {
      if (this.lock.state === "locked" || this.lock.state === "pin") return "-outline";
      return "";
    }

    get redOutline() {
      if (this.lock.state === "locked" || this.lock.state === "pin") return "-outline";
      return "";
    }

    get toolTipText() {
      return this.lock.state;
    }
  }

  export default LedStateComponent;
</script>
