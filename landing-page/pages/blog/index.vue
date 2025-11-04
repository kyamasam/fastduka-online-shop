<template>
  <div>
    <nuxt-layout name="layout-two">
      <!-- breadcrumb area start -->
      <breadcrumb-three sub-title="Blog" title="Latest News & Articles" />
      <!-- breadcrumb area end -->

      <!-- blog area start -->
      <section class="tp-blog-area pt-120 pb-120">
        <div class="container">
          <div class="row">
            <div class="col-xl-9 col-lg-8">
              <!-- Loading state -->
              <div v-if="pending" class="row">
                <div class="col-xl-6 col-lg-6 col-md-6" v-for="n in 6" :key="n">
                  <div class="tp-blog-item mb-50">
                    <div class="tp-blog-thumb">
                      <div class="skeleton h-64 w-full rounded mb-4"></div>
                    </div>
                    <div class="tp-blog-content">
                      <div class="skeleton h-4 w-3/4 mb-2"></div>
                      <div class="skeleton h-6 w-full mb-2"></div>
                      <div class="skeleton h-4 w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error state -->
              <div v-else-if="error" class="text-center py-5">
                <h3>Error loading blogs</h3>
                <p class="text-muted">{{ error.message || 'Something went wrong' }}</p>
                <button @click="refresh()" class="tp-btn tp-btn-2">Try Again</button>
              </div>

              <!-- Empty state -->
              <div v-else-if="!data?.results?.length" class="text-center py-5">
                <h3>No Blogs Found</h3>
                <p class="text-muted">Check back later for new articles.</p>
              </div>

              <!-- Blog posts -->
              <div v-else class="row">
                <div class="col-xl-6 col-lg-6 col-md-6" v-for="blog in data.results" :key="blog.id">
                  <div class="tp-blog-item mb-50">
                    <div class="tp-blog-thumb">
                      <nuxt-link :to="`/blog/${blog.slug}`">
                        <img
                          :src="blog.cover_photo || '/img/blog/blog-default.jpg'"
                          :alt="blog.title"
                          class="w-full h-64 object-cover"
                        />
                      </nuxt-link>
                    </div>
                    <div class="tp-blog-content">
                      <div class="tp-blog-meta">
                        <span class="tp-blog-date">
                          <i class="fa-light fa-calendar-days"></i>
                          {{ formatDate(blog.created_at) }}
                        </span>
                        <span class="tp-blog-category">
                          <i class="fa-light fa-tag"></i>
                          {{ blog.category?.name || 'Uncategorized' }}
                        </span>
                      </div>
                      <h3 class="tp-blog-title">
                        <nuxt-link :to="`/blog/${blog.slug}`">{{ blog.title }}</nuxt-link>
                      </h3>
                      <div class="tp-blog-author-2">
                        <span>By {{ blog.author?.email?.split('@')[0] || 'Admin' }}</span>
                      </div>
                      <div class="tp-blog-btn">
                        <nuxt-link :to="`/blog/${blog.slug}`" class="tp-btn tp-btn-border tp-btn-border-sm">
                          Read More
                        </nuxt-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="data?.results?.length" class="row">
                <div class="col-12">
                  <div class="tp-pagination">
                    <nav>
                      <ul>
                        <li v-if="data?.previous">
                          <nuxt-link :to="`/blog?page=${currentPage - 1}`" class="tp-pagination-prev">
                            <svg width="15" height="13" viewBox="0 0 15 13" fill="none">
                              <path d="M1.00017 6.77879L14 6.77879" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M6.24316 11.7803L0.999899 6.77829L6.24316 1.77631" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Prev
                          </nuxt-link>
                        </li>

                        <li v-for="pageNum in visiblePages" :key="pageNum">
                          <nuxt-link
                            v-if="pageNum !== '...'"
                            :to="`/blog?page=${pageNum}`"
                            :class="{ 'current': pageNum === currentPage }"
                          >
                            {{ pageNum }}
                          </nuxt-link>
                          <span v-else class="tp-pagination-dots">...</span>
                        </li>

                        <li v-if="data?.next">
                          <nuxt-link :to="`/blog?page=${currentPage + 1}`" class="tp-pagination-next">
                            Next
                            <svg width="15" height="13" viewBox="0 0 15 13" fill="none">
                              <path d="M13.9998 6.77879L1 6.77879" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="M8.75684 1.77631L14.0001 6.77829L8.75684 11.7803" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </nuxt-link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="col-xl-3 col-lg-4">
              <div class="tp-sidebar-wrapper">
                <!-- Categories -->
                <div class="tp-sidebar-widget mb-50">
                  <h3 class="tp-sidebar-widget-title">Categories</h3>
                  <div class="tp-sidebar-widget-content">
                    <div v-if="categoriesPending" class="tp-sidebar-list">
                      <div v-for="n in 5" :key="n" class="skeleton h-4 w-full mb-2"></div>
                    </div>
                    <div v-else-if="categoriesData?.results?.length" class="tp-sidebar-list">
                      <ul>
                        <li v-for="category in categoriesData.results" :key="category.id">
                          <nuxt-link :to="`/blog?category=${category.id}`">
                            {{ category.name }}
                          </nuxt-link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <!-- Recent Posts -->
                <div class="tp-sidebar-widget mb-50">
                  <h3 class="tp-sidebar-widget-title">Recent Posts</h3>
                  <div class="tp-sidebar-widget-content">
                    <div v-if="recentPending" class="tp-sidebar-rc-post">
                      <div v-for="n in 3" :key="n" class="tp-sidebar-rc-item d-flex mb-20">
                        <div class="skeleton h-16 w-16 rounded mr-3"></div>
                        <div class="flex-1">
                          <div class="skeleton h-3 w-full mb-1"></div>
                          <div class="skeleton h-3 w-2/3"></div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="recentData?.results?.length" class="tp-sidebar-rc-post">
                      <div v-for="post in recentData.results" :key="post.id" class="tp-sidebar-rc-item d-flex mb-20">
                        <div class="tp-sidebar-rc-thumb">
                          <nuxt-link :to="`/blog/${post.slug}`">
                            <img
                              :src="post.cover_photo || '/img/blog/blog-default.jpg'"
                              :alt="post.title"
                              class="w-16 h-16 object-cover rounded"
                            />
                          </nuxt-link>
                        </div>
                        <div class="tp-sidebar-rc-content">
                          <h3 class="tp-sidebar-rc-title">
                            <nuxt-link :to="`/blog/${post.slug}`">{{ post.title }}</nuxt-link>
                          </h3>
                          <div class="tp-sidebar-rc-meta">
                            <span>{{ formatDate(post.created_at) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- blog area end -->
    </nuxt-layout>
  </div>
</template>

<script setup lang="ts">
interface BlogAuthor {
  email: string;
}

interface BlogCategory {
  id: number;
  name: string;
}

interface Blog {
  id: number;
  title: string;
  slug: string;
  cover_photo: string | null;
  created_at: string;
  author: BlogAuthor;
  category: BlogCategory;
}

interface BlogResponse {
  results: Blog[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Page metadata
definePageMeta({
  layout: false,
});

// SEO
useDynamicSeo({
  title: "Blog",
  description: "Read our latest articles and news",
  keywords: "blog, articles, news, updates",
});

// Get query parameters
const route = useRoute();
const currentPage = computed(() => parseInt(route.query.page as string) || 1);
const categoryFilter = computed(() => route.query.category as string);

// Build API query parameters
const queryParams = computed(() => {
  const params = new URLSearchParams();
  params.append('page', currentPage.value.toString());
  params.append('ordering', '-created_at');
  if (categoryFilter.value) {
    params.append('category', categoryFilter.value);
  }
  return params.toString();
});

// Fetch blogs with proper error handling
const { data, pending, error, refresh } = await getDataUnauthed(`/blogs/?${queryParams.value}`);

// Fetch categories for sidebar
const { data: categoriesData, pending: categoriesPending } = await getDataUnauthed('/blog-categories/');

// Fetch recent posts for sidebar
const { data: recentData, pending: recentPending } = await getDataUnauthed('/blogs/?limit=5&ordering=-created_at');

// Format date function
const formatDate = (dateString: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (err) {
    return 'Invalid Date';
  }
};

// Calculate visible pages for pagination
const visiblePages = computed(() => {
  if (!data.value?.count) return [];

  const totalPages = Math.ceil(data.value.count / 10); // Assuming 10 items per page
  const current = currentPage.value;
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show smart pagination
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (current >= totalPages - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
  }

  return pages;
});

// Watch for route changes and refetch data
watch(() => route.query, async () => {
  await refresh();
}, { deep: true });
</script>

<style scoped>
.tp-blog-area {
  background-color: #f8f9fa;
}

.tp-blog-item {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.tp-blog-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);
}

.tp-blog-thumb {
  position: relative;
  overflow: hidden;
}

.tp-blog-thumb img {
  transition: transform 0.3s ease;
}

.tp-blog-item:hover .tp-blog-thumb img {
  transform: scale(1.05);
}

.tp-blog-content {
  padding: 25px;
}

.tp-blog-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.tp-blog-meta span {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

.tp-blog-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  line-height: 1.3;
}

.tp-blog-title a {
  color: #020202;
  text-decoration: none;
  transition: color 0.3s ease;
}

.tp-blog-title a:hover {
  color: #0989ff;
}

.tp-blog-author-2 {
  font-size: 12px;
  color: #666;
  margin-bottom: 20px;
}

.tp-blog-btn .tp-btn {
  padding: 8px 20px;
  font-size: 14px;
}

.tp-sidebar-wrapper {
  position: sticky;
  top: 20px;
}

.tp-sidebar-widget {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.tp-sidebar-widget-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 25px;
  color: #020202;
}

.tp-sidebar-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tp-sidebar-list li {
  margin-bottom: 10px;
}

.tp-sidebar-list a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.tp-sidebar-list a:hover {
  color: #0989ff;
}

.tp-sidebar-rc-item {
  align-items: flex-start;
  gap: 15px;
}

.tp-sidebar-rc-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  line-height: 1.3;
}

.tp-sidebar-rc-title a {
  color: #020202;
  text-decoration: none;
  transition: color 0.3s ease;
}

.tp-sidebar-rc-title a:hover {
  color: #0989ff;
}

.tp-sidebar-rc-meta {
  font-size: 12px;
  color: #666;
}

.tp-pagination {
  margin-top: 50px;
}

.tp-pagination ul {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tp-pagination a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #fff;
  color: #666;
  text-decoration: none;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.tp-pagination a:hover,
.tp-pagination a.current {
  background: #0989ff;
  color: #fff;
  border-color: #0989ff;
}

.tp-pagination-prev,
.tp-pagination-next {
  padding: 0 15px !important;
  width: auto !important;
  gap: 8px;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 768px) {
  .tp-blog-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .tp-sidebar-wrapper {
    margin-top: 50px;
    position: static;
  }
}
</style>