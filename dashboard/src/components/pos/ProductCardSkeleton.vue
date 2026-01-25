<template>
    <div class="bg-white border border-gray-100 rounded-xl shadow-sm animate-pulse flex flex-col h-full">
        <!-- Image Skeleton -->
        <div class="aspect-square bg-gray-200 rounded-t-lg overflow-hidden max-h-[200px]"></div>

        <div class="flex flex-col gap-3 p-4">
            <!-- Title Skeleton -->
            <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>

            <!-- Stock Skeleton -->
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div class="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>

            <!-- Price and Button Skeleton -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                <div class="h-6 bg-gray-200 rounded w-1/4"></div>
                <div class="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Skeleton loading component for product cards
</script>