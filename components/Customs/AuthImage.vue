<template>
  <v-img :src="data" />
</template>
<script lang="ts">
  import {Component, Vue, Prop} from "vue-property-decorator";

  @Component({
    async mounted() {
      console.log("FETCHING IMAGE ", this.src);
      this.$axios
        .get(this.src, {
          responseType: "arraybuffer"
        })
        .then(
          res =>
            (this.data =
              "data:image/png;base64," + Buffer.from(res.data).toString("base64"))
        )
        .catch(res => (this.data = "foo.png"));
    }
  })
  class AuthImage extends Vue {
    @Prop({
      default: () => ""
    })
    src: string;

    data: string = "";
  }

  export default AuthImage;
</script>
