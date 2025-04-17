<template>
  <div class="ninjadash-nav-actions__item ninjadash-nav-actions__notification">
    <sdPopover placement="bottomLeft" action="click">
      <template v-slot:content>
        <NinjadashTopDropdown class="ninjadash-top-dropdown">
          <sdHeading as="h5" class="ninjadash-top-dropdown__title">
            <span class="title-text">Notifications</span>
            <a-badge class="badge-success" count="3" />
          </sdHeading>
          <perfect-scrollbar
            :options="{
              wheelSpeed: 1,
              swipeEasing: true,
              suppressScrollX: true,
            }"
          >
            <ul class="ninjadash-top-dropdown__nav notification-list">
              <li>
                <a to="#">
                  <div class="ninjadash-top-dropdown__content notifications">
                    <div class="notification-icon bg-primary">
                      <unicon name="hdd"></unicon>
                    </div>
                    <div class="notification-content d-flex">
                      <div class="notification-text">
                        <sdHeading as="h5">
                          <span>James</span> sent you a message
                        </sdHeading>
                        <p>5 hours ago</p>
                      </div>
                      <div class="notification-status">
                        <a-badge dot />
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a to="#">
                  <div class="ninjadash-top-dropdown__content notifications">
                    <div class="notification-icon bg-secondary">
                      <unicon name="share-alt"></unicon>
                    </div>
                    <div class="notification-content d-flex">
                      <div class="notification-text">
                        <sdHeading as="h5">
                          <span>James</span> sent you a message
                        </sdHeading>
                        <p>5 hours ago</p>
                      </div>

                      <div class="notification-status">
                        <a-badge dot />
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a to="#">
                  <div class="ninjadash-top-dropdown__content notifications">
                    <div class="notification-icon bg-secondary">
                      <unicon name="share-alt"></unicon>
                    </div>
                    <div class="notification-content d-flex">
                      <div class="notification-text">
                        <sdHeading as="h5">
                          <span>James</span> sent you a message
                        </sdHeading>
                        <p>5 hours ago</p>
                      </div>

                      <div class="notification-status">
                        <a-badge dot />
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a to="#">
                  <div class="ninjadash-top-dropdown__content notifications">
                    <div class="notification-icon bg-secondary">
                      <unicon name="share-alt"></unicon>
                    </div>
                    <div class="notification-content d-flex">
                      <div class="notification-text">
                        <sdHeading as="h5">
                          <span>James</span> sent you a message
                        </sdHeading>
                        <p>5 hours ago</p>
                      </div>

                      <div class="notification-status">
                        <a-badge dot />
                      </div>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a to="#">
                  <div class="ninjadash-top-dropdown__content notifications">
                    <div class="notification-icon bg-secondary">
                      <unicon name="share-alt"></unicon>
                    </div>
                    <div class="notification-content d-flex">
                      <div class="notification-text">
                        <sdHeading as="h5">
                          <span>James</span> sent you a message
                        </sdHeading>
                        <p>5 hours ago</p>
                      </div>

                      <div class="notification-status">
                        <a-badge dot />
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </perfect-scrollbar>
          <router-link class="btn-seeAll" to="#">
            See all incoming activity
          </router-link>
        </NinjadashTopDropdown>
      </template>
      <a-badge dot :offset="[-8, -5]">
        <a to="#" class="ninjadash-nav-action-link">
          <img src="@/static/img/icon/alarm.svg" />
        </a>
      </a-badge>
    </sdPopover>
  </div>
</template>
<script>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import { NinjadashTopDropdown } from "./auth-info-style";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Notification",
  components: {
    NinjadashTopDropdown,
    PerfectScrollbar,
  },
});
</script>
<style scoped>
.ps {
  height: 200px;
}
</style>
