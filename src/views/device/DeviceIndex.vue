<template>
  <div>
    <component
      @goChannelPage="handleChannel"
      @goDevicePosition="handlePosition"
      @goGBRecords="handleGBRecords"
      @goBack="handleGoBack"
      :record="record"
      :is="currentComponent"></component>
  </div>
</template>

<script>
// 动态切换组件
import DeviceList from './DeviceList'
import DeviceChannelList from './DeviceChannelList'
import DevicePosition from './DevicePosition'
import GBRecords from './GBRecords'

export default {
  name: 'DeviceListWrapper',
  components: {
    DeviceList,
    DeviceChannelList,
    DevicePosition,
    GBRecords
  },
  data() {
    return {
      currentComponent: 'DeviceList',
      record: ''
    }
  },
  created() {

  },
  methods: {
    handleChannel(record) {
      this.record = record || ''
      this.currentComponent = 'DeviceChannelList'
    },
    handlePosition(record) {
      this.record = record || ''
      this.currentComponent = 'DevicePosition'
    },
    handleGBRecords(record) {
      this.record = record || ''
      this.currentComponent = 'GBRecords'
    },
    handleGoBack() {
      this.record = ''
      this.currentComponent = 'DeviceList'
    }
  },
  watch: {
    '$route.path'() {
      this.record = ''
      this.currentComponent = 'DeviceList'
    }
  }
}
</script>
