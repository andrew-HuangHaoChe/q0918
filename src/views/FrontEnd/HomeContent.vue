<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <SuccessMessage></SuccessMessage>
    <AlertMessage></AlertMessage>
    <div class="wrapper">
      <div class="container">
        <div class="row mt-2">
          <div class="col-md-3">
            <div class="list-group sticky-top mb-3">
              <a href="#all" class="list-group-item list-group-item-action" :class="{ active: filter === 'all' }"
                @click.prevent="filter='all'">
                <i aria-hidden="true" class="far fa-keyboard mr-2"></i>全部鍵盤
              </a>
              <a href="#ducky" class="list-group-item list-group-item-action option-font" data-toggle="list"
                :class="{ active: filter === 'ducky'}" @click.prevent="filter ='ducky'">
                <i aria-hidden="true" class="far fa-keyboard mr-2"></i>Ducky
              </a>
              <a href="#irock" class="list-group-item list-group-item-action option-font" data-toggle="list"
                :class="{ active: filter === 'irock'}" @click.prevent="filter = 'irock'">
                <i aria-hidden="true" class="far fa-keyboard mr-2"></i>irock
              </a>
              <a href="#filco" class="list-group-item list-group-item-action option-font" data-toggle="list"
                :class="{ active: filter === 'filco'}" @click.prevent="filter = 'filco'">
                <i aria-hidden="true" class="far fa-keyboard mr-2"></i>filco
              </a>

            </div>
          </div>
          <div class="col-md-9">
            <div class="row">
              <div class="col-md-4 mb-4 box-shadow keyboardCard" v-for="item in filterProducts" :key="item.id">
                <div class="card border-0 shadow-sm">
                  <div
                    style="height: 180px;background-size: contain; background-position: center; background-repeat: no-repeat; position: relative;"
                    :style="{ backgroundImage:`url(${item.imageUrl})`}">
                  </div>
                  <a href="#" @click.prevent="addLiked(item,item.id)" class="liked">
                    <i class="far fa-heart text-primary d-flex justify-content-end" v-if="!checkOutFav(item)"></i>
                    <i class="fas fa-heart text-primary d-flex justify-content-end" v-if="checkOutFav(item)"></i>
                  </a>
                  <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                    <h5 class="card-title">
                      <a href="#" class="text-dark">{{ item.title }}</a>
                    </h5>
                    <p class="card-text">{{ item.content }}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                      <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
                      <del class="h6">原價 {{ item.origin_price }} 元</del>
                      <div class="h5">現在只要 {{ item.price }} 元</div>
                    </div>
                  </div>
                  <div class="card-footer bg-white d-flex">
                    <router-link :to="'/pickcommodity/' + item.id">
                      <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                        查看更多</button>
                    </router-link>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
                      <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                      加到購物車
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ShopCart></ShopCart>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import ShopCart from './ShopCart'
import Footer from './Footer'
import SuccessMessage from '../SuccessMessage'
import AlertMessage from '../AlertMessage'
const STORAGE_KEY = 'fav-storage'
export default {
  components: {
    ShopCart,
    Footer,
    SuccessMessage,
    AlertMessage
  },
  data () {
    return {
      cart: [],
      shopcart: [],
      product: {},
      products: [],
      keyboardSort: [],
      pagination: {},
      isLoading: false,
      status: {
        loadingItem: ''
      },
      isActive: true,
      filter: 'ducky',
      favId: '',
      favItem: '',
      favList: []
    }
  },
  methods: {
    getProducts (page = 1) {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`
      const vm = this
      vm.isLoading = true
      vm.$http.get(api).then((response) => {
        vm.isLoading = false
        vm.products = response.data.products
        vm.pagination = response.data.pagination
        vm.products.forEach(element => {
          vm.keyboardSort.push(element.category)
        })
        const tempItem = response.data.products
        tempItem.forEach((el) => {
          vm.$set(el, 'favItem', false)
        })
      })
    },
    getProduct (id) {
      const vm = this
      vm.isLoading = true
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`
      vm.$http.get(api).then((response) => {
        vm.isLoading = false
        vm.product = response.data.product
      })
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
          vm.$bus.$emit('cart:push')
          vm.getCart()
          vm.$bus.$emit('successMessage', response.data.message, 'success')
        }
      })
    },
    addLiked (item, id) {
      const vm = this
      vm.favId = id
      if (vm.favList.indexOf(vm.favId) === -1) {
        vm.favItem = true
        vm.favList.push(vm.favId)
        vm.$bus.$emit('successMessage', '已加入最愛', 'success')
      } else {
        vm.favList.splice(vm.favList.indexOf(vm.favId), 1)
        vm.favItem = false
        vm.$bus.$emit('message:push', '已移除最愛', 'danger')
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vm.favList))
      vm.$bus.$emit('listPush', vm.favList)
    },
    checkOutFav (item) {
      const vm = this
      if (vm.favList.some((el) => el === item.id)) {
        return true
      }
      return false
    }
  },
  computed: {
    filterProducts: function () {
      if (this.filter === 'all') {
        return this.products
      } else if (this.filter === 'ducky') {
        return this.products.filter(function (item, index, array) {
          return item.category === 'Ducky'
        })
      } else if (this.filter === 'irock') {
        return this.products.filter(function (item, index, array) {
          return item.category === 'i-rock'
        })
      } else if (this.filter === 'filco') {
        return this.products.filter(function (item, index, array) {
          return item.category === 'Filco'
        })
      }
    }
  },
  mounted () {
    const vm = this
    vm.$bus.$on('feebackFav', (id) => {
      vm.getProducts()
      vm.checkOutFav(id)
    })
  },
  created () {
    this.getProducts()
    this.getCart()
  }
}
</script>
