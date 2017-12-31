<template>
    <div class="not-found-404">
        404
    </div>
</template>

<script>
export default {
  name: 'notfound',
  mounted: function(){
    this.$store.dispatch('common/SetTitle2','404');
  },
}
</script>
