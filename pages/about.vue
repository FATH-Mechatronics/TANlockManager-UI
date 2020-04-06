<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card min-width="330px">
        <v-card-title class="headline">
          Electron Nuxt TypeScript
        </v-card-title>
        <v-card-text>
          <p>TANlockManager: {{ app }}</p>
          <p>Vue: {{ vue }}</p>
          <p>Location: {{ currentLocation }}</p>
          <p>baseURL: {{ base }}</p>
          <logo/>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
          <br>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Logo from '~/components/Logo.vue';
  import {Component, Vue} from 'nuxt-property-decorator';

  @Component({
      components: {
        Logo
      },
      head: {
        title: "About"
      }
    }
  )
  class AboutPage extends Vue {
    app: string = '0.0.1.0';
    vue: string = Vue.version;
    currentLocation: string = location.href;
    base: string = this.$axios.defaults.baseURL;
  }

  export default AboutPage;
</script>
