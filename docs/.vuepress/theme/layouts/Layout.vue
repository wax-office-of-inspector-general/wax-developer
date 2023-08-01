<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <div
      class="sidebar-mask"
      @click="sidebarToggle(false)"
    ></div>

    <Sidebar
      :items="sidebarItems"
      @sidebar-toggle="sidebarToggle"
    >
      <template #top>
        <slot name="sidebar-top" />
      </template>
      <template #bottom>
        <slot name="sidebar-bottom" />
      </template>
    </Sidebar>

    <div class="content-wrapper">
      <Navbar
        @sidebar-toggle="sidebarToggle"
      />

      <Page
        :sidebar-items="sidebarItems"
      >
        <template #top>
          <Breadcrumb />
          <slot name="page-top" />
        </template>
        <template #bottom>
          <slot name="page-bottom" />
        </template>
      </Page>

      <Footer />
    </div>
  </div>
</template>

<script>
import PageWithHeader from '@theme/components/PageWithHeader.vue'
import Navbar from '@theme/components/Navbar.vue'
import Page from '@parent-theme/components/Page.vue'
import Sidebar from '@theme/components/Sidebar.vue'
import Breadcrumb from '@theme/components/Breadcrumb.vue'
import Footer from '@theme/components/Footer.vue'
import { resolveSidebarItems } from '@parent-theme/util'

export default {
  name: 'Layout',

  components: {
    PageWithHeader,
    Page,
    Sidebar,
    Navbar,
    Breadcrumb,
    Footer
  },

  data () {
    return {
      isSidebarOpen: false
    }
  },

  computed: {
    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    },
    pageClasses () {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'sidebar-open': this.isSidebarOpen,
        },
        userPageClass
      ]
    }
  },

  mounted () {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false
    })
  },

  methods: {
    sidebarToggle (to) {
      console.log(to);
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
      this.$emit('sidebar-toggle', this.isSidebarOpen)
    },

    // side swipe
    onTouchStart (e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    },

    onTouchEnd (e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.sidebarToggle(true)
        } else {
          this.sidebarToggle(false)
        }
      }
    }
  }
}
</script>