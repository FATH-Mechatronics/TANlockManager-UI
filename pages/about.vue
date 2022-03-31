<template>
  <v-layout align-center column justify-center>
    <v-flex md8 sm8 xs12>
      <v-card min-width="350px">
        <v-card-title class="headline">
          TANlockManager UI
        </v-card-title>
        <v-card-text>
          <v-simple-table>
            <th colspan="2" class="headline">Version</th>
            <tr>
              <td>TANlockManager-UI</td>
              <td>{{ appVersion }}</td>
            </tr>
            <tr>
              <td>TANlockManager-Server</td>
              <td>{{ serverVersion }}</td>
            </tr>
            <tr>
              <td>Vue</td>
              <td>{{ vueVersion }}</td>
            </tr>
          </v-simple-table>
          <br/>
          <v-simple-table>
            <th colspan="2" class="headline">Config</th>
            <tr>
              <td>Location</td>
              <td>{{ currentLocation }}</td>
            </tr>
            <tr>
              <td>baseURL</td>
              <td>{{ base }}</td>
            </tr>
          </v-simple-table>
          <br/>
          <logo/>
          <br>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Logo from '~/components/Logo.vue';
import {Component, Vue} from "nuxt-property-decorator"
import {Context} from "@nuxt/types";

@Component({
      components: {
        Logo
      },
      head: {
        title: "About"
      }
    }
)
export default class AboutPage extends Vue {
  appVersion: string = "";
  serverVersion: string = "";
  vueVersion: string = Vue.version;
  currentLocation: string = location.href;
  base: string = this.$axios.defaults.baseURL;

  public setStuff(stuff){
    console.log("Setting Stuff", stuff);
  }

  async fetch(){
    const srvResponse:any = await this.$axios.get(`/api/version`);
    this.serverVersion = srvResponse.data.version;
  }

  async asyncData({env}) {
    return {
      appVersion: env.appVersion
    };
  }
}
</script>
