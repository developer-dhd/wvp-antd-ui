<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <div class="header">
        <span class="title">WVP GB28181 视频平台</span>
      </div>
      <div class="desc">
        Video platform based on GB28181 protocol WVP
      </div>
      <a-card class="center-card">
        <a-card-grid class="card-grid-left" :hoverable="false">
          <a-carousel autoplay>
            <img src="~@/assets/banner2.jpg" alt="bannner1">
            <img src="~@/assets/banner3.jpg" alt="bannner2">
            <img src="~@/assets/banner4.jpg" alt="bannner3">
          </a-carousel>
        </a-card-grid>
        <a-card-grid class="card-grid-right" :hoverable="false">
          <div class="login-title">
            <label class="login-font">系统登录</label>
          </div>
          <router-view/>
        </a-card-grid>
      </a-card>

      <div class="footer">
        <div class="copyright">
          Powered By <a target="_blank" href="https://decoderx.cc/">DecoderX</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {deviceMixin} from '@/store/device-mixin'
import {Carousel} from 'ant-design-vue'

export default {
  name: 'UserLayout',
  components: {
    ACarousel: Carousel
  },
  mixins: [deviceMixin],
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    background: #f0f2f1 url(~@/assets/background.svg) no-repeat 50%;
    background-size: 100%;
    //padding: 50px 0 84px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    a {
      text-decoration: none;
    }

    .ant-card-grid {
      float: left;
      width: 33.33%;
      padding: 24px;
      border: 0;
      border-radius: 0;
      box-shadow: none !important;
      transition: all 0.3s;
    }

    .header {
      height: 44px;
      line-height: 44px;

      .title {
        font-size: 42px;
        color: rgba(0, 0, 0, .85);
        font-weight: bold;
        position: relative;
        top: 2px;
        letter-spacing: 2px;
      }
    }

    .desc {
      font-size: 14px;
      margin-top: 12px;
      margin-bottom: 20px;
      padding: 15px 0;
    }

    .center-card {
      width: 960px;
      border: none;
      border-radius: 10px;
      overflow: hidden;

      .card-grid-left {
        width: 60%;
        padding: 0;
        border: none;

        img {
          height: 350px;
        }
      }

      .card-grid-right {
        width: 40%;
        padding: 20px 0 0 0;

        .login-title {
          width: 100%;
          text-align: center;
          padding-bottom: 10px;
          margin-top: 20px;

          .login-font {
            font-size: large;
            font-weight: bold;
            text-space: 2px;
            letter-spacing: 2px
          }
        }
      }
    }

    .main {
      min-width: 260px;
      width: 368px;
      margin: 0 auto;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 30px;
      text-align: center;

      .copyright {
        font-size: 14px;
      }
    }

  }
}
</style>
