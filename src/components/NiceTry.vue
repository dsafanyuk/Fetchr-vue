<template>
  <v-app>
    <v-container>
      <v-layout column align-center>
        <img id="banana" v-bind:src="bnan">
        <v-btn to="/dashboard">Go back home</v-btn>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
import Banana from '../assets/images/peanutbutterjellytime.gif';

export default {
  data() {
    return {
      bnan: Banana,
    };
  },
};
</script>

<style scoped>
#banana {
  margin: 10%;
  height: 224px;
  width: 163px;
}
</style>
