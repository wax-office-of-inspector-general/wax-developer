import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import theme from "./theme.js";

import { getDirname, path } from '@vuepress/utils';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "WAX Developer",
      description: "A docs demo for vuepress-theme-hope",
    },
    // "/es/": {
    //   lang: "es-ES",
    //   title: "WAX Developer ES",
    //   description: "vuepress-theme-hope",
    // },
    // "/de/": {
    //   lang: "de-DE",
    //   title: "WAX Developer DE",
    //   description: "vuepress-theme-hope",
    // },
  },

  theme,

  shouldPrefetch: false,

  plugins: [
    searchProPlugin({}),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components'),
    }),
  ],

  // alias: {
  //   // Here you can redirect aliases to your own components
  //   // For example, here we change the theme's home page component to HomePage.vue under user .vuepress/components
  //   "@theme-hope/modules/sidebar/components/Sidebar": path.resolve(
  //     __dirname,
  //     "./components/SidebarExtended.vue"
  //   ),
  // }
});