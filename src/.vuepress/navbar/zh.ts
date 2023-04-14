import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/es/",
  { text: "案例", icon: "discover", link: "/es/demo/" },
  {
    text: "指南",
    icon: "creative",
    prefix: "/es/guide/",
    children: [
      {
        text: "Bar",
        icon: "creative",
        prefix: "bar/",
        children: ["baz", { text: "...", icon: "more", link: "" }],
      },
      {
        text: "Foo",
        icon: "config",
        prefix: "foo/",
        children: ["ray", { text: "...", icon: "more", link: "" }],
      },
    ],
  },
  {
    text: "V2 文档",
    icon: "note",
    link: "https://theme-hope.vuejs.press/es/",
  },
]);
