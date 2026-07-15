"use client";

import { FormEvent, useState } from "react";

type MerchantInput = {
  storeName: string;
  storeType: string;
  location: string;
  audience: string;
  offer: string;
  goal: string;
  competition: string;
};

type MarketingPlan = {
  audienceProfile: string;
  strategy: string;
  douyin: { title: string; hook: string; script: string; cta: string };
  xiaohongshu: { title: string; body: string; tags: string[] };
  moments: string;
  weeklyPlan: Array<{ day: string; theme: string; action: string }>;
  advice: string[];
};

const DEMO_INPUT: MerchantInput = {
  storeName: "多彩贵州自助烙锅",
  storeType: "贵州特色自助烙锅",
  location: "大学城商圈",
  audience: "附近高校学生，喜欢朋友聚餐和高性价比餐饮",
  offer: "9.9 元团购体验活动",
  goal: "提升到店咨询，让更多大学生知道新活动",
  competition: "周边餐饮选择较多，需要突出贵州风味和聚餐氛围",
};

const DEMO_PLAN: MarketingPlan = {
  audienceProfile: "核心顾客是大学城内结伴用餐的高校学生。他们关注聚餐氛围、价格是否清楚，以及内容能否快速看懂店铺特色。",
  strategy: "围绕“贵州风味 + 学生聚餐 + 真实活动”连续表达：先用短视频展示场景，再用小红书补充体验理由，最后用朋友圈承接熟人咨询。",
  douyin: {
    title: "大学城聚餐的新选择",
    hook: "大学城的同学，想吃贵州特色烙锅可以看看这里。",
    script: "镜头 1：朋友围坐烙锅的近景。\n镜头 2：展示店内真实菜品和用餐氛围。\n口播：多彩贵州自助烙锅正在做 9.9 元团购体验活动，适合约上同学一起来试试贵州风味。",
    cta: "评论区说说你最想和谁一起来，活动细节以店内实际说明为准。",
  },
  xiaohongshu: {
    title: "大学城学生聚餐｜贵州特色烙锅可以这样吃",
    body: "最近在大学城发现一家贵州特色自助烙锅，比较适合同学朋友一起聚餐。\n\n店里目前有 9.9 元团购体验活动，想尝试贵州风味的同学可以先了解活动规则，再约上朋友一起去。内容里的价格和活动都以店内实际说明为准。",
    tags: ["大学城美食", "学生聚餐", "贵州烙锅", "本地探店"],
  },
  moments: "大学城的同学看过来～多彩贵州自助烙锅正在做 9.9 元团购体验活动。想和朋友一起试试贵州特色烙锅，可以来了解一下，具体活动规则以店内实际说明为准。",
  weeklyPlan: [
    { day: "周一", theme: "认识店铺", action: "拍一条 15 秒门店与聚餐场景短视频。" },
    { day: "周二", theme: "贵州特色", action: "用三张实拍图说明烙锅的特色。" },
    { day: "周三", theme: "活动说明", action: "清楚发布 9.9 元团购体验活动及真实规则。" },
    { day: "周四", theme: "聚餐场景", action: "展示同学朋友围坐用餐的真实氛围。" },
    { day: "周五", theme: "周末邀约", action: "发布适合周末聚餐的朋友圈文案。" },
    { day: "周六", theme: "现场素材", action: "集中拍摄菜品、门店和用餐过程素材。" },
    { day: "周日", theme: "一周复盘", action: "记录咨询最多的问题，作为下周选题。" },
  ],
  advice: [
    "在所有内容中统一写清活动适用条件，避免顾客误解。",
    "优先使用真实门店、菜品和用餐场景，不使用无关网图。",
    "每周记录咨询量最高的平台和内容，下一周集中复用有效主题。",
  ],
};

const FIELDS: Array<{
  name: keyof MerchantInput;
  label: string;
  placeholder: string;
  multiline?: boolean;
}> = [
  { name: "storeName", label: "店铺名称", placeholder: "例如：多彩贵州自助烙锅" },
  { name: "storeType", label: "店铺类型", placeholder: "例如：贵州特色自助烙锅" },
  { name: "location", label: "所在位置", placeholder: "例如：大学城商圈" },
  { name: "audience", label: "目标顾客", placeholder: "描述你最想吸引的人", multiline: true },
  { name: "offer", label: "当前活动", placeholder: "只填写真实存在的活动", multiline: true },
  { name: "goal", label: "本次目标", placeholder: "例如：提升到店咨询", multiline: true },
  { name: "competition", label: "竞争情况", placeholder: "周边选择与自己的差异", multiline: true },
];

export default function Home() {
  const [form, setForm] = useState<MerchantInput>(DEMO_INPUT);
  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState<"ai" | "sample">("ai");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message =
          data && typeof data === "object" && "error" in data
            ? String(data.error)
            : "生成失败，请稍后重试。";
        throw new Error(message);
      }
      setPlan(data as MarketingPlan);
      setSource("ai");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setPlan(DEMO_PLAN);
    setSource("sample");
    setError("");
  }

  return (
    <main>
      <header className="hero">
        <div className="brand">LOCALAI <span>GROWTH AGENT</span></div>
        <div className="hero-copy">
          <p className="eyebrow">给小店一支随时在线的内容团队</p>
          <h1>把店铺信息，变成一周的获客内容。</h1>
          <p className="hero-description">
            一次输入，自动生成顾客画像、内容策略、抖音脚本、小红书笔记、朋友圈文案和七天行动计划。
          </p>
          <div className="trust-row">
            <span>DeepSeek-V3.2 内容引擎</span>
            <span>只依据真实信息</span>
            <span>约 1 分钟生成</span>
          </div>
        </div>
      </header>

      <section className="workspace">
        <aside className="input-panel">
          <div className="panel-heading">
            <div>
              <p className="step-label">STEP 01</p>
              <h2>告诉我你的店铺</h2>
            </div>
            <button className="text-button" type="button" onClick={() => setForm(DEMO_INPUT)}>
              填入示例
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {FIELDS.map((field) => (
                <label key={field.name} className={field.multiline ? "wide" : ""}>
                  <span>{field.label}</span>
                  {field.multiline ? (
                    <textarea
                      name={field.name}
                      value={form[field.name]}
                      placeholder={field.placeholder}
                      rows={3}
                      maxLength={field.name === "competition" ? 320 : 240}
                      onChange={(event) =>
                        setForm({ ...form, [field.name]: event.target.value })
                      }
                      required
                    />
                  ) : (
                    <input
                      name={field.name}
                      value={form[field.name]}
                      placeholder={field.placeholder}
                      maxLength={field.name === "location" ? 120 : 80}
                      onChange={(event) =>
                        setForm({ ...form, [field.name]: event.target.value })
                      }
                      required
                    />
                  )}
                </label>
              ))}
            </div>

            <button className="generate-button" type="submit" disabled={loading}>
              <span>{loading ? "正在分析店铺与客群…" : "生成我的内容增长方案"}</span>
              <span aria-hidden="true">→</span>
            </button>
            <p className="privacy-note">不会把你的 API Key 或内部错误显示在页面中。</p>
          </form>
        </aside>

        <section className="result-panel" aria-live="polite" aria-busy={loading}>
          <div className="panel-heading">
            <div>
              <p className="step-label">STEP 02</p>
              <h2>你的增长作战板</h2>
            </div>
            {plan && <span className="ready-badge">{source === "ai" ? "AI 已生成" : "示例结果"}</span>}
          </div>

          {error && (
            <div className="error-message" role="alert">
              <p>{error}</p>
              <button type="button" onClick={loadSample}>先查看完整示例</button>
            </div>
          )}
          {loading && (
            <div className="loading-state" role="status">
              <div className="loader" />
              <h3>正在组织可直接使用的内容</h3>
              <p>分析顾客画像 → 提炼策略 → 编排 7 天行动</p>
            </div>
          )}
          {!loading && !plan && !error && <EmptyState onLoadSample={loadSample} />}
          {!loading && plan && <PlanView plan={plan} />}
        </section>
      </section>

      <footer>为真实小商家而做 · LocalAI Growth Agent MVP</footer>
    </main>
  );
}

function EmptyState({ onLoadSample }: { onLoadSample: () => void }) {
  return (
    <div className="empty-state">
      <div className="empty-mark">7D</div>
      <h3>一套输入，六类成果</h3>
      <p>左侧已放入大学城餐饮店示例。点击生成，即可看到完整的营销工作流。</p>
      <div className="deliverables">
        {["顾客画像", "内容策略", "抖音脚本", "小红书笔记", "朋友圈文案", "七天计划"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <button className="sample-button" type="button" onClick={onLoadSample}>无需 API，先看示例成果</button>
    </div>
  );
}

function PlanView({ plan }: { plan: MarketingPlan }) {
  return (
    <div className="plan-stack">
      <ResultCard number="01" title="顾客画像与核心策略">
        <p>{plan.audienceProfile}</p>
        <div className="strategy-box"><strong>核心策略</strong><p>{plan.strategy}</p></div>
      </ResultCard>

      <ResultCard number="02" title="抖音 15 秒脚本">
        <h4>{plan.douyin.title}</h4>
        <p className="hook">开场：{plan.douyin.hook}</p>
        <p className="preserve-lines">{plan.douyin.script}</p>
        <p className="cta">行动引导：{plan.douyin.cta}</p>
      </ResultCard>

      <ResultCard number="03" title="小红书种草笔记">
        <h4>{plan.xiaohongshu.title}</h4>
        <p className="preserve-lines">{plan.xiaohongshu.body}</p>
        <div className="tags">{plan.xiaohongshu.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
      </ResultCard>

      <ResultCard number="04" title="朋友圈文案">
        <p className="preserve-lines">{plan.moments}</p>
      </ResultCard>

      <ResultCard number="05" title="七天执行计划">
        <div className="week-grid">
          {plan.weeklyPlan.map((item, index) => (
            <article key={`${item.day}-${index}`}>
              <span>{item.day}</span>
              <strong>{item.theme}</strong>
              <p>{item.action}</p>
            </article>
          ))}
        </div>
      </ResultCard>

      <ResultCard number="06" title="活动优化建议">
        <ul>{plan.advice.map((item, index) => <li key={index}>{item}</li>)}</ul>
      </ResultCard>
    </div>
  );
}

function ResultCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <article className="result-card">
      <div className="card-title"><span>{number}</span><h3>{title}</h3></div>
      <div className="card-content">{children}</div>
    </article>
  );
}
