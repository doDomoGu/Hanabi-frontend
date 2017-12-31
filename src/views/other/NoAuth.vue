<template>
    <div class="not-found-404">
        没有权限
    </div>
</template>

<script>
export default {
  name: 'noauth',
  mounted: function(){
    this.$store.dispatch('common/SetTitle2','没有权限');
  },
}
</script>

