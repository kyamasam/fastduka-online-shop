<template>
  <PageHeaders
    class="ninjadash-page-header-main"
    title="Payments"
  ></PageHeaders>

  <base-withdraw-modal
    v-if="showWithdraw"
    @toggleModal="showWithdraw = !showWithdraw"
  />

  <BaseTable
    :columns="columns"
    :fetch-url="url"
    :show0therItems="true"
    :showSearch="false"
    title="Clients"
    @trailingReload="getWalletBalance"
  >
    <template v-if="isPhotographerOrOwner" #otherItems>
      <!--      <InformationCard title="123 Photos Sold">-->
      <!--        <template #icon>-->
      <!--          <camera-filled class="h-6 w-6"/>-->
      <!--        </template>-->
      <!--      </InformationCard>-->

      <InformationCard>
        <template #title>
          <span>
            Account Balance : {{ formatCurrency(wallet_info?.account_balance) }}
          </span>
        </template>
      </InformationCard>

      <sdButton
        v-if="isPhotographerOrOwner"
        class="flex items-center justify-center h-10 w-fit"
        size="middle"
        type="secondary"
        @click="showWithdraw = !showWithdraw"
      >
        <span class="h-fit text-white">
          <wallet-filled />
        </span>

        <span>Withdraw Cash</span>
      </sdButton>
    </template>

    <template #filters>
      <div class="flex flex-wrap gap-2">
        <div class="flex items-center gap-0 w-fit">
          <el-radio-group
            v-model="transactionType"
            size="large"
            @change="filterByTransactionType"
          >
            <el-radio-button label=""> All Transactions </el-radio-button>
            <el-radio-button label="gallery_purchase">
              Money from Gallery Purchase
            </el-radio-button>
            <el-radio-button label="withdrawal"> Withdrawals</el-radio-button>
            <el-radio-button label="commission_charge">
              System Charges
            </el-radio-button>
          </el-radio-group>
        </div>
        <el-input
          v-model="transactionCode"
          class="w-56"
          clearable
          placeholder="transaction code"
          size="large"
          @input="filterByTransactionCode"
        >
        </el-input>
      </div>
    </template>

    <template v-slot:bodyCell="slotProps">
      <!-- <template>
        {{ slotProps.text }}
      </template> -->

      <template v-if="slotProps.column.key === 'transaction_amount'">
        {{ slotProps.text }}
      </template>
      <template v-if="slotProps.column.key === 'created_at'">
        {{ new Date(slotProps.text.created_at)?.toLocaleDateString() }}
        {{ new Date(slotProps.text.created_at)?.toLocaleTimeString() }}
      </template>
      <template v-if="slotProps.column.key === 'customer_account_number'">
        {{ slotProps.text }}
      </template>
      <template v-if="slotProps.column.key === 'customer_name'">
        {{ slotProps.text }}
      </template>

      <template v-if="slotProps.column.dataIndex === 'transaction_code'">
        {{ slotProps.text }}
      </template>

      <template v-if="slotProps.column.dataIndex === 'transaction_type'">
        <span class="capitalize">{{ slotProps?.text?.replace("_", " ") }}</span>
      </template>

      <template v-if="slotProps.column.dataIndex === 'transaction_status'">
        <span class="capitalize">
          <el-tag v-if="slotProps?.text === 'processed'" type="success">
            {{ slotProps.text }}</el-tag
          >

          <el-tag v-if="slotProps?.text === 'processing'" type="info">
            {{ slotProps.text }}</el-tag
          >

          <el-tag v-if="slotProps?.text === 'failed'" type="danger">
            {{ slotProps.text }}</el-tag
          >
        </span>
      </template>

      <template v-if="slotProps.column.dataIndex === 'payment_method'">
        <span class="capitalize">
          {{ slotProps.text }}
        </span>
      </template>

      <template v-if="slotProps.column.dataIndex === 'created_at'">
        {{ slotProps.text }}
      </template>
    </template>
  </BaseTable>
</template>

<script setup>
import BaseWithdrawModal from "@/components/modals/BaseWithdrawModal";
import store from "@/vuex/store";
import { ElInput, ElRadioButton, ElRadioGroup, ElTag } from "element-plus";
import { onBeforeMount, onMounted, ref } from "vue";
import { allowedUsers } from "@/utility/functions";

