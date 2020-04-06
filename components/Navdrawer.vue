<template>
  <div column align-stretch>
    <v-navigation-drawer v-model="drawer" app floating persistent>
      <v-list dense nav>
        <v-list-item>
          <img src="~/assets/img/tanlock-header.png" style="width: 100%;" />
        </v-list-item>

        <v-divider />

        <v-list-item v-for="item in sideMenu" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app fixed>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <img src="~/assets/img/tanlock-logo.png" style="height: 1em;" /> Manager
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-for="(item, index) in actionMenu" :key="index" :to="item.link">{{ item.title }}</v-btn>
        <v-btn @click.stop="logout" :style="hiddenStyle(this.$user.get())">Logout</v-btn>
      </v-toolbar-items>
      <!--<v-toolbar-items class="hidden-md-and-up">-->
      <!--<v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>-->
      <v-menu class="hidden-md-and-up">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" class="hidden-md-and-up">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in actionMenu" :key="index" :to="item.link">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click.stop="logout" :style="hiddenStyle(this.$user.get())">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!--</v-toolbar-items>-->
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import menu from "../commons/menu";
import { Component, Vue, Prop } from "vue-property-decorator";
import permissionHide from "../commons/permissionHide";
@Component
class NavdrawerComponent extends Vue {
  sideMenu: Object[] = menu.sideMenu().filter(this.permFilter);

  actionMenu: Object[] = menu.actionMenu().filter(this.permFilter);

  drawer: Object = null;

  logout() {
    this.$axios
      .post(`/auth/logout`)
      .then(res => this.$router.push("/login"))
      .catch(err => console.error(err));
  }

  permFilter(i: { hidden: boolean; permission: string }) {
    return !i.hidden && permissionHide.hasPermission(this.$user.get(), i.permission);
  }

  hiddenStyle = permissionHide.hiddenStyle;
}

export default NavdrawerComponent;
</script>

