<template>
  <div class="">
    <PageHeaders title="Dashboard" class="ninjadash-page-header-main">
    </PageHeaders>
    <Main class="flex flex-col gap-2">
      <p>Storage Used</p>
      <div class="w-1/2 flex flex-col gap-2">
        <p>
          <span v-if="convertMyStorageToGb?.gb > 1">
            {{ convertMyStorageToGb?.gb }} GB
          </span>
          <span v-else> {{ convertMyStorageToGb?.mb }} MB </span>
          <span> of {{ userDetails?.allocated_storage }} GB</span>
        </p>
        <a-alert
          v-if="convertMyStorageToGb?.percentage > 1"
          message="You are out of Storage"
          type="error"
          show-icon
        />
        <a-alert
          v-else-if="convertMyStorageToGb?.percentage > 0.8"
          message="You are out of Storage"
          type="warning"
          show-icon
        />

        <a-progress
          class="my-4"
          :strokeWidth="18"
          :showInfo="false"
          :status="
            convertMyStorageToGb?.percentage < 0.6
              ? 'success'
              : convertMyStorageToGb?.percentage < 0.8
              ? 'normal'
              : 'exception'
          "
          trailColor="#9f96864d"
          :percent="(convertMyStorageToGb?.percentage * 100)?.toFixed(1)"
        />
      </div>
      <a-button class="w-10 h-12 rounded" @click="refreshData">
        <template #icon>
          <ReloadOutlined></ReloadOutlined>
        </template>
      </a-button>
      <p>My Earnings</p>
      <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <!-- Card -->
        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs">
          <div class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full">
            <Money class="h-6"></Money>
          </div>
          <div>
            <p class="mb-2 text-sm font-medium text-gray-600">Wallet Balance</p>
            <base-loader v-if="isLoadingWalletBalance"></base-loader>
            <p v-else class="text-lg font-semibold text-gray-700">
              {{ this.formatCurrency(wallet?.account_balance) }}
            </p>
          </div>
        </div>
        <!-- Card -->
        <!-- Card -->
        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs">
          <div class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full">
            <Camera class="h-6"></Camera>
          </div>
          <div>
            <p class="mb-2 text-sm font-medium text-gray-600">
              Total Photos Sold
            </p>
            <base-loader v-if="isLoadingSummary"></base-loader>

            <p v-else class="text-lg font-semibold text-gray-700">
              {{ myAccountSummary?.total_photos_sold }}
            </p>
          </div>
        </div>
        <!-- Card -->
        <!-- Card -->
        <div class="flex items-center p-4 bg-white rounded-lg shadow-xs">
          <div class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full">
            <Money class="h-6"></Money>
          </div>
          <div>
            <p class="mb-2 text-sm font-medium text-gray-600">Total Earnings</p>
            <base-loader v-if="isLoadingSummary"></base-loader>
            <p v-else class="text-lg font-semibold text-gray-700">
              {{ this.formatCurrency(myAccountSummary?.cash_made) }}
            </p>
          </div>
        </div>
        <!-- Card -->
      </div>

      <!-- platform stats-->
      <template v-if="this.userDetails.is_admin">
        <!-- sales summary-->
        <p>Platform Sales</p>
        <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          <!-- Total Withdrawn Card -->
          <div class="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div class="p-3 mr-4 text-red-500 bg-red-100 rounded-full">
              <Money class="h-6"></Money>
            </div>
            <div>
              <p class="mb-2 text-sm font-medium text-gray-600">
                Total Withdrawn
              </p>
              <base-loader v-if="isLoadingPlatformFinanceSummary"></base-loader>
              <p v-else class="text-lg font-semibold text-gray-700">
                {{
                  (
                    platformFinanceSummary?.total_withdrawn || 0
                  )?.toLocaleString()
                }}
              </p>
            </div>
          </div>
          <!-- Total Withdrawn Card -->

          <!-- Total Account Balance Card -->
          <div class="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div class="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full">
              <Money class="h-6"></Money>
            </div>
            <div>
              <p class="mb-2 text-sm font-medium text-gray-600">
                Total Photographer Balances
              </p>
              <base-loader v-if="isLoadingPlatformFinanceSummary"></base-loader>
              <p v-else class="text-lg font-semibold text-gray-700">
                {{
                  (
                    platformFinanceSummary?.total_account_balance || 0
                  )?.toLocaleString()
                }}
              </p>
            </div>
          </div>
          <!-- Total Account Balance Card -->

          <!-- Total Cash Made Card -->
          <div class="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div class="p-3 mr-4 text-yellow-500 bg-yellow-100 rounded-full">
              <TrendCharts class="h-6"></TrendCharts>
            </div>
            <div>
              <p class="mb-2 text-sm font-medium text-gray-600">
                Total Cash Made
              </p>
              <base-loader v-if="isLoadingPlatformFinanceSummary"></base-loader>
              <p v-else class="text-lg font-semibold text-gray-700">
                {{
                  (
                    platformFinanceSummary?.total_cash_made || 0
                  )?.toLocaleString()
                }}
              </p>
            </div>
          </div>
          <!-- Total Cash Made Card -->

          <!-- Total Photos Sold Card -->
          <div class="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div class="p-3 mr-4 text-indigo-500 bg-indigo-100 rounded-full">
              <Camera class="h-6"></Camera>
            </div>
            <div>
              <p class="mb-2 text-sm font-medium text-gray-600">
                Total Photos Sold
              </p>
              <base-loader v-if="isLoadingPlatformFinanceSummary"></base-loader>
              <p v-else class="text-lg font-semibold text-gray-700">
                {{
                  (
                    platformFinanceSummary?.total_photos_sold || 0
                  )?.toLocaleString()
                }}
              </p>
            </div>
          </div>
        </div>
        <!-- Total Photos Sold Card -->

        <!-- end cash summary-->

        <!-- storage summary-->
        <p>Storage Stats</p>
        <div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          <!-- Total Storage Used Card -->
          <div class="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full">
              <Folder class="h-6"></Folder>
            </div>
            <div>
              <p class="mb-2 text-sm font-medium text-gray-600">
                Total Storage Used
              </p>
              <base-loader v-if="isLoadingPlatformStorageSummary"></base-loader>
              <p v-else class="text-lg font-semibold text-gray-700">
                {{
                  (
                    platformStorageSummary?.total_storage_used || 0
                  )?.toLocaleString()
                }}
              </p>
            </div>
          </div>
          <!-- Total Storage Used Card -->
          <!-- Total Photos Card -->
          <div class="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div class="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full">
              <Odometer class="h-6"></Odometer>
            </div>
            <div>
              <p class="mb-2 text-sm font-medium text-gray-600">Total Photos</p>
              <base-loader v-if="isLoadingPlatformStorageSummary"></base-loader>
              <p v-else class="text-lg font-semibold text-gray-700">
                {{
                  (platformStorageSummary?.total_photos || 0)?.toLocaleString()
                }}
              </p>
            </div>
          </div>
          <!-- Total Photos Card -->
          <!-- Total Galleries Card -->
          <div class="flex items-center p-4 bg-white rounded-lg shadow-xs">
            <div class="p-3 mr-4 text-green-500 bg-green-100 rounded-full">
              <Grid class="h-6"></Grid>
            </div>
            <div>
              <p class="mb-2 text-sm font-medium text-gray-600">
                Total Galleries
              </p>
              <base-loader v-if="isLoadingPlatformStorageSummary"></base-loader>
              <p v-else class="text-lg font-semibold text-gray-700">
                {{
                  (
                    platformStorageSummary?.total_galleries || 0
                  )?.toLocaleString()
                }}
              </p>
            </div>
          </div>
          <!-- Total Galleries Card -->
        </div>
        <!-- end storage summary-->
      </template>
      <!-- end platform stats-->
    </Main>
  </div>
