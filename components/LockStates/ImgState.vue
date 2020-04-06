<template>
  <v-tooltip :disabled="(lock.state == 'hidden')" top>
    <template v-slot:activator="{on}">
      <div v-on="on">
        <img src="~/assets/img/imgState/open.png" :style="openCss"/>
        <img src="~/assets/img/imgState/locked.png" :style="lockedCss"/>
        <img src="~/assets/img/imgState/unlocked.png" :style="unlockedCss"/>
        <img src="~/assets/img/imgState/pin.png" :style="pinCss"/>
        <img src="~/assets/img/imgState/error.png" :style="errorCss"/>
        <img src="~/assets/img/imgState/unknown.png" :style="unknownCss"/>
      </div>
    </template>
    <span>{{toolTipText}}</span>
  </v-tooltip>
</template>

<script lang="ts">
  import TanLock from "../../model/TanLock";
  import {Component, Vue, Prop} from "vue-property-decorator";

  @Component
  class ImgStateComponent extends Vue {
    components = {};
    @Prop({default: () => new TanLock()})
    lock: TanLock;

    @Prop({default: ""})
    css: string;

    static base: string = "~/assets/img/imgState/";

    static knownStates: string[] = ["open", "locked", "unlocked", "pin", "error", "hidden"];

    get openCss() {
      if (this.lock.state !== "open") return "display: none;";
      return this.css;
    }

    get lockedCss() {
      if (this.lock.state !== "locked") return "display: none;";
      return this.css;
    }

    get unlockedCss() {
      if (this.lock.state !== "unlocked") return "display: none";
      return this.css;
    }

    get pinCss() {
      if (this.lock.state !== "pin") return "display: none";
      return this.css;
    }

    get errorCss() {
      if (this.lock.state !== "error") return "display: none";
      return this.css;
    }

    get unknownCss() {
      if (ImgStateComponent.knownStates.indexOf(this.lock.state) < 0) return this.css;
      else return "display:none";
    }

    get toolTipText() {
      return this.lock.state;
    }
  }

  export default ImgStateComponent;
</script>
