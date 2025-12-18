import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Globe, ArrowRight, Play, Pause, X, Menu, 
  Zap, Users, BookOpen, GraduationCap, Upload, Check, ChevronDown,
  Package, TrendingUp, Briefcase, Cog, Brain, Send
} from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * 1. CONFIGURATION & DATA (設定與資料)
 * ------------------------------------------------------------------
 */

// 面試影片逐字稿資料 (含時間軸與中英對照)
const TRANSCRIPT_DATA = [
  { start: 0, end: 8, speaker: 'Sinclair', zh: '大家早安。歡迎來到今天華碩產品經理職位的面試環節。謝謝大家的參與。我們從自我介紹開始吧。', en: 'Good morning, everyone. Welcome to today’s interview session for the Product Manager position at ASUS. Thank you all for being here. Let’s begin with introductions.' },
  { start: 8, end: 16, speaker: 'Olivia', zh: '早安，我是 Olivia。我有行銷和產品規劃的經驗，並且熱衷於開發能解決使用者真實問題的產品。', en: 'Good morning. I’m Olivia. I have experience in marketing and product planning, and I’m passionate about developing products that solve real user problems.' },
  { start: 16, end: 24, speaker: 'Tina', zh: '我是 Tina。我的背景是商業開發，專注於了解市場趨勢、客戶需求，以及如何將其轉化為產品策略。', en: 'I’m Tina. My background is in business development, and I focus on understanding market trends, customer needs, and how to turn them into product strategies.' },
  { start: 24, end: 32, speaker: 'Kai', zh: '我是 Kai。我有工程背景，專長是將技術解決方案與使用者體驗做連結。', en: 'And I’m Kai. I come from an engineering background, and I specialize in connecting technical solutions with user experience.' },
  { start: 32, end: 40, speaker: 'Sinclair', zh: '謝謝各位的介紹。先從一個簡單的問題開始：為什麼想在華碩擔任產品經理？', en: 'Thank you for the introductions. Let’s start with a simple question: Why do you want to work as a Product Manager at ASUS?' },
  { start: 40, end: 50, speaker: 'Olivia', zh: '我欽佩華碩對創新的承諾。公司在硬體和設計上不斷推陳出新。我想透過創造具競爭力且對使用者有意義的產品來做出貢獻。', en: 'I admire ASUS’s commitment to innovation. The company consistently pushes new ideas in both hardware and design. I want to contribute by helping create products that are both competitive and meaningful for users.' },
  { start: 50, end: 60, speaker: 'Tina', zh: '對我來說，華碩之所以突出，是因為在技術與以人為本的思維之間取得了平衡。我認為產品經理是市場需求與華碩技術能力之間的橋樑。', en: 'For me, ASUS stands out because of the balance between technology and user-centric thinking. I see the Product Manager role as the bridge between what the market needs and what ASUS can build.' },
  { start: 60, end: 70, speaker: 'Kai', zh: '從技術角度來看，華碩的工程品質一直令我印象深刻。我想協助將這些優勢轉化為能為不同類型使用者帶來明確價值的產品。', en: 'From a technical angle, ASUS has always impressed me with its engineering quality. I want to help translate those strengths into products that deliver clear value to different types of users.' },
  { start: 70, end: 80, speaker: 'Sinclair', zh: '很好。接下來，如果你是華碩筆電部門的產品經理，你的首要任務會是什麼？', en: 'Great. Now, let’s move on. If you were the Product Manager for the ASUS laptop division, what would your first priority be?' },
  { start: 80, end: 92, speaker: 'Olivia', zh: '我的首要任務是識別關鍵使用者區隔。例如學生、專業人士和創作者都有不同需求。了解這些差異有助於定義有意義的功能和產品定位。', en: 'My first priority would be identifying the key user segments. For example, students, professionals, and creators all have different needs. Understanding these differences helps define meaningful features and product positioning.' },
  { start: 92, end: 102, speaker: 'Tina', zh: '我會專注於競品分析。筆電產業變化快速，了解華碩相較於競爭對手的定位，有助於引導產品方向。', en: 'I would focus on competitive analysis. The laptop industry moves quickly, so knowing where ASUS stands compared to rivals helps guide product direction.' },
  { start: 102, end: 112, speaker: 'Kai', zh: '我會與工程團隊密切合作，了解技術限制與可能性。這樣我們才能規劃出務實、高效且有價值的功能。', en: 'I would work closely with engineering teams to understand technical limitations and possibilities. That way, we can plan features that are realistic, efficient, and valuable.' },
  { start: 112, end: 122, speaker: 'Sinclair', zh: '回答得很好。下一個問題：華碩以 ZenBook 和 ROG 系列聞名。你會如何持續改進這些產品線？', en: 'Excellent answers. Next question: ASUS is known for the ZenBook and ROG series. How would you continue improving these product lines?' },
  { start: 122, end: 132, speaker: 'Olivia', zh: '對於 ZenBook，我會強調便攜性與便利性——更長的續航力、更輕薄的設計以及更聰明的軟體功能。', en: 'For ZenBook, I would emphasize portability and user convenience — longer battery life, lighter design, and smarter software features.' },
  { start: 132, end: 142, speaker: 'Tina', zh: '對於 ROG 系列，我認為機會在於強化電競生態系：更好的散熱、客製化功能，以及支援實況主和創作者的工具。', en: 'For the ROG series, I see opportunities in enhancing the gaming ecosystem: better cooling, customizable features, and tools that support streamers and creators.' },
  { start: 142, end: 152, speaker: 'Kai', zh: '我會推動整合 AI 功能，以增強效能最佳化、即時資源管理和使用者個人化體驗。', en: 'I would push for integrating AI features that enhance performance optimization, real-time resource management, and user personalization.' },
  { start: 152, end: 160, speaker: 'Sinclair', zh: '很棒的觀點。最後一個問題，請用一句話描述華碩作為一家科技公司的獨特之處。', en: 'Very good perspectives. Now, one last question. In one sentence, describe what makes ASUS unique as a technology company.' },
  { start: 160, end: 168, speaker: 'Olivia', zh: '華碩的獨特之處在於持續創新，同時保持強大的產品可靠性。', en: 'ASUS is unique because it consistently delivers innovation while maintaining strong product reliability.' },
  { start: 168, end: 176, speaker: 'Tina', zh: '華碩之所以突出，是因為能將先進技術與以使用者為中心的設計完美融合。', en: 'ASUS stands out for its ability to blend advanced technology with user-focused design.' },
  { start: 176, end: 184, speaker: 'Kai', zh: '華碩的特別之處在於提供強大的產品，同時服務日常使用者與高效能專業人士。', en: 'ASUS is special because it offers powerful products that serve both everyday users and high-performance professionals.' },
  { start: 184, end: 192, speaker: 'Sinclair', zh: '謝謝。今天的面試環節到此結束。各位的見解令人印象深刻，感謝你們對加入華碩的興趣。', en: 'Thank you. That concludes our interview session. Your insights were impressive, and we appreciate your interest in joining ASUS.' },
  { start: 192, end: 200, speaker: 'Sinclair', zh: '謝謝觀看，歡迎在我們的網頁上探索更多資訊。', en: 'Thank you for watching, and feel free to explore more on our webpage.' },
];

