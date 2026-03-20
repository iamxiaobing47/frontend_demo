# Draw.io 图表示例

本目录包含多个draw.io格式的图表文件，展示了如何创建和使用draw.io XML格式的图表，特别优化了对飞书的兼容性。

## 文件说明

### 1. `minimal-flowchart.drawio` (最推荐用于飞书)

- 极简版本，只包含最基本的必要元素
- 无任何额外属性，最大程度兼容各种平台
- 适合在飞书等对格式要求严格的平台使用

### 2. `simple-flowchart.drawio` (推荐用于飞书)

- 简化的流程图示例，专为飞书兼容性优化
- 使用标准椭圆作为开始/结束节点
- 使用正交边样式连接线，提高兼容性
- 移除了DOCTYPE声明，简化XML结构

### 3. `feishu-compatible-diagram.drawio`

- 飞书兼容版本的流程图
- 简化了mxGraphModel属性
- 移除了外部DTD引用

### 4. `example-diagram.drawio`

- 原始的简单流程图示例
- 包含三个步骤：开始 → 处理步骤 → 结束
- 展示了基本的矩形节点和连接线

### 5. `advanced-diagram.drawio`

- 系统架构图示例
- 包含用户（椭圆）、Web应用（矩形）、数据库（圆柱体）
- 展示了不同形状类型和带标签的连接线

## 如何使用

### 飞书导入（推荐）

1. 在飞书中创建新文档或打开现有文档
2. 点击"插入" → "流程图"
3. 选择"从文件导入"
4. **优先选择 `minimal-flowchart.drawio` 文件**（这是最简化的版本，兼容性最好）
5. 如果导入失败，请尝试以下步骤：
   - 确保文件扩展名为 `.drawio`
   - 按顺序尝试：`minimal-flowchart.drawio` → `simple-flowchart.drawio` → `feishu-compatible-diagram.drawio`
   - 检查飞书版本是否支持draw.io导入功能

### 在线使用

1. 访问 [https://app.diagrams.net/](https://app.diagrams.net/)
2. 选择 "Open Existing Diagram"
3. 上传 `.drawio` 文件
4. 图表将自动加载并可以编辑

### 本地使用

1. 下载并安装 [diagrams.net 桌面应用](https://github.com/jgraph/drawio-desktop)
2. 直接打开 `.drawio` 文件进行编辑

### 集成到其他工具

- **VS Code**: 安装 "Draw.io Integration" 扩展
- **Confluence**: 直接粘贴XML内容或上传文件
- **Notion**: 通过嵌入功能使用
- **飞书**: 使用上述专门的导入步骤

## Draw.io 格式特点

- 基于XML格式
- 使用 `mxGraphModel` 作为根元素
- 每个元素（节点、连接线）都有唯一的 `id`
- 支持各种形状、样式和布局
- 可以包含中文和其他Unicode字符

## 飞书兼容性注意事项

为了确保在飞书中成功导入draw.io文件，请注意：

1. **避免DOCTYPE声明**：飞书可能不支持外部DTD引用
2. **简化属性**：减少mxGraphModel中的不必要属性
3. **使用标准样式**：避免过于复杂的自定义样式
4. **正交连接线**：使用`edgeStyle=orthogonalEdgeStyle`提高兼容性
5. **文件大小**：保持文件简洁，避免过于复杂的图表

如果仍然遇到导入问题，建议：

- 先在draw.io在线工具中打开文件确认格式正确
- 尝试复制图表内容到飞书的原生流程图工具中
- 联系飞书技术支持确认当前版本的draw.io支持情况

## 自定义修改

要修改这些图表：

1. 在draw.io中打开文件
2. 进行所需的编辑
3. 保存为新的 `.drawio` 文件
4. 或者直接编辑XML（需要了解draw.io的XML结构）

## 常用形状样式

- `ellipse`: 椭圆形（用于用户、角色等）
- `rounded=0`: 直角矩形
- `rounded=1`: 圆角矩形
- `shape=cylinder`: 圆柱体（用于数据库）
- `endArrow=classic`: 经典箭头样式
- `whiteSpace=wrap`: 文本自动换行

这些示例文件可以作为模板，帮助您快速创建自己的draw.io图表。