const columns = ref([
  {
    title: "Time",
    dataIndex: "",
    key: "created_at",
    sorter: true,
  },
  {
    title: "Amount",
    dataIndex: "transaction_amount",
    key: "transaction_amount",
    sorter: true,
  },
  {
    title: "Customer Name",
    dataIndex: "customer_name",
    key: "customer_name",
  },
  {
    title: "Phone",
    dataIndex: "customer_account_number",
    key: "customer_account_number",
    sorter: true,
  },
  {
    title: "Code",
    dataIndex: "transaction_code",
    key: "",
    sorter: true,
  },
  {
    title: "Status",
    dataIndex: "transaction_status",
    key: "",
    sorter: true,
  },

  {
    title: "Type",
    dataIndex: "transaction_type",
    key: "",
    sorter: true,
  },
  {
    title: "Mode",
    dataIndex: "payment_method",
    key: "payment_method",
    sorter: true,
  },
]);
const userType = JSON.parse(
  localStorage.getItem("piczanguUserDetails")
)?.user_type;
const isPhotographerOrOwner =
  userType?.toLowerCase() === "photographer" ||
  userType?.toLowerCase() === "owner"
    ? true
    : false;
const url = ref("transaction");
const transactionCode = ref("");
const transactionType = ref("withdrawal");
const filters = ref([{ transaction_type: "withdrawal" }]);

const doesKeyExist = (property, value, listOfObjects) => {
  if (listOfObjects.length === 0) {
    return false;
  }
  return listOfObjects.some((obj) => obj[property] !== undefined);
};

const updateUrl = (baseUrl, filters) => {
  let updatedUrl = baseUrl;
  filters.forEach((query, index) => {
    const separator = index === 0 ? "?" : "&";

    if (typeof filters === "object" && filters !== null) {
      Object.entries(query).forEach(([key, value]) => {
        updatedUrl += `${separator}${encodeURIComponent(
          key
        )}=${encodeURIComponent(value)}`;
      });
    }
  });

  return updatedUrl;
};

const updateFilters = (keyToCheck, valueToFind, objectToFind) => {
  const isKeyPresent = doesKeyExist(keyToCheck, valueToFind, filters.value);
  const valuesAreSame = filters.value.some(
    (obj) => obj[keyToCheck] === valueToFind
  );

  if (isKeyPresent && !valuesAreSame) {
    const filteredObjects = filters.value.filter((obj) => !(keyToCheck in obj));
    filters.value = filteredObjects;
    filters.value.push(objectToFind);
    url.value = updateUrl("transaction", filters.value);
  }
  if (!isKeyPresent) {
    filters.value.push(objectToFind);
    url.value = updateUrl("transaction", filters.value);
  }
};

const filterByTransactionCode = () => {
  // url.value = url.value + `?transaction_code=${transactionCode.value}`
  if (transactionCode.value) {
    updateFilters("transaction_code", transactionCode.value, {
      ["transaction_code"]: transactionCode.value,
    });
  } else {
    updateFilters("transaction_code", transactionCode.value, {
      ["transaction_code"]: "",
    });
  }
};
const filterByTransactionType = () => {
  if (transactionType.value) {
    updateFilters("transaction_type", transactionType.value, {
      ["transaction_type"]: transactionType.value,
    });
  } else {
    updateFilters("transaction_type", transactionType.value, {
      ["transaction_type"]: "",
    });
  }
};

const wallet_info = ref("");

const getWalletBalance = () => {
  store.dispatch("fetchList", { url: "wallet/my-wallet" }).then((res) => {
    wallet_info.value = res?.data;
  });
};

let formatCurrency = (amount) => {
  let formatter = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
  });
  return formatter.format(amount);
};

const props = defineProps({
  showWithdraw: {
    type: Boolean,
    default: false,
  },
});

onMounted(() => {
  getWalletBalance();
  allowedUsers("admin");
  // allowedUsers('photographer')
});
onBeforeMount(() => {
  url.value = "transaction/?transaction_type=withdrawal";
});
</script>

<style scoped></style>