const TEXT = {
  zh: {
    nav: { next: '下一步', prev: '上一步', start: '開始旅程' },
    p1: {
      welcome: '歡迎來到',
      subtitle: '商管學生進入科技業的最佳起點',
      placeholder: '請輸入您的姓名',
      btn: '開啟職涯地圖'
    },
    p2: {
      title: '為何選擇華碩？',
      video_title: 'ASUS 創新願景',
      transcript_title: '影片逐字稿',
      transcript_desc: '點擊逐字稿可跳轉影片進度',
      video_placeholder: '請載入您的面試影片檔案',
      load_video_btn: '選擇影片檔 (.mp4)',
      features_title: '新鮮人優勢',
      f1: '商管首選', f1_desc: '產品導向，非工科也能懂',
      f2: '薪資透明', f2_desc: '3年達 52K，比肩代工大廠',
      f3: '升遷明確', f3_desc: 'PM → PMM → 經理路徑清晰',
      freshman_guide: {
        title: '新鮮人攻略 (6-12個月準備路徑)',
        step1: { title: 'Step 1', desc: '校內選修供應鏈/PM課\n(群組作業 OTD > 95%)' },
        step2: { title: 'Step 2', desc: '考取 PMP/SCOR 證照\n(加薪 10K 籌碼)' },
        step3: { title: 'Step 3', desc: 'Excel 進階 + Power BI\n(模擬 NPIMP 流程)' },
        step4: { title: 'Step 4', desc: '投遞實習/正職\n(強調追蹤延遲案例)' }
      }
    },
    p3: {
      title: '職位透視',
      subtitle: '選擇兩個職位進行詳細比較',
      select_1: '選擇第一個職位',
      select_2: '選擇第二個職位',
      headers: {
        code: '職缺代號',
        focus: '核心占比',
        resp: '工作日常 (Daily)',
        edu: '學歷/經驗',
        skill: '必備技能',
        trait: '人格特質',
        salary: '薪資與升遷'
      }
    },
    p4: {
      title: '菁英團隊',
      subtitle: '與最聰明的人一起工作'
    },
    p4_5: {
      title: '術語白話文',
      subtitle: '供應鏈與產品管理的必備詞彙',
      flip_hint: '點擊卡片翻轉'
    },
    p5: {
      title: '潛能測驗',
      subtitle: 'AI 分析你的供應鏈基因',
      question: '情境題',
      result_title: '分析完成',
      result_desc: '根據演算法，您最適合的角色是：',
      restart: '重新測驗',
      next_step: '前往挑戰',
      cheat_sheet: '術語白話文'
    },
    p6: {
      title: '加入我們',
      game_title: '模擬面試挑戰',
      game_desc: '回答正確可獲得優先面試權！(OTD > 97% 是你的目標)',
      form_title: '投遞履歷',
      name: '姓名',
      email: '電子郵件',
      msg: '給我們的話',
      submit: '確認送出',
      success: '發送成功！記得在履歷強調你的 OTD 達成率！'
    }
  },
  en: {
    nav: { next: 'Next', prev: 'Back', start: 'Start Journey' },
    p1: {
      welcome: 'Welcome to',
      subtitle: 'Best Starting Point for Business Grads',
      placeholder: 'Enter your name',
      btn: 'Start Career Map'
    },
    p2: {
      title: 'Why ASUS?',
      video_title: 'ASUS Vision',
      transcript_title: 'Transcript',
      transcript_desc: 'Click transcript to jump',
      video_placeholder: 'Please load your interview video file',
      load_video_btn: 'Select Video File (.mp4)',
      features_title: 'Grad Benefits',
      f1: 'Top Choice', f1_desc: 'Product-oriented, friendly to business majors',
      f2: 'Competitive Pay', f2_desc: 'Reach 52K in 3 years',
      f3: 'Clear Path', f3_desc: 'PM → PMM → Manager',
      freshman_guide: {
        title: 'Freshman Guide (6-12 Months Roadmap)',
        step1: { title: 'Step 1', desc: 'Take Supply Chain/PM courses\n(Group Project OTD > 95%)' },
        step2: { title: 'Step 2', desc: 'Get PMP/SCOR Certified\n(Salary Boost Leverage)' },
        step3: { title: 'Step 3', desc: 'Master Excel + Power BI\n(Simulate NPIMP Flow)' },
        step4: { title: 'Step 4', desc: 'Apply Internship/Job\n(Highlight Tracking Cases)' }
      }
    },
    p3: {
      title: 'Role Insights',
      subtitle: 'Select two roles to compare in detail',
      select_1: 'Select First Role',
      select_2: 'Select Second Role',
      headers: {
        code: 'Job Code',
        focus: 'Core Mix',
        resp: 'Daily Routine',
        edu: 'Edu / Exp',
        skill: 'Key Skills',
        trait: 'Traits',
        salary: 'Salary & Path'
      }
    },
    p4: {
      title: 'Elite Team',
      subtitle: 'Work with the brightest minds'
    },
    p4_5: {
      title: 'Term Decoder',
      subtitle: 'Essential Vocabulary for Supply Chain & Product Management',
      flip_hint: 'Click card to flip'
    },
    p5: {
      title: 'Potential Test',
      subtitle: 'AI Analysis of your Supply Chain DNA',
      question: 'Scenario',
      result_title: 'Analysis Complete',
      result_desc: 'According to the algorithm, your best fit is:',
      restart: 'Restart',
      next_step: 'Go to Challenge',
      cheat_sheet: 'Term Decoder'
    },
    p6: {
      title: 'Join Us',
      game_title: 'Interview Challenge',
      game_desc: 'Answer correctly to get priority interview! (OTD > 97% is your goal)',
      form_title: 'Submit Resume',
      name: 'Name',
      email: 'Email',
      msg: 'Message to Us',
      submit: 'Submit',
      success: 'Submitted! Remember to highlight your OTD achievement in your resume!'
    }
  }
};

const ROLES = {
  SA11425: 'SA11425',
  SA10023: 'SA10023',
  SA10125: 'SA10125',
  AD11903: 'AD11903'
};

