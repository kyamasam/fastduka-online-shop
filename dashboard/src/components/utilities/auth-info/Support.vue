<template>
  <div class="support">
    <sdPopover placement="bottomLeft" action="click">
      <template v-slot:content>
        <NestedDropdown>
          <div class="support-dropdwon">
            <ul>
              <sdHeading as="h5">Documentation</sdHeading>
              <li>
                <a to="#">How to customize admin</a>
              </li>
              <li>
                <a to="#">How to use</a>
              </li>
              <li>
                <a to="#">The relation of vertical spacing</a>
              </li>
            </ul>
            <ul>
              <sdHeading as="h5">Payments</sdHeading>
              <li>
                <a to="#">How to customize admin</a>
              </li>
              <li>
                <a to="#">How to use</a>
              </li>
            </ul>
            <ul>
              <sdHeading as="h5">Content Planner</sdHeading>
              <li>
                <a to="#">How to customize admin</a>
              </li>
              <li>
                <a to="#">How to use</a>
              </li>
            </ul>
          </div>
        </NestedDropdown>
      </template>
      <a to="#" class="ninjadash-nav-action-link">
        <unicon name="info-circle" width="20"></unicon>
      </a>
    </sdPopover>
  </div>
</template>

<script>
import { NestedDropdown } from "./auth-info-style";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Support",
  components: {
    NestedDropdown,
  },
});
</script>
