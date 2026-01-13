// =========================================
// 1. 全局配置与状态管理
// =========================================
let currentLang = 'en'; // 当前激活语言
let scanInterval;       // 用于存储扫描定时器 ID，方便随时停止

// 定义 Cloudflare 支持的标准端口 (用于动态渲染)
const httpsPorts = [443, 8443, 2053, 2083, 2087, 2096];
const httpPorts = [80, 8080, 2052, 2082, 2086, 2095];

// =========================================
// 2. 多语言词典 (i18n Database)
// 为了维护方便，将所有文案集中管理
// =========================================
const translations = {
    en: {
        app_title: "BPB Panel",
        login_subtitle: "Worker Management System v4.6",
        login_password_label: "Password",
        login_btn: "Login",
        login_hint: "Tip: Demo Mode, enter any password.",
        menu_dashboard: "Dashboard",
        menu_protocols: "Protocols & Ports",
        menu_general: "General Settings",
        menu_fragment: "Fragment",
        menu_warp: "Warp & Pro",
        menu_routing: "Routing Rules",
        menu_chain: "Chain Proxy",
        menu_scanner: "IP Scanner",
        menu_kv: "KV Editor",
        user_admin: "Admin User",
        user_online: "Online",
        dashboard_desc: "Overview of system status and quick actions.",
        btn_refresh_ip: "Refresh IP",
        card_ai_title: "AI Smart Obfuscate",
        card_ai_desc: "Automatically randomize Fragment length, interval, and Warp noise to evade detection.",
        btn_run_obfuscate: "Run Smart Obfuscate",
        card_ip_title: "Current IP",
        status_checking: "Checking...",
        card_status_title: "Worker Status",
        label_cpu: "CPU Usage",
        label_requests: "Requests (24h)",
        label_kv_writes: "KV Writes",
        card_actions_title: "Quick Actions",
        btn_copy_sub: "Copy Sub Link",
        btn_export_clash: "Export Clash",
        btn_save: "Save Changes",
        card_enabled_protocols: "Enabled Protocols",
        toggle_vless: "Enable VLESS Configs",
        toggle_trojan: "Enable Trojan Configs",
        desc_tls_ports: "Cloudflare supported TLS ports.",
        desc_http_ports: "Cloudflare supported non-TLS ports.",
        card_dns: "DNS Configuration",
        label_remote_dns: "Remote DNS (DoH)",
        label_local_dns: "Local DNS",
        toggle_fakedns: "Enable FakeDNS",
        card_network: "Network & IP",
        label_proxy_ip: "Proxy IP / Clean IP",
        desc_proxy_ip: "Used to proxy traffic through a clean Cloudflare IP.",
        toggle_ipv6: "Enable IPv6 Support",
        toggle_ech: "Enable ECH (Secure Hello)",
        desc_fragment: "Splits TLS packets into smaller chunks to bypass SNI blocking.",
        label_length: "Length (Min - Max)",
        label_interval: "Interval (Min - Max ms)",
        label_packets: "Packets",
        card_warp_account: "Warp Account",
        label_warp_key: "Warp Plus License Key",
        label_warp_endpoint: "Warp Endpoint",
        card_warp_pro: "Warp Pro (Obfuscation)",
        label_noise_mode: "UDP Noise Mode",
        label_noise_apply: "Noise Apply To",
        card_predefined_rules: "Pre-defined Rules",
        toggle_ads: "Block Ads & Trackers",
        toggle_porn: "Block Pornography",
        toggle_quic: "Block QUIC (UDP)",
        toggle_lan: "Bypass LAN / Private IP",
        toggle_cn: "Bypass China (CN)",
        toggle_ir: "Bypass Iran (IR)",
        toggle_ru: "Bypass Russia (RU)",
        toggle_google_ai: "Bypass Google AI",
        card_custom_rules: "Custom Rules",
        label_custom_bypass: "Custom Bypass IPs/Domains",
        label_custom_block: "Custom Block IPs/Domains",
        toggle_enable_chain: "Enable Chain Proxy",
        label_protocol: "Protocol",
        label_server: "Server Address",
        label_port: "Port",
        label_username: "Username / UUID",
        label_password: "Password",
        label_max_latency: "Max Latency (ms)",
        label_scan_threads: "Scan Threads",
        toggle_auto_apply: "Auto-Apply Best IP",
        btn_start_scan: "Start Scan",
        card_scan_log: "Scanner Log",
        btn_force_write: "Force Write",
        desc_kv: "Directly edit the JSON configuration stored in KV.",
        // Messages for Toast
        msg_login_success: "Login Successful!",
        msg_obfuscated: "System Obfuscated!",
        msg_ip_applied: "Best IP Applied: ",
        msg_copy: "Copied to clipboard!",
        msg_download: "Config downloaded!",
        msg_kv_warn: "Warning: Direct KV write is risky!",
        msg_save: "Settings Saved!"
    },
    zh: {
        app_title: "BPB 面板",
        login_subtitle: "Worker 管理系统 v4.6",
        login_password_label: "访问密码",
        login_btn: "登录",
        login_hint: "提示：演示模式，输入任意密码登录。",
        menu_dashboard: "仪表盘",
        menu_protocols: "协议与端口",
        menu_general: "通用设置",
        menu_fragment: "分片 (Fragment)",
        menu_warp: "Warp & Pro",
        menu_routing: "路由规则",
        menu_chain: "链式代理",
        menu_scanner: "IP 优选扫描",
        menu_kv: "KV 编辑器",
        user_admin: "管理员",
        user_online: "在线",
        dashboard_desc: "系统状态概览与快捷操作。",
        btn_refresh_ip: "刷新 IP",
        card_ai_title: "AI 智能混淆",
        card_ai_desc: "自动随机化 Fragment 长度、间隔及 Warp 噪音参数，规避防火墙探测。",
        btn_run_obfuscate: "执行智能混淆",
        card_ip_title: "当前 IP",
        status_checking: "查询中...",
        card_status_title: "Worker 状态",
        label_cpu: "CPU 占用",
        label_requests: "24h 请求数",
        label_kv_writes: "KV 写入",
        card_actions_title: "快捷操作",
        btn_copy_sub: "复制订阅链接",
        btn_export_clash: "导出 Clash 配置",
        btn_save: "保存更改",
        card_enabled_protocols: "启用协议",
        toggle_vless: "启用 VLESS 配置",
        toggle_trojan: "启用 Trojan 配置",
        desc_tls_ports: "Cloudflare 支持的 TLS 端口。",
        desc_http_ports: "Cloudflare 支持的非 TLS 端口。",
        card_dns: "DNS 配置",
        label_remote_dns: "远程 DNS (DoH)",
        label_local_dns: "本地 DNS",
        toggle_fakedns: "启用 FakeDNS",
        card_network: "网络与 IP",
        label_proxy_ip: "优选 IP / CDN",
        desc_proxy_ip: "用于通过纯净的 Cloudflare IP 代理流量。",
        toggle_ipv6: "启用 IPv6 支持",
        toggle_ech: "启用 ECH (加密 Client Hello)",
        desc_fragment: "将 TLS 数据包分片以绕过 SNI 阻断。",
        label_length: "长度 (Min - Max)",
        label_interval: "间隔 (Min - Max ms)",
        label_packets: "数据包位置",
        card_warp_account: "Warp 账户",
        label_warp_key: "Warp+ 密钥 (License)",
        label_warp_endpoint: "Warp 端点",
        card_warp_pro: "Warp Pro (混淆)",
        label_noise_mode: "UDP 噪音模式",
        label_noise_apply: "噪音应用范围",
        card_predefined_rules: "预设规则",
        toggle_ads: "拦截广告与追踪",
        toggle_porn: "拦截成人内容",
        toggle_quic: "拦截 QUIC (UDP)",
        toggle_lan: "绕过局域网 / 私有 IP",
        toggle_cn: "绕过中国 (CN)",
        toggle_ir: "绕过伊朗 (IR)",
        toggle_ru: "绕过俄罗斯 (RU)",
        toggle_google_ai: "绕过 Google AI (Gemini)",
        card_custom_rules: "自定义规则",
        label_custom_bypass: "自定义绕过 (白名单)",
        label_custom_block: "自定义阻断 (黑名单)",
        toggle_enable_chain: "启用链式代理 (前置代理)",
        label_protocol: "协议",
        label_server: "服务器地址",
        label_port: "端口",
        label_username: "用户名 / UUID",
        label_password: "密码",
        label_max_latency: "最大延迟 (ms)",
        label_scan_threads: "并发线程",
        toggle_auto_apply: "自动应用最佳 IP",
        btn_start_scan: "开始扫描",
        card_scan_log: "扫描日志",
        btn_force_write: "强制写入",
        desc_kv: "直接编辑存储在 KV 中的 JSON 配置。",
        // Messages
        msg_login_success: "登录成功！",
        msg_obfuscated: "系统混淆完成！",
        msg_ip_applied: "已应用最佳 IP: ",
        msg_copy: "已复制到剪贴板！",
        msg_download: "配置已下载！",
        msg_kv_warn: "警告：直接修改 KV 有风险！",
        msg_save: "设置已保存！"
    },
    ru: {
        app_title: "Панель BPB",
        login_subtitle: "Система управления v4.6",
        login_password_label: "Пароль",
        login_btn: "Войти",
        login_hint: "Демо: введите любой пароль.",
        menu_dashboard: "Дашборд",
        menu_protocols: "Протоколы",
        menu_general: "Общие",
        menu_fragment: "Фрагментация",
        menu_warp: "Warp & Pro",
        menu_routing: "Маршрутизация",
        menu_chain: "Chain Proxy",
        menu_scanner: "Сканер IP",
        menu_kv: "Редактор KV",
        user_admin: "Админ",
        user_online: "Онлайн",
        dashboard_desc: "Обзор системы.",
        btn_refresh_ip: "Обновить IP",
        card_ai_title: "AI Обфускация",
        card_ai_desc: "Рандомизация параметров для обхода блокировок.",
        btn_run_obfuscate: "Запуск обфускации",
        card_ip_title: "Текущий IP",
        status_checking: "Проверка...",
        card_status_title: "Статус Worker",
        label_cpu: "Загрузка CPU",
        label_requests: "Запросы (24ч)",
        label_kv_writes: "Запись KV",
        card_actions_title: "Действия",
        btn_copy_sub: "Копировать ссылку",
        btn_export_clash: "Скачать Clash",
        btn_save: "Сохранить",
        card_enabled_protocols: "Протоколы",
        toggle_vless: "Включить VLESS",
        toggle_trojan: "Включить Trojan",
        desc_tls_ports: "TLS порты Cloudflare.",
        desc_http_ports: "HTTP порты Cloudflare.",
        card_dns: "Настройки DNS",
        label_remote_dns: "Удаленный DNS (DoH)",
        label_local_dns: "Локальный DNS",
        toggle_fakedns: "Включить FakeDNS",
        card_network: "Сеть и IP",
        label_proxy_ip: "Чистый IP (Proxy)",
        desc_proxy_ip: "Использовать чистый IP Cloudflare.",
        toggle_ipv6: "Включить IPv6",
        toggle_ech: "Включить ECH",
        desc_fragment: "Разделение пакетов TLS.",
        label_length: "Длина (Min - Max)",
        label_interval: "Интервал (мс)",
        label_packets: "Пакеты",
        card_warp_account: "Аккаунт Warp",
        label_warp_key: "Ключ Warp+",
        label_warp_endpoint: "Эндпоинт",
        card_warp_pro: "Warp Pro",
        label_noise_mode: "Режим шума UDP",
        label_noise_apply: "Применить шум к",
        card_predefined_rules: "Правила",
        toggle_ads: "Блок рекламы",
        toggle_porn: "Блок порно",
        toggle_quic: "Блок QUIC",
        toggle_lan: "Обход LAN",
        toggle_cn: "Обход Китай (CN)",
        toggle_ir: "Обход Иран (IR)",
        toggle_ru: "Обход Россия (RU)",
        toggle_google_ai: "Обход Google AI",
        card_custom_rules: "Свои правила",
        label_custom_bypass: "Белый список",
        label_custom_block: "Черный список",
        toggle_enable_chain: "Включить Chain Proxy",
        label_protocol: "Протокол",
        label_server: "Сервер",
        label_port: "Порт",
        label_username: "Пользователь",
        label_password: "Пароль",
        label_max_latency: "Макс. задержка",
        label_scan_threads: "Потоки",
        toggle_auto_apply: "Авто-применение IP",
        btn_start_scan: "Начать скан",
        card_scan_log: "Лог сканера",
        btn_force_write: "Записать",
        desc_kv: "Редактировать JSON в KV.",
        // Messages
        msg_login_success: "Успешный вход!",
        msg_obfuscated: "Система обфусцирована!",
        msg_ip_applied: "IP применен: ",
        msg_copy: "Скопировано!",
        msg_download: "Конфиг скачан!",
        msg_kv_warn: "Осторожно: запись KV опасна!",
        msg_save: "Настройки сохранены!"
    },
    fa: {
        app_title: "پنل BPB",
        login_subtitle: "سیستم مدیریت ورکر v4.6",
        login_password_label: "رمز عبور",
        login_btn: "ورود",
        login_hint: "نکته: حالت دمو، هر رمزی وارد کنید.",
        menu_dashboard: "داشبورد",
        menu_protocols: "پروتکل‌ها و پورت‌ها",
        menu_general: "تنظیمات عمومی",
        menu_fragment: "فرگمنت (Fragment)",
        menu_warp: "وارپ و پرو",
        menu_routing: "قوانین مسیریابی",
        menu_chain: "پروکسی زنجیره‌ای",
        menu_scanner: "اسکنر IP",
        menu_kv: "ویرایشگر KV",
        user_admin: "مدیر",
        user_online: "آنلاین",
        dashboard_desc: "نمای کلی وضعیت سیستم.",
        btn_refresh_ip: "بروزرسانی IP",
        card_ai_title: "مبهم‌سازی هوشمند AI",
        card_ai_desc: "تغییر تصادفی تنظیمات برای دور زدن فیلترینگ.",
        btn_run_obfuscate: "اجرای مبهم‌سازی",
        card_ip_title: "IP فعلی",
        status_checking: "در حال بررسی...",
        card_status_title: "وضعیت ورکر",
        label_cpu: "مصرف CPU",
        label_requests: "درخواست‌ها (24h)",
        label_kv_writes: "نوشتن در KV",
        card_actions_title: "دسترسی سریع",
        btn_copy_sub: "کپی لینک اشتراک",
        btn_export_clash: "دانلود کانفیگ Clash",
        btn_save: "ذخیره تغییرات",
        card_enabled_protocols: "پروتکل‌های فعال",
        toggle_vless: "فعالسازی VLESS",
        toggle_trojan: "فعالسازی Trojan",
        desc_tls_ports: "پورت‌های TLS کلادفلر.",
        desc_http_ports: "پورت‌های غیر TLS کلادفلر.",
        card_dns: "تنظیمات DNS",
        label_remote_dns: "DNS راه دور (DoH)",
        label_local_dns: "DNS داخلی",
        toggle_fakedns: "فعالسازی FakeDNS",
        card_network: "شبکه و IP",
        label_proxy_ip: "IP تمیز / پروکسی",
        desc_proxy_ip: "برای عبور ترافیک از IP سالم کلادفلر.",
        toggle_ipv6: "پشتیبانی IPv6",
        toggle_ech: "فعالسازی ECH",
        desc_fragment: "تقسیم بسته‌های TLS برای دور زدن فیلترینگ SNI.",
        label_length: "طول (Min - Max)",
        label_interval: "فاصله (Min - Max ms)",
        label_packets: "بسته‌ها",
        card_warp_account: "حساب وارپ",
        label_warp_key: "کلید لایسنس Warp+",
        label_warp_endpoint: "آدرس سرور وارپ",
        card_warp_pro: "وارپ پرو (مبهم‌سازی)",
        label_noise_mode: "حالت نویز UDP",
        label_noise_apply: "اعمال نویز روی",
        card_predefined_rules: "قوانین پیش‌فرض",
        toggle_ads: "مسدودسازی تبلیغات",
        toggle_porn: "مسدودسازی محتوای بزرگسال",
        toggle_quic: "مسدودسازی QUIC (UDP)",
        toggle_lan: "دور زدن شبکه داخلی",
        toggle_cn: "دور زدن چین (CN)",
        toggle_ir: "دور زدن ایران (IR)",
        toggle_ru: "دور زدن روسیه (RU)",
        toggle_google_ai: "دور زدن هوش مصنوعی گوگل",
        card_custom_rules: "قوانین شخصی",
        label_custom_bypass: "لیست سفید (Bypass)",
        label_custom_block: "لیست سیاه (Block)",
        toggle_enable_chain: "فعالسازی پروکسی زنجیره‌ای",
        label_protocol: "پروتکل",
        label_server: "آدرس سرور",
        label_port: "پورت",
        label_username: "نام کاربری / UUID",
        label_password: "رمز عبور",
        label_max_latency: "حداکثر تاخیر (ms)",
        label_scan_threads: "تعداد رشته‌ها (Threads)",
        toggle_auto_apply: "اعمال خودکار بهترین IP",
        btn_start_scan: "شروع اسکن",
        card_scan_log: "لاگ اسکنر",
        btn_force_write: "ذخیره اجباری",
        desc_kv: "ویرایش مستقیم فایل JSON در KV.",
        // Messages
        msg_login_success: "ورود موفق!",
        msg_obfuscated: "سیستم مبهم‌سازی شد!",
        msg_ip_applied: "بهترین IP اعمال شد: ",
        msg_copy: "کپی شد!",
        msg_download: "کانفیگ دانلود شد!",
        msg_kv_warn: "هشدار: تغییر مستقیم KV خطرناک است!",
        msg_save: "تنظیمات ذخیره شد!"
    }
};

