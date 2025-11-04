<template>
  <div>
    <nuxt-layout name="layout-two">
      <!-- breadcrumb area start -->
      <breadcrumb-3
        v-if="blogData"
        title="Blog Details"
        :subtitle="blogData.title"
      />
      <!-- breadcrumb area end -->

      <!-- blog details area start -->
      <section class="tp-postbox-details-area pt-120 pb-120">
        <div class="container">
          <div class="row">
            <div class="col-xl-9 col-lg-8">
              <!-- Loading state -->
              <div v-if="pending" class="tp-postbox-details-wrapper">
                <div class="skeleton h-96 w-full rounded mb-6"></div>
                <div class="skeleton h-8 w-3/4 mb-4"></div>
                <div class="skeleton h-4 w-1/2 mb-6"></div>
                <div class="skeleton h-4 w-full mb-2"></div>
                <div class="skeleton h-4 w-full mb-2"></div>
                <div class="skeleton h-4 w-3/4 mb-2"></div>
              </div>

              <!-- Error state -->
              <div v-else-if="error" class="text-center py-5">
                <h3>Blog Post Not Found</h3>
                <p class="text-muted">{{ error.message || 'The blog post you are looking for does not exist.' }}</p>
                <nuxt-link to="/blog" class="tp-btn tp-btn-2">Back to Blog</nuxt-link>
              </div>

              <!-- Blog content -->
              <div v-else-if="blogData" class="tp-postbox-details-wrapper">
                <article class="tp-postbox-details-item">
                  <!-- Blog header -->
                  <div class="tp-postbox-details-thumb" v-if="blogData.cover_photo">
                    <img
                      :src="blogData.cover_photo"
                      :alt="blogData.title"
                      class="w-full h-96 object-cover rounded-lg"
                    />
                  </div>

                  <div class="tp-postbox-details-content">
                    <!-- Meta information -->
                    <div class="tp-postbox-details-meta mb-25">
                      <span class="tp-postbox-details-date">
                        <i class="fa-light fa-calendar-days"></i>
                        {{ formatDate(blogData.created_at) }}
                      </span>
                      <span class="tp-postbox-details-category">
                        <i class="fa-light fa-tag"></i>
                        {{ blogData.category?.name || 'Uncategorized' }}
                      </span>
                      <span class="tp-postbox-details-author">
                        <i class="fa-light fa-user"></i>
                        By {{ blogData.author?.email?.split('@')[0] || 'Admin' }}
                      </span>
                    </div>

                    <!-- Title -->
                    <h3 class="tp-postbox-details-title">{{ blogData.title }}</h3>

                    <!-- Content -->
                    <div class="tp-postbox-details-text">
                      <TipTapRenderer :content="blogData.content" />
                    </div>

                    <!-- Social sharing -->
                    <div class="tp-postbox-details-share">
                      <h4 class="tp-postbox-details-share-title">Share this post:</h4>
                      <div class="tp-postbox-details-share-list">
                        <a
                          :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="facebook"
                        >
                          <i class="fab fa-facebook-f"></i>
                        </a>
                        <a
                          :href="`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(blogData.title)}`"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="twitter"
                        >
                          <i class="fab fa-twitter"></i>
                        </a>
                        <a
                          :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="linkedin"
                        >
                          <i class="fab fa-linkedin-in"></i>
                        </a>
                        <a
                          :href="`https://wa.me/?text=${encodeURIComponent(blogData.title + ' ' + currentUrl)}`"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="whatsapp"
                        >
                          <i class="fab fa-whatsapp"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>

                <!-- Navigation -->
                <div class="tp-postbox-details-navigation">
                  <div class="row">
                    <div class="col-md-6">
                      <div v-if="prevPost" class="tp-postbox-details-navigation-item prev">
                        <nuxt-link :to="`/blog/${prevPost.slug}`">
                          <span class="tp-postbox-details-navigation-direction">Previous</span>
                          <h4 class="tp-postbox-details-navigation-title">{{ prevPost.title }}</h4>
                        </nuxt-link>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div v-if="nextPost" class="tp-postbox-details-navigation-item next text-end">
                        <nuxt-link :to="`/blog/${nextPost.slug}`">
                          <span class="tp-postbox-details-navigation-direction">Next</span>
                          <h4 class="tp-postbox-details-navigation-title">{{ nextPost.title }}</h4>
                        </nuxt-link>
                      </div>
                    </div>
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
                      <div v-for="post in recentData.results.filter(p => p.slug !== route.params.slug)" :key="post.id" class="tp-sidebar-rc-item d-flex mb-20">
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

                <!-- Back to Blog -->
                <div class="tp-sidebar-widget">
                  <div class="tp-sidebar-widget-content text-center">
                    <nuxt-link to="/blog" class="tp-btn tp-btn-border tp-btn-border-sm w-100">
                      <i class="fa-light fa-arrow-left me-2"></i>
                      Back to Blog
                    </nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- blog details area end -->
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
  content: any;
  created_at: string;
  author: BlogAuthor;
  category: BlogCategory;
}

