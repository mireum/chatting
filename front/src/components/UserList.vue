<template>
  <div>
    <div>
      <div>
        <img :src="user.profile_image" />
        <p>{{ user.name }}</p>
      </div>
      <div>
        <button>채팅하기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {

  },
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>