const JOB_DATA = {
  [ROLES.SA11425]: {
    code: 'SA11425',
    icon: <Package size={40} />,
    title_zh: 'Fulfillment PM (機構/料件)', title_en: 'Fulfillment PM (Mech)',
    category_zh: '供應鏈管理', category_en: 'Supply Chain Mgmt',
    color: 'from-orange-400 to-red-500',
    focus_zh: '溝通 60% / 數據 30% / 邏輯 10%', focus_en: 'Comm 60% / Data 30% / Logic 10%',
    resp_zh: ['08:00 晨會產能確認', '10:00 Tooling 追蹤', '14:00 異常應變'],
    resp_en: ['08:00 Capacity Check', '10:00 Tooling Tracking', '14:00 Emergency Response'],
    edu_zh: '大學、碩士 (商管可)', edu_en: 'Bachelor/Master (Business ok)',
    skill_zh: ['Excel (Pivot/VBA)', '跨部門協調', 'NPIMP 流程'],
    skill_en: ['Excel (Pivot/VBA)', 'Cross-dept Comm', 'NPIMP Flow'],
    trait_zh: '抗壓性高 (9hr戰鬥)', trait_en: 'High Resilience',
    salary_zh: '月薪 30K-52K (2-3年升 PMM)', salary_en: '30K-52K/mo (PMM in 2-3yrs)',
    chibi: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 animate-bounce">
         <rect x="20" y="30" width="60" height="50" rx="5" fill="#FB923C" />
         <path d="M 20 30 L 50 50 L 80 30" stroke="#7C2D12" strokeWidth="2" fill="none"/>
         <rect x="30" y="20" width="40" height="10" fill="#FDBA74" />
         <text x="35" y="65" fontSize="8" fill="white" fontWeight="bold">OTD&gt;97%</text>
         <circle cx="50" cy="55" r="5" fill="#FFF" />
      </svg>
    )
  },
  [ROLES.SA10023]: {
    code: 'SA10023',
    icon: <TrendingUp size={40} />,
    title_zh: 'Fulfillment PM (主機板)', title_en: 'Fulfillment PM (MB)',
    category_zh: '產銷協調', category_en: 'Operation',
    color: 'from-blue-400 to-indigo-500',
    focus_zh: '數據 50% / 溝通 40% / 系統 10%', focus_en: 'Data 50% / Comm 40% / Sys 10%',
    resp_zh: ['滾動式預測 (Rolling Forecast)', 'Dashboard 報告', '庫存水位監控'],
    resp_en: ['Rolling Forecast', 'Dashboard Reporting', 'Inventory Monitoring'],
    edu_zh: '大學以上 (依能力敘薪)', edu_en: 'Bachelor+ (Based on ability)',
    skill_zh: ['Excel (高階樞紐)', '數據敏感度', 'Power BI'],
    skill_en: ['Excel (Adv Pivot)', 'Data Sensitivity', 'Power BI'],
    trait_zh: '對數字敏感、邏輯清晰', trait_en: 'Number Sensitive, Logical',
    salary_zh: '月薪 30K-52K (年終1-3個月)', salary_en: '30K-52K/mo (1-3mo Bonus)',
    chibi: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 animate-pulse">
        <circle cx="50" cy="40" r="20" fill="#3B82F6" />
        <rect x="35" y="60" width="30" height="25" rx="3" fill="#60A5FA" />
        <rect x="40" y="65" width="5" height="15" fill="#1E40AF" />
        <rect x="55" y="65" width="5" height="15" fill="#1E40AF" />
      </svg>
    )
  },
  [ROLES.SA10125]: {
    code: 'SA10125',
    icon: <Briefcase size={40} />,
    title_zh: 'Product Manager (PM)', title_en: 'Product Manager',
    category_zh: '產品策略', category_en: 'Product Strategy',
    color: 'from-purple-400 to-pink-500',
    focus_zh: '策略 40% / 溝通 35% / 數據 25%', focus_en: 'Strategy 40% / Comm 35% / Data 25%',
    resp_zh: ['產品 Roadmap 規劃', '客戶訪談與反饋', '跨部門協調'],
    resp_en: ['Product Roadmap', 'Customer Interviews', 'Cross-dept Alignment'],
    edu_zh: '大學以上 (MBA加分)', edu_en: 'Bachelor+ (MBA preferred)',
    skill_zh: ['User Story 撰寫', '市場分析', 'Agile/Scrum'],
    skill_en: ['User Story Writing', 'Market Analysis', 'Agile/Scrum'],
    trait_zh: '創新思維、決策力強', trait_en: 'Innovative, Strong Decision-making',
    salary_zh: '月薪 35K-60K (P&L 責任)', salary_en: '35K-60K/mo (P&L Owner)',
    chibi: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 animate-bounce">
        <rect x="25" y="20" width="50" height="60" rx="5" fill="#A855F7" />
        <circle cx="35" cy="35" r="3" fill="#FFF" />
        <circle cx="50" cy="35" r="3" fill="#FFF" />
        <circle cx="65" cy="35" r="3" fill="#FFF" />
        <line x1="30" y1="50" x2="70" y2="50" stroke="#FFF" strokeWidth="2" />
      </svg>
    )
  },
  [ROLES.AD11903]: {
    code: 'AD11903',
    icon: <Cog size={40} />,
    title_zh: 'System Analyst (SA)', title_en: 'System Analyst',
    category_zh: '系統規劃', category_en: 'System Planning',
    color: 'from-green-400 to-emerald-500',
    focus_zh: '邏輯 50% / 數據 35% / 溝通 15%', focus_en: 'Logic 50% / Data 35% / Comm 15%',
    resp_zh: ['User Story 轉換', '系統規格定義', '流程最佳化'],
    resp_en: ['User Story Conversion', 'System Spec Definition', 'Process Optimization'],
    edu_zh: '大學以上 (資訊背景佳)', edu_en: 'Bachelor+ (IT background preferred)',
    skill_zh: ['系統思維', 'SQL/Database', '流程圖繪製'],
    skill_en: ['Systems Thinking', 'SQL/Database', 'Process Mapping'],
    trait_zh: '邏輯嚴謹、細心', trait_en: 'Logical, Meticulous',
    salary_zh: '月薪 28K-48K (技術加薪)', salary_en: '28K-48K/mo (Tech Bonus)',
    chibi: (
      <svg viewBox="0 0 100 100" className="w-32 h-32 animate-spin-slow">
        <circle cx="50" cy="50" r="30" fill="none" stroke="#10B981" strokeWidth="3" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#34D399" strokeWidth="2" />
        <circle cx="50" cy="50" r="5" fill="#10B981" />
      </svg>
    )
  }
};

const TEAM_MEMBERS = [
  { 
    name: '古凱升 Kai Kusuma', 
    role_zh: 'Team Lead (組長)', role_en: 'Team Lead',
    desc_zh: '國企系4年級 (111212037)。負責統粌、影片與腳本製作、分析、參與拍摔。', 
    desc_en: 'IBS (111212037). Coordination, Video & Script, Analysis, Filming.', 
    color: 'bg-orange-500',
    avatar: '/images/kai.png'
  },
  { 
    name: '林雨柔 Olivia Lin', 
    role_zh: 'Web Designer (網頁設計)', role_en: 'Web Designer',
    desc_zh: '電機系4年級 (111323079)。負責網頁設計與製作、參與拍摔。', 
    desc_en: 'EE4(111323079). Web Design & Dev, Filming.', 
    color: 'bg-blue-500',
    avatar: '/images/olivia.png'
  },
  { 
    name: '王怡婷 Tina Wang', 
    role_zh: 'Content Creator (內容製作)', role_en: 'Content Creator',
    desc_zh: '國企系3年級 (112212015)。負責影片與腳本製作、職務分析、參與拍摔。', 
    desc_en: 'IBS3 (112212015). Video & Script, Job Analysis, Filming.', 
    color: 'bg-purple-500',
    avatar: '/images/tina.png'
  },
  { 
    name: '張博凱 Sinclair Chang', 
    role_zh: 'Web Developer (網頁開發)', role_en: 'Web Developer',
    desc_zh: '財金系2年級 (113214066)。負責網頁設計與製作、參與拍摔。', 
    desc_en: 'FIN2(113214066). Web Design & Dev, Filming.', 
    color: 'bg-green-500',
    avatar: '/images/sinclair.png'
  }
];

