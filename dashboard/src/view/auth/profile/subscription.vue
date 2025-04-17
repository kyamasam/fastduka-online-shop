
<template>
  <div class="flex flex-col ">
    <PageHeaders title="Subscriptions" class="ninjadash-page-header-main"></PageHeaders>
<!--    subscription hotfix-->

    <div class="px-4 md:px-8">
      <a-tabs v-model="activeKey"
              @tabClick="checkActiveSubscription"
              type="card">
        <a-tab-pane key="1" >
          <template #tab>
            <span class="flex items-center gap-2">
              <star-filled class="h-4 w-4 text-orange-500"/>
              My Subscription
            </span>
          </template>

          <div
              class="flex flex-col items-center h-fit">
            <div class="flex flex-wrap h-full  gap-6  w-full">
              <subscription-card/>
            </div>
          </div>
        </a-tab-pane>



        <a-tab-pane key="2" >
          <template #tab>
            <span class="flex items-center gap-2">
              <setting class="h-4 w-4"/>
              Manage Subscriptions
            </span>
          </template>
          <div
              class="flex flex-col items-center h-fit">
            <div class="flex flex-wrap h-full  gap-6  w-full">
              <subscription-card v-for="item in userSubscriptions"
                                 :subscriptionObject="item"
                                 :key="item"/>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>


  </div>

</template>

<script setup>
import {ref, onMounted} from "vue"
import {Setting, StarFilled} from "@element-plus/icons-vue";
import SubscriptionCard from "@/view/auth/profile/components/subscriptionCard.vue";
import store from "@/vuex/store";
import { allowedUsers } from "@/utility/functions"

const activeKey = ref(2)

const checkActiveSubscription = () => {
  activeKey.value = activeKey.value > 1 ? 1 : 2
  console.log(activeKey.value)
}

const userSubscriptions = ref([])

const fetchSubscriptions = () =>{
    store.dispatch('fetchList',{url:'subscription-plan'}).then(
        (res)=>{
          userSubscriptions.value = res.data
          console.log(res.data)
        }
    )
}

onMounted(()=>{
  checkActiveSubscription()
  fetchSubscriptions()
  allowedUsers('photographer')
})

</script>


<style scoped>

</style>