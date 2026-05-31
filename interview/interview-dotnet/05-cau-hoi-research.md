# Bộ câu hỏi — Research

> 2 câu: quy trình research, đánh giá nguồn tin.
>
> **Dành cho Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Mid và Senior only.** Điểm Senior = tích lũy Mid + Senior/câu.

| # | Câu hỏi | Mid (max) | Senior (max) |
|---|--------|:---------:|:------------:|
| 19 | [Khi gặp lỗi mới, bạn thường research như thế nào?](#câu-19-khi-gặp-lỗi-mới-bạn-thường-research-như-thế-nào) | 8 | 18 |
| 20 | [Làm sao biết một giải pháp trên Internet có đáng tin?](#câu-20-làm-sao-biết-một-giải-pháp-trên-internet-có-đáng-tin) | 8 | 18 |
| | **Tổng điểm tối đa** | **16** | **36** |
| | **Tổng ngưỡng đạt (gợi ý)** | **14** | **32** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *16* | |

---

### Câu 19 — Khi gặp lỗi mới, bạn thường research như thế nào?

#### Mục tiêu đánh giá

- Quy trình debug có hệ thống
- Khả năng tự học và tra cứu
- Đánh giá nguồn tin
- Thái độ làm việc khi bí

#### Đáp án kỳ vọng tổng quát

**Quy trình gợi ý:** (1) Tái hiện lỗi ổn định → (2) Đọc message + stack trace → (3) Khoanh vùng layer (code, config, DB, network) → (4) Tra docs chính thức, release notes, GitHub issues → (5) Giả thuyết + thử nghiệm nhỏ (POC) → (6) Fix + test regression → (7) Ghi lại knowledge.

**Nguồn ưu tiên:** Microsoft docs, source repo, RFC > blog ngẫu nhiên. **Version:** luôn khớp version package/runtime.

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Debug có hệ thống (binary search layer) | +1 |
| Đọc tài liệu chính thức trước blog | +1 |
| So sánh nhiều nguồn | +1 |
| Kiểm tra version compatibility | +1 |
| Tạo minimal repro project | +1 |
| Dùng debugger/breakpoint hiệu quả | +1 |
| Đọc source/decompile khi cần | +1 |
| Viết note/ADR ngắn sau fix | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Copy solution không hiểu | Technical debt |
| Không verify trên staging | Production risk |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Đánh giá độ tin cậy nguồn | +1 |
| Phản biện giải pháp "đúng một phần" | +1 |
| POC có đo lường (benchmark, log) | +1 |
| Root cause analysis, không chỉ symptom | +1 |
| Chia sẻ playbook cho team | +1 |
| Đánh giá risk trước khi apply hotfix prod | +1 |
| Đọc changelog/security advisory | +1 |
| Time-box research tránh rabbit hole | +1 |
| Mentor junior quy trình research | +1 |
| Cải thiện observability để lần sau dễ hơn | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **Stack trace chỉ có framework code — làm gì tiếp?** → symbols, source link, logging
2. **Lỗi chỉ production không local — hướng?** → env diff, data, load
3. **Deadline gấp nhưng chưa hiểu root cause?** → mitigate vs fix, communicate

---

### Câu 20 — Làm sao biết một giải pháp trên Internet có đáng tin?

#### Mục tiêu đánh giá

- Tư duy phản biện
- Tránh copy-paste nguy hiểm
- Đánh giá context/version
- Engineering judgment

#### Đáp án kỳ vọng tổng quát

**Checklist đáng tin:** nguồn chính chủ (Microsoft, repo official), ngày cập nhật gần, version khớp, có test/repro, nhiều người xác nhận trên issue tracker, tác giả có credibility.

**Red flag nguồn:** không có version, code "magic", disable security, workaround hack không giải thích, contradict official docs.

**Cách verify:** đọc docs song song, chạy POC isolated, review security implication, pair review trước merge.

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Phân biệt primary vs secondary source | +1 |
| Đọc issue thread GitHub đầy đủ | +1 |
| Hiểu context khác (scale, cloud) | +1 |
| Đánh giá security của snippet | +1 |
| So sánh với official recommendation | +1 |
| Kiểm tra license dependency | +1 |
| Document lý do chọn giải pháp | +1 |
| Peer review trước merge | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| NuGet package lạ không audit | Supply chain risk |
| Disable SSL "để chạy được" | Security fail |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Threat model cho third-party code | +1 |
| Đánh giá maintainability dài hạn | +1 |
| Phát hiện anti-pattern disguised as fix | +1 |
| Dùng CVE database cho dependency | +1 |
| Quyết định build vs buy có căn cứ | +1 |
| Thiết lập team standard trusted sources | +1 |
| Đào tạo junior nhận diện red flag | +1 |
| Post-incident: solution Internet caused outage | +1 |
| RFC/ADR ghi quyết định | +1 |
| Balance speed vs safety có communicate | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **GitHub Copilot/ChatGPT gợi ý code — tin mức nào?** → verify, test, security scan
2. **Package download cao nhưng 1 open issue critical?** → risk assessment
3. **Official docs và community conflict — chọn sao?** → repro, issue upstream

---

