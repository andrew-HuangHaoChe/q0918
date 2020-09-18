<template>
  <div>
    <HomeNav></HomeNav>
    <HomeHeader></HomeHeader>
    <HomeContent></HomeContent>
  </div>
</template>

<script>
import HomeNav from './HomeNavbar.vue'
import HomeHeader from './HomeHeader.vue'
import HomeContent from './HomeContent.vue'

export default {
  components: {
    HomeNav,
    HomeHeader,
    HomeContent
  }
}
</script>
