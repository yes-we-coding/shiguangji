<template>
  <div class="container about-page">
    <div class="about-card">
      <div class="avatar">拾</div>
      <h1 class="about-title">关于我</h1>
      <p class="about-intro">
        你好，我是阿拾，一名前端工程师。<br />
        喜欢写作、摄影和一切简洁美好的事物。
      </p>

      <div class="about-section">
        <h2 class="section-title">这个博客</h2>
        <p>
          「拾光集」是我的个人小站，用来记录学习笔记、技术思考与生活随想。
          名字取"拾起时光"之意——把值得记住的碎片留下来，集在一起。
          整站由 Vue 3 + Vite 手工搭建，没有评论和统计，安安静静写字。
        </p>
      </div>

      <div class="about-section">
        <h2 class="section-title">找到我</h2>
        <div class="contact-links">
          <!-- TODO: 替换为真实 GitHub 地址 -->
          <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
          <!-- TODO: 替换为真实邮箱 -->
          <a href="mailto:hi@example.com">邮箱</a>
          <!-- 暂未提供 RSS 订阅；准备好后取消注释并指向 /rss.xml -->
          <!-- <a href="/rss.xml">RSS</a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 680px;
  padding-top: 56px;
  padding-bottom: 64px;
}

.about-card {
  padding: 48px 44px;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
}

.avatar {
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  margin: 0 auto 20px;
  border-radius: 50%;
  font-size: 29px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-deep));
  box-shadow:
    0 0 0 6px var(--accent-soft),
    var(--shadow);
}

.about-title {
  margin-bottom: 12px;
  font-size: 24px;
  font-weight: 600;
}

.about-intro {
  font-size: 15px;
  color: var(--text-muted);
}

.about-section {
  margin-top: 32px;
  padding-top: 28px;
  text-align: left;
  border-top: 1px solid var(--border);
}

.section-title {
  margin-bottom: 12px;
  font-size: 17px;
  font-weight: 600;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 9px;
  border-radius: 50%;
  background: var(--accent);
}

.about-section p {
  font-size: 14.5px;
  line-height: 1.9;
  color: var(--text-muted);
}

.contact-links {
  display: flex;
  gap: 10px;
}

.contact-links a {
  padding: 6px 18px;
  font-size: 14px;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.contact-links a:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
}

@media (max-width: 640px) {
  .about-card {
    padding: 36px 24px;
  }
}
</style>