// =========================================
// 3. 初始化逻辑 (Initialization)
// 页面加载完成后，优先渲染端口和语言设置
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    renderPorts();
    initLanguage();
});

// =========================================
// 4. 语言切换逻辑 (I18n Engine)
// =========================================
function initLanguage() {
    // 优先从本地缓存读取，如果没有则尝试获取浏览器语言
    let storedLang = localStorage.getItem('bpb_lang');
    if (!storedLang) {
        const browserLang = navigator.language || navigator.userLanguage; 
        if (browserLang.includes('zh')) storedLang = 'zh';
        else if (browserLang.includes('fa') || browserLang.includes('ir')) storedLang = 'fa';
        else if (browserLang.includes('ru')) storedLang = 'ru';
        else storedLang = 'en';
    }
    changeLanguage(storedLang);
    
    // 更新下拉框的选中状态
    const selector = document.querySelector('.lang-select');
    if(selector) selector.value = storedLang;
}

function changeLanguage(lang) {
    localStorage.setItem('bpb_lang', lang);
    currentLang = lang;
    
    // Step 1: 添加动画类，触发 CSS 模糊和下沉效果
    document.body.classList.add('lang-switching');

    // Step 2: 等待过渡时间后 (300ms) 切换文字内容
    setTimeout(() => {
        // 波斯语需要开启 RTL 模式
        if (lang === 'fa') document.body.classList.add('rtl');
        else document.body.classList.remove('rtl');

        // 如果找不到对应语言包，回退到英文
        const texts = translations[lang] || translations['en'];
        
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (texts[key]) el.innerText = texts[key];
        });

        // Step 3: 文字更新完毕，移除动画类，触发淡入
        requestAnimationFrame(() => {
            document.body.classList.remove('lang-switching');
        });
    }, 300);
}

