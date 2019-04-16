<template>
  <div :class="bigDiv">
    <div class="bigText"></div>
  </div>
</template>
<script>
import Logo from '../assets/images/logo.png';

export default {
  data() {
    return {
      logo: Logo,
    };
  },
};
</script>
<style scoped>
.bigDiv {
  background-image: "../assets/images/logo.png";
  opacity: 0.2;
}
</style>
