<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <SuccessMessage></SuccessMessage>
    <nav class="navbar navbar-expand-lg navbar-light fixed-top topnav">
      <button class="navbar-toggler showMenu" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <router-link to="/"><img src="https://github.com/andrew-HuangHaoChe/image/blob/master/keyboardlogo.png?raw=true"
          class="logoImg pb-2"></router-link>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto py-2">
          <li class="nav-item pr-4 pb-2 d-flex justify-content-start">
            <router-link :to="{ path: '/'}" active-class="routerActive"><i
                class="fas fa-home fa-2x d-flex justify-content-center"></i>
              <div class="d-flex justify-content-center homeFont">首頁</div>
            </router-link>
          </li>
          <li class="nav-item pr-4 pb-2 d-flex justify-content-start">
            <router-link :to="{ path: '/shopping'}" active-class="routerActive"><i
                class="fas fa-shopping-bag fa-2x d-flex justify-content-center"></i>
              <div class="d-flex justify-content-center homeFont">商品</div>
            </router-link>
          </li>
          <li class="nav-item pr-4 pb-2 d-flex justify-content-start">
            <div class="btn-group">
              <div class="btn-group dropleft favIcon" role="group">
                <button type="button"
                  class="d-flex flex-column align-items-start p-0 border-0 btn dropdown-toggle dropdown-toggle-split favBtn"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="far fa-heart d-flex flex-column justify-content-start"></i>
                  <div class="homeFont">最愛</div>
                </button>
                <div class="dropdown-menu">
                  <div class="row drop-item-f px-4 py-2 favoriteList" v-for="(item,index) in favList" :key="index">
                    <div class="col-8 drop-item">{{ item }}</div>
                    <div class="col-1 drop-item"><i class="fas fa-eraser" @click="removeFav(item)"></i></div>
                    <div class="col-1 drop-item"><i class="fas fa-shopping-cart" @click="addfavCart(item)"></i></div>
                  </div>
                </div>
                <p class="favLength"><span class="d-flex justify-content-center">{{ favItem.length }}</span></p>
              </div>
            </div>
          </li>
          <li class="nav-item pr-4 pb-2 d-flex justify-content-start">
            <router-link :to="{ path: '/promotion'}" active-class="routerActive"><i
                class="fas fa-ticket-alt fa-2x d-flex justify-content-center"></i>
              <div class="d-flex justify-content-center icon">優惠</div>
            </router-link>
          </li>
          <li class="nav-item pr-4 pb-2 d-flex justify-content-start">
            <router-link :to="{ path: '/login'}" active-class="routerActive"><i
                class="far fa-user fa-2x d-flex justify-content-center"></i>
              <div class="d-flex justify-content-center icon">登入</div>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
<script>
import SuccessMessage from '../SuccessMessage'
export default {
  components: {
    SuccessMessage
  },
  data () {
    return {
      isrouActive: false,
      favItem: JSON.parse(localStorage.getItem('fav-storage')) || [],
      favList: [],
      isfavShow: false,
      isLoading: false
    }
  },
  methods: {
    getCart () {
      const vm = this
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
      vm.$http.get(api).then((response) => {
        vm.cart = response.data.data
        vm.$bus.$emit('cartnum', response.data.data.carts.length, response.data.data)
      })
    },
    addCart (id, qty = 1, item) {
      const vm = this
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
      const cart = {
        product_id: id,
        qty
      }
      vm.$http.post(api, { data: cart }).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('cart:push')
          vm.getCart()
          vm.$bus.$emit('successMessage', response.data.message, 'success')
          vm.favList.splice(vm.favList.indexOf(item), 1)
          localStorage.setItem('fav-storage', JSON.stringify(vm.favList))
        }
      })
    },
    removeFav (id) {
      const vm = this
      vm.favItem.splice(vm.favItem.indexOf(id), 1)
      localStorage.setItem('fav-storage', JSON.stringify(vm.favList))
      vm.$bus.$emit('feebackFav', id)
    },
    getFavtitle () {
      const vm = this
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`
      vm.$http.get(api).then((response) => {
        const productItem = response.data.products
        productItem.filter((item) => {
          if (vm.favItem.indexOf(item.id) !== -1) {
            vm.favList.push(item.title)
          }
          return item
        })
      })
    },
    addfavCart (title) {
      const vm = this
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`
      vm.$http.get(api).then((response) => {
        const productItem = response.data.products
        productItem.filter((item) => {
          if (title.indexOf(item.title) !== -1) {
            vm.addCart(item.id, 1, item.title)
          }
          return item
        })
      })
    }
  },
  mounted () {
    const vm = this
    vm.getFavtitle()
  },
  watch: {
    favItem () {
      const vm = this
      if (vm.favList.length !== vm.favItem.length) {
        vm.favList = []
        vm.getFavtitle()
      }
    }
  },
  created () {
    const vm = this
    vm.$bus.$on('listPush', (newfavItem) => {
      vm.favItem = newfavItem
    })
  }
}
</script>
<style lang="scss" scoped>
  .topnav {
    background-color: #fafafa;
    box-shadow: 0 3px 6px -3px gray;
  }
</style>