</template>

<script>
import BaseLoader from "@/components/BaseLoader.vue";
import PageHeaders from "@/components/pageHeaders/PageHeaders.vue";
import { storageMultiplier, userTypes } from "@/utility/constants";
import { formatCurrency } from "@/utility/functions";
import vuexPersist from "@/vuex/modules/vuexPersist/index";
import { ReloadOutlined } from "@ant-design/icons-vue";
import {
  Box,
  Camera,
  DataAnalysis,
  DataBoard,
  DataLine,
  Folder,
  Grid,
  Histogram,
  Money,
  Odometer,
  Refresh,
  TrendCharts,
} from "@element-plus/icons-vue";
import QrcodeVue from "qrcode.vue";
import { defineComponent } from "vue";
import store from "../../vuex/store";
import { Main } from "../styled";
export default defineComponent({
  name: "BlankPage",
  methods: { formatCurrency },
  components: {
    Box,
    Histogram,
    DataLine,
    DataBoard,
    DataAnalysis,
    PageHeaders,
    Main,
    QrcodeVue,
    BaseLoader,
    Refresh,
    ReloadOutlined,
    Money,
    Odometer,
    TrendCharts,
    Camera,
    Folder,
    Grid,
  },
  data() {
    return {
      allocatedStorage: 0,
      userDetails: {
        user_type: "",
        is_admin: false,
        allocated_storage: 0,
      },
      storageMultiplier: storageMultiplier,
      myAccountSummary: {
        total_photos_sold: 0,
        cash_made: 0,
        total_storage_used: 0,
      },
      isLoadingSummary: true,
      persistedUser: vuexPersist,
      wallet: {
        account_balance: 0,
      },
      isLoadingWalletBalance: true,
      platformFinanceSummary: {
        total_withdrawn: 0,
        total_account_balance: 0,
        total_cash_made: 0,
        total_photos_sold: 0,
      },
      isLoadingPlatformFinanceSummary: false,
      isLoadingPlatformStorageSummary: false,
      platformStorageSummary: {
        total_storage_used: 0,
        total_photos: 0,
        total_galleries: 0,
      },
      userTypes: userTypes,
    };
  },
  computed: {
    convertMyStorageToGb() {
      const allocation =
        this.userDetails.allocated_storage * storageMultiplier.gb;
      const used_storage = this.myAccountSummary.total_storage_used;
      const storage_in_gb = used_storage / this.storageMultiplier.gb;
      const storage_in_mb = used_storage / this.storageMultiplier.mb;

      return {
        gb: storage_in_gb.toFixed(2),
        mb: storage_in_mb.toFixed(2),
        percentage: (
          storage_in_gb / this.userDetails.allocated_storage
        ).toFixed(2),
      };
    },
    convertPlatformStorageToGb() {
      const used_storage = this.platformStorageSummary.total_storage_used;

      return used_storage / this.storageMultiplier;
    },
  },
  methods: {
    refreshData() {
      this.getUsageSummary();
      this.getWalletBalance();
      if (this.userDetails?.is_admin) {
        this.getPlatformFinancesSummary();
        this.getPlatformStorageSummary();
      }
    },
    getUsageSummary() {
      this.isLoadingSummary = true;
      store
        .dispatch("fetchList", { url: "photographer-profile-summary" })
        .then((resp) => {
          this.isLoadingSummary = false;
          this.myAccountSummary = resp.data;
        })
        .catch(() => {
          this.isLoadingSummary = false;
        });
    },
    getWalletBalance() {
      this.isLoadingWalletBalance = true;
      store
        .dispatch("fetchList", { url: "wallet/my-wallet" })
        .then((resp) => {
          this.isLoadingWalletBalance = false;
          this.wallet = resp.data;
        })
        .catch(() => {
          this.isLoadingWalletBalance = false;
        });
    },
    getPlatformFinancesSummary() {
      this.isLoadingPlatformFinanceSummary = true;
      store
        .dispatch("fetchList", { url: "reports/platform-finances-summary" })
        .then((resp) => {
          this.isLoadingPlatformFinanceSummary = false;
          this.platformFinanceSummary = resp.data;
        })
        .catch(() => {
          this.isLoadingPlatformFinanceSummary = false;
        });
    },
    getPlatformStorageSummary() {
      this.isLoadingPlatformStorageSummary = true;
      store
        .dispatch("fetchList", { url: "reports/platform-storage-usage" })
        .then((resp) => {
          this.isLoadingPlatformStorageSummary = false;
          this.platformStorageSummary = resp.data;
        })
        .catch(() => {
          this.isLoadingPlatformStorageSummary = false;
        });
    },
  },
  mounted() {
    this.userDetails = JSON.parse(localStorage.getItem("piczanguUserDetails"));
    this.refreshData();
  },
});
</script>
