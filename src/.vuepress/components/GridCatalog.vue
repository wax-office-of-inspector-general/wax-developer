<script setup lang="ts">
import { usePageData, useSiteData } from "@vuepress/client";
import { type VNode, computed, defineComponent, h } from "vue";
import { type RouteMeta, RouterLink, useRouter } from "vue-router";
import { endsWith, keys, startsWith } from "./utils/helper";

import "../styles/grid-catalog.scss";

declare const AUTO_CATALOG_TITLE_META_KEY: string;
declare const AUTO_CATALOG_ICON_META_KEY: string;
declare const AUTO_CATALOG_ORDER_META_KEY: string;
declare const AUTO_CATALOG_INDEX_META_KEY: string;

interface CatalogInfo {
  title: string;
  icon: string | null | undefined;
  base: string;
  order: number | null | undefined;
  level: number;
  path: string;
  children?: CatalogInfo[];
}

const props = defineProps({
  base: {
    type: String,
    default: "",
  },

  title: {
    type: String,
    default: "",
  },

  level: {
    type: Number,
    default: 1,
  },

  index: Boolean,
});

const page = usePageData();
const router = useRouter();
const siteData = useSiteData();

const shouldIndex = (meta: RouteMeta): boolean => {
  const index = <boolean | undefined>meta[AUTO_CATALOG_INDEX_META_KEY];

  return typeof index === "undefined" || index;
};

const getCatalogInfo = (): CatalogInfo[] => {
  const base = props.base || page.value.path.replace(/\/[^/]+$/, "/");
  const routes = router.getRoutes();
  const result: CatalogInfo[] = [];

  routes
    .filter(({ meta, path }) => {
      // filter those under current base
      if (!startsWith(path, base) || path === base) return false;

      if (base === "/") {
        const otherLocales = keys(siteData.value.locales).filter(
          (item) => item !== "/"
        );

        // exclude 404 page and other locales
        if (
          path === "/404.html" ||
          otherLocales.some((localePath) => startsWith(path, localePath))
        )
          return false;
      }

      return (
        // filter real page
        ((endsWith(path, ".html") && !endsWith(path, "/index.html")) ||
          endsWith(path, "/")) &&
        // page should be indexed
        shouldIndex(meta)
      );
    })
    .map(({ path, meta }) => {
      const level = path.substring(base.length).split("/").length;

      return {
        title: <string>meta[AUTO_CATALOG_TITLE_META_KEY] || "",
        icon: <string | null | undefined>meta[AUTO_CATALOG_ICON_META_KEY],
        base: path.replace(/\/[^/]+\/?$/, "/"),
        order:
          <number | null | undefined>meta[AUTO_CATALOG_ORDER_META_KEY] || null,
        level: endsWith(path, "/") ? level - 1 : level,
        path,
      };
    })
    .filter(
      ({ title, level }) =>
        typeof title === "string" && title && level <= props.level
    )
    .sort(
      (
        { title: titleA, level: levelA, path: pathA, order: orderA },
        { title: titleB, level: levelB, path: pathB, order: orderB }
      ) => {
        const level = levelA - levelB;

        if (level) return level;

        // check README.md, it should be first one
        if (endsWith(pathA, "/index.html")) return -1;
        if (endsWith(pathB, "/index.html")) return 1;

        // infoA order is absent
        if (orderA === null) {
          // infoB order is absent
          if (orderB === null)
            // compare title
            return titleA.localeCompare(titleB);

          // infoB order is present
          return orderB;
        }

        // infoB order is absent
        if (orderB === null) return orderA;

        // now we are sure both order exist

        // infoA order is positive
        if (orderA > 0) {
          if (orderB > 0) return orderA - orderB;

          return -1;
        }

        // both order are negative
        if (orderB < 0) return orderA - orderB;

        return 1;
      }
    )
    .forEach((info) => {
      const { base, level } = info;

      switch (level) {
        case 1:
          result.push(info);
          break;

        case 2: {
          const parent = result.find((item) => item.path === base);

          if (parent) (parent.children ??= []).push(info);
          break;
        }

        default: {
          const grandParent = result.find(
            (item) => item.path === base.replace(/\/[^/]+\/$/, "/")
          );

          if (grandParent) {
            const parent = grandParent.children?.find(
              (item) => item.path === base
            );

            if (parent) (parent.children ??= []).push(info);
          }
        }
      }
    });

  return result;
};

const info = computed(() => getCatalogInfo());
</script>
<template>
  <div class="grid-catalog-wrapper">
    <div v-if="props.title" class="grid-catalog-title">
      <h3>{{ props.title }}</h3>
    </div>
    <div class="grid-catalog-items">
      <div v-if="info.length" v-for="{children, icon, path, title} in info">
        <a :href="path" class="grid-item-link">
          <div class="grid-item-img"></div>
          <p class="grid-item-title">{{ title }}</p>
        </a>
      </div>
    </div>
  </div>
</template>
