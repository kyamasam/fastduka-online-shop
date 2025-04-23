<script setup>
import BaseTable from "@/components/BaseTable.vue";
import { ref } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import router from "@/routes";
import BaseDrawer from "@/BaseDrawer.vue";

const selectAction = (action, userId) => {
  router.push({ name: action, params: { userId: userId } });
};

const columns = ref([
  {
    title: "Name",
    dataIndex: "",
    key: "name",
  },
  {
    title: "Phone Number",
    dataIndex: "",
    key: "phone",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "User Type",
    dataIndex: "user_type",
    key: "user_type",
  },
  {
    title: "Actions",
    dataIndex: "",
    key: "actions",
  },
]);
</script>

<template>
  <router-view />
  <BaseTable
      :columns="columns"
      create-route-name="create-user"
      fetchUrl="users"
      title="Users"
  >
    <template v-slot:bodyCell="slotProps">
      <template v-if="slotProps.column.key === 'name'">
        <div class="flex items-center gap-2">
          <img
              :alt="slotProps.text?.profile?.tagline"
              :src="slotProps.text?.profile?.profile_photo"
              class="h-10 w-auto"
          />
          {{ slotProps.text?.first_name }} {{ slotProps.text?.last_name }}
        </div>
      </template>

      <template v-if="slotProps.column.key === 'username'">
        <div>
          {{ slotProps.text?.username }}
        </div>
      </template>

      <template v-if="slotProps.column.key === 'phone'">
        <div>
          {{ slotProps.text?.phone_code }} {{ slotProps.text?.phone_number }}
        </div>
      </template>

      <template v-if="slotProps.column.key === 'email'">
        <div>
          {{ slotProps.text }}
        </div>
      </template>

      <template v-if="slotProps.column.key === 'actions'">
        <el-button
            class="bg-blue-400 border-none hover:bg-blue-500 focus:bg-blue-500 rounded-none"
            type="primary"
            size="large"
            @click="selectAction('edit-user', slotProps.text?.id)"
        >
          <el-icon>
            <arrow-right />
          </el-icon>
        </el-button>
      </template>
    </template>
  </BaseTable>
</template>

<style scoped></style>
