<template>
  <div>
    <!-- Loading State -->
    <div v-if="pending" class="flex flex-col items-center justify-center min-h-64 py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading blogs...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-64 py-12 text-center">
      <div class="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Unable to load blogs</h2>
      <p class="text-gray-600 mb-4">{{ error.message }}</p>
      <button 
        @click="refreshData" 
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="data">
      <!-- Breadcrumb -->
      <BlogBreadcrumb 
        v-if="currentBlog" 
        :blog="currentBlog" 
      />

      <!-- Blog Details Area -->
      <BlogDetailsArea 
        v-if="currentBlog" 
        :blog="currentBlog" 
      />

      <!-- Blog List -->
      <div v-if="!currentBlog" class="min-h-screen">
        <!-- Hero Section -->
        <section class="relative bg-white py-28 border-b border-gray-100">
          <!-- Geometric background -->
          <div class="absolute inset-0 overflow-hidden">
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-gray-50 rotate-45"></div>
            <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-gray-50 rotate-45"></div>
          </div>

          <div class="container mx-auto px-4 text-center relative z-10">
            <div class="flex justify-center mb-8">
              <div class="flex items-center gap-4 text-gray-400">
                <div class="w-12 h-px bg-gray-300"></div>
                <span class="text-sm font-semibold tracking-widest uppercase">Design Blog</span>
                <div class="w-12 h-px bg-gray-300"></div>
              </div>
            </div>

            <h1 class="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 mb-6 tracking-tight">
              Spaces <span class="text-gray-400">&</span> Stories
            </h1>

            <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
              Exploring the intersection of design, architecture, and the art of creating meaningful
              spaces
            </p>
          </div>
        </section>

        <!-- Blog Grid Section -->
        <section class="py-12">
          <div class="container mx-auto px-4">
            <!-- Filters -->
            <div class="flex flex-col lg:flex-row gap-6 mb-8 items-start lg:items-end justify-between">
              <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div class="flex flex-col gap-2">
                  <label for="category-filter" class="text-sm font-medium text-gray-700">
                    Filter by Category
                  </label>
                  <select 
                    id="category-filter"
                    v-model="selectedCategory" 
                    @change="filterBlogs"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 min-w-[200px]"
                  >
                    <option value="">All Categories</option>
                    <option 
                      v-for="category in categories" 
                      :key="category.id" 
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                
                <div class="flex flex-col gap-2 relative">
                  <label class="text-sm font-medium text-gray-700">
                    Search Blogs
                  </label>
                  <div class="relative">
                    <input 
                      type="text" 
                      v-model="searchQuery" 
                      placeholder="Search blogs..." 
                      class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full h-12 min-w-[300px]"
                      @input="onSearchInput"
                    />
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-400">🔍</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Results Count -->
              <div class="text-sm text-gray-600">
                Showing {{ data.results.length }} of {{ data.count }} blogs
              </div>
            </div>

            <!-- Blog Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <article 
                v-for="blog in data.results" 
                :key="blog.id" 
                class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-100"
                @click="navigateToBlog(blog)"
              >
                <div class="relative overflow-hidden">
                  <img 
                    :src="blog.cover_photo || '/images/blog-placeholder.jpg'" 
                    :alt="blog.title"
                    loading="lazy"
                    class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div class="absolute top-3 left-3">
                    <span class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {{ blog.category.name }}
                    </span>
                  </div>
                </div>
                
                <div class="p-6">
                  <h3 class="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {{ blog.title }}
                  </h3>
                  
                  <div 
                    class="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
                    v-html="getExcerpt(blog.content)"
                  />
                  
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <img 
                        :src="blog.author.avatar || '/images/avatar-placeholder.png'" 
                        :alt="blog.author.first_name"
                        class="w-8 h-8 rounded-full object-cover"
                      />
                      <span class="text-sm font-medium text-gray-700">
                        {{ blog.author.first_name }} {{ blog.author.last_name }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatDate(blog.created_at) }}
                    </div>
                  </div>
                  
                  <button class="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    Read More
                  </button>
                </div>
              </article>
            </div>

            <!-- Pagination -->
            <div v-if="data.count > pagination.pageSize" class="flex items-center justify-center gap-4">
              <button 
                :disabled="!data.previous || pending" 
                @click="loadPage(data.previous)"
                class="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <span>←</span>
                Previous
              </button>
              
              <div class="flex items-center gap-2">
                <span class="text-gray-600 text-sm">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>
                <span class="text-gray-400">•</span>
                <span class="text-gray-500 text-sm">
                  {{ data.count }} total blogs
                </span>
              </div>
              
              <button 
                :disabled="!data.next || pending" 
                @click="loadPage(data.next)"
                class="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                Next
                <span>→</span>
              </button>
            </div>

            <!-- Empty State -->
            <div v-if="data.results.length === 0" class="text-center py-12">
              <div class="text-6xl mb-4">📝</div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">No blogs found</h3>
              <p class="text-gray-600">Try adjusting your search or filters</p>
              <button 
                @click="clearFilters"
                class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDebounceFn } from '@vueuse/core'

