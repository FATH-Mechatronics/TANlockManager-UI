<template>
    <div column align-stretch>
        <v-navigation-drawer v-model="drawer" app floating persistent>
            <v-list dense nav>
                <v-list-item>
                    <img src="~/assets/img/tanlock-header.png" style="width: 100%;"/>
                </v-list-item>

                <v-divider/>

                <v-list-item to="/">
                    <v-list-item-icon>
                        <v-icon>mdi-view-dashboard</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Dashboard</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-group prepend-icon="mdi-group" value="true">
                    <v-list-item slot="activator">
                        <v-list-item-content>
                            <v-list-item-title>Cages</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-for="(child, childIndex) in cages" :key="childIndex" :to="getCageLink(child)">
                        <v-list-item-icon></v-list-item-icon>
                        <v-list-item-title>
                            <v-icon small :color="child.color">mdi-circle</v-icon>
                            {{child.name}}
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="newCageDialog = true" :style="hiddenStyle(this.$user.get(), 'WRITE_CAGE')">
                        <v-list-item-icon></v-list-item-icon>
                        <v-list-item-title>
                            <v-icon small>mdi-plus</v-icon>
                            New Cage
                        </v-list-item-title>
                    </v-list-item>
                </v-list-group>

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
                <img src="~/assets/img/tanlock-logo.png" style="height: 1em;"/> Manager
            </v-toolbar-title>
            <v-spacer></v-spacer>
           <!--<v-toolbar-items class="hidden-sm-and-down">
                <v-btn v-for="(item, index) in actionMenu" :key="index" :to="item.link">{{ item.title }}</v-btn>
                <v-btn @click.stop="logout" :style="hiddenStyle(this.$user.get())">Logout</v-btn>
            </v-toolbar-items>-->
            <!--<v-toolbar-items class="hidden-md-and-up">-->
            <!--<v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>-->
            <!--<v-menu class="hidden-md-and-up">-->
            <v-menu>
                <template v-slot:activator="{ on }">
                    <v-btn depressed large v-on="on">
                        <b>{{ userName }}</b>
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in actionMenu" :key="index" :to="item.link">
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click.stop="logout" :style="hiddenStyle(this.$user.get())">
                        <v-list-item-icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Logout</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
            <!--</v-toolbar-items>-->
        </v-app-bar>

        <!---->
        <CageEditDialog :dialog="newCageDialog" @closed="closedNewCageDialog"/>
    </div>
</template>

<script lang="ts">
    import menu from "../commons/menu";
    import {Component, Vue} from "vue-property-decorator";
    import permissionHide from "../commons/permissionHide";
    import Cage from "~/model/Cage";
    import CageEditDialog from "~/components/Dialogs/CageEditDialog.vue";

    @Component({
        async mounted() {
            return this.$axios
                .get(`/data/cage`)
                .then(res => {
                    if (res) {
                        this.cages.push(...res.data);
                    }
                });
        },
        components: {
            CageEditDialog
        }
    })
    class NavdrawerComponent extends Vue {
        sideMenu: Object[] = menu.sideMenu().filter(this.permFilter);

        actionMenu: Object[] = menu.actionMenu().filter(this.permFilter);

        cages: Cage[] = [];

        drawer: Object = null;

        newCageDialog = false;

        userName = (this.$user.get()?this.$user.get().user:"NOT LOGGED IN");

        getCageLink(cage) {
            return "/cages/" + cage.id;
        }

        logout() {
            this.$axios
                .post(`/auth/logout`)
                .then(res => this.$router.push("/login"))
                .catch(err => console.error(err));
        }

        closedNewCageDialog(newCage: Cage | null) {
            this.newCageDialog = false;
            if (newCage != null) {
                this.cages.push(newCage);
            }
        }

        permFilter(i: { hidden: boolean; permission: string }) {
            return !i.hidden && permissionHide.hasPermission(this.$user.get(), i.permission);
        }

        hiddenStyle = permissionHide.hiddenStyle;
    }

    export default NavdrawerComponent;
</script>

