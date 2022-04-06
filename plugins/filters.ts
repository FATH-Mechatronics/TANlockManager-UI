import {Vue} from "nuxt-property-decorator";

Vue.filter('fixed', (value: number, len: number) => {
    return value.toFixed(len)
});