// =========================================
// 5. Toast 通知组件 (UI Component)
// =========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    let iconClass = 'fa-info-circle';
    let toastClass = 'toast-info';
    
    // 根据类型映射不同的图标和颜色
    if (type === 'success') {
        iconClass = 'fa-check-circle';
        toastClass = 'toast-success';
    } else if (type === 'error') {
        iconClass = 'fa-times-circle';
        toastClass = 'toast-error';
    } else if (type === 'warning') {
        iconClass = 'fa-exclamation-triangle';
        toastClass = 'toast-warning';
    }

    toast.className = `toast ${toastClass}`;
    toast.innerHTML = `<i class="fas ${iconClass}"></i><span>${message}</span>`;
    
    container.appendChild(toast);

    // 强制重绘，确保 CSS transition 生效
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 3.5秒后自动消失
    setTimeout(() => {
        toast.classList.remove('show');
        toast.style.opacity = '0';
        // 等待淡出动画结束后再从 DOM 移除
        setTimeout(() => {
            if(container.contains(toast)) container.removeChild(toast);
        }, 400); 
    }, 3500);
}

// =========================================
// 6. 核心交互函数 (Core Logic)
// =========================================

// 模拟登录过程
function handleLogin() {
    const overlay = document.getElementById('login-overlay');
    const container = document.getElementById('app-container');
    const btn = overlay.querySelector('button');
    
    // 按钮进入加载状态
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            container.style.display = 'flex';
            
            // 稍微延迟显示主容器，确保 flex 布局计算完毕
            setTimeout(() => container.style.opacity = '1', 50);
            
            fetchMyIP();
            showToast(translations[currentLang].msg_login_success, 'success');
        }, 500);
    }, 800);
}

