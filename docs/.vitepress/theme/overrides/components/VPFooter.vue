<template>
  <div class="footer-container slide-enter" v-if="frontmatter.footer !== false">
    <footer class="footer">
      <VPImage v-if="theme.logo" class="logo" :image="theme.logo" />
    </footer>
    <footer class="footer">
      <div class="footer-navigation" v-for="item in theme.footer.navigation">
        <h3 class="footer-title">{{ item.title }}</h3>
        <ul>
          <li v-for="ic in item.items">
            <VPLink
              :href="ic.href"
              :title="ic.text"
              :noIcon="true"
            >
              {{ ic.text }}
            </VPLink>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useData, withBase } from 'vitepress'
import VPLink from '~theme/components/VPLink.vue';
import VPImage from '~theme/components/VPImage.vue';

const { frontmatter, theme } = useData()

console.log(theme.value);
</script>

<style lang="scss">
.footer-container {
  z-index: 1;
  position: relative;
  right: 0;
  bottom: 0;
  padding: 0 32px;
  background-color: var(--vp-c-bg-alt);
  border-top: 1px solid var(--vp-c-divider);
}

.is-home ~ .footer-container .footer {
  max-width: 1152px;
}

.footer:first-child {
  padding-top: 2.5rem;
}

.footer:last-child {
  row-gap: 1rem;
}

.footer {
  display: grid;
  width: 100%;
  grid-auto-flow: row;
  place-items: start;
  column-gap: 1rem;
  font-size: 0.87rem;
  font-family: var(--vp-font-family-base);
  line-height: 1.25rem;
  margin: 0 auto;
}

.footer > * {
  display: grid;
  place-items: start;
  gap: 0.5rem;
}

.footer {
  place-items: center;

  .logo {
    height: var(--vp-nav-logo-height);
  }
}

.footer-navigation {
  width: 100%;
  line-height: 2em;
  font-size: 13px;
  font-weight: 500;
  place-items: self-start;
  gap: 0;
  overflow: hidden;

  ul {
    width: 100%;
    height: 0;
    overflow: hidden;
    transition: 300ms ease;

    li:last-child {
      margin-bottom: 16px;
    }
  }

  ul > li > a {
    display: inline-block;
    transition: color 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
    color: var(--vp-c-text-2);
    padding: 6px 14px;
    width: 100%;

    &:hover {
      color: var(--vp-c-brand);
    }
  }
}

.footer-title {
  cursor: pointer;
  width: 100%;
  user-select: all;
  font-weight: 700;
  font-size: 1em;
  line-height: 1.33337;
  color: var(--vp-c-brand);
  text-transform: uppercase;
  letter-spacing: -0.01em;
  padding: 1rem 0;
  opacity: 0.8;

  &::after {
    content: '+';
    filter: invert(50%);
    float: right;
    width: 14px;
    height: 14px;
    text-align: center;
    margin-right: 8px;
    transition: transform 0.3s ease;
  }
}

.footer-title:hover {
  &::after {
    transform: rotate(45deg) scale(1.08);
  }
}

// 这里逻辑还有点问题
.footer-title:hover ~ ul,
.footer-title ~ ul:hover {
  height: 100%;
}

@media (min-width: 1440px) {
  .footer-container .footer {
    max-width: 945px;
  }
}

@media (min-width: 960px) {
  .VPSidebar ~ .footer-container {
    width: calc(100% - var(--vp-sidebar-width));
    left: var(--vp-sidebar-width);
  }
}

@media (min-width: 48rem) {
  .footer {
    grid-auto-flow: column;
    place-items: self-start;
    row-gap: 2.5rem;
  }

  .footer-navigation:first-child {
    border-top: none;
  }

  .footer-navigation {
    place-items: self-start;
    border: none;

    ul {
      height: 100%;
    }

    ul > li > a {
      padding: 0;
    }
  }

  .footer-center {
    grid-auto-flow: row dense;
  }

  .footer-qrcode {
    display: flex;
  }

  .footer:first-child {
    padding-bottom: 2.5rem;
  }

  .footer-title {
    cursor: default;

    &::after {
      display: none;
    }
  }
}

.footer-sociallink {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  color: var(--vp-c-text-2);

  &:hover {
    color: var(--vp-c-text-1);
    transition: all 0.25s;
    background-color: var(--vp-c-bg-elv);
    border-radius: 25%;
  }

  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
}
</style>