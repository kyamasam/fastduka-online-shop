<template>
  <div>
    <sdPageHeader title="Coming Soon" class="ninjadash-page-header-main">
    </sdPageHeader>
    <Main>
      <a-row :gutter="25">
        <a-col :sm="24" :xs="24">
          <ComingsoonStyleWrapper>
            <sdCards headless>
              <div class="ninjadash-logo">
                <img
                  style="
                     {
                      width: '120px';
                    }
                  "
                  :src="
                    !darkMode
                      ? require(`../../static/img/Logo_Dark.svg`)
                      : require(`../../static/img/Logo_White.svg`)
                  "
                  alt=""
                />
              </div>
              <div class="coming-soon-content">
                <h1>We are coming soon</h1>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry's standard dummy text ever since the
                  1500s,
                </p>
              </div>
              <div class="ninjadash-countdown">
                <div class="countdwon-data" v-if="!isFinished">
                  <span>
                    <span class="countdown-time">{{ days }}</span>
                    <span class="countdown-title">Days</span>
                  </span>
                  <span>
                    <div class="countdown-time">{{ hours }}</div>
                    <span class="countdown-title">Hours</span>
                  </span>
                  <span>
                    <div class="countdown-time">{{ minutes }}</div>
                    <span class="countdown-title">Minutes</span>
                  </span>
                  <span>
                    <div class="countdown-time">{{ seconds }}</div>
                    <span class="countdown-title">Seconds</span>
                  </span>
                </div>
                <div class="coming-soon-content" v-else>
                  <p>Event Has Been Successfully Completed</p>
                </div>
              </div>
              <div class="subscription-form">
                <a-form name="basic">
                  <div class="subscription-form-inner">
                    <a-form-item>
                      <a-input
                        type="email"
                        name="email"
                        value="username@email.com"
                        placeholder="input placeholder"
                      />
                    </a-form-item>
                    <sdButton type="primary" html-type="submit">
                      Subscribe
                    </sdButton>
                  </div>
                </a-form>
              </div>
              <div class="coming-soon-social">
                <ul>
                  <li>
                    <router-link to="#" class="facebook">
                      <font-awesome-icon :icon="faFacebookF" size="1x" />
                    </router-link>
                  </li>
                  <li>
                    <router-link to="#" class="twitter">
                      <font-awesome-icon :icon="faTwitter" size="1x" />
                    </router-link>
                  </li>
                  <li>
                    <router-link to="#" class="globe">
                      <font-awesome-icon icon="globe" size="1x" />
                    </router-link>
                  </li>
                  <li>
                    <router-link to="#" class="github">
                      <font-awesome-icon :icon="faGithub" size="1x" />
                    </router-link>
                  </li>
                </ul>
                <p>
                  2022 © <a href="http://www.sovware.com" style="">SovWare</a>
                </p>
              </div>
            </sdCards>
          </ComingsoonStyleWrapper>
        </a-col>
      </a-row>
    </Main>
  </div>
</template>

<script>
import { Main } from "../styled";
import { ComingsoonStyleWrapper } from "./style";
import {
  faFacebookF,
  faTwitter,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import Countdown from "countdown-js";
import { ref, defineComponent, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "ComingSoon",
  components: {
    Main,
    ComingsoonStyleWrapper,
  },
  setup() {
    const { state } = useStore();
    const darkMode = computed(() => state.themeLayout.data);
    const ten_days = 1000 * 60 * 60 * 24 * 10;
    const end = new Date(new Date().getTime() + ten_days);

    const days = ref(0);
    const hours = ref(0);
    const minutes = ref(0);
    const seconds = ref(0);
    const isFinished = ref(false);

    const timer = Countdown.timer(
      end,
      function (timeLeft) {
        days.value = timeLeft.days;
        hours.value = timeLeft.hours;
        minutes.value = timeLeft.minutes;
        seconds.value = timeLeft.seconds;
      },
      function () {
        isFinished.value = true;
      }
    );
    return {
      timer,
      days,
      hours,
      minutes,
      seconds,
      isFinished,
      faFacebookF,
      faTwitter,
      faGithub,
      darkMode,
    };
  },
});
</script>