const GLOSSARY_TERMS = [
  {
    term_en: 'User-centric thinking',
    term_zh: '以用戶為中心的思維',
    definition_en: 'Designing products or services with the user\'s needs and experience as the primary focus.',
    definition_zh: '設計產品或服務時，將用戶需求與體驗放在首位。'
  },
  {
    term_en: 'Gaming ecosystem',
    term_zh: '遊戲生態系統',
    definition_en: 'The interconnected network of games, platforms, players, and services that support gaming.',
    definition_zh: '支撐遊戲的互聯網絡，包括遊戲、平台、玩家與相關服務。'
  },
  {
    term_en: 'Real-time resource management',
    term_zh: '即時資源管理',
    definition_en: 'Monitoring and adjusting resources immediately as needs or conditions change.',
    definition_zh: '隨著需求或情況變化，立即監控並調整資源。'
  },
  {
    term_en: 'NPIMP Flow',
    term_zh: 'NPIMP 流程',
    definition_en: 'A specific workflow or process framework (likely context-specific; typically refers to planning or operational flow).',
    definition_zh: '特定的工作流程或操作框架（通常與規劃或運營相關，需依情境理解）。'
  },
  {
    term_en: 'Rolling Forecast',
    term_zh: '滾動預測',
    definition_en: 'Continuously updated financial or operational forecasts, extending beyond fixed periods.',
    definition_zh: '持續更新的財務或運營預測，不受固定期間限制。'
  },
  {
    term_en: 'Dashboard Reporting',
    term_zh: '儀表板報告',
    definition_en: 'Visual displays of key metrics and data for quick insights and monitoring.',
    definition_zh: '將關鍵數據和指標以視覺化呈現，便於快速了解與監控。'
  },
  {
    term_en: 'Power BI',
    term_zh: 'Power BI 工具',
    definition_en: 'Microsoft\'s business analytics tool for creating interactive reports and dashboards.',
    definition_zh: '微軟的商業分析工具，用於製作互動式報告與儀表板。'
  },
  {
    term_en: 'User Story',
    term_zh: '使用者故事',
    definition_en: 'A brief description of a software feature from an end-user perspective, used in Agile development.',
    definition_zh: '從終端用戶角度簡短描述軟體功能，用於敏捷開發。'
  },
  {
    term_en: 'Agile/Scrum',
    term_zh: '敏捷/Scrum',
    definition_en: 'Agile: iterative, flexible project management approach; Scrum: a structured framework within Agile for organizing work into sprints.',
    definition_zh: '敏捷：迭代、靈活的專案管理方法；Scrum：敏捷框架下，按短週期（Sprint）組織工作的方式。'
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 0,
    q_zh: '你遇到供應鏈延遲，會怎麼辦？',
    q_en: 'You encounter a supply chain delay. What do you do?',
    options: [
      { text_zh: '立即與客戶溝通，說明狀況', text_en: 'Communicate with customers immediately', score: ROLES.SA11425 },
      { text_zh: '分析數據找出根本原因', text_en: 'Analyze data to find root cause', score: ROLES.SA10023 },
      { text_zh: '評估市場影響，調整策略', text_en: 'Assess market impact, adjust strategy', score: ROLES.SA10125 },
      { text_zh: '檢查系統參數是否設定錯誤', text_en: 'Check system parameters', score: ROLES.AD11903 },
    ]
  },
  {
    id: 1,
    q_zh: '你覺得自己最大的優勢是？(核心能力占比)',
    q_en: 'What is your biggest strength? (Core mix)',
    options: [
      { text_zh: '溝通協調 (60%) - 喜歡跟人喬事情', text_en: 'Communication (60%) - Negotiation', score: ROLES.SA11425 },
      { text_zh: '數據分析 (30%) - Excel/Pivot Table 是強項', text_en: 'Data Analysis (30%) - Excel Expert', score: ROLES.SA10023 },
      { text_zh: '市場洞察 - 喜歡研究競品與策略', text_en: 'Market Insight - Strategy & Trends', score: ROLES.SA10125 },
      { text_zh: '邏輯優化 - 喜歡改善流程與系統', text_en: 'Logic Optimization - Process Improvement', score: ROLES.AD11903 },
    ]
  },
  {
    id: 2,
    q_zh: '關於「工作日常」，你比較能接受哪種挑戰？',
    q_en: 'Which daily challenge fits you?',
    options: [
      { text_zh: '08:00 晨會確認產能，隨時應對突發狀況', text_en: '08:00 Morning meeting, handling emergencies', score: ROLES.SA11425 },
      { text_zh: '整天盯著 Dashboard，對數字極度敏感', text_en: 'Staring at Dashboard, sensitive to numbers', score: ROLES.SA10023 },
      { text_zh: '籌辦大型展覽，規劃產品 Roadmap', text_en: 'Organizing expos, planning Roadmap', score: ROLES.SA10125 },
      { text_zh: '將業務需求轉化為系統規格 (User Story)', text_en: 'Translating needs to User Stories', score: ROLES.AD11903 },
    ]
  },
  {
    id: 3,
    q_zh: '對於未來的「職涯路徑」，你期待的是？',
    q_en: 'What is your expected career path?',
    options: [
      { text_zh: '2-3年升 PMM，成為供應鏈經理', text_en: 'PMM in 2-3 yrs, SC Manager', score: ROLES.SA11425 },
      { text_zh: '成為數據營運專家，轉任 Sales PM', text_en: 'Data Ops Expert -> Sales PM', score: ROLES.SA10023 },
      { text_zh: '負責產品 P&L，掌握產品生殺大權', text_en: 'Own Product P&L', score: ROLES.SA10125 },
      { text_zh: '成為數位轉型顧問或 IT 主管', text_en: 'Digital Transformation Consultant', score: ROLES.AD11903 },
    ]
  }
];

const INTERVIEW_QA = [
  { q_zh: '華碩的核心競爭力是什麼？', q_en: 'What is ASUS\'s core competency?', options: [{ text_zh: '創新與品質', text_en: 'Innovation & Quality' }, { text_zh: '成本領導', text_en: 'Cost Leadership' }, { text_zh: '市場佔有率', text_en: 'Market Share' }], correct: 0 },
  { q_zh: 'PM 的首要責任是什麼？', q_en: 'What is a PM\'s primary responsibility?', options: [{ text_zh: '編寫程式碼', text_en: 'Write Code' }, { text_zh: '定義產品方向', text_en: 'Define Product Direction' }, { text_zh: '管理預算', text_en: 'Manage Budget' }], correct: 1 },
  { q_zh: 'User Story 的格式是什麼？', q_en: 'What is the format of a User Story?', options: [{ text_zh: 'As a [role], I want [feature], so that [benefit]', text_en: 'As a [role], I want [feature], so that [benefit]' }, { text_zh: '作為[角色]，我想要[功能]，以便[好處]', text_en: 'System needs [feature]' }, { text_zh: '系統需要[功能]', text_en: 'System needs [feature]' }], correct: 0 },
  { q_zh: '敏捷開發的衝刺週期通常是多長？', q_en: 'How long is a typical Agile sprint?', options: [{ text_zh: '1 週', text_en: '1 week' }, { text_zh: '2 週', text_en: '2 weeks' }, { text_zh: '4 週', text_en: '4 weeks' }], correct: 1 },
  { q_zh: 'OTD 代表什麼？', q_en: 'What does OTD stand for?', options: [{ text_zh: '按時交貨', text_en: 'On-Time Delivery' }, { text_zh: '按時開發', text_en: 'On-Time Development' }, { text_zh: '訂單追蹤', text_en: 'Order Tracking' }], correct: 0 }
];



/**
 * ------------------------------------------------------------------
 * 2. COMPONENTS (頁面與邏輯)
 * ------------------------------------------------------------------
 */



