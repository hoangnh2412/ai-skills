# Bộ câu hỏi — Research

> 2 câu: quy trình research, đánh giá nguồn tin (góc nhìn React/Frontend).
>
> **Dành cho Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.
>
> **Tham chiếu:** [brainstoming-reactjs.md](../brainstoming-reactjs.md) · [14-form-phong-van.md](./14-form-phong-van.md)

---

## Mục lục

> **Mid và Senior only.** Điểm Senior = tích lũy Mid + Senior/câu.

| # | Câu hỏi | Mid (max) | Senior (max) |
|---|--------|:---------:|:------------:|
| 19 | [Khi gặp lỗi mới (React/build/runtime), bạn thường research như thế nào?](#câu-19-khi-gặp-lỗi-mới-reactbuildruntime-bạn-thường-research-như-thế-nào) | 8 | 18 |
| 20 | [Làm sao biết một giải pháp trên Internet có đáng tin (npm, Stack Overflow, blog)?](#câu-20-làm-sao-biết-một-giải-pháp-trên-internet-có-đáng-tin-npm-stack-overflow-blog) | 8 | 18 |
| | **Tổng điểm tối đa** | **16** | **36** |
| | **Tổng ngưỡng đạt (gợi ý)** | **14** | **32** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *16* | |

---

### Câu 19 — Khi gặp lỗi mới (React/build/runtime), bạn thường research như thế nào?

#### Mục tiêu đánh giá

- Quy trình debug frontend có hệ thống
- Khả năng tự học và tra cứu
- Đánh giá nguồn tin kỹ thuật
- Thái độ làm việc khi bí

#### Đáp án kỳ vọng tổng quát

**Quy trình gợi ý:** (1) Tái hiện lỗi ổn định (browser, viewport, route) → (2) Đọc message console + stack trace + React DevTools → (3) Khoanh vùng layer (component, hook, build, API, CSS) → (4) Tra docs chính thức: [React docs](https://react.dev), [MDN](https://developer.mozilla.org), Vite/webpack docs, GitHub issues package → (5) Giả thuyết + thử nghiệm nhỏ (minimal repro CodeSandbox) → (6) Fix + test regression (RTL/E2E) → (7) Ghi lại knowledge (ADR, team wiki).

**Nguồn ưu tiên:** react.dev, MDN, repo official > blog ngẫu nhiên > Stack Overflow cũ. **Version:** khớp React 18/19, router major, bundler version.

**Công cụ:** React DevTools (Profiler, Components), Network tab, Source map, `eslint-plugin-react-hooks`.

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Debug có hệ thống (binary search component tree) | +1 |
| Đọc react.dev / MDN trước blog | +1 |
| So sánh nhiều nguồn | +1 |
| Kiểm tra version React/Vite/package compatibility | +1 |
| Tạo minimal repro (StackBlitz/CodeSandbox) | +1 |
| Dùng breakpoint / `console` có mục đích | +1 |
| Đọc GitHub issue tracker của thư viện | +1 |
| Viết note ngắn sau fix | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Copy solution Stack Overflow không hiểu | Technical debt |
| Không verify trên staging/preview | Production risk |
| Sửa `eslint-disable` hooks mà không hiểu | Bug tiềm ẩn |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Đánh giá độ tin cậy nguồn | +1 |
| Phản biện giải pháp "đúng một phần" (workaround hack) | +1 |
| POC có đo lường (Profiler, Lighthouse) | +1 |
| Root cause analysis, không chỉ symptom | +1 |
| Chia sẻ playbook cho team frontend | +1 |
| Đánh giá risk trước hotfix prod | +1 |
| Đọc changelog/security advisory npm | +1 |
| Time-box research tránh rabbit hole | +1 |
| Mentor junior quy trình research | +1 |
| Cải thiện observability (Sentry, source map) | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **"Maximum update depth exceeded" — hướng debug?** → setState trong render, effect deps vòng lặp
2. **Lỗi chỉ Safari/iOS — làm gì?** → browser diff, polyfill, caniuse
3. **Deadline gấp chưa hiểu root cause?** → mitigate (feature flag), communicate risk

---

### Câu 20 — Làm sao biết một giải pháp trên Internet có đáng tin (npm, Stack Overflow, blog)?

#### Mục tiêu đánh giá

- Tư duy phản biện
- Tránh copy-paste nguy hiểm
- Đánh giá context/version npm package
- Engineering judgment frontend

#### Đáp án kỳ vọng tổng quát

**Checklist đáng tin:** nguồn chính chủ (react.dev, tác giả thư viện), ngày cập nhật gần, version khớp React, có test/repro, issue tracker active, download npm ổn định nhưng **không** là tiêu chí duy nhất, nhiều maintainer.

**Red flag nguồn:**

| Dấu hiệu | Rủi ro |
|----------|--------|
| SO answer React 16 class component cho app hooks | Outdated |
| `npm install` package 2 download/tuần | Abandonware |
| Blog disable ESLint hooks rules | Anti-pattern |
| Copy `dangerouslySetInnerHTML` không sanitize | XSS |
| AI-generated code không verify | Hallucination API |

**Verify:** đọc docs song song, chạy POC isolated, `npm audit`, peer dependency check, pair review trước merge.

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Phân biệt primary vs secondary source | +1 |
| Đọc issue thread GitHub đầy đủ | +1 |
| Hiểu context khác (Next.js vs CRA vs Vite) | +1 |
| Đánh giá security snippet (XSS, eval) | +1 |
| So sánh với official recommendation | +1 |
| Kiểm tra license dependency | +1 |
| Document lý do chọn package | +1 |
| Peer review trước merge | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| npm package lạ không audit | Supply chain risk |
| `--legacy-peer-deps` mù quáng mọi lần | Dependency hell |
| Copy CSS `!important` hack không hiểu | Maintainability |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Threat model cho third-party script/package | +1 |
| Đánh giá maintainability dài hạn (bundle size, API stability) | +1 |
| Phát hiện anti-pattern disguised as fix | +1 |
| Dùng CVE/`npm audit` cho dependency | +1 |
| Quyết định build vs buy có căn cứ | +1 |
| Thiết lập team standard trusted sources | +1 |
| Đào tạo junior nhận diện red flag | +1 |
| Post-incident: solution Internet caused outage | +1 |
| ADR ghi quyết định chọn lib | +1 |
| Balance speed vs safety có communicate | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **Copilot/ChatGPT gợi ý hook — tin mức nào?** → verify react.dev, test, eslint hooks
2. **Package download cao nhưng 1 critical open issue?** → risk assessment, fork/alternative
3. **Official docs và blog conflict — chọn sao?** → repro, issue upstream, prefer docs

---
