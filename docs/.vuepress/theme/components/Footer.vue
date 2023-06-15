<template>
  <p>Footer</p>
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
