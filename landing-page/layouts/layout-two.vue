<template>
  <div class="min-h-screen flex flex-col">
    <header-two />
    <main class="flex-1">
      <slot />
    </main>
    <footer-one :style_2="true" />
    <back-to-top />
    <modal-product />
  </div>
</template>
