<script>
export default {
  name: "photographerIcon"
}
</script>

<template>
  <svg width="6" height="6" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="100%" height="100%" fill="#ffffff" />

    <!-- Body -->
    <rect x="70" y="100" width="60" height="80" fill="#333333" />

    <!-- Head -->
    <circle cx="100" cy="80" r="20" fill="#cccccc" />

    <!-- Arms -->
    <line x1="70" y1="120" x2="30" y2="160" stroke="#333333" stroke-width="5" />
    <line x1="130" y1="120" x2="170" y2="160" stroke="#333333" stroke-width="5" />

    <!-- Camera -->
    <rect x="110" y="110" width="40" height="30" fill="#999999" />
    <rect x="115" y="115" width="30" height="20" fill="#cccccc" />
    <circle cx="125" cy="120" r="2" fill="#333333" />

    <!-- Lens -->
    <circle cx="125" cy="120" r="8" fill="#666666" />
    <circle cx="125" cy="120" r="5" fill="#cccccc" />

    <!-- Legs -->
    <line x1="100" y1="180" x2="70" y2="230" stroke="#333333" stroke-width="5" />
    <line x1="100" y1="180" x2="130" y2="230" stroke="#333333" stroke-width="5" />
  </svg>

</template>

<style scoped>

</style>