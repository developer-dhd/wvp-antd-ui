<template>
  <a-result status="403" title="地图功能未开启" sub-title="对不起，地图功能暂未开启。如需开启，请联系开发人员！">
    <template #extra>
      <a-button type="primary" @click="back">
        返回
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'MapClose',
  inject: ['reloadApp'],
  methods: {
    back() {
      this.reloadApp()
    }
  }
}
</script>
