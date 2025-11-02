<template>
    <article class="py-8">
        <div class="container mx-auto px-4 max-w-4xl">
            <header class="mb-8 text-center">
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                    {{ blog.title }}
                </h1>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600 mb-6">

                    <div class="text-sm">
                        {{ formatDate(blog.created_at) }}
                    </div>
                </div>

                <div class="flex items-center justify-center gap-2">
                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {{ blog.category.name }}
                    </span>
                </div>
            </header>

            <div class="mb-8">
                <img v-if="blog.cover_photo" :src="blog.cover_photo" :alt="blog.title"
                    class="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg" />
            </div>

            <div class="prose prose-lg max-w-none">
                <TipTapRenderer :content="blog.content" />
            </div>

            <footer class="mt-12 pt-8 border-t border-gray-200">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div class="text-sm text-gray-600">
                        Last updated: {{ formatDate(blog.updated_at) }}
                    </div>
                    <div class="flex gap-3">
                        <button class="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <!-- Share icon -->
                            <span class="sr-only">Share</span>
                            📤
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    </article>
</template>

<script setup>
defineProps({
    blog: {
        type: Object,
        required: true
    }
})

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>