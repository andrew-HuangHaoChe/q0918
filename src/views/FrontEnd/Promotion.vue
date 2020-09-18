<template>
  <div>
    <HomeNav class="mb-5 pb-5"></HomeNav>
    <div class="mt-5 pt-5 container">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <h1 class="text-center text-secondary mt-4 pb-3 h2 discount-title h3">
              <span class="proicon">
                <i class="fas fa-ticket-alt"></i>
              </span>
              優惠活動
            </h1>
            <div class="proBg proInf">
              <p class="protitle d-flex justify-content-center h1 pt-4 text-info font-weight-bold">金伯周年慶</p>
              <p class="subtitle d-flex justify-content-center h4 text-white pt-2 font-weight-bold">全館商品</p>
              <p class="subtitle d-flex justify-content-center h4 text-white pt-1 font-weight-bold">使用以下優惠碼通通7折!</p>
              <div class="d-flex justify-content-center mt-5">
                <div class="discode py-5">
                  <p class="distext mb-0 text-white font-weight-bold">001213</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import HomeNav from './HomeNavbar'
import Footer from './Footer'
export default {
  components: {
    HomeNav,
    Footer
  }
}
</script>
