// 生产环境配置文件 - 安全版本
// 此文件可以安全上传到 GitHub，不包含敏感信息

const SUPABASE_CONFIG = {
    URL: process.env.SUPABASE_URL || 'your-supabase-url',
    ANON_KEY: process.env.SUPABASE_ANON_KEY || 'your-anon-key'
};

// 如果在浏览器环境中，从全局变量获取配置
if (typeof window !== 'undefined') {
    // 在 Vercel 部署时，这些值会通过环境变量注入
    window.SUPABASE_CONFIG = {
        URL: '{{SUPABASE_URL}}',
        ANON_KEY: '{{SUPABASE_ANON_KEY}}'
    };
}