// Tab 标签页切换
function switchTab(sectionId, navElement) {
    // 高亮菜单项
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    navElement.classList.add('active');
    
    // 切换内容区域
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    // 移动端点击后自动收起侧边栏
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('show');
    }
}

// 移动端侧边栏显隐
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
}

// 动态渲染端口号 DOM
function renderPorts() {
    const httpsContainer = document.getElementById('https-ports-container');
    const httpContainer = document.getElementById('http-ports-container');
    
    httpsPorts.forEach(port => {
        const div = document.createElement('div');
        div.className = 'port-item active'; 
        div.innerText = port;
        div.onclick = () => div.classList.toggle('active');
        httpsContainer.appendChild(div);
    });
    
    httpPorts.forEach(port => {
        const div = document.createElement('div');
        div.className = 'port-item'; 
        div.innerText = port;
        div.onclick = () => div.classList.toggle('active');
        httpContainer.appendChild(div);
    });
}

// 模拟保存设置 (带按钮加载状态反馈)
function saveSettings() {
    const btn = event.currentTarget; // 获取点击的按钮
    const originalHtml = btn.innerHTML;
    
    // 变为 loading 状态
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    
    setTimeout(() => {
        // 变为成功勾选状态
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.classList.remove('btn-success');
        btn.classList.add('btn-primary'); // 暂时变蓝
        
        showToast(translations[currentLang].msg_save, 'success');
        
        // 1.5秒后恢复原样
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.classList.add('btn-success');
            btn.classList.remove('btn-primary');
            btn.disabled = false;
        }, 1500);
    }, 800);
}

