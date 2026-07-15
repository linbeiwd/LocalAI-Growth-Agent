const FIELD_LIMITS = {
  storeName: 80,
  storeType: 80,
  location: 120,
  audience: 240,
  offer: 240,
  goal: 240,
  competition: 320,
};

/**
 * @typedef {{
 *   storeName: string;
 *   storeType: string;
 *   location: string;
 *   audience: string;
 *   offer: string;
 *   goal: string;
 *   competition: string;
 * }} MerchantInput
 */

/** @param {unknown} value @returns {MerchantInput | null} */
export function validateMerchantInput(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  /** @type {Record<string, string>} */
  const normalized = {};
  for (const [field, maxLength] of Object.entries(FIELD_LIMITS)) {
    const raw = value[field];
    if (typeof raw !== "string") return null;

    const text = raw.trim();
    if (!text || text.length > maxLength) return null;
    normalized[field] = text;
  }

  return /** @type {MerchantInput} */ (normalized);
}

/** @param {unknown} value @returns {string | null} */
export function extractOutputText(value) {
  if (!value || typeof value !== "object" || !Array.isArray(value.output)) {
    return null;
  }

  for (const item of value.output) {
    if (!item || typeof item !== "object" || !Array.isArray(item.content)) {
      continue;
    }
    for (const part of item.content) {
      if (
        part &&
        typeof part === "object" &&
        part.type === "output_text" &&
        typeof part.text === "string"
      ) {
        return part.text;
      }
    }
  }

  return null;
}

/** @param {unknown} value @returns {string | null} */
export function extractChatCompletionText(value) {
  const content = value?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : null;
}

/** @param {unknown} value @returns {boolean} */
export function isMarketingPlan(value) {
  const text = (item) => typeof item === "string" && item.trim().length > 0;
  const record = (item) => item && typeof item === "object" && !Array.isArray(item);

  if (!record(value) || !record(value.douyin) || !record(value.xiaohongshu)) return false;
  if (![value.audienceProfile, value.strategy, value.moments].every(text)) return false;
  if (![value.douyin.title, value.douyin.hook, value.douyin.script, value.douyin.cta].every(text)) return false;
  if (![value.xiaohongshu.title, value.xiaohongshu.body].every(text)) return false;
  if (!Array.isArray(value.xiaohongshu.tags) || !value.xiaohongshu.tags.every(text)) return false;
  if (!Array.isArray(value.weeklyPlan) || value.weeklyPlan.length !== 7) return false;
  if (!value.weeklyPlan.every((item) => record(item) && [item.day, item.theme, item.action].every(text))) return false;
  return Array.isArray(value.advice) && value.advice.length >= 3 && value.advice.length <= 5 && value.advice.every(text);
}
