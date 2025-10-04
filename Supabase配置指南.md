# 中秋猜谜语游戏 - Supabase 配置指南

## 1. 创建 Supabase 项目

1. 访问 [Supabase官网](https://supabase.com/)
2. 点击 "Start your project" 注册账号
3. 登录后点击 "New project"
4. 填写项目信息：
   - Organization: 选择或创建组织
   - Name: `mid-autumn-riddle-game`
   - Database Password: 设置一个强密码（请记住）
   - Region: 选择 `Southeast Asia (Singapore)` 或最近的区域
5. 点击 "Create new project"

## 2. 获取项目配置信息

项目创建完成后：

1. 进入项目仪表板
2. 点击左侧菜单的 "Settings" → "API"
3. 复制以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJ...` (很长的字符串)

## 3. 创建数据表

1. 点击左侧菜单的 "Table Editor"
2. 点击 "Create a new table"

### 创建 users 表

- Table name: `users`
- Description: `用户信息表`
- 点击 "Save"

然后添加以下列：

| 列名 | 类型 | 默认值 | 是否可空 | 描述 |
|------|------|--------|----------|------|
| id | int8 | - | 否 | 主键（自动递增） |
| username | text | - | 否 | 用户名（唯一） |
| password | text | - | 否 | 密码 |
| score | int4 | 0 | 否 | 得分 |
| created_at | timestamptz | now() | 否 | 创建时间 |
| updated_at | timestamptz | now() | 否 | 更新时间 |

### 创建 feedback 表

- Table name: `feedback`
- Description: `用户反馈表`
- 点击 "Save"

然后添加以下列：

| 列名 | 类型 | 默认值 | 是否可空 | 描述 |
|------|------|--------|----------|------|
| id | int8 | - | 否 | 主键（自动递增） |
| username | text | - | 否 | 反馈用户名 |
| user_id | int8 | - | 是 | 用户ID（外键） |
| contact | text | - | 是 | 联系方式（可选） |
| content | text | - | 否 | 反馈内容 |
| created_at | timestamptz | now() | 否 | 创建时间 |

### 创建 user_answers 表（可选）

如果需要记录答题历史：

- Table name: `user_answers`
- Description: `用户答题记录表`

添加以下列：

| 列名 | 类型 | 默认值 | 是否可空 | 描述 |
|------|------|--------|----------|------|
| id | int8 | - | 否 | 主键（自动递增） |
| user_id | int8 | - | 否 | 用户ID（外键，对应users表的id） |
| riddle_id | integer | - | 否 | 谜题ID |
| user_answer | text | - | 否 | 用户答案 |
| is_correct | boolean | - | 否 | 是否正确 |
| answered_at | timestamptz | now() | 否 | 答题时间 |

## 4. 设置行级安全策略（RLS）

1. 在 users 表页面，点击右上角的 "..." → "Edit table"
2. 开启 "Enable Row Level Security (RLS)"
3. 点击 "Save"

### 添加策略

1. 点击 "Policies" 标签
2. 点击 "Add policy"

#### 允许所有用户查看排行榜
- Policy name: `Allow public read access`
- Allowed operation: `SELECT`
- Target roles: `public`
- USING expression: `true`

#### 允许插入新用户
- Policy name: `Allow public insert`
- Allowed operation: `INSERT`
- Target roles: `public`
- WITH CHECK expression: `true`

#### 允许用户更新自己的分数
- Policy name: `Allow users to update own score`
- Allowed operation: `UPDATE`
- Target roles: `public`
- USING expression: `true`
- WITH CHECK expression: `true`

## 5. 配置游戏文件

1. 打开 `index.html` 文件
2. 找到以下代码行：

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

3. 替换为你的实际配置：

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 6. 测试连接

1. 在浏览器中打开 `index.html`
2. 输入用户名登录
3. 答对一道题目
4. 检查 Supabase 仪表板中的 users 表是否有新数据

## 7. 实时功能验证

1. 打开两个浏览器窗口
2. 分别用不同用户名登录
3. 在一个窗口中答题
4. 观察另一个窗口的排行榜是否实时更新

## 常见问题

### Q: 无法连接到 Supabase
A: 检查网络连接，确认 URL 和 API Key 是否正确

### Q: 数据无法插入
A: 检查 RLS 策略是否正确设置，确保 public 角色有插入权限

### Q: 排行榜不实时更新
A: 检查浏览器控制台是否有错误，确认 Realtime 功能是否启用

### Q: 用户名重复
A: 可以在 users 表的 username 列添加 UNIQUE 约束

## 部署注意事项

- 确保 Supabase 项目的区域选择合适
- 生产环境建议设置更严格的 RLS 策略
- 定期备份数据库
- 监控 API 使用量，避免超出免费额度

## 免费额度说明

Supabase 免费计划包括：
- 500MB 数据库存储
- 5GB 带宽
- 50MB 文件存储
- 500,000 Edge Function 调用

对于中秋猜谜语游戏，免费额度完全够用。