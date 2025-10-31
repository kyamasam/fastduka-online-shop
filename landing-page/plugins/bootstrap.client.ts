export default defineNuxtPlugin(() => {
  if (process.client) {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }
});