// 模拟获取 IP
function fetchMyIP() {
    const ipEl = document.getElementById('dashboard-ip');
    const locEl = document.getElementById('dashboard-loc');
    
    ipEl.innerText = "...";
    // 模拟 API 请求延迟
    setTimeout(() => {
        ipEl.innerText = "104.28.201.17";
        locEl.innerText = "Cloudflare • San Francisco, US";
    }, 1000);
}

// 链式代理 UI 显隐逻辑
function toggleChainFields() {
    const isChecked = document.getElementById('chain-toggle').checked;
    const fields = document.getElementById('chain-fields');
    
    if (isChecked) {
        fields.style.display = 'block';
        setTimeout(() => fields.style.opacity = '1', 10);
    } else {
        fields.style.opacity = '0';
        setTimeout(() => fields.style.display = 'none', 300);
    }
}

// 模拟 AI 混淆过程 (带矩阵特效)
function runSmartObfuscation() {
    const overlay = document.getElementById('obfuscation-overlay');
    const msg = document.getElementById('obfuscate-msg');
    
    overlay.style.display = 'flex';
    const steps = ["ANALYZING TRAFFIC...", "RANDOMIZING FINGERPRINT...", "CALCULATING INTERVALS...", "INJECTING NOISE...", "APPLYING CONFIG..."];
    let i = 0;
    
    const interval = setInterval(() => {
        if (i >= steps.length) {
            clearInterval(interval);
            overlay.style.display = 'none';
            
            // 随机化表单数据
            document.getElementById('frag-len-min').value = Math.floor(Math.random() * 50) + 40;
            document.getElementById('frag-len-max').value = Math.floor(Math.random() * 100) + 200;
            document.getElementById('warp-noise').value = Math.random() > 0.5 ? 'random' : 'quic';
            
            showToast(translations[currentLang].msg_obfuscated, 'success');
        } else {
            msg.innerText = steps[i];
            i++;
        }
    }, 700);
}

