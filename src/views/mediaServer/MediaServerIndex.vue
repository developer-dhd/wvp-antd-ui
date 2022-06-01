<template>
  <div>
    <component @goEditPage="goEditPage" @goAddPage="goAddPage" @goDetailPage="goDetailPage" @goBack="goBack" :record="record" :is="currentComponent"></component>
  </div>
</template>

<script>
import MediaServerList from "./MediaServerList";
import MediaServerEdit from "./MediaServerEdit";
import MediaServerStepForm from "./stepForm/MediaServerStepForm";
import MediaServerDetail from "./MediaServerDetail";

export default {
  components: {
    MediaServerList,
    MediaServerEdit,
    MediaServerStepForm,
    MediaServerDetail
  },
  data() {
    return {
      currentComponent: 'MediaServerList',
      record: {}
    }
  },
  methods: {
    goAddPage(){
      this.record = {}
      this.currentComponent = 'MediaServerStepForm'
    },
    goEditPage(record){
      this.record = record || {}
      this.currentComponent = 'MediaServerEdit'
    },
    goDetailPage(record){
      this.record = record || {}
      this.currentComponent = 'MediaServerDetail'
    },
    goBack() {
      this.currentComponent = {}
      this.currentComponent = 'MediaServerList'
    }
  }
}

</script>

<style scoped>

</style>
