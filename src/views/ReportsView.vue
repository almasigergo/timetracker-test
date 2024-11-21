<script setup>

    import { provide } from 'vue'
    import Charts from '@/components/Charts.vue'
    import Filters from '@/components/Filters.vue'
    import ModalForm from '@/components/ModalForm.vue'
    import Logs from '@/components/Logs.vue'

    // Import the shared store
    import useSharedStore from '@/include/useSharedStore'

    // Provide the shared state and actions to child components
    const sharedStore = useSharedStore()
    provide('useSharedStore', sharedStore)

</script>
<template>
    <ModalForm />
    <Filters />
    <Logs />
    <Charts />
</template>