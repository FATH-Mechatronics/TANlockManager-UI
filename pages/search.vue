<template>
  <div>
    <v-form v-on:submit.prevent="search">
      <v-text-field
        v-model="searchPath"
        label="Search Subnet"
        :append-icon="loading?'mdi-stop':'mdi-magnify'"
        @click:append="()=>loading?stopSearch():startSearch()"
        :readonly="loading"
      ></v-text-field>
    </v-form>
    <v-data-table
      :loading="loading"
      :loading-text="loadingText"></v-data-table>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from "nuxt-property-decorator";
  import axios from "axios";

  const baseURL = "";

  @Component({
    async asyncData() {
      return axios.get(`${baseURL}/util/subnet`)
        .then((res) => {
          return {searchPath: res.data};
        });
    },
    head: {
      title: "Search"
    }
  })
  class SearchPage extends Vue {
    components = {};
    foundList: Object[] = [];
    searchPath: String;
    loading: boolean = false;

    startSearch(): void {
      this.loading = true;
    }

    stopSearch(): void {
      this.loading = false;
    }

    get loadingText(): string {
      return "Searching " + this.searchPath + " for TANlocks";
    }
  }

  export default SearchPage;
</script>
