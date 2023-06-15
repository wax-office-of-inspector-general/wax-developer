<template>
    <div class="toc-wrapper">
        <h2>{{ title }}</h2>
        <div class="toc-items">
            <div
                class="toc-item"
                v-for="item in items"
                :key="item.path"
            >
                <router-link :to="item.path">
                    <img src="/assets/images/header-default.png" class="toc-item-image"/>
                    <p class="toc-item-title">
                        {{ item.title || item.path }}
                    </p>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ChildTableOfContents",
    props: {
        title: {
            type: String,
            default: 'More about this section'
        },
        header: {
            type: Boolean,
            default: false,
        },
        pageUrl: {
            type: String,
            default: undefined,
        },
        max: {
            type: Number,
            default: undefined,
        },
        level: {
            type: Number,
            default: undefined,
        },
    },
    computed: {
        items() {
            const currentUrl = this.pageUrl || this.$page.regularPath;

            return this.itemChilds(currentUrl);
        },
    },
    methods: {
        allChilds() {
            return this.$site.pages.sort((a, b) => {
                const aOrder = a.frontmatter && a.frontmatter.order;
                const bOrder = b.frontmatter && b.frontmatter.order;

                if (aOrder && bOrder) {
                    return aOrder > bOrder ? 1 : -1;
                }

                return 0;
            });
        },
        itemChilds(currentUrl) {
            return this.allChilds().filter((p) => {
                if (
                    !p.regularPath.startsWith(currentUrl) ||
                    p.regularPath === currentUrl
                ) {
                    return false;
                }

                const split = p.regularPath
                    .substr(currentUrl.length)
                    .split("/");

                if (p.regularPath.endsWith("/") && split.length === 2) {
                    return true;
                }

                if (p.regularPath.endsWith(".html") && split.length === 1) {
                    return true;
                }

                return false;
            });
        },
        itemHeaders(headers) {
            return (headers || []).filter((r) => r.level === 2);
        }
    },
};
</script>

<style lang="stylus">
.toc-wrapper
    margin-top: 2em
    
    .toc-items
        display grid
        grid-gap 1em
        grid-template-columns repeat(6, calc(25% - 1em))
        grid-template-rows 25% 25% 25%
        
        .toc-item
            width 100%
            
            .toc-item-image
                border-radius 12px
            > a 
                text-decoration none
                font-size 1em
        
            .toc-item-title
                margin 0
</style>
