<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <SuccessMessage></SuccessMessage>
    <HomeNav></HomeNav>
    <router-view></router-view>
    <div class="container picContent">
      <div class="row pt-5">
        <div class="col-md-4">
          <div class="card border-0 picCard" v-for="(item,key) in product" :key="item.id">
            <div class="card-body">
              <h4 class="card-title d-inline">{{ item.title }}
                <span class="text-secondary h5">( {{ item.category }} )</span>
              </h4>
              <p class="card-text">
              <ul class="w-100 p-0 mb-0 mt-3 d-flex justify-content-between">
                <li class="d-inline h5 text-secondary d-flex align-items-center mb-0 priceLine">
                  {{ item.origin_price |currency }}</li>
                <li class="d-inline h3 text-primary mb-0">網路價 NT{{ item.price |currency }}</li>
              </ul>
              </p>
              <select name="" class="custom-select from-control mt-3 w-100" v-model="item.num">
                <option :value="num" v-for="num in 10" :key="num" selected>
                  選購{{ num }} {{ item.unit }}
                </option>
              </select>
            </div>
            <div class="card-footer d-flex justify-content-between bg-white">
              <div class="text-muted text-nowrap mr-3 d-inline">
                小計<strong>{{ item.num * item.price }}</strong>元
              </div>
              <button class="btn btn-primary d-inline" @click="addtoCart(item.id, item.num)">
                <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                加入購物車
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-8" v-for="(item,key) in product" :key="item.id">
          <div class="container px-3 imageBox">
            <div class="pdwrapper">
              <img class="img-fluid img-box" :src="item.imageUrl" alt="">
            </div>
          </div>
        </div>
      </div>
      <ShopCart></ShopCart>
      <hr style="border: 1px dashed #3d5958;">
    </div>
    <section class="container">
      <div class="row">
        <div class="col-md-12" v-for="(pickItem,key) in product" :key="pickItem.id">
          <h4 class="p-2 text-primary pickBorder"><i class="far fa-sticky-note pr-2"></i>商品規格</h4>
          <p class="h5" style="line-height: 36px;">
          <pre>{{ pickItem.description }}</pre>
          </p>
        </div>
        <div class="col-md-12" v-for="(pickItem,key) in product" :key="pickItem.category">
          <h4 class="p-2 text-primary pickBorder"><i class="far fa-star pr-2"></i>商品特點</h4>
          <p class="h5" style="line-height: 36px;">
          <pre>{{ pickItem.content }}</pre>
          </p>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>
<script>
import HomeNav from './HomeNavbar'
import ShopCart from './ShopCart'
import Footer from './Footer'
import SuccessMessage from '../SuccessMessage'
export default {
  components: {
    HomeNav,
    ShopCart,
    Footer,
    SuccessMessage
  },
  data () {
    return {
      cart: [],
      product: [],
      isLoading: false,
      status: {
        loadingItem: ''
      },
      coupon_code: ''
    }
  },
  methods: {
    getProduct () {
      const vm = this
      const id = vm.$route.params.id
      vm.isLoading = true
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`
      vm.$http.get(api).then((response) => {
        response.data.product.num = 1
        vm.isLoading = false
        vm.product.push(response.data.product)
      })
    },
    addtoCart (id, qty = 1) {
      const vm = this
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
      vm.status.loadingItem = id
      const cart = {
        product_id: id,
        qty
      }
      vm.$http.post(api, { data: cart }).then((response) => {
        vm.status.loadingItem = ''
        if (response.data.success) {
          vm.getCart()
          vm.$bus.$emit('successMessage', response.data.message, 'success')
        }
      })
    },
    total () {
      const vm = this
      let totalNum = 0
      for (const item in cart) {
        if (typeof vm.cart[item] === 'final_total') {
          totalNum += vm.cart[item]
        }
      }
    },
    getCart () {
      const vm = this
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
      vm.isLoading = true
      vm.$http.get(api).then((response) => {
        vm.cart = response.data.data
        vm.isLoading = false
        vm.$bus.$emit('cartnum', response.data.data.carts.length, response.data.data)
      })
    }
  },
  created () {
    this.getProduct()
  },
  beforeMount () {
    this.getCart()
  }
}
</script>
