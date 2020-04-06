<template>
  <v-layout xs12 sm8 md6>
    <v-flex>
      <v-card>
        <v-card-title class="headline mt-2">{{plugin}} Config</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="pluginConfig"
            auto-grow
            :success="correctJSON(pluginConfig)"
            :error="!correctJSON(pluginConfig)"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="!correctJSON(pluginConfig)" @click="submitConfig">Save</v-btn>
        </v-card-actions>
      </v-card>
      <v-card>
        <v-card-title class="headline mt-2">{{plugin}} Help</v-card-title>
        <v-card-text>
          <v-textarea v-model="pluginHelp" auto-grow disabled/>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue} from "nuxt-property-decorator";

  @Component
  class PluginSettingsPage extends Vue {
    pluginConfig: any = "";
    pluginHelp: any = "";
    plugin: string = "";

    mounted() {
      this.plugin = this.$route.params.plugin;

      this.$axios
        .get(`/config/plugin/${this.plugin}`)
        .then(data => {
          this.pluginConfig = JSON.stringify(data.data, null, 2);
          this.$axios
            .get(`/config/plugin/${this.plugin}/help`)
            .then(data => {
              this.pluginHelp = data.data;
              this.$forceUpdate();
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    }

    correctJSON(json: string) {
      try {
        let out = JSON.parse(json);
        if (out != undefined) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
      return true;
    }

    submitConfig() {
      console.log("submitConfig", JSON.parse(this.pluginConfig));
      this.$axios
        .post(`/config/plugin/${this.plugin}`, JSON.parse(this.pluginConfig))
        .then(data => {
          this.$router.back();
        })
        .catch(err => {
          alert(err);
        });
    }
  }

  export default PluginSettingsPage;
</script>