// Page metadata
definePageMeta({
  layout: false,
});

// Get route parameters
const route = useRoute();
const slug = route.params.slug as string;

// Fetch blog post by slug
const { data, pending, error } = await getDataUnauthed(`/blogs/?search=${slug}`);

// Get the actual blog post from search results
const blogPost = computed(() => {
  if (data.value?.results?.length) {
    return data.value.results.find((blog: Blog) => blog.slug === slug) || data.value.results[0];
  }
  return null;
});

// Fetch categories for sidebar
const { data: categoriesData, pending: categoriesPending } = await getDataUnauthed('/blog-categories/');

// Fetch recent posts for sidebar
const { data: recentData, pending: recentPending } = await getDataUnauthed('/blogs/?limit=6&ordering=-created_at');

// Get current URL for sharing
const currentUrl = computed(() => {
  if (process.client) {
    return window.location.href;
  }
  return '';
});

// Get previous and next posts
const prevPost = computed(() => {
  if (!recentData.value?.results || !blogPost.value) return null;
  const currentIndex = recentData.value.results.findIndex((p: Blog) => p.id === blogPost.value.id);
  return currentIndex > 0 ? recentData.value.results[currentIndex - 1] : null;
});

const nextPost = computed(() => {
  if (!recentData.value?.results || !blogPost.value) return null;
  const currentIndex = recentData.value.results.findIndex((p: Blog) => p.id === blogPost.value.id);
  return currentIndex < recentData.value.results.length - 1 ? recentData.value.results[currentIndex + 1] : null;
});

// Use the blog post data
const blogData = computed(() => blogPost.value);

// SEO
useDynamicSeo({
  title: computed(() => blogData.value?.title || 'Blog Post'),
  description: computed(() => blogData.value?.title || 'Read our latest blog post'),
  keywords: computed(() => `${blogData.value?.category?.name || 'blog'}, ${blogData.value?.title || 'article'}`),
});

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

// Handle 404 if blog not found
if (process.client && !pending.value && !blogData.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Blog post not found'
  });
}
</script>

<style scoped>
.tp-postbox-details-area {
  background-color: #f8f9fa;
}

.tp-postbox-details-wrapper {
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.tp-postbox-details-thumb {
  margin-bottom: 30px;
}

.tp-postbox-details-meta {
  display: flex;
  align-items: center;
  gap: 25px;
  flex-wrap: wrap;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 15px;
}

.tp-postbox-details-meta span {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tp-postbox-details-title {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  margin: 25px 0;
  color: #020202;
}

.tp-postbox-details-text {
  font-size: 16px;
  line-height: 1.7;
  color: #555;
  margin-bottom: 40px;
}

.tp-postbox-details-share {
  border-top: 1px solid #e0e0e0;
  padding-top: 30px;
}

.tp-postbox-details-share-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #020202;
}

.tp-postbox-details-share-list {
  display: flex;
  gap: 15px;
}

.tp-postbox-details-share-list a {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;
}

.tp-postbox-details-share-list a.facebook {
  background: #3b5998;
}

.tp-postbox-details-share-list a.twitter {
  background: #1da1f2;
}

.tp-postbox-details-share-list a.linkedin {
  background: #0077b5;
}

.tp-postbox-details-share-list a.whatsapp {
  background: #25d366;
}

.tp-postbox-details-share-list a:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.tp-postbox-details-navigation {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px solid #e0e0e0;
}

.tp-postbox-details-navigation-item {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tp-postbox-details-navigation-item:hover {
  background: #e9ecef;
}

.tp-postbox-details-navigation-item a {
  text-decoration: none;
  color: inherit;
}

.tp-postbox-details-navigation-direction {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tp-postbox-details-navigation-title {
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0 0 0;
  color: #020202;
  line-height: 1.3;
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
  .tp-postbox-details-wrapper {
    padding: 20px;
  }

  .tp-postbox-details-title {
    font-size: 24px;
  }

  .tp-postbox-details-meta {
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