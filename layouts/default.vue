<template>
    <v-app>
        <Navdrawer/>
        <v-container>
            <v-main>
                <nuxt/>
            </v-main>
        </v-container>
    </v-app>
</template>

<script lang="ts">
import Navdrawer from "../components/Navdrawer.vue";
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    Navdrawer
  }
})

export default class DefaultTemplate extends Vue {

}
</script>
