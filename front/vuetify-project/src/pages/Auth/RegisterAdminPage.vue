<template>
  <AuthGuard>
    <RegisterAdmin />
  </AuthGuard>
</template>

<script>
import RegisterAdmin from '@/components/Auth/RegisterAdmin.vue'
import AuthGuard from '@/components/Auth/AuthGuard.vue'

export default {
  name: 'RegisterAdminPage',
  components: {
    RegisterAdmin,
    AuthGuard
  }
}
</script>
