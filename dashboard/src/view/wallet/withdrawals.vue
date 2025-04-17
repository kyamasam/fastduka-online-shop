<template>
  <PageHeaders title="Withdrawals" class="ninjadash-page-header-main"></PageHeaders>

  <base-withdraw-modal v-if="showWithdraw" @toggleModal="showWithdraw = !showWithdraw"/>


  <BaseTable
      :columns="columns"
      fetch-url="past-withdrawal-list"
      title="Withdrawals"
  >
    <template #otherItems>
      <InformationCard title="Ksh 2,000 Balance">
        <template #icon>
          <span >
            <money class="h-6 w-6"/>
          </span>
        </template>
      </InformationCard>



      <sdButton size="middle"
                type="secondary"
                @click="showWithdraw = !showWithdraw"
                class="flex items-center justify-center h-12">
        <span class="h-fit text-white">
          <wallet-filled/>
        </span>

        <span >Withdraw Cash</span>
      </sdButton>
    </template>

    <template #filters>
      <div class="p-1 flex gap-2 rounded">
        <a-range-picker
            v-model:value="dateRange"
            format="YYYY/MM/DD"
            class="rounded h-12"  />
      </div>
    </template>

    <template v-slot:bodyCell="slotProps">
      <template v-if="slotProps.column.dataIndex === 'transaction_amount'">
        something
      </template>
      <template v-if="slotProps.column.key === 'actions'">
        <AButton type="primary" >
          <template #icon>
            <edit-pen/>
          </template>
        </AButton>

        <a-button>
          <template #icon>
            <CaretRight/>
          </template>
        </a-button>
      </template>
    </template>
  </BaseTable>


</template>

<script setup>
import BaseTable from "@/components/BaseTable";
import PageHeaders from "@/components/pageHeaders/PageHeaders";
import {ref} from 'vue'
import {CaretRight, Filter, Money, WalletFilled} from "@element-plus/icons-vue";
import {ElDialog, ElButton} from "element-plus";
import store from "../../vuex/store"
import InformationCard from "../../components/cards/InformationCard.vue";

const columns= [
  {
    title: "Amount",
    dataIndex: "transaction_amount",
    key: "transaction_amount",
    sorter: true,
  },
  {
    title: "Code",
    dataIndex: "transaction_code",
  },
  {
    title: "Status",
    dataIndex: "transaction_status",
  },
  {
    title: "Actions",
    dataIndex: "",
    key:"actions"
  },
]

const dateRange = ref([])

const props = defineProps({
  showWithdraw : {
    type: Boolean,
    default: false
}
})

onMounted(
  ()=>{
    allowedUsers('photographer')
  }
)

</script>

<style scoped>

</style>