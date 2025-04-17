<template>
  <div class="md:w-1/3 w-full flex flex-col items-center">
    <a-button
        class="bg-blue-500"
        type="primary"
        @click="isCameraShown ? hideCam() : showCam()"
    >
      <span v-if="isCameraShown">Hide Camera</span>
      <span v-else>Show Camera</span>
    </a-button>
    <!--  -->

    <el-dialog
        v-model="isCameraShown"
        :before-close="hideCam"
        class="w-fit md:w-1/2"
        draggable
        title="Selfie"
    >
      <div
          :class="'display-block flex flex-col justify-center items-center p-0 relative  rounded-md'"
          class=" "
          style="width: width; height: height"
      >
        <canvas
            ref="canvas"
            :style="showPreview ? 'display:block' : 'display:none'"
            style="width: 300px !important; height: height !important"
        ></canvas>

        <BaseLoader v-if="props.loadingSelfie"/>

        <video
            v-if="isCameraShown"
            ref="cameraRef"
            :height="height"
            :style="isCameraShown ? 'display:block' : 'display:none'"
            :width="width"
            autoplay
            class="rounded-md"
        ></video>
        <a-button
            v-if="isCameraShown"
            class="flex gap-2 items-center bottom-4 absolute bg-blue-400 hover:bg-blue-500 text-white border-none rounded"
            size="large"
            style="right: 41%"
            type="primary"
            @click="capturePhoto"
        >
          <CameraFilled class="h-4 w-4"></CameraFilled>
          <BaseLoader v-if="props.loadingSelfie"/>
        </a-button>
      </div>
    </el-dialog>

    <!-- :class="showPreview ? 'display:block' : 'display:none'" -->
  </div>
</template>

<script setup>
import BaseLoader from "@/components/BaseLoader.vue";
import store from "@/vuex/store";
import {CameraFilled} from "@ant-design/icons-vue";
import {ElDialog} from "element-plus";
import {ref} from "vue";

const emit = defineEmits(["callImageUpload"]);
const width = ref(450);
const height = ref(337.5);
const props = defineProps({
  loadingSelfie: {
    default: false,
    type: Boolean,
  },
});
const callImageUpload = () => {
  emit("callImageUpload");
};

const canvas = ref(null);
const photoInfo = ref({});
const isLoading = ref(false);
const cameraRef = ref(null);
const isCameraShown = ref(false);
const showPreview = ref(false);

function stopCamera() {
  console.log("closing camera", cameraRef.value.srcObject);
  let tracks = cameraRef.value.srcObject.getTracks();

  tracks.forEach((track) => {
    track.enabled = false;
    console.log(track, "---");
    track.stop();
  });
}

function hideCam() {
  isCameraShown.value = false;
  stopCamera();
  return isCameraShown.value;
}

function showCam() {
  isCameraShown.value = true;
  showPreview.value = false;
  const constraints = (window.constraints = {
    audio: false,
    video: true,
  });
  navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        isLoading.value = false;
        cameraRef.value.srcObject = stream;
        // mediaStream.value = stream;
      })
      .catch((error) => {
        isLoading.Value = false;
        alert("May the browser didn't support or there is some errors.");
      });
}

function formatImage(imageDataURL, file) {
  photoInfo.value = {
    uid: "vc-upload-1710836776214-8",
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.name,
    size: file.size,
    type: file.type,
    percent: 0,
    originFileObj: file, // Assign the actual file object to originFileObj
    error: null,
    response: null,
    status: "success",
    imageDataURL: imageDataURL,
  };
}

const capturePhoto = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    cameraRef.value.srcObject = stream;

    cameraRef.value.onloadedmetadata = () => {
      canvas.value.width = cameraRef.value.videoWidth;
      canvas.value.height = cameraRef.value.videoHeight;
      canvas.value
          .getContext("2d")
          .drawImage(
              cameraRef.value,
              0,
              0,
              canvas.value.width,
              canvas.value.height
          );
      const imageDataURL = canvas.value.toDataURL("image/png");

      // Create a Blob object from the data URL
      const blob = dataURItoBlob(imageDataURL);

      // Create a File object from the Blob
      const file = new File([blob], "captured_photo.png", {
        type: "image/png",
        lastModified: Date.now(),
      });
      isCameraShown.value = false;
      showPreview.value = true;

      formatImage(imageDataURL, file);

      store.commit("setImageList", [photoInfo.value]);
      callImageUpload();

      // Stop the video stream
      console.log("fik");
      stream.getTracks().forEach((track) => track.stop());
    };
  } catch (error) {
    console.error("Error starting camera:", error);
  }
};

// Function to convert data URI to Blob
const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const byteArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], {type: mimeString});
};
</script>
