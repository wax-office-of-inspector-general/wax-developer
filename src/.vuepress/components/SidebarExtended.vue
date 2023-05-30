<script lang="ts" setup>

import {
  // type SlotsType,
  type VNode,
  defineComponent,
  h,
  onMounted,
  shallowRef,
  watch,
} from "vue";
import { useRoute } from "vue-router";

// import { SideBar } from 'vuepress-theme-hope/lib/client/modules/sidebar/components/Sidebar';
import SidebarLinks from 'vuepress-theme-hope/lib/client/modules/sidebar/components/Sidebar';
import { useThemeLocaleData } from 'vuepress-theme-hope/lib/client/composables/index';
import { useSidebarItems } from 'vuepress-theme-hope/lib/client/modules/sidebar/composables/index';

import "../styles/sidebar.scss";

const route = useRoute();
const themeLocale = useThemeLocaleData();
const sidebarItems = useSidebarItems();

const sidebar = shallowRef<HTMLElement>();

onMounted(() => {
  // scroll to active sidebar item
  watch(
    () => route.hash,
    (hash): void => {
      // get the active sidebar item DOM, whose href equals to the current route
      const activeSidebarItem = document.querySelector(
        `.sidebar a.sidebar-link[href="${route.path}${hash}"]`
      );

      if (!activeSidebarItem) return;

      // get the top and height of the sidebar
      const { top: sidebarTop, height: sidebarHeight } =
        sidebar.value!.getBoundingClientRect();
      // get the top and height of the active sidebar item
      const { top: activeSidebarItemTop, height: activeSidebarItemHeight } =
        activeSidebarItem.getBoundingClientRect();

      // when the active sidebar item overflows the top edge of sidebar
      if (activeSidebarItemTop < sidebarTop)
        // scroll to the top edge of sidebar
        activeSidebarItem.scrollIntoView(true);
      // when the active sidebar item overflows the bottom edge of sidebar
      else if (
        activeSidebarItemTop + activeSidebarItemHeight >
        sidebarTop + sidebarHeight
      )
        // scroll to the bottom edge of sidebar
        activeSidebarItem.scrollIntoView(false);
    }
  );
});

</script>
<template>

</template>
