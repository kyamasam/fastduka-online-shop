<template>
  <div
       class="h-full max-w-[308px] rounded-xl bg-white lg:w-auto xl:w-[348px]">
    <div class="flex h-full flex-col rounded-xl border border-gray-500 py-6 px-5 sm:px-10 lg:border-none">
      <div class="flex flex-col text-left">
        <div class="flex flex-col gap-3">
          <span class="text-[22px]">{{subscriptionObject?.name}}</span>
          <span>
              Ideal for individuals who need quick access to basic features.
            </span>
        </div>
        <div class="my-2 flex items-center gap-3">
          <span class="text-[56px] font-semibold">${{subscriptionObject?.base_price}}</span>
          <span class="font-normal">/ Month</span>
        </div>

        <button v-if="showSelectPlan"
            class="w-full rounded border-[1px] border-[#365CCE] py-2.5 text-[#365CCE] mb-4">
          Select Plan
        </button>
        <div class=" space-y-3" v-for="item in subscriptionObject.features_objects">
          <div class="flex items-center gap-4">
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="16" fill="#E8EDFB" />
              <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M21.8162 12.207C22.0701 12.4737 22.0597 12.8957 21.793 13.1495L14.0893 20.4829C13.9577 20.6081 13.7808 20.6742 13.5993 20.666C13.4179 20.6577 13.2477 20.5758 13.128 20.4391L10.1651 17.0545C9.92254 16.7775 9.95052 16.3563 10.2276 16.1138C10.5046 15.8713 10.9258 15.8992 11.1683 16.1763L13.6734 19.0379L20.8737 12.1838C21.1404 11.9299 21.5624 11.9403 21.8162 12.207Z"
                  fill="#365CCE"
              />
            </svg>
            <span class="text-base font-medium">
               {{item?.description}}
              </span>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
export default {
  name: "subscriptionCard",
  props: {
    subscriptionObject: {
      type: Object,
      default: {//empty object}
      }
    },
    showSelectPlan: {
      type: Boolean,
      default: true
      }
    }
}
</script>



<style scoped>

</style>