// IP 优选扫描逻辑 (模拟器)
function toggleScan() {
    const btn = document.getElementById('scan-btn');
    const log = document.getElementById('scan-log');
    const autoApply = document.getElementById('auto-apply-ip').checked;
    const texts = translations[currentLang];

    // 如果按钮是红色 (Stop)，则停止扫描
    if (btn.classList.contains('btn-danger')) {
        clearInterval(scanInterval);
        btn.innerHTML = `<i class="fas fa-play"></i> <span data-i18n="btn_start_scan">${texts.btn_start_scan}</span>`;
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-primary');
        log.innerHTML += `<div style="color:white;">> Stopped.</div>`;
        return;
    }

    // 开始扫描
    btn.innerHTML = '<i class="fas fa-stop"></i> Stop';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-danger');
    log.innerHTML += `<div>> Initializing...</div>`;
    log.scrollTop = log.scrollHeight;

    let count = 0;
    let bestIp = '';
    let bestLatency = 999;

    scanInterval = setInterval(() => {
        count++;
        // 生成随机 IP 模拟
        const ip = `104.${16 + Math.floor(Math.random()*10)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
        const latency = Math.floor(Math.random() * 400);
        
        // 根据延迟给颜色
        let color = latency < 150 ? '#10b981' : (latency < 300 ? '#f59e0b' : '#ef4444');
        const line = `<div style="color:${color}">> [${ip}] ${latency}ms</div>`;
        log.innerHTML += line;
        log.scrollTop = log.scrollHeight; // 自动滚动到底部

        if (latency < bestLatency) {
            bestLatency = latency;
            bestIp = ip;
        }

        // 模拟扫描 10 个后停止
        if (count >= 10) {
            clearInterval(scanInterval);
            log.innerHTML += `<div>> Finished. Best: ${bestIp}</div>`;
            
            if (autoApply) {
                document.getElementById('general-proxy-ip').value = bestIp;
                log.innerHTML += `<div style="color:#10b981;">> Auto Applied.</div>`;
                showToast(texts.msg_ip_applied + bestIp, 'success');
            }
            
            // 恢复按钮状态
            btn.innerHTML = `<i class="fas fa-play"></i> <span data-i18n="btn_start_scan">${texts.btn_start_scan}</span>`;
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-primary');
        }
    }, 300);
}