<template>
  <div class="footer">
    <div class="logo">
      <img
        v-if="$site.themeConfig.logo"
        class="logo can-hide"
        :src="$withBase($site.themeConfig.logo)"
        :alt="$siteTitle"
      >
    </div>
    <div class="link-columns">
      <div class="link-column">
        <ul>
          <li>
            <span>Join the conversation</span>
          </li>
          <li>
            <a href="#">Chat on Telegram</a>
          </li>
          <li>
            <a href="#">Chat on Discord</a>
          </li>
        </ul>
      </div>
      <div class="link-column">
        <ul>
          <li>
            <span>About WAX</span>
          </li>
          <li>
            <a href="#">Chat on Telegram</a>
          </li>
          <li>
            <a href="#">Chat on Discord</a>
          </li>
        </ul>
      </div>
      <div class="link-column">
        <ul>
          <li>
            <span>Follow us</span>
          </li>
          <li>
            <a href="#">Chat on Telegram</a>
          </li>
          <li>
            <a href="#">Chat on Discord</a>
          </li>
        </ul>
      </div>
      <div class="link-column">
        <ul>
          <li>
            <span>Follow us</span>
          </li>
          <li>
            <a href="#">Chat on Telegram</a>
          </li>
          <li>
            <a href="#">Chat on Discord</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    footerSocials() {
      
    },
  },
  methods: {
    titleCase: function (str) {
      return str
        .toLowerCase()
        .split(' ')
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    },
  },
};
</script>
