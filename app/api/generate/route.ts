import {
  extractChatCompletionText,
  extractOutputText,
  isMarketingPlan,
  validateMerchantInput,
} from "../../../lib/marketing-plan.mjs";

const SILICONFLOW_MODEL = "deepseek-ai/DeepSeek-V3.2";

const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "audienceProfile",
    "strategy",
    "douyin",
    "xiaohongshu",
    "moments",
    "weeklyPlan",
    "advice",
  ],
  properties: {
    audienceProfile: { type: "string" },
    strategy: { type: "string" },
    douyin: {
      type: "object",
      additionalProperties: false,
      required: ["title", "hook", "script", "cta"],
      properties: {
        title: { type: "string" },
        hook: { type: "string" },
        script: { type: "string" },
        cta: { type: "string" },
      },
    },
    xiaohongshu: {
      type: "object",
      additionalProperties: false,
      required: ["title", "body", "tags"],
      properties: {
        title: { type: "string" },
        body: { type: "string" },
        tags: {
          type: "array",
          minItems: 3,
          maxItems: 6,
          items: { type: "string" },
        },
      },
    },
    moments: { type: "string" },
    weeklyPlan: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["day", "theme", "action"],
        properties: {
          day: { type: "string" },
          theme: { type: "string" },
          action: { type: "string" },
        },
      },
    },
    advice: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string" },
    },
  },
} as const;

const SYSTEM_INSTRUCTIONS = `你是一名服务中国线下小商家的内容增长顾问。根据商家提供的事实，输出可以直接执行的中文营销方案。

硬性要求：
1. 只能使用输入中明确出现的店名、位置、价格、活动和卖点。
2. 不得虚构折扣、销量、排名、奖项、地址、联系方式、口味反馈或效果保证。
3. 如果信息不足，使用稳妥的表达，不自行补造事实。
4. 内容应具体、自然、适合真实小商家执行；避免空泛口号。
5. 抖音脚本控制在约 15 秒可讲完，小红书文案适合移动端阅读，一周计划每天只安排一个主要动作。`;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求格式不正确。" }, { status: 400 });
  }

  const input = validateMerchantInput(body);
  if (!input) {
    return Response.json(
      { error: "请完整填写商家信息，并检查内容长度。" },
      { status: 400 },
    );
  }

  const siliconFlowKey = process.env.SILICONFLOW_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;
  const provider = siliconFlowKey ? "siliconflow" : "openai";
  const apiKey = siliconFlowKey ?? openAIKey;
  if (!apiKey) {
    return Response.json(
      { error: "服务尚未配置可用的 AI API Key。" },
      { status: 500 },
    );
  }

  try {
    const isSiliconFlow = provider === "siliconflow";
    const upstream = await fetch(isSiliconFlow
      ? "https://api.siliconflow.cn/v1/chat/completions"
      : "https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(isSiliconFlow
        ? {
            model: SILICONFLOW_MODEL,
            messages: [
              {
                role: "system",
                content: `${SYSTEM_INSTRUCTIONS}\n严格只输出符合以下 JSON Schema 的 JSON 对象，不要输出 Markdown：\n${JSON.stringify(PLAN_SCHEMA)}`,
              },
              { role: "user", content: JSON.stringify(input) },
            ],
            response_format: { type: "json_object" },
            enable_thinking: false,
            temperature: 0.4,
            max_tokens: 3500,
          }
        : {
            model: "gpt-5.6",
            reasoning: { effort: "low" },
            store: false,
            max_output_tokens: 3500,
            instructions: SYSTEM_INSTRUCTIONS,
            input: JSON.stringify(input),
            text: {
              format: {
                type: "json_schema",
                name: "local_marketing_plan",
                strict: true,
                schema: PLAN_SCHEMA,
              },
            },
          },
      ),
    });

    if (upstream.status === 401) {
      return Response.json(
        { code: "invalid_api_key", error: `${isSiliconFlow ? "硅基流动" : "OpenAI"} API Key 无效。` },
        { status: 401 },
      );
    }

    if (upstream.status === 429) {
      return Response.json(
        {
          code: "quota_exhausted",
          error: `${isSiliconFlow ? "硅基流动" : "OpenAI"} API 当前无可用额度或请求过于频繁。`,
        },
        { status: 429 },
      );
    }

    if (!upstream.ok) {
      return Response.json(
        { error: "AI 服务暂时不可用，请稍后重试。" },
        { status: 502 },
      );
    }

    const responseData: unknown = await upstream.json();
    const outputText = isSiliconFlow
      ? extractChatCompletionText(responseData)
      : extractOutputText(responseData);
    if (!outputText) throw new Error("Missing output text");

    const plan: unknown = JSON.parse(outputText);
    if (!isMarketingPlan(plan)) throw new Error("Invalid marketing plan");
    return Response.json(plan);
  } catch (error) {
    console.error(
      "Marketing plan generation failed:",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "生成方案时出现问题，请稍后重试。" },
      { status: 502 },
    );
  }
}
