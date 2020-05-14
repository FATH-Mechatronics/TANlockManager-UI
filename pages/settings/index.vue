<template>
  <v-layout xs12 sm8 md6>
    <v-flex>
      <v-card>
        <v-card-title class="headline">Management Settings</v-card-title>
        <v-card-text>
          <v-form>
            <v-switch
              style="display: none"
              v-model="settings['selfSignedCert']"
              label="Selfsigned Certificate"
            />
            <span style="display: none">
              *allows the client webbrowser (the gui) to accept insecure certs
              <br/>(Not Implemented, currently only the generated CA gets accepted)
              <br/>
              <br/>
            </span>
            <v-divider style="display: none"/>
            <v-text-field
              disabled
              v-model="settings['managementHeartbeatTimeout']"
              type="number"
              label="Heartbeat MaxTimeout (sec)"
            />
          </v-form>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title class="headline mt-2">TANlock Settings</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="settings['tANlockApiKey']" label="API Key"/>
            <span>
              *Default API-Key inserted on AutoConfig (on first event persist Lock to DB)
              <br/>
              <br/>
            </span>
            <v-divider/>
            <v-switch v-model="settings['tANlockSSL']" label="TANlock SSL"/>
            <span>
              *Default use of SSL for TANlock on AutoConfig (on first event persist Lock to DB)
              <br/>
              <br/>
            </span>
            <v-divider/>
            <v-switch v-model="settings['tANlockSelfSignedCert']" label="Selfsigned Certificate"/>
            <span>
              *allows the serverside client (communication to TANlock) to accept insecure certs
              <br/>
              <br/>
            </span>
            <v-divider/>
            <v-switch v-model="settings['tANlockAutoAccept']" label="Automatic accept new TANocks"/>
          </v-form>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title class="headline mt-2">Open Settings</v-card-title>
        <v-card-text>
          <v-form>
            <v-select v-model="settings['openDefaultMethod']" :items="openMethods" label="Default OpenMessage"/>
            <span>
              *Default method when Opening a TANlock from UI
              <br/>
              <br/>
            </span>
            <v-divider/>
            <v-text-field v-model="settings['openDefaultPin']" label="Default PIN"/>
            <span>
              *Default PIN when Opening a TANlock
              <br/>
              <br/>
            </span>
          </v-form>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title class="headline mt-2">Monitoring Settings</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="settings['monitoringPollInterval']" label="Poll Interval (sec)"/>
            <v-divider/>
            <v-text-field
              disabled
              v-model="settings['monitoringTemperatureLowValue']"
              label="Temperature Low Value"
            />
            <span>
              *No Input to disable
              <br/>
              <br/>
            </span>
            <v-divider/>
            <v-text-field
              disabled
              v-model="settings['monitoringTemperatureHighValue']"
              label="Temperature High Value"
            />
            <span>
              *No Input to disable
              <br/>
              <br/>
            </span>
            <v-divider/>
            <v-text-field
              disabled
              v-model="settings['monitoringHumidityLowValue']"
              label="Humidity Low Value"
            />
            <span>
              *No Input to disable
              <br/>
              <br/>
            </span>
            <v-divider/>
            <v-text-field
              disabled
              v-model="settings['monitoringHumidityHighValue']"
              label="Humidity High Value"
            />
            <span>
              *No Input to disable
              <br/>
              <br/>
            </span>
            <v-divider/>
          </v-form>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title class="headline mt-2">Plugins</v-card-title>
        <v-card-text>
          <ul v-for="plugin in plugins" v-bind:key="plugin">
            <li>
              configure
              <router-link :to="getLink(plugin)">{{plugin}}</router-link>
            </li>
          </ul>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title class="headline mt-2">Actions</v-card-title>
        <v-card-text>
          <v-btn @click="save()" color="primary">Apply Settings</v-btn>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";

  @Component({
    async mounted() {
      this.$axios.get(`/config`).then(res => {
        res.data.forEach(element => {
          this.settings[element.name] = element.value;
        });
        this.$forceUpdate();
      });
      this.$axios.get("/config/plugin").then(res => {
        this.plugins = res.data;
        this.$forceUpdate();
      });
    }
  })
  class SettingsPage extends Vue {
    settings: Object = {};
    plugins: String[] = [];

    openMethods: String[]=["prepareopen", "input"];

    save(): void {
      Object.keys(this.settings).forEach(key => {
        this.$axios.put(`/config`, {
          name: key,
          value: this.settings[key]
        });
      });
      this.$router.go(-1);
    }

    getLink(plugin): string {
      return `/settings/plugin/${plugin}`;
    }
  }

  export default SettingsPage;
</script>

