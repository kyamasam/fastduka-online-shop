<template>
    <div class="tiptap-content" v-html="renderedContent" />
</template>

<script setup>
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import { computed } from 'vue'

const props = defineProps({
    content: {
        type: [String, Object],
        default: null
    }
})

// TipTap extensions used in the editor
const extensions = [
    StarterKit,
]

const renderedContent = computed(() => {
    if (!props.content) return ''

    try {
        let parsedContent = props.content

        // If content is a string, try to parse it as JSON
        if (typeof props.content === 'string') {
            // If it's already HTML, return it as is
            if (props.content.startsWith('<')) {
                return props.content
            }

            // Try to parse as JSON
            parsedContent = JSON.parse(props.content)
        }

        // Generate HTML using TipTap's official method
        return generateHTML(parsedContent, extensions)

    } catch (error) {
        console.error('Error rendering TipTap content:', error)

        // Fallback: if it's a string, return it as is (might be plain text)
        if (typeof props.content === 'string') {
            return `<p>${props.content}</p>`
        }

        return '<p>Error rendering content</p>'
    }
})
</script>

<style scoped>
.tiptap-content :deep(p) {
    @apply mb-4 leading-relaxed text-gray-700;
}

.tiptap-content :deep(h1) {
    @apply text-3xl font-bold text-gray-900 mb-4 mt-8;
}

.tiptap-content :deep(h2) {
    @apply text-2xl font-bold text-gray-900 mb-4 mt-6;
}

.tiptap-content :deep(h3) {
    @apply text-xl font-bold text-gray-900 mb-3 mt-6;
}

.tiptap-content :deep(ul) {
    @apply list-disc list-inside mb-4 space-y-1;
}

.tiptap-content :deep(ol) {
    @apply list-decimal list-inside mb-4 space-y-1;
}

.tiptap-content :deep(blockquote) {
    @apply border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4;
}

.tiptap-content :deep(code) {
    @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono;
}

.tiptap-content :deep(pre) {
    @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4;
}

.tiptap-content :deep(a) {
    @apply text-blue-600 hover:text-blue-700 underline;
}

.tiptap-content :deep(img) {
    @apply rounded-lg shadow-md my-4 max-w-full h-auto;
}
</style>