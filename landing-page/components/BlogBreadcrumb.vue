<template>
    <nav class="bg-gray-50 border-b border-gray-200 py-4">
        <div class="container mx-auto px-4">
            <div class="flex items-center space-x-2 text-sm">
                <NuxtLink to="/" class="text-blue-600 hover:text-blue-700 transition-colors">
                    Home
                </NuxtLink>
                <span class="text-gray-400">›</span>
                <NuxtLink to="/blogs" class="text-blue-600 hover:text-blue-700 transition-colors">
                    Blog
                </NuxtLink>
                <span class="text-gray-400">›</span>
                <span class="text-gray-600">{{ blog.category.name }}</span>
                <span class="text-gray-400">›</span>
                <span class="text-gray-900 font-medium truncate">{{ blog.title }}</span>
            </div>
        </div>
    </nav>
</template>

<script setup>
defineProps({
    blog: {
        type: Object,
        required: true
    }
})
</script>