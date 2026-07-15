import assert from "node:assert/strict";
import test from "node:test";
import {
  extractChatCompletionText,
  extractOutputText,
  isMarketingPlan,
  validateMerchantInput,
} from "../lib/marketing-plan.mjs";

const validInput = {
  storeName: "多彩贵州自助烙锅",
  storeType: "贵州特色自助烙锅",
  location: "大学城商圈",
  audience: "附近高校学生",
  offer: "9.9 元团购体验活动",
  goal: "提升到店咨询",
  competition: "周边餐饮选择较多",
};

test("validates and trims complete merchant input", () => {
  const result = validateMerchantInput({ ...validInput, storeName: "  示例店  " });
  assert.equal(result?.storeName, "示例店");
});

test("rejects missing and oversized merchant fields", () => {
  assert.equal(validateMerchantInput({ ...validInput, offer: "" }), null);
  assert.equal(validateMerchantInput({ ...validInput, competition: "字".repeat(321) }), null);
});

test("extracts output_text from a Responses API payload", () => {
  const payload = {
    output: [{ type: "message", content: [{ type: "output_text", text: "{\"ok\":true}" }] }],
  };
  assert.equal(extractOutputText(payload), "{\"ok\":true}");
  assert.equal(extractOutputText({ output: [] }), null);
});

test("extracts and validates a chat completion marketing plan", () => {
  const plan = {
    audienceProfile: "学生客群",
    strategy: "真实展示",
    douyin: { title: "标题", hook: "开场", script: "脚本", cta: "行动" },
    xiaohongshu: { title: "标题", body: "正文", tags: ["大学城", "聚餐"] },
    moments: "朋友圈文案",
    weeklyPlan: Array.from({ length: 7 }, (_, index) => ({ day: `第${index + 1}天`, theme: "主题", action: "动作" })),
    advice: ["建议一", "建议二", "建议三"],
  };
  const payload = { choices: [{ message: { content: JSON.stringify(plan) } }] };
  assert.equal(extractChatCompletionText(payload), JSON.stringify(plan));
  assert.equal(isMarketingPlan(plan), true);
  assert.equal(isMarketingPlan({ ...plan, weeklyPlan: [] }), false);
});
