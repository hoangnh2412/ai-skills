# Bộ câu hỏi — Quy trình

> 2 câu: Git workflow, CI/CD frontend (npm/Vite) & DoD.
>
> **Dành cho Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.

---

## Mục lục

> **Mid và Senior only.** Điểm Senior = tích lũy Mid + Senior/câu.

| # | Câu hỏi | Mid (max) | Senior (max) |
|---|--------|:---------:|:------------:|
| 26 | [Git workflow bạn thường dùng cho dự án React?](#câu-26-git-workflow-bạn-thường-dùng-cho-dự-án-react) | 8 | 18 |
| 27 | [CI/CD frontend và release: Definition of Done (DoD) gồm những gì?](#câu-27-cicd-frontend-và-release-definition-of-done-dod-gồm-những-gì) | 8 | 18 |
| | **Tổng điểm tối đa** | **16** | **36** |
| | **Tổng ngưỡng đạt (gợi ý)** | **14** | **32** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *16* | |

---

### Câu 26 — Git workflow bạn thường dùng cho dự án React?

#### Mục tiêu đánh giá

- Version control thực hành
- Collaboration branch strategy
- Code review integration
- Release hygiene cho SPA/frontend repo

#### Đáp án kỳ vọng tổng quát

**Phổ biến:** GitHub Flow (main + feature branch), Trunk-based (short-lived branch), GitFlow (nếu release cycle dài).

**Thực hành tốt cho frontend:**

- Branch naming rõ: `feature/ABC-123-product-filter`, `fix/ABC-456-login-redirect`
- Commit message có ý nghĩa; Conventional Commits nếu team dùng
- PR nhỏ, tách UI refactor và feature khi có thể
- Không commit `.env`, `node_modules`, build artifact (`dist/`)
- `.gitignore` đúng; lockfile (`package-lock.json` / `pnpm-lock.yaml`) commit
- Rebase/merge theo team rule; squash merge cho history gọn

```bash
git checkout -b feature/ORD-42-product-search
npm run lint && npm run test
git push -u origin feature/ORD-42-product-search
# open PR → review → CI green → merge
```

**Monorepo frontend:** có thể dùng Nx/Turborepo — branch theo app/package, affected build trong CI.

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
| Bisect debug regression UI (concept) | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| PR 3000 dòng component + refactor thường xuyên | Review impossible |
| Commit secret hoặc `.env.local` | Security |
| Rewrite history public branch | Team disruption |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết kế branching strategy cho team frontend | +1 |
| Protected branch, required review + CI | +1 |
| Monorepo vs polyrepo trade-off | +1 |
| Husky/lint-staged pre-commit hook | +1 |
| Changeset / release note automation | +1 |
| Migration history squash policy | +1 |
| Train team git hygiene | +1 |
| Incident: bad merge recovery | +1 |
| Integration CI on PR (preview deploy) | +1 |
| Compliance audit trail | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **Conflict rebase trên file component lớn — xử lý?** → manual resolve, chạy test, continue
2. **Ai được force push main?** → nobody / admin emergency only
3. **Design system package trong monorepo — branch strategy?** → trunk, ownership rõ

---

### Câu 27 — CI/CD frontend và release: Definition of Done (DoD) gồm những gì?

#### Mục tiêu đánh giá

- Delivery pipeline awareness (npm/Vite)
- Quality gate frontend
- Release discipline
- Production responsibility

#### Đáp án kỳ vọng tổng quát

**Pipeline CI frontend điển hình (Vite + npm/pnpm):**

```yaml
# Ví dụ GitHub Actions — pseudocode
steps:
  - npm ci
  - npm run lint          # ESLint
  - npm run typecheck     # tsc --noEmit (nếu TS)
  - npm run test          # Vitest/Jest + RTL
  - npm run build         # vite build
  - npm run preview       # smoke optional
  - upload dist/ artifact hoặc deploy preview (Vercel/Netlify/S3+CloudFront)
```

**CD:** PR → preview URL → QA/stakeholder review → merge main → deploy staging → smoke E2E → prod (manual approval hoặc canary).

**DoD gợi ý cho task frontend:**

| Hạng mục | Chi tiết |
|----------|----------|
| Code | Reviewed, lint/typecheck pass |
| Test | Unit/RTL cho logic; E2E cho flow quan trọng (nếu team có) |
| Build | `vite build` pass, không warning critical |
| UX | Loading/error/empty state; responsive theo design |
| a11y | Keyboard, label cơ bản |
| Env | Biến `VITE_*` document; không secret trong bundle |
| Deploy | Preview/staging verified; rollback plan |
| Monitoring | Error tracking (Sentry) hook nếu có |
| Sign-off | BA/QA pass; changelog nếu user-facing |

**Release:** semantic versioning (app hoặc package), changelog, tag, deployment window, post-deploy verify (smoke + Core Web Vitals spot check).

#### Tiêu chí chấm điểm — Mid (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Viết/maintain pipeline YAML cơ bản | +1 |
| Lint + test + build trong CI | +1 |
| Environment-specific config (`VITE_API_URL`) | +1 |
| Preview deploy cho PR | +1 |
| Feature flag deploy (concept) | +1 |
| Rollback procedure biết (redeploy tag cũ) | +1 |
| DoD có error tracking / smoke test | +1 |
| Cache dependency CI (`npm ci` + cache) | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Deploy Friday không monitor | Incident prone |
| Secret trong `VITE_` env commit repo | Security — lộ client bundle |
| Skip test vì "chỉ đổi CSS" | Regression risk |

#### Tiêu chí chấm điểm — Senior (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết kế pipeline toàn team frontend | +1 |
| Bundle size budget gate trong CI | +1 |
| Progressive delivery / canary static deploy | +1 |
| Lighthouse CI hoặc perf budget | +1 |
| Visual regression (Chromatic/Percy) | +1 |
| Incident rollback automation | +1 |
| CDN cache invalidation strategy | +1 |
| Post-deploy metric verify (RUM, error rate) | +1 |
| Blameless postmortem process | +1 |
| Train team release on-call | +1 |

**Pass criteria:** Mid 7/8 · Senior 16/18

#### Follow-up

1. **Build Vite pass local nhưng fail CI — nguyên nhân thường gặp?** → Node version, env var thiếu, case-sensitive path
2. **Pipeline 25 phút — cải thiện?** → parallel job, cache, test split, affected build monorepo
3. **Hotfix prod khi main đã merge nhiều feature — chiến lược?** → branch from tag, cherry-pick, redeploy artifact cũ

---
