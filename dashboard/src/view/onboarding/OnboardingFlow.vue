<template>
  <div class="flex justify-center items-center min-h-screen w-full bg-gray-50 py-8">
    <div class="max-w-3xl w-full mx-auto px-4">
      <!-- Progress steps indicator -->
      <el-steps :active="currentStep"
                finish-status="success"
                class="mb-8">
        <el-step title="Business Info"></el-step>
        <el-step title="Site Icon"></el-step>
        <el-step title="Site Logo"></el-step>
      </el-steps>

      <!-- Form container -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <!-- Step 1: Business Information -->
        <div v-if="currentStep === 0"
             class="min-h-[320px]">
          <h2 class="text-2xl font-bold mb-4">Business Information</h2>
          <p class="text-gray-600 mb-6">
            Let's get to know your business better.
          </p>

          <el-form ref="businessInfoForm"
                   :model="formData"
                   :rules="rules"
                   label-position="top">
            <el-form-item label="Business Name"
                          prop="title">
              <el-input v-model="formData.title"
                        placeholder="Enter your business name"
                        size="large" />
            </el-form-item>

            <el-form-item label="Business Description"
                          prop="description">
              <el-input v-model="formData.description"
                        type="textarea"
                        :rows="4"
                        placeholder="Briefly describe your business"
                        size="large" />
            </el-form-item>

            <el-form-item label="Industry"
                          prop="industry">
              <el-select v-model="formData.industry"
                         placeholder="Select your industry"
                         style="width: 100%"
                         size="large">
                <el-option label="Food & Beverages"
                           value="Food & Beverages" />
                <el-option label="Grocery"
                           value="Grocery" />
                <el-option label="Butchery"
                           value="Butchery" />
                <el-option label="Bakery"
                           value="Bakery" />
                <el-option label="Liquor Store"
                           value="Liquor Store" />
                <el-option label="Restaurant & Takeaway"
                           value="Restaurant & Takeaway" />
                <el-option label="Coffee Shop / Café"
                           value="Coffee Shop / Café" />
                <el-option label="Retail"
                           value="Retail" />
                <el-option label="Electronics & Appliances"
                           value="Electronics & Appliances" />
                <el-option label="Mobile Phones & Accessories"
                           value="Mobile Phones & Accessories" />
                <el-option label="Fashion & Apparel"
                           value="Fashion & Apparel" />
                <el-option label="Shoes & Footwear"
                           value="Shoes & Footwear" />
                <el-option label="Beauty & Cosmetics"
                           value="Beauty & Cosmetics" />
                <el-option label="Health & Wellness"
                           value="Health & Wellness" />
                <el-option label="Pharmacy & Medical Supplies"
                           value="Pharmacy & Medical Supplies" />
                <el-option label="Home & Living"
                           value="Home & Living" />
                <el-option label="Furniture & Decor"
                           value="Furniture & Decor" />
                <el-option label="Hardware & Building Materials"
                           value="Hardware & Building Materials" />
                <el-option label="Automotive & Spare Parts"
                           value="Automotive & Spare Parts" />
                <el-option label="Books & Stationery"
                           value="Books & Stationery" />
                <el-option label="Toys & Games"
                           value="Toys & Games" />
                <el-option label="Sports & Outdoors"
                           value="Sports & Outdoors" />
                <el-option label="Pet Supplies"
                           value="Pet Supplies" />
                <el-option label="Jewelry & Watches"
                           value="Jewelry & Watches" />
                <el-option label="Art & Crafts"
                           value="Art & Crafts" />
                <el-option label="Baby & Kids"
                           value="Baby & Kids" />
                <el-option label="Agriculture & Farming"
                           value="Agriculture & Farming" />
                <el-option label="Services"
                           value="Services" />
                <el-option label="Salon & Spa"
                           value="Salon & Spa" />
                <el-option label="Cleaning & Laundry"
                           value="Cleaning & Laundry" />
                <el-option label="Events & Catering"
                           value="Events & Catering" />
                <el-option label="Technology & IT"
                           value="Technology & IT" />
                <el-option label="Education & Training"
                           value="Education & Training" />
                <el-option label="Stationery & Office Supplies"
                           value="Stationery & Office Supplies" />
                <el-option label="Wholesale & Distribution"
                           value="Wholesale & Distribution" />
                <el-option label="Other"
                           value="Other" />

              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <!-- Step 2: Site Icon Upload -->
        <div v-if="currentStep === 1"
             class="min-h-[320px]">
          <h2 class="text-2xl font-bold mb-4">Site Icon</h2>
          <p class="text-gray-600 mb-6">
            Upload a site icon (favicon) for your business website.
          </p>

          <el-form ref="iconForm"
                   :model="formData"
                   :rules="rules"
                   label-position="top">
            <el-form-item label="Site Icon"
                          prop="siteIcon">
              <el-upload ref="siteIconUpload"
                         class="w-full"
                         drag
                         :auto-upload="false"
                         :on-change="handleIconChange"
                         :on-exceed="handleSiteIconExceed"
                         :on-remove="handleIconRemove"
                         :limit="1"
                         accept="image/png,image/jpeg,image/svg+xml,image/webp">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    PNG, JPEG, SVG or WebP file (max. 2MB). Recommended size:
                    192x192px
                  </div>
                </template>
              </el-upload>

              <div v-if="iconPreview"
                   class="mt-4 border border-gray-200 p-4 rounded-md">
                <h4 class="text-sm font-medium mb-2">Preview:</h4>
                <div class="w-16 h-16 overflow-hidden">
                  <img :src="iconPreview"
                       alt="Site Icon Preview"
                       class="w-full h-auto object-contain" />
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <!-- Step 3: Site Logo Upload -->
        <div v-if="currentStep === 2"
             class="min-h-[320px]">
          <h2 class="text-2xl font-bold mb-4">Site Logo</h2>
          <p class="text-gray-600 mb-6">Upload your business logo.</p>

          <el-form ref="logoForm"
                   :model="formData"
                   :rules="rules"
                   label-position="top">
            <el-form-item label="Site Logo"
                          prop="siteLogo">
              <el-upload ref="siteLogoUpload"
                         :handleExceed="handleLogoExceed"
                         :file-list="[]"
                         class="w-full"
                         drag
                         :auto-upload="false"
                         :on-change="handleLogoChange"
                         :on-remove="handleLogoRemove"
                         :limit="1"
                         accept="image/png,image/jpeg,image/svg+xml,image/webp">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  Drop file here or <em>click to upload</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    PNG, JPEG, SVG or WebP file (max. 5MB). Recommended size:
                    300x100px
                  </div>
                </template>
              </el-upload>

              <div v-if="logoPreview"
                   class="mt-4 border border-gray-200 p-4 rounded-md">
                <h4 class="text-sm font-medium mb-2">Preview:</h4>
                <div class="max-w-[300px] max-h-[100px] overflow-hidden">
                  <img :src="logoPreview"
                       alt="Site Logo Preview"
                       class="w-full h-auto object-contain" />
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <!-- Success screen -->
        <div v-if="currentStep === 4"
             class="min-h-[320px] flex flex-col items-center justify-center text-center py-8">
          <div class="text-6xl text-green-500 mb-4">
            <el-icon><circle-check-filled /></el-icon>
          </div>
          <h2 class="text-2xl font-bold mb-4">Setup Complete!</h2>
          <p class="text-gray-600 mb-6">
            Your business profile has been set up successfully. You can now
            continue to your dashboard.
          </p>
          <el-button type="primary"
                     size="large"
                     @click="goToDashboard"
                     class="mt-4">
            Go to Dashboard
          </el-button>
        </div>

        <!-- Navigation buttons -->
        <div class="flex justify-between mt-8"
             v-if="currentStep < 4">
          <el-button v-if="currentStep > 0"
                     @click="prevStep"
                     size="large"
                     icon="el-icon-arrow-left">
            Previous
          </el-button>
          <div v-else></div>

          <el-button type="primary"
                     @click="nextStep"
                     size="large"
                     :loading="isSubmitting">
            {{ currentStep === 3 ? "Finish" : "Next" }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import store from "@/vuex/store";
import { CircleCheckFilled, UploadFilled } from "@element-plus/icons-vue";
import { ElNotification, genFileId } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentStep = ref(0);
const isSubmitting = ref(false);

const emit = defineEmits(["complete"]);
const props = defineProps({
  settingsData: {
    type: Object,
    default: () => ({}),
  },
});

// Form data
const formData = reactive({
  title: "",
  description: "",
  industry: "",
  siteIcon: null,
  siteLogo: null,
});

// Preview URLs
const iconPreview = ref(null);
const logoPreview = ref(null);

// Form validation rules
const rules = {
  title: [
    {
      required: true,
      message: "Please enter your business name",
      trigger: "blur",
    },
  ],
  description: [
    {
      required: true,
      message: "Please enter a business description",
      trigger: "blur",
    },
  ],
  industry: [
    { required: true, message: "Please select an industry", trigger: "change" },
  ],
  siteIcon: [
    { required: true, message: "Please upload a site icon", trigger: "change" },
  ],
  siteLogo: [
    { required: true, message: "Please upload a site logo", trigger: "change" },
  ],
};

// Form refs for validation
const businessInfoForm = ref(null);
const industryForm = ref(null);
const iconForm = ref(null);
const logoForm = ref(null);

const siteIconUpload = ref();

const handleSiteIconExceed = (files) => {
  siteIconUpload.value?.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  siteIconUpload.value?.handleStart(file);
};
const siteLogoUpload = ref();

const handleLogoExceed = (files) => {
  siteLogoUpload.value?.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  siteLogoUpload.value?.handleStart(file);
};
// Handle file changes
const handleIconChange = async (file) => {
  console.log("icon change");
  // Validate file
  if (file.raw.size > 2 * 1024 * 1024) {
    // 2MB max
    ElNotification({
      title: "Error",
      message: "Icon file size cannot exceed 2MB",
      type: "error",
    });
    return false;
  }

  formData.siteIcon = file.raw;
  createPreview(file.raw, "icon");
  const iconFormData = new FormData();
  iconFormData.append("site_icon", file.raw);

  await store.dispatch("upload", {
    url: "settings/upload_site_icon/",
    data: iconFormData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const handleLogoChange = async (file) => {
  // Validate file
  if (file.raw.size > 5 * 1024 * 1024) {
    // 5MB max
    ElNotification({
      title: "Error",
      message: "Logo file size cannot exceed 5MB",
      type: "error",
    });
    return false;
  }
  const logoFormData = new FormData();
  logoFormData.append("site_logo", file.raw);

  await store.dispatch("upload", {
    url: "settings/upload_site_logo/",
    data: logoFormData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  formData.siteLogo = file.raw;
  createPreview(file.raw, "logo");
};

const handleIconRemove = () => {
  formData.siteIcon = null;
  iconPreview.value = null;
};

const handleLogoRemove = () => {
  formData.siteLogo = null;
  logoPreview.value = null;
};

const createPreview = (fileOrUrl, type) => {
  // Check if fileOrUrl is a string (URL) or a File object
  if (typeof fileOrUrl === "string") {
    // It's already a URL string
    if (type === "icon") {
      iconPreview.value = fileOrUrl;
    } else {
      logoPreview.value = fileOrUrl;
    }
  } else {
    // It's a File object, use FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === "icon") {
        iconPreview.value = e.target.result;
      } else {
        logoPreview.value = e.target.result;
      }
    };
    reader.readAsDataURL(fileOrUrl);
  }
};

// Navigation functions
const nextStep = async () => {
  // Validate current step
  let isValid = false;

  switch (currentStep.value) {
    case 0:
      isValid = await validateForm(businessInfoForm);
      break;

    case 1:
      isValid = formData.siteIcon !== null;
      if (!isValid) {
        ElNotification({
          title: "Error",
          message: "Please upload a site icon",
          type: "error",
        });
      }
      break;
    case 2:
      isValid = formData.siteLogo !== null;
      if (!isValid) {
        ElNotification({
          title: "Error",
          message: "Please upload a site logo",
          type: "error",
        });
      }
      if (isValid) {
        await submitForm();
        return;
      }
      break;
  }

  if (isValid) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const validateForm = async (formRef) => {
  if (!formRef.value) return false;

  return new Promise((resolve) => {
    formRef.value.validate((valid) => {
      resolve(valid);
    });
  });
};

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    // First, submit the basic settings
    const settingsData = {
      title: formData.title,
      description: formData.description,
      industry: formData.industry,
      is_active: true,
    };

    // Save basic settings using store action
    await store.dispatch("postData", {
      url: "settings",
      data: settingsData,
    });
    // Show success message
    ElNotification({
      title: "Success",
      message: "Business profile setup complete!",
      type: "success",
    });

    // Go to success step
    currentStep.value = 4;
  } catch (error) {
    console.error("Error submitting form:", error);

    ElNotification({
      title: "Error",
      message: "Failed to save settings. Please try again.",
      type: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const goToDashboard = () => {
  emit("complete");
  router.push({ name: "products" });
};
onMounted(() => {
  // Pre-fill form data if settingsData is provided
  if (props.settingsData) {
    Object.keys(props.settingsData).forEach((key) => {
      if (key in formData) {
        formData[key] = props.settingsData[key];
      }
    });

    // Create previews if siteIcon and siteLogo are present
    if (props.settingsData.site_icon) {
      formData.siteIcon = props.settingsData.site_icon;

      createPreview(formData.siteIcon, "icon");
    }
    if (props.settingsData.site_logo) {
      formData.siteLogo = props.settingsData.site_logo;

      createPreview(formData.siteLogo, "logo");
    }
  }
});
</script>