// Composables
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

// State
const selectedCategory = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pagination = ref({
  pageSize: 9
})

// Fetch blogs data using your getData format
const {
    data,
    error,
    pending,
    execute
} = await getDataUnauthed(
    "/blogs",
    {
        method: "GET",
        params: {
            page: currentPage.value,
            page_size: pagination.value.pageSize,
            category: selectedCategory.value || undefined,
            search: searchQuery.value || undefined
        }
    }
);

// Create debounced search function
const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1
  refreshData()
}, 500)

// Methods
const onSearchInput = () => {
  debouncedSearch()
}

const refreshData = () => {
  currentPage.value = 1
  return execute()
}

const navigateToBlog = (blog) => {
  router.push(`/blogs/${blog.slug}/${blog.id}`)
}

const clearFilters = () => {
  selectedCategory.value = ''
  searchQuery.value = ''
  refreshData()
}

// Computed properties
const currentBlog = computed(() => {
  if (route.params.id && data.value?.results) {
    return data.value.results.find(blog => blog.id == route.params.id)
  }
  return null
})

const categories = computed(() => {
  if (data.value?.results) {
    const uniqueCategories = new Map()
    data.value.results.forEach(blog => {
      if (blog.category && !uniqueCategories.has(blog.category.id)) {
        uniqueCategories.set(blog.category.id, blog.category)
      }
    })
    return Array.from(uniqueCategories.values())
  }
  return []
})

const totalPages = computed(() => {
  if (data.value?.count) {
    return Math.ceil(data.value.count / pagination.value.pageSize)
  }
  return 1
})

// Helper methods
const getExcerpt = (content) => {
  if (!content) return ''

  let textContent = ''
  if (typeof content === 'object') {
    textContent = extractTextFromTiptap(content)
  } else if (typeof content === 'string') {
    textContent = content.replace(/<[^>]*>/g, '')
  }

  return textContent.length > 150
    ? textContent.substring(0, 150) + '...'
    : textContent
}

const extractTextFromTiptap = (tiptapContent) => {
  if (!tiptapContent?.content) return ''

  let text = ''
  const extractText = (node) => {
    if (node.text) {
      text += node.text
    }
    if (node.content) {
      node.content.forEach(extractText)
    }
  }

  tiptapContent.content.forEach(extractText)
  return text
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const filterBlogs = () => {
  currentPage.value = 1
  refreshData()
}

const loadPage = (url) => {
  if (!url) return

  const urlObj = new URL(url)
  const page = urlObj.searchParams.get('page')
  currentPage.value = parseInt(page) || 1
  refreshData()
}

// SEO setup function (simplified without useSchemaOrg)
const setupSEO = () => {
  const baseUrl = config.public.siteUrl || "https://fastduka.netlify.app"
  const currentPath = route.params.id
    ? `/blogs/${route.params.slug}/${route.params.id}`
    : '/blogs'
  const currentUrl = `${baseUrl}${currentPath}`

  if (currentBlog.value) {
    // Single blog post SEO
    const blog = currentBlog.value

    useSeoMeta({
      title: `${blog.title} | Fastduka Blog`,
      description: getExcerpt(blog.content),
      ogTitle: blog.title,
      ogDescription: getExcerpt(blog.content),
      ogImage: blog.cover_photo,
      ogUrl: currentUrl,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterTitle: blog.title,
      twitterDescription: getExcerpt(blog.content),
      twitterImage: blog.cover_photo
    })

    // Add manual schema.org structured data
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.title,
            description: getExcerpt(blog.content),
            image: blog.cover_photo ? [blog.cover_photo] : [],
            datePublished: blog.created_at,
            dateModified: blog.updated_at,
            author: {
              "@type": "Person",
              name: `${blog.author.first_name} ${blog.author.last_name}`,
              email: blog.author.email
            },
            publisher: {
              "@type": "Organization",
              name: "Fastduka",
              logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/logo.png`
              }
            }
          })
        }
      ]
    })
  } else {
    // Blog listing SEO
    useSeoMeta({
      title: "Blog | Fastduka - Latest News & Insights",
      description: "Stay updated with the latest news, insights, and updates from Fastduka. Read our blog for industry trends and company updates.",
      ogTitle: "Blog | Fastduka - Latest News & Insights",
      ogDescription: "Stay updated with the latest news, insights, and updates from Fastduka.",
      ogUrl: currentUrl,
      ogType: 'website'
    })
  }
}

// Watch for data changes to update SEO
watch([data, currentBlog], () => {
  setupSEO()
}, { immediate: true })

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await refreshData()
  }
})
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>