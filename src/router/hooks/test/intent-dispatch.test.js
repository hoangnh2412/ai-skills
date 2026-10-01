import test from "node:test"
import assert from "node:assert/strict"
import { matchIntent, announceLine } from "../../../router/lib/intent-dispatch.js"

test("intent: Khởi tạo dự án sample → minipower-router-init", () => {
  assert.equal(matchIntent("Khởi tạo dự án sample"), "minipower-router-init")
})

test("intent: không cần /minipower — mô tả việc", () => {
  assert.equal(matchIntent("thêm cache Redis cho service đơn hàng"), "minipower-backend-caching-dotnet")
  assert.equal(matchIntent("Viết FR luồng đặt hàng module ORD"), "minipower-analyst-srs")
  assert.equal(matchIntent("làm gì tiếp"), "minipower-router")
})

test("intent: khóa dài thắng — không nhầm init với skill khác", () => {
  assert.equal(matchIntent("Init project ten-du-an"), "minipower-router-init")
})

test("intent: Cài minipower theo link → init, không làm theo link", () => {
  assert.equal(matchIntent("Cài minipower cho tôi theo https://example.com/docs"), "minipower-router-init")
  assert.equal(matchIntent("Cai minipower cho toi theo https://example.com/docs"), "minipower-router-init")
})

test("intent: không khớp → null (dispatcher hỏi, không bịa)", () => {
  assert.equal(matchIntent("hôm nay ăn gì"), null)
})

test("intent: dòng thông báo trước khi chạy", () => {
  const task = "Khởi tạo dự án sample"
  const skill = matchIntent(task)
  assert.equal(announceLine(skill, task), "Sẽ chạy `minipower-router-init` để xử lý Khởi tạo dự án sample.")
})
