<template>
  <section class="tp-blog-area pt-50 pb-75">
    <div class="container">
      <div class="row">
        <div class="col-xl-12">
          <div class="tp-section-title-wrapper-4 mb-50 text-center">
            <span class="tp-section-title-pre-4">Latest News</span>
            <h3 class="tp-section-title-4">From Our Blog</h3>
          </div>
        </div>
      </div>
      <div class="row" v-if="pending">
        <div class="col-lg-4 col-md-6" v-for="n in 3" :key="n">
          <div class="tp-blog-item mb-40">
            <div class="tp-blog-thumb">
              <div class="skeleton h-48 w-full rounded mb-4"></div>
            </div>
            <div class="tp-blog-content">
              <div class="skeleton h-4 w-3/4 mb-2"></div>
              <div class="skeleton h-6 w-full mb-2"></div>
              <div class="skeleton h-4 w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-else-if="data?.results?.length">
        <div class="col-lg-4 col-md-6" v-for="blog in data.results" :key="blog.id">
          <div class="tp-blog-item mb-40">
            <div class="tp-blog-thumb">
              <nuxt-link :to="`/blog/${blog.slug}`">
                <img
                  :src="blog.cover_photo || '/img/blog/blog-default.jpg'"
                  :alt="blog.title"
                  class="w-full h-48 object-cover rounded"
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
                  {{ blog.category?.name }}
                </span>
              </div>
              <h3 class="tp-blog-title">
                <nuxt-link :to="`/blog/${blog.slug}`">{{ blog.title }}</nuxt-link>
              </h3>
              <div class="tp-blog-author">
                <span>By {{ blog.author?.email || 'Admin' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-else-if="!pending && !data?.results?.length">
        <div class="col-12 text-center">
          <p class="text-muted">No blogs available at the moment.</p>
        </div>
      </div>
      <div class="row" v-if="data?.results?.length">
        <div class="col-12 text-center mt-20">
          <nuxt-link to="/blog" class="tp-btn tp-btn-border tp-btn-border-sm">
            View All Blogs
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
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

// Fetch latest blogs from API (limit to 3 for landing page)
const { data, pending, error } = await getDataUnauthed('/blogs/?limit=3&ordering=-created_at');

// Format date function
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
.tp-blog-area {
  background-color: #f8f9fa;
}

.tp-section-title-wrapper-4 {
  margin-bottom: 50px;
}

.tp-section-title-pre-4 {
  color: #0989ff;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  display: block;
}

.tp-section-title-4 {
  font-size: 36px;
  font-weight: 700;
  color: #020202;
  margin: 0;
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

.tp-blog-author {
  font-size: 12px;
  color: #666;
}

.tp-btn {
  display: inline-block;
  padding: 12px 30px;
  background: transparent;
  border: 2px solid #0989ff;
  color: #0989ff;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tp-btn:hover {
  background: #0989ff;
  color: #fff;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
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
  .tp-section-title-4 {
    font-size: 28px;
  }

  .tp-blog-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>