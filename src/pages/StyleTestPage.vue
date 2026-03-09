<template>
  <div class="style-test-page">
    <div class="card">
      <h1>全局样式测试</h1>
      <h2>配色方案预览</h2>

      <div class="color-preview">
        <div class="color-item" style="background-color: var(--color-primary); color: white">
          主要颜色 (Primary) - #4361ee
        </div>
        <div class="color-item" style="background-color: var(--color-secondary); color: white">
          次要颜色 (Secondary) - #3f37c9
        </div>
        <div class="color-item" style="background-color: var(--color-accent); color: black">
          强调颜色 (Accent) - #4cc9f0
        </div>
        <div class="color-item" style="background-color: var(--color-error); color: white">
          错误颜色 (Error) - #e63946
        </div>
        <div class="color-item" style="background-color: var(--color-success); color: white">
          成功颜色 (Success) - #2a9d8f
        </div>
        <div class="color-item" style="background-color: var(--color-warning); color: black">
          警告颜色 (Warning) - #f4a261
        </div>
        <div class="color-item" style="background-color: var(--color-info); color: white">
          信息颜色 (Info) - #4895ef
        </div>
      </div>

      <h2>按钮样式</h2>
      <div class="button-group">
        <button class="btn btn-primary">主要按钮</button>
        <button class="btn btn-secondary">次要按钮</button>
        <button class="btn btn-success">成功按钮</button>
        <button class="btn btn-error">错误按钮</button>
      </div>

      <h2>Vuetify 组件测试</h2>
      <v-btn color="primary" class="ma-2">Vuetify Primary</v-btn>
      <v-btn color="secondary" class="ma-2">Vuetify Secondary</v-btn>
      <v-btn color="success" class="ma-2">Vuetify Success</v-btn>
      <v-btn color="error" class="ma-2">Vuetify Error</v-btn>

      <h2>表单元素</h2>
      <div class="form-group">
        <input type="text" placeholder="输入框示例" />
        <textarea placeholder="文本区域示例"></textarea>
        <select>
          <option>选择选项1</option>
          <option>选择选项2</option>
        </select>
      </div>

      <h2>卡片和阴影</h2>
      <div class="card-example">
        <div class="card">
          <h3>卡片标题</h3>
          <p>这是一个使用全局样式的卡片组件，具有圆角和阴影效果。</p>
        </div>
      </div>

      <h2>加载状态</h2>
      <div class="loading-example">
        <span class="loading"></span>
        <span>加载中...</span>
      </div>

      <h2>链接样式</h2>
      <p>这是一个 <a href="#">链接示例</a>，悬停时会变色并显示下划线。</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.style-test-page {
  padding: 24px;
}

.color-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 24px 0;
}

.color-item {
  padding: 16px;
  border-radius: var(--border-radius-md);
  text-align: center;
  font-weight: 500;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin: 24px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 24px 0;
}

.card-example {
  margin: 24px 0;
}

.loading-example {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 24px 0;
}
</style>