const Page3_Jobs = ({ isZh, t, darkMode, cardClass }: any) => {
    const [selectedRole1, setSelectedRole1] = useState("PM");
    const [selectedRole2, setSelectedRole2] = useState("PMM");
    const roleOptions = Object.keys(JOB_DATA).map(key => ({

      value: key,
      label: isZh ? JOB_DATA[key as keyof typeof JOB_DATA].title_zh : JOB_DATA[key as keyof typeof JOB_DATA].title_en
    }));

    const renderComparisonRow = (label: string, dataKey: string, isList = false) => {
      const data1 = JOB_DATA[selectedRole1];
      const data2 = JOB_DATA[selectedRole2];
      
      // Handle language switching for data access
      const val1 = isZh ? (data1 as any)[dataKey + '_zh'] : (data1 as any)[dataKey + '_en'];
      const val2 = isZh ? (data2 as any)[dataKey + '_zh'] : (data2 as any)[dataKey + '_en'];

      return (
        <div className="grid grid-cols-3 gap-4 py-6 border-b border-gray-500/20 last:border-0">
          <div className="col-span-3 md:col-span-1 font-bold opacity-60 flex items-center">{label}</div>
          <div className="col-span-3 md:col-span-1">
             {isList ? (
               <ul className="space-y-1 list-disc list-inside text-sm">
                 {(val1 as string[]).map((item: string, i: number) => <li key={i}>{item}</li>)}
               </ul>
             ) : (
               <div className="text-lg font-medium">{val1}</div>
             )}
          </div>
          <div className="col-span-3 md:col-span-1">
             {isList ? (
               <ul className="space-y-1 list-disc list-inside text-sm">
                 {(val2 as string[]).map((item: string, i: number) => <li key={i}>{item}</li>)}
               </ul>
             ) : (
               <div className="text-lg font-medium">{val2}</div>
             )}
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-8 pb-20">
        <h2 className="text-4xl font-bold">{t.p3.title}</h2>
        <p className="opacity-60">{t.p3.subtitle}</p>

        {/* Selectors */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Selector 1 */}
          <div className="relative group">
            <label className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 block">{t.p3.select_1}</label>
            <div className="relative">
              <select 
                value={selectedRole1}
                onChange={(e) => setSelectedRole1(e.target.value)}
                className={`w-full p-3 pl-4 pr-10 rounded-xl appearance-none outline-none cursor-pointer font-bold text-lg transition-all
                  ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-900'}
                `}
              >
                {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
            </div>
          </div>

          {/* VS Icon (Desktop only) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cyan-500 items-center justify-center font-black text-white italic shadow-lg z-10">
            VS
          </div>

          {/* Selector 2 */}
          <div className="relative group">
            <label className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 block">{t.p3.select_2}</label>
            <div className="relative">
              <select 
                value={selectedRole2}
                onChange={(e) => setSelectedRole2(e.target.value)}
                className={`w-full p-3 pl-4 pr-10 rounded-xl appearance-none outline-none cursor-pointer font-bold text-lg transition-all
                  ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-900'}
                `}
              >
                {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Visual Comparison Area */}
        <div className="max-w-5xl mx-auto w-full px-4 animate-fade-in-up">
          
          {/* Header Images */}
          <div className="grid grid-cols-2 gap-8 mb-12 text-center">
             <div className="flex flex-col items-center gap-4">
                <div className={`p-6 rounded-[2rem] bg-gradient-to-br ${JOB_DATA[selectedRole1].color} shadow-2xl transform hover:scale-105 transition-transform duration-500`}>
                  {React.cloneElement(JOB_DATA[selectedRole1].icon, { size: 64, className: 'text-white' })}
                </div>
                <div className="mt-2 text-sm opacity-60 font-mono">{JOB_DATA[selectedRole1].code}</div>
             </div>
             <div className="flex flex-col items-center gap-4">
                <div className={`p-6 rounded-[2rem] bg-gradient-to-br ${JOB_DATA[selectedRole2].color} shadow-2xl transform hover:scale-105 transition-transform duration-500`}>
                  {React.cloneElement(JOB_DATA[selectedRole2].icon, { size: 64, className: 'text-white' })}
                </div>
                <div className="mt-2 text-sm opacity-60 font-mono">{JOB_DATA[selectedRole2].code}</div>
             </div>
          </div>

          {/* Comparison Table */}
          <div className={`rounded-3xl p-8 ${cardClass}`}>
            {renderComparisonRow(t.p3.headers.focus, 'focus')}
            {renderComparisonRow(t.p3.headers.salary, 'salary')}
            {renderComparisonRow(t.p3.headers.resp, 'resp', true)}
            {renderComparisonRow(t.p3.headers.skill, 'skill', true)}
            {renderComparisonRow(t.p3.headers.edu, 'edu')}
            {renderComparisonRow(t.p3.headers.trait, 'trait')}
          </div>

        </div>
      </div>
    );
  }

const Page4_Team = ({ isZh, t, darkMode, cardClass }: any) => {
    const [selectedCard, setSelectedCard] = useState(0);
    const accentText = darkMode ? 'text-cyan-400' : 'text-blue-600';
    const primaryBtn = `px-6 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/50 shadow-lg' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 shadow-lg'}`;
    const nextPage = () => {};
    return (
      <div className="flex flex-col pb-20">
        <h2 className="text-4xl font-bold mb-8 text-center">{t.p4.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <div key={idx} className={`relative group overflow-hidden rounded-3xl h-80 ${cardClass}`}>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${member.color}`}></div>
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-gray-500/10 to-transparent"></div>
              <div className="flex flex-col items-center justify-center h-full p-6 text-center z-10 relative">
                <div className={`w-24 h-24 rounded-full mb-4 border-4 border-white/10 shadow-xl overflow-hidden bg-gradient-to-tr ${member.color} flex items-center justify-center text-3xl font-bold text-white`}>
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className={`text-sm font-semibold mb-2 ${accentText}`}>{isZh ? member.role_zh : member.role_en}</p>
                <p className="text-sm opacity-60 leading-relaxed">
                  {isZh ? member.desc_zh : member.desc_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

const Page4_5_TermDecoder = ({ isZh, t, darkMode, cardClass }: any) => {
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    return (
      <div className="flex flex-col pb-20">
        <h2 className="text-4xl font-bold mb-4 text-center">{t.p4_5.title}</h2>
        <p className="text-center opacity-60 mb-12 text-lg">{t.p4_5.subtitle}</p>
        <p className="text-center opacity-50 mb-8 text-sm">{t.p4_5.flip_hint}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {GLOSSARY_TERMS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCard(selectedCard === idx ? null : idx)}
              // Fixed: using selectedCard instead of flipped
              className={`h-64 rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                selectedCard === idx
                  ? 'shadow-2xl shadow-cyan-500/50'
                  : 'shadow-lg hover:shadow-cyan-500/30'
              } ${cardClass}`}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d' as any,
                transform: selectedCard === idx ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.6s'
              }}
            >
              {selectedCard === idx ? (
                <div className="p-6 h-full flex flex-col justify-center" style={{ transform: 'rotateY(180deg)' }}>
                  <p className="text-sm leading-relaxed opacity-80">{isZh ? item.definition_zh : item.definition_en}</p>
                </div>
              ) : (
                <div className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <h3 className="text-xl font-bold mb-2">{isZh ? item.term_zh : item.term_en}</h3>
                  <p className="text-xs opacity-50">👇 {isZh ? '點擊查看定義' : 'Click to see definition'}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

const Page5_Quiz = ({ isZh, t, darkMode, cardClass, userName }: any) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
    const [quizResult, setQuizResult] = useState<any>(null);
    const [quizScores, setQuizScores] = useState<Record<string, number>>({});
    const [quizStep, setQuizStep] = useState(0);
    const primaryBtn = `px-6 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/50 shadow-lg' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 shadow-lg'}`;
    const accentText = darkMode ? 'text-cyan-400' : 'text-blue-600';
    const handleAnswer = (roleScore: string) => {
      const newScores = { ...quizScores, [roleScore]: quizScores[roleScore] + 1 };
      setQuizScores(newScores);
      if (quizStep < QUIZ_QUESTIONS.length - 1) {
        setQuizStep(prev => prev + 1);
      } else {
        const winner = Object.keys(newScores).reduce((a: string, b: string) => newScores[a as keyof typeof newScores] > newScores[b as keyof typeof newScores] ? a : b);
        setQuizResult(winner as (keyof typeof JOB_DATA));
      }
    };

    const resetQuiz = () => {
      setQuizStep(0);
      setQuizScores({ [ROLES.SA11425]: 0, [ROLES.SA10023]: 0, [ROLES.SA10125]: 0, [ROLES.AD11903]: 0 });
      setQuizResult(null);
    };

    if (quizResult) {
      const resultData = JOB_DATA[quizResult];
      if (!resultData) {
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center pb-20">
            <p className="text-xl opacity-60">Loading result...</p>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in-up pb-20">
           <div className={`relative p-10 rounded-[3rem] ${cardClass} max-w-lg w-full overflow-visible`}>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 filter drop-shadow-xl">
                {resultData.chibi}
              </div>
              <h3 className="text-xl font-bold mt-16 text-slate-400 tracking-widest uppercase">{t.p5.result_desc}</h3>
              <h2 className={`text-4xl md:text-5xl font-black my-4 bg-clip-text text-transparent bg-gradient-to-r ${resultData.color}`}>
                {isZh ? resultData.title_zh : resultData.title_en}
              </h2>
              <p className="text-sm opacity-60 mb-8">{resultData.code} - {isZh ? resultData.category_zh : resultData.category_en}</p>
              <div className="flex gap-4 justify-center mt-4">
                <button onClick={resetQuiz} className="px-6 py-2 rounded-full border border-slate-500/50 hover:bg-slate-500/10 transition">
                  {t.p5.restart}
                </button>
                <button onClick={() => {}} className={primaryBtn}>
                  {t.p5.next_step}
                </button>
              </div>
           </div>
        </div>
      );
    }

    const currentQ = QUIZ_QUESTIONS[quizStep];

    return (
      <div className="flex flex-col gap-8 pb-20">
        <h2 className="text-4xl font-bold">{t.p5.title}</h2>
        <p className="opacity-60">{t.p5.subtitle}</p>

        <div className={`rounded-3xl p-8 ${cardClass} animate-fade-in-up`}>
          <h3 className="text-2xl font-bold mb-6">{t.p5.question} {quizStep + 1} / {QUIZ_QUESTIONS.length}</h3>
          <p className="text-lg mb-8">{isZh ? currentQ.q_zh : currentQ.q_en}</p>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.score)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500'
                    : 'bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-blue-500'
                }`}
              >
                {isZh ? opt.text_zh : opt.text_en}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }




const Page6_Interview = ({ isZh, t, darkMode, cardClass, userName }: any) => {
    const [gameActive, setGameActive] = useState<number | null>(0);
    const [formSent, setFormSent] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Record<string, number>>({}); 
    const accentText = darkMode ? 'text-cyan-400' : 'text-blue-600';
    const primaryBtn = `px-6 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/50 shadow-lg' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 shadow-lg'}`;
    const quizResult = userAnswers ? Object.values(userAnswers).length > 0 ? 'PM' : null : null;

    const handleAnswerClick = (qIdx: number, optIdx: number) => {
      if (userAnswers[qIdx.toString()] !== undefined) return;
      setUserAnswers(prev => ({ ...prev, [qIdx.toString()]: optIdx }));
    };

    const correctCount = Object.keys(userAnswers).filter((qIdx: string) => {
      return userAnswers[qIdx] === INTERVIEW_QA[parseInt(qIdx)].correct;
    }).length;
    const progress = (Object.keys(userAnswers).length / INTERVIEW_QA.length) * 100;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
        <div className="flex flex-col gap-6">
          <div className={`p-8 rounded-3xl ${cardClass} flex-1`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{t.p6.game_title}</h3>
                <p className="text-sm opacity-60">{t.p6.game_desc}</p>
              </div>
              <div className="ml-auto flex flex-col items-end">
                <span className="text-sm font-bold opacity-60">Score</span>
                <span className={`text-2xl font-black ${correctCount === INTERVIEW_QA.length ? 'text-green-500' : accentText}`}>
                  {correctCount * 20} / 100
                </span>
              </div>
            </div>

            <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
               <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="space-y-4">
              {INTERVIEW_QA.map((q, idx) => {
                const isAnswered = userAnswers[idx.toString()] !== undefined;
                const isCorrect = isAnswered && userAnswers[idx.toString()] === q.correct;
                const isOpen = gameActive === idx;

                return (
                  <div key={idx} className={`border rounded-2xl overflow-hidden transition-all ${darkMode ? 'border-slate-600' : 'border-gray-300'} ${isAnswered ? (isCorrect ? 'border-green-500/50' : 'border-red-500/50') : ''}`}>
                     <button 
                      onClick={() => setGameActive(isOpen ? null : idx) as any}
                      className="w-full p-4 text-left flex justify-between items-start gap-4 hover:bg-slate-500/5"
                     >
                       <div className="flex items-start gap-3">
                          <div className={`mt-1 min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                            ${isAnswered ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-slate-500/30'}
                          `}>
                            {isAnswered ? (isCorrect ? '✓' : '✗') : idx + 1}
                          </div>
                          <div>
                            <p className="font-bold">{isZh ? q.q_zh : q.q_en}</p>
                            {isAnswered && (
                              <p className={`text-xs mt-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                {isCorrect ? '✓ Correct' : '✗ Wrong'}
                              </p>
                            )}
                          </div>
                       </div>
                       <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                     </button>
                     {isOpen && (
                       <div className="px-4 pb-4 space-y-2 border-t border-slate-600/50">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswerClick(idx, optIdx)}
                              disabled={isAnswered}
                              className={`w-full p-3 rounded-lg text-left text-sm transition ${
                                isAnswered
                                  ? optIdx === q.correct
                                    ? 'bg-green-500/20 border border-green-500/50 text-green-100'
                                    : optIdx === userAnswers[idx.toString()]
                                    ? 'bg-red-500/20 border border-red-500/50 text-red-100'
                                    : 'opacity-30'
                                  : 'hover:bg-slate-500/10 border border-slate-600/30 hover:border-slate-500'
                              } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              {isZh ? opt.text_zh : opt.text_en}
                            </button>
                          ))}
                       </div>
                     )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {!formSent ? (
            <>
              <div className={`p-8 rounded-3xl ${cardClass} flex-1`}>
                <h3 className="text-2xl font-bold mb-6">{t.p6.form_title}</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setFormSent(true); }}>
                  <div>
                    <label className="block text-sm font-bold mb-2 opacity-70">{t.p6.name}</label>
                    <input type="text" defaultValue={userName} className="w-full p-3 rounded-xl bg-slate-500/10 border border-transparent focus:border-cyan-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 opacity-70">{t.p6.email}</label>
                    <input type="email" className="w-full p-3 rounded-xl bg-slate-500/10 border border-transparent focus:border-cyan-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 opacity-70">{t.p6.msg}</label>
                    <textarea rows={4} className="w-full p-3 rounded-xl bg-slate-500/10 border border-transparent focus:border-cyan-500 outline-none" placeholder={quizResult ? `Applying for: ${quizResult}` : ''}></textarea>
                  </div>
                  <button type="submit" className={`${primaryBtn} w-full flex justify-center items-center gap-2 mt-4`}>
                    {t.p6.submit} <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full animate-fade-in-up">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6">
                <Check size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{isZh ? "收到！" : "Received!"}</h3>
              <p className="opacity-60">{t.p6.success}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

export default function App() {
  const [page, setPage] = useState(0);
  const [lang, setLang] = useState('zh'); // 'zh' or 'en'
  const [darkMode, setDarkMode] = useState(true);
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const t = TEXT[lang as keyof typeof TEXT];
  const isZh = lang === 'zh';

  // 選單項目 (只包含前兩頁)
  // Add missing text properties to TEXT object
  const textWithDefaults = {
    ...t,
    p3: t.p3 || { title: '職位透視' },
    p4: t.p4 || { title: '菁英團隊' },
    p4_5: t.p4_5 || { title: '術語白話文' },
    p5: t.p5 || { title: '潛能測驗' },
    p6: t.p6 || { title: '加入我們' }
  };

  const menuItems = [
    { index: 0, label: isZh ? '首頁' : 'Home' },
    { index: 1, label: t.p2.title },
    { index: 2, label: t.p3.title },
    { index: 3, label: t.p4.title },
    { index: 4, label: t.p4_5.title },
    { index: 5, label: t.p5.title },
    { index: 6, label: t.p6.title },
  ];

  // 切換功能
  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleLang = () => setLang(l => l === 'zh' ? 'en' : 'zh');
  const nextPage = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(p => p + 1);
  };
  const prevPage = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(p => Math.max(0, p - 1));
  };

  // 全域樣式
  const themeClass = darkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-slate-900';
  const cardClass = darkMode 
    ? 'bg-slate-900/60 border border-slate-700 backdrop-blur-md shadow-lg shadow-cyan-500/10' 
    : 'bg-white/80 border border-gray-200 backdrop-blur-md shadow-xl shadow-blue-500/5';
  const primaryBtn = `px-6 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-cyan-500/50 shadow-lg' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 shadow-lg'}`;
  
  // --- PAGE 1: Landing Page ---
  const Page1_Landing = () => {
    const [localName, setLocalName] = useState(userName);
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 relative overflow-hidden">
        <div className={`absolute top-20 left-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob ${darkMode ? 'bg-purple-500' : 'bg-blue-300'}`}></div>
        <div className={`absolute top-40 right-10 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 ${darkMode ? 'bg-cyan-500' : 'bg-pink-300'}`}></div>

        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-fade-in-up">
          ASUS Portal
        </h1>
        <p className={`text-xl md:text-2xl mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'} animate-fade-in-up delay-100`}>
          {t.p1.subtitle}
        </p>

        <div className="w-full max-w-md space-y-6 animate-fade-in-up delay-200 z-10">
          <div className="relative group">
            <input 
              type="text" 
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder={t.p1.placeholder}
              className={`w-full p-4 text-center text-lg rounded-2xl outline-none transition-all duration-300 border-2 ${darkMode ? 'bg-slate-800/50 border-slate-700 focus:border-cyan-400 text-white placeholder-slate-500' : 'bg-white border-gray-200 focus:border-blue-500 text-gray-800'}`}
            />
            <div className={`absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>
          </div>
          
          <button 
            onClick={() => {
              if (localName.trim()) {
                setUserName(localName);
                nextPage();
              } else {
                alert(isZh ? "請輸入姓名" : "Please enter your name");
              }
            }}
            className={`${primaryBtn} w-full text-lg flex items-center justify-center gap-2`}
          >
            {t.p1.btn} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  // --- PAGE 2: About / Video Interview ---
  const Page2_About = () => {
    const [player, setPlayer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [apiLoaded, setApiLoaded] = useState(false);
    const transcriptRef = useRef(null);
    const videoId = "6Kf0C5FjTOk"; 

    // Load YouTube API
    useEffect(() => {
      if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        if ((window as any).YT && (window as any).YT.Player) {
          setApiLoaded(true);
        } else {
          (window as any).onYouTubeIframeAPIReady = () => setApiLoaded(true);
        }
        return;
      }

      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      
      (window as any).onYouTubeIframeAPIReady = () => {
        setApiLoaded(true);
      };
    }, []);

    // Initialize Player
    useEffect(() => {
      const container = document.getElementById('youtube-player');
      if (apiLoaded && !player && container) {
        try {
          const newPlayer = new (window as any).YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
              'playsinline': 1,
              'controls': 1
            },
            events: {
              'onError': (e: any) => console.error("YouTube Player Error:", e)
            }
          });
          setPlayer(newPlayer);
        } catch (error) {
          console.error("Error initializing YouTube player:", error);
        }
      }
    }, [apiLoaded, player]);

    // Timer for Current Time
    useEffect(() => {
      const interval = setInterval(() => {
        if (player && (player as any).getCurrentTime && typeof (player as any).getCurrentTime === 'function') {
          try {
            const time = (player as any).getCurrentTime();
            setCurrentTime(time);
          } catch (e) {}
        }
      }, 500); 

      return () => clearInterval(interval);
    }, [player]);

    // Auto-scroll Transcript
    useEffect(() => {
      if (!transcriptRef.current) return;
      
      const activeIndex = TRANSCRIPT_DATA.findIndex(
        item => currentTime >= item.start && currentTime < item.end
      );

      if (activeIndex !== -1) {
        const activeElement = (transcriptRef.current as any)?.children?.[activeIndex];
        if (activeElement) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, [currentTime]);

    const handleJumpToTime = (time: number) => {
      if (player && (player as any).seekTo) {
        (player as any).seekTo(time, true);
        (player as any).playVideo();
      }
    };

    return (
      <div className="flex flex-col gap-6 pb-20">
        <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <span className="w-2 h-12 bg-cyan-500 rounded-full"></span>
          {t.p2.title} <span className="text-sm font-normal opacity-50 ml-auto">User: {userName}</span>
        </h2>

        {/* Freshman Guide - Strategic Content */}
        <div className="w-full p-6 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-4 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <GraduationCap size={100} />
           </div>
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-500">
             <BookOpen size={20}/> {t.p2.freshman_guide.title}
           </h3>
           <div className="flex flex-col md:flex-row gap-4 justify-between items-center text-sm">
              <div className="flex-1 text-center p-3 rounded-xl bg-white/5 border border-white/10 w-full">
                <div className="font-bold text-lg mb-1">{t.p2.freshman_guide.step1.title}</div>
                <div className="opacity-70 whitespace-pre-wrap">{t.p2.freshman_guide.step1.desc}</div>
              </div>
              <ArrowRight className="hidden md:block opacity-30" />
              <div className="flex-1 text-center p-3 rounded-xl bg-white/5 border border-white/10 w-full">
                <div className="font-bold text-lg mb-1">{t.p2.freshman_guide.step2.title}</div>
                <div className="opacity-70 whitespace-pre-wrap">{t.p2.freshman_guide.step2.desc}</div>
              </div>
              <ArrowRight className="hidden md:block opacity-30" />
              <div className="flex-1 text-center p-3 rounded-xl bg-white/5 border border-white/10 w-full">
                <div className="font-bold text-lg mb-1">{t.p2.freshman_guide.step3.title}</div>
                <div className="opacity-70 whitespace-pre-wrap">{t.p2.freshman_guide.step3.desc}</div>
              </div>
              <ArrowRight className="hidden md:block opacity-30" />
              <div className="flex-1 text-center p-3 rounded-xl bg-white/5 border border-white/10 w-full">
                <div className="font-bold text-lg mb-1">{t.p2.freshman_guide.step4.title}</div>
                <div className="opacity-70 whitespace-pre-wrap">{t.p2.freshman_guide.step4.desc}</div>
              </div>
           </div>
        </div>

        {/* Video & Transcript */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:h-[500px]">
          
          {/* 1. Real YouTube Player */}
          <div className={`relative rounded-3xl overflow-hidden group h-[300px] md:h-full bg-black flex flex-col ${cardClass} border-none`}>
             <div id="youtube-player" className="w-full h-full"></div>
          </div>

          {/* 2. Interactive Transcript */}
          <div className={`rounded-3xl p-6 flex flex-col h-[300px] md:h-full ${cardClass} relative overflow-hidden`}>
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-500/20">
              <h3 className="text-xl font-bold">{t.p2.transcript_title}</h3>
              <div className="flex items-center gap-2 text-xs opacity-50">
                 {t.p2.transcript_desc}
              </div>
            </div>
            
            <div ref={transcriptRef} className="flex-1 overflow-y-auto custom-scrollbar pr-2 scroll-smooth">
              {TRANSCRIPT_DATA.map((item, index) => {
                const isActive = currentTime >= item.start && currentTime < item.end;
                return (
                  <div 
                    key={index}
                    onClick={() => handleJumpToTime(item.start)}
                    className={`p-4 rounded-xl mb-3 cursor-pointer transition-all duration-300 group
                      ${isActive 
                        ? (darkMode ? 'bg-cyan-500/20 border-l-4 border-cyan-500' : 'bg-blue-100 border-l-4 border-blue-500') 
                        : 'opacity-50 hover:opacity-80 hover:bg-gray-500/5'}
                    `}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded bg-slate-500/20 ${isActive ? (darkMode ? 'text-white' : 'text-slate-900') : ''}`}>
                          {item.speaker}
                        </span>
                        <span className={`text-xs font-mono font-bold ${isActive ? 'text-cyan-500' : 'opacity-50'}`}>
                          {Math.floor(item.start/60)}:{(item.start%60).toString().padStart(2,'0')}
                        </span>
                      </div>
                      {isActive && <div className="text-xs font-bold text-cyan-500 px-2 py-0.5 rounded bg-cyan-500/10">Active</div>}
                    </div>
                    <p className={`text-sm mb-2 font-bold leading-relaxed ${isActive ? (darkMode ? 'text-white' : 'text-slate-900') : ''}`}>{isZh ? item.zh : item.en}</p>
                    <p className="text-xs italic opacity-70 leading-relaxed group-hover:opacity-100">{isZh ? item.en : item.zh}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { icon: <Zap className="text-yellow-400" />, title: t.p2.f1, desc: t.p2.f1_desc },
            { icon: <Users className="text-cyan-400" />, title: t.p2.f2, desc: t.p2.f2_desc },
            { icon: <Globe className="text-green-400" />, title: t.p2.f3, desc: t.p2.f3_desc },
          ].map((f, i) => (
            <div key={i} className={`p-6 rounded-2xl flex flex-col gap-2 hover:-translate-y-1 transition-transform duration-300 ${cardClass}`}>
              <div className="p-3 bg-slate-500/10 rounded-xl w-fit">{f.icon}</div>
              <h4 className="text-lg font-bold">{f.title}</h4>
              <p className="opacity-60 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full min-h-screen font-sans transition-colors duration-500 overflow-x-hidden flex flex-col ${themeClass}`}>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.5); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* --- Navbar --- */}
      <nav className={`fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 backdrop-blur-md border-b ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'}`}>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl transition-all duration-300 hover:bg-slate-500/10 active:scale-95 ${isMenuOpen ? 'bg-slate-500/20 text-cyan-500' : ''}`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsMenuOpen(false)}></div>
                <div className={`absolute top-full left-0 mt-4 w-64 rounded-2xl shadow-2xl overflow-hidden border backdrop-blur-xl animate-fade-in-up origin-top-left p-2 flex flex-col gap-1
                  ${darkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-gray-200'}
                `}>
                  <div className="px-4 py-2 text-xs font-bold opacity-40 uppercase tracking-widest border-b border-gray-500/20 mb-2">
                    {isZh ? '快速導航' : 'NAVIGATION'}
                  </div>
                  {menuItems.map((item) => (
                    <button
                      key={item.index}
                      onClick={() => {
                        setPage(item.index);
                        setIsMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`text-left px-4 py-3 rounded-xl transition-all font-bold text-sm flex items-center gap-3
                        ${page === item.index 
                          ? (darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-500/10 text-blue-600')
                          : 'hover:bg-slate-500/10 opacity-70 hover:opacity-100'}
                      `}
                    >
                      <span className={`text-xs p-1 rounded-md w-6 h-6 flex items-center justify-center font-mono ${page === item.index ? 'bg-current text-black/50' : 'bg-slate-500/20'}`}>
                        {item.index}
                      </span>
                      {item.label}
                      {page === item.index && <Check size={14} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 font-black text-xl tracking-tighter cursor-pointer" onClick={() => setPage(0)}>
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-white">A</div>
            <span className="hidden md:inline">ASUS Portal</span>
            <span className="md:hidden">ASUS</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button onClick={toggleLang} className="p-2 rounded-full hover:bg-gray-500/10 transition-colors">
             <span className="font-bold text-xs">{lang === 'zh' ? 'EN' : '中'}</span>
           </button>
           <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-500/10 transition-colors">
             {darkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 px-4 md:px-8 relative z-0">
        <div className="w-full relative">
          {page === 0 && <Page1_Landing />}
          {page === 1 && <Page2_About />}
          {page === 2 && <Page3_Jobs isZh={isZh} t={t} darkMode={darkMode} cardClass={cardClass} />}
          {page === 3 && <Page4_Team isZh={isZh} t={t} darkMode={darkMode} cardClass={cardClass} />}
          {page === 4 && <Page4_5_TermDecoder isZh={isZh} t={t} darkMode={darkMode} cardClass={cardClass} />}
          {page === 5 && <Page5_Quiz isZh={isZh} t={t} darkMode={darkMode} cardClass={cardClass} userName={userName} />}
          {page === 6 && <Page6_Interview isZh={isZh} t={t} darkMode={darkMode} cardClass={cardClass} userName={userName} />}
        </div>
      </main>

      {page > 0 && (
        <div className={`fixed bottom-0 left-0 w-full p-4 backdrop-blur-md border-t z-50 flex justify-between items-center ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'}`}>
          <button 
            onClick={prevPage}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-500/10 transition disabled:opacity-30"
            disabled={page === 1}
          >
            <ChevronDown className="rotate-90" /> {t.nav.prev}
          </button>

          <span className="text-sm font-bold opacity-40">
            PAGE 0{page} / 02
          </span>

          <button 
            onClick={nextPage}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white transition-all shadow-lg hover:scale-105 disabled:opacity-50 disabled:grayscale
              bg-gradient-to-r from-cyan-500 to-blue-600
            `}
            disabled={page >= 6}
          >
             {t.nav.next} <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}