# Bộ câu hỏi — Quy trình

> 2 câu: Git workflow, CI/CD & DoD.
>
> **Dành cho Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Mid và Senior only.** Điểm Senior = tích lũy Mid + Senior/câu.

| # | Câu hỏi | Mid (max) | Senior (max) |
|---|--------|:---------:|:------------:|
| 26 | [Git workflow bạn thường dùng?](#câu-26-git-workflow-bạn-thường-dùng) | 8 | 18 |
| 27 | [CI/CD và release: Definition of Done (DoD) gồm những gì?](#câu-27-cicd-và-release-definition-of-done-dod-gồm-những-gì) | 8 | 18 |
| | **Tổng điểm tối đa** | **16** | **36** |
| | **Tổng ngưỡng đạt (gợi ý)** | **14** | **32** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *16* | |

---

### Câu 26 — Git workflow bạn thường dùng?

#### Mục tiêu đánh giá

- Version control thực hành
- Collaboration branch strategy
- Code review integration
- Release hygiene

#### Đáp án kỳ vọng tổng quát

**Phổ biến:** GitFlow (develop/main/release), GitHub Flow (main + feature branch), Trunk-based (short-lived branch).

**Thực hành tốt:** branch naming rõ (`feature/ABC-123-desc`), commit message có ý nghĩa, rebase/merge theo team rule, PR nhỏ, không commit secret, `.gitignore` đúng.

```bash
git checkout -b feature/ORD-42-add-coupon
# ... commits ...
git push -u origin feature/ORD-42-add-coupon
# open PR → review → squash merge
```

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Feature branch workflow | +1 |
| Rebase vs merge hiểu trade-off | +1 |
| `git revert` vs reset biết khi nào | +1 |
| Cherry-pick hotfix | +1 |
| Stash khi cần | +1 |
| Tag release version | +1 |
| PR template / linked ticket | +1 |
| Bisect debug regression (concept) | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| PR 5000 dòng thường xuyên | Review impossible |
| Rewrite history public branch | Team disruption |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết kế branching strategy cho team | +1 |
| Protected branch, required review | +1 |
| Monorepo vs polyrepo trade-off | +1 |
| Signed commit / GPG (nếu policy) | +1 |
| Git LFS large file | +1 |
| Migration history squash policy | +1 |
| Train team git hygiene | +1 |
| Incident: bad merge recovery | +1 |
| Integration với CI on PR | +1 |
| Compliance audit trail | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **Conflict rebase — xử lý?** → manual resolve, test, continue
2. **Ai được force push main?** → nobody / admin only emergency
3. **Monorepo nhiều team — branch strategy?** → trunk, ownership

---

### Câu 27 — CI/CD và release: Definition of Done (DoD) gồm những gì?

#### Mục tiêu đánh giá

- Delivery pipeline awareness
- Quality gate
- Release discipline
- Production responsibility

#### Đáp án kỳ vọng tổng quát

**CI:** build, unit test, lint, security scan mỗi PR. **CD:** deploy staging → smoke test → prod (manual approval hoặc automated canary).

**DoD gợi ý:** code reviewed, test pass, docs cập nhật, migration chạy được, feature flag (nếu cần), monitoring/alert, rollback plan, BA sign-off, QA pass.

**Release:** semantic versioning, changelog, tag, deployment window, post-deploy verify.

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Viết/maintain pipeline YAML cơ bản | +1 |
| Docker image build trong CI | +1 |
| Environment-specific config | +1 |
| Database migration trong release | +1 |
| Feature flag deploy | +1 |
| Rollback procedure biết | +1 |
| DoD có observability | +1 |
| Blue-green/canary (concept) | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Deploy Friday không monitor | Incident prone |
| Secret trong pipeline log | Security |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết kế pipeline toàn team | +1 |
| SLO trong DoD | +1 |
| Progressive delivery | +1 |
| Infrastructure as Code integration | +1 |
| Compliance gate (SOC2) | +1 |
| Incident rollback automation | +1 |
| Cost/perf gate | +1 |
| Post-deploy metric verify | +1 |
| Blameless postmortem process | +1 |
| Train team release on-call | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **Migration breaking deploy — chiến lược?** → expand-contract, backward compatible
2. **Pipeline 45 phút — cải thiện?** → parallel, cache, test split
3. **Hotfix prod khi main đã thay đổi nhiều?** → branch from tag, cherry-pick

---

