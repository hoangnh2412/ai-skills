# Bộ câu hỏi React — Nâng cao

> 9 câu: custom hooks, Context, memo, Router, React Query, forms, performance, Error Boundary/Suspense, TypeScript.
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
| 10 | [Custom hooks — khi nào tách logic?](#câu-10-custom-hooks--khi-nào-tách-logic) | 10 | 22 |
| 11 | [Context API — pitfalls và khi nào tránh?](#câu-11-context-api--pitfalls-và-khi-nào-tránh) | 10 | 22 |
| 12 | [`React.memo`, `useMemo`, `useCallback` — khi nào cần?](#câu-12-reactmemo-usememo-usecallback--khi-nào-cần) | 10 | 22 |
| 13 | [React Router — routing và lazy load](#câu-13-react-router--routing-và-lazy-load) | 10 | 22 |
| 14 | [State management vs React Query (server state)](#câu-14-state-management-vs-react-query-server-state) | 10 | 22 |
| 15 | [Forms phức tạp — React Hook Form / validation](#câu-15-forms-phức-tạp--react-hook-form--validation) | 10 | 22 |
| 16 | [Performance frontend — re-render và bundle](#câu-16-performance-frontend--re-render-và-bundle) | 10 | 22 |
| 17 | [Error Boundary và Suspense](#câu-17-error-boundary-và-suspense) | 10 | 22 |
| 18 | [TypeScript với React — patterns cơ bản](#câu-18-typescript-với-react--patterns-cơ-bản) | 10 | 22 |
| | **Tổng điểm tối đa** | **90** | **198** |
| | **Tổng ngưỡng đạt (gợi ý)** | **81** | **162** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *72* | |

---

### Câu 10 — Custom hooks — khi nào tách logic?

#### Mục tiêu đánh giá

- Tách logic khỏi UI component
- Quy tắc đặt tên và reuse hook
- Testability và composition
- Tránh over-abstraction

#### Đáp án kỳ vọng tổng quát

**Custom hook** là function bắt đầu bằng `use`, gọi hooks khác bên trong, tái sử dụng **stateful logic** giữa nhiều component.

```tsx
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function useProducts(params: ProductQuery) {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(buildUrl(params), { signal: controller.signal })
      .then(r => r.json())
      .then(setData)
      .catch(e => { if (e.name !== 'AbortError') setError(e); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [params]);

  return { data, loading, error };
}
```

**Khi tách:** logic lặp ≥2 nơi, effect phức tạp, tách test. **Không tách:** logic 3 dòng chỉ dùng 1 chỗ (YAGNI).

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Hiểu custom hook tái sử dụng logic, không phải JSX | +1 |
| Quy tắc tên `use*` | +1 |
| Tách fetch/form logic ra hook | +1 |
| Return object/array rõ ràng | +1 |
| Hook có cleanup khi cần | +1 |
| Không gọi hook trong if/loop | +1 |
| Test hook với `@testing-library/react` renderHook | +1 |
| Colocation vs shared hook folder | +1 |
| Tránh God hook quá nhiều responsibility | +1 |
| Ví dụ thực tế trong project | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Custom hook chỉ wrap 1 dòng `useState` | Over-abstraction |
| Hook không tuân Rules of Hooks | Bug nền tảng |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết kế hook API ổn định (breaking change awareness) | +1 |
| Generic hook `<T>` khi phù hợp | +1 |
| So sánh custom hook vs React Query cho server state | +1 |
| Hook composition (hook gọi hook) | +1 |
| SSR/hydration consideration | +1 |
| Document JSDoc / example usage | +1 |
| Team hook library / shared package | +1 |
| Performance — tránh re-create callback mỗi render trong hook API | +1 |
| Refactor case study tách logic từ component lớn | +1 |
| Guideline khi **không** tạo hook | +1 |
| Testing edge case (unmount during fetch) | +1 |
| Architectural boundary feature hook vs shared | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Custom hook vs utility function thuần — khác gì?** → hook dùng React hooks bên trong
2. **`useProducts` params object — deps effect thế nào?** → stable reference, serialize queryKey
3. **Share hook qua npm package nội bộ — versioning?** → semver, peer dep React

---

### Câu 11 — Context API — pitfalls và khi nào tránh?

#### Mục tiêu đánh giá

- Hiểu Context giải quyết prop drilling
- Nhận diện re-render toàn subtree
- Split context, memo value
- Khi chọn Zustand/Redux/React Query thay Context

#### Đáp án kỳ vọng tổng quát

**Context** truyền data xuống cây component không cần prop từng tầng.

```tsx
const ThemeContext = createContext<'light' | 'dark'>('light');

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}
```

**Pitfalls:**

| Vấn đề | Hậu quả | Giảm thiểu |
|--------|---------|------------|
| Value object mới mỗi render | Re-render mọi consumer | `useMemo` value |
| Một context chứa theme + user + cart | Consumer nhỏ cũng re-render | Split context |
| Dùng Context làm global store mọi thứ | Perf kém, khó debug | Zustand/Redux/React Query |
| Default `undefined` không check | Runtime bug | Guard hook + TypeScript |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Giải thích prop drilling và Context fix | +1 |
| `Provider` + `useContext` pattern | +1 |
| Re-render khi value đổi | +1 |
| `useMemo` cho context value | +1 |
| Split context theo concern | +1 |
| Custom hook wrapper (`useAuth`) | +1 |
| Không dùng Context cho high-frequency update | +1 |
| So sánh Context vs Redux (khái niệm) | +1 |
| Ví dụ theme/locale/auth thực tế | +1 |
| TypeScript type context | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| "Context thay Redux mọi case" | Thiếu trade-off |
| Provider value inline object mỗi render | Perf trap |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Selective subscription pattern (split + memo children) | +1 |
| Context + reducer (`useReducer`) cho complex state | +1 |
| React 19 `use(Context)` / compiler impact awareness | +1 |
| SSR pass context qua boundary | +1 |
| DevTools debug context re-render | +1 |
| Migration Context bloated → Zustand | +1 |
| Team guideline khi dùng Context | +1 |
| Performance measure trước khi tối ưu | +1 |
| Anti-pattern: global event bus via Context | +1 |
| Testing mock Provider | +1 |
| Micro-frontend shared context isolation | +1 |
| Document public API Provider | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Cart 100 item update — Context ổn không?** → frequent update → dedicated store
2. **`useContext` trong component con sâu — re-render parent?** → chỉ consumer re-render khi value đổi
3. **React Query cache có thay Context server data?** → yes for server state

---

### Câu 12 — `React.memo`, `useMemo`, `useCallback` — khi nào cần?

#### Mục tiêu đánh giá

- Phân biệt ba cơ chế memo
- Tránh premature optimization
- Profiler-driven optimization
- Reference equality impact

#### Đáp án kỳ vọng tổng quát

| API | Mục đích |
|-----|----------|
| `React.memo(Component)` | Skip re-render component nếu props shallow equal |
| `useMemo(fn, deps)` | Cache **kết quả tính toán** giữa render |
| `useCallback(fn, deps)` | Cache **function reference** giữa render |

```tsx
const ProductRow = React.memo(function ProductRow({ product, onSelect }: Props) {
  return <tr onClick={() => onSelect(product.id)}>{product.name}</tr>;
});

function ProductList({ products, onSelect }: ListProps) {
  const handleSelect = useCallback((id: string) => onSelect(id), [onSelect]);
  const sorted = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );
  return sorted.map(p => <ProductRow key={p.id} product={p} onSelect={handleSelect} />);
}
```

**Quy trình:** đo Profiler trước → tối ưu bottleneck → đo lại. Memo có chi phí so sánh deps.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Phân biệt memo / useMemo / useCallback | +1 |
| `React.memo` shallow compare props | +1 |
| `useCallback` giữ reference cho child memo | +1 |
| `useMemo` cho expensive calculation | +1 |
| Không memo mọi component | +1 |
| Inline object/function phá memo child | +1 |
| React DevTools Profiler | +1 |
| `memo` custom compare function (hiếm) | +1 |
| List lớn + memo row pattern | +1 |
| Ví dụ đo được cải thiện | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| `useCallback` mọi handler không cần | Noise, không lợi |
| Memo trước khi profile | Premature optimization |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| React Compiler (auto memo) awareness | +1 |
| Virtualization thay memo list 10k item | +1 |
| State colocation giảm re-render scope | +1 |
| Context split tránh memo không đủ | +1 |
| Bundle size impact minimal vs algorithm | +1 |
| Team perf budget + review rule | +1 |
| `useMemo` dependency stale bug case | +1 |
| Concurrent features + memo interaction | +1 |
| Document when to remove memo | +1 |
| Load test + RUM correlation | +1 |
| Trade-off readability vs perf | +1 |
| Mentor junior tránh cargo cult memo | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Parent re-render — child memo có re-render không?** → không nếu props equal
2. **`useMemo(() => fn, [])` vs `useCallback`?** → useCallback cho function identity
3. **Context consumer — memo child vẫn chậm?** → context change bypass memo props

---

### Câu 13 — React Router — routing và lazy load

#### Mục tiêu đánh giá

- Client-side routing cơ bản
- Nested routes, layout
- Code splitting với lazy + Suspense
- Protected route pattern

#### Đáp án kỳ vọng tổng quát

**React Router v6+** map URL → component; `BrowserRouter` + `Routes` + `Route`.

```tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const ProductListPage = lazy(() => import('./features/products/ProductListPage'));
const ProductDetailPage = lazy(() => import('./features/products/ProductDetailPage'));

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/" element={<Navigate to="/products" replace />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**Protected route:** wrapper check auth → redirect `/login` + `location.state.from`.

**Lazy load:** giảm initial bundle; prefetch route on hover (optional).

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| `Route`, `Routes`, `Link`, `useNavigate` | +1 |
| Dynamic segment `:id`, `useParams` | +1 |
| Nested route + layout `Outlet` | +1 |
| `lazy` + `Suspense` code splitting | +1 |
| Protected route pattern | +1 |
| 404 / catch-all `*` route | +1 |
| Query string `useSearchParams` | +1 |
| Redirect sau login | +1 |
| Basename deploy subpath | +1 |
| Ví dụ cấu trúc route thực tế | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không biết lazy load route | Bundle awareness thấp |
| Auth check trong mỗi page copy-paste | Thiếu abstraction |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Data router (`createBrowserRouter`, loaders) | +1 |
| Error boundary route level | +1 |
| Scroll restoration | +1 |
| SSR/Remix vs CSR router trade-off | +1 |
| Route-based code split + analyze bundle | +1 |
| Deep link + auth token handling | +1 |
| Micro-frontend route integration | +1 |
| Route guard role-based | +1 |
| Prefetch strategy | +1 |
| Migration v5 → v6 case | +1 |
| Team routing convention doc | +1 |
| SEO: CSR limitation + mitigation | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **`useEffect` fetch khi route đổi — thay bằng loader?** → data router, less effect
2. **Browser refresh `/products/1` — server config?** → fallback index.html SPA
3. **Tab mở 2 route — state share?** → URL is source of truth

---

### Câu 14 — State management vs React Query (server state)

#### Mục tiêu đánh giá

- Phân biệt client state vs server state
- Khi dùng Redux/Zustand vs React Query/SWR
- Cache, invalidation, optimistic update
- Tránh duplicate source of truth

#### Đáp án kỳ vọng tổng quát

| Loại | Ví dụ | Công cụ gợi ý |
|------|-------|---------------|
| **Client state** | UI toggle, form draft, wizard step | `useState`, Zustand, Redux (UI slice) |
| **Server state** | User list, product catalog từ API | React Query, SWR, RTK Query |

```tsx
// React Query — server state
const { data, isLoading, error } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => api.getProducts(filters),
  staleTime: 60_000,
});

const mutation = useMutation({
  mutationFn: api.updateProduct,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
});
```

**Anti-pattern:** copy API response vào Redux rồi tự sync — duplicate, stale cache.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Phân biệt client vs server state | +1 |
| React Query `queryKey`, `queryFn` | +1 |
| Loading/error từ library | +1 |
| Cache stale/refetch concept | +1 |
| `invalidateQueries` sau mutation | +1 |
| Local state đủ cho form đơn giản | +1 |
| Redux cho global UI (theme, cart) — khái niệm | +1 |
| Tránh fetch trong Redux middleware mù | +1 |
| Optimistic update (concept) | +1 |
| Ví dụ project thực tế | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Redux cho mọi API call | Over-engineering |
| Không invalidate sau POST/PUT | Stale UI |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Normalized cache vs denormalized trade-off | +1 |
| Pagination/infinite query pattern | +1 |
| Prefetch on hover / route loader | +1 |
| Offline/persist query (concept) | +1 |
| Zustand + React Query boundary doc | +1 |
| SSR dehydrate/hydrate React Query | +1 |
| Real-time websocket + query invalidation | +1 |
| Migration Redux-Saga API → React Query | +1 |
| Team state architecture ADR | +1 |
| Error retry/backoff policy | +1 |
| Multi-tab cache sync | +1 |
| Testing mock QueryClient | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Form edit product — state ở đâu trước submit?** → local/RHF; server cache sau save
2. **Cart local vs server cart — sync?** → optimistic + reconcile
3. **React Query vs SWR — chọn sao?** → feature, team, ecosystem

---

### Câu 15 — Forms phức tạp — React Hook Form / validation

#### Mục tiêu đánh giá

- Controlled form scale problem
- RHF uncontrolled + register pattern
- Schema validation (Zod/Yup)
- Error UX và accessibility

#### Đáp án kỳ vọng tổng quát

**Controlled mọi field:** mỗi keystroke re-render form lớn → chậm.

**React Hook Form:** register ref, validate on submit/blur, ít re-render.

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
});

type FormData = z.infer<typeof schema>;

function SignupForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} aria-invalid={!!errors.email} />
      {errors.email && <span role="alert">{errors.email.message}</span>}
      <button disabled={isSubmitting}>Submit</button>
    </form>
  );
}
```

**Complex:** field array (`useFieldArray`), dependent fields, async validate (check email unique).

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Controlled vs uncontrolled trade-off | +1 |
| RHF `register`, `handleSubmit` | +1 |
| Validation schema Zod/Yup | +1 |
| Hiển thị error per field | +1 |
| `isSubmitting` disable submit | +1 |
| Prevent double submit | +1 |
| Default values / reset form | +1 |
| a11y: label, `aria-invalid`, `role="alert"` | +1 |
| Integrate với UI library (Controller) | +1 |
| Ví dụ form thực tế | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| 20 field controlled không tối ưu | Perf unaware |
| Validate chỉ HTML5 `required` | Thiếu business rule |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Multi-step wizard state machine | +1 |
| Server error map to field | +1 |
| Autosave draft debounce | +1 |
| File upload form integration | +1 |
| i18n validation message | +1 |
| Test RHF + RTL userEvent | +1 |
| Performance form 100+ fields (virtualize) | +1 |
| Design system form abstraction | +1 |
| Migration legacy controlled → RHF plan | +1 |
| Security: không log sensitive field | +1 |
| Team form standard doc | +1 |
| Compare Formik vs RHF trade-off | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Watch field A → show field B — RHF?** → `watch` / `useWatch`
2. **Edit form load async default — timing?** → `reset(data)` khi fetch xong
3. **Unsaved leave warning — implement?** → `beforeunload` / router blocker

---

### Câu 16 — Performance frontend — re-render và bundle

#### Mục tiêu đánh giá

- Re-render diagnosis
- Bundle analysis
- Core Web Vitals awareness
- Practical optimization hierarchy

#### Đáp án kỳ vọng tổng quát

**Re-render:** React re-render khi state/props/context parent đổi. Tối ưu: colocate state, split component, memo có căn cứ, virtualize list dài.

**Bundle:** `vite build` + `rollup-plugin-visualizer`; lazy route; tree-shaking; tránh import cả lodash.

**Core Web Vitals:** LCP (hero image), INP (interaction delay), CLS (layout shift).

```
Đo (Lighthouse, Profiler) → Fix largest issue → Đo lại
Ưu tiên: network/asset > bundle split > render > memo micro
```

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| React DevTools Profiler highlight | +1 |
| Colocate state giảm re-render | +1 |
| Route lazy load | +1 |
| Image lazy `loading="lazy"`, size appropriate | +1 |
| Tránh anonymous function prop không cần thiết (khi đã biết impact) | +1 |
| `react-window` / virtualize list dài (concept) | +1 |
| Bundle analyzer đọc chart cơ bản | +1 |
| Debounce search/input | +1 |
| LCP/CLS nghĩa là gì (khái niệm) | +1 |
| Ví dụ fix perf thực tế | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Memo trước khi đo | Cargo cult |
| Import moment.js full locale | Bundle bloat |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| RUM (Datadog/Vercel Analytics) | +1 |
| Perf budget CI (bundle size, Lighthouse) | +1 |
| INP optimization (long task split) | +1 |
| Font loading strategy | +1 |
| SSR/SSG vs CSR perf trade-off | +1 |
| Service worker / cache strategy | +1 |
| Third-party script audit | +1 |
| React concurrent defer update | +1 |
| War room perf incident process | +1 |
| Team perf guild / checklist | +1 |
| Cost CDN vs compute | +1 |
| Document regression test perf | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **LCP chậm do hero 5MB PNG — fix?** → WebP, responsive srcset, priority hint
2. **Table 5000 row DOM — approach?** → virtualization, pagination server-side
3. **CLS do banner load — fix?** → reserve height, skeleton

---

### Câu 17 — Error Boundary và Suspense

#### Mục tiêu đánh giá

- Catch render error không crash whole app
- Suspense fallback UX
- Boundary placement strategy
- Limitation (không bắt async/event)

#### Đáp án kỳ vọng tổng quát

**Error Boundary:** class component hoặc lib (`react-error-boundary`) bắt lỗi **render/lifecycle** con, hiển thị fallback UI.

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Đã xảy ra lỗi</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Thử lại</button>
    </div>
  );
}

<ErrorBoundary FallbackComponent={ErrorFallback} onError={logToSentry}>
  <ProductRoutes />
</ErrorBoundary>
```

**Suspense:** hiển thị fallback khi child lazy load hoặc suspend (React Query `useSuspenseQuery`, Relay).

**Không bắt:** event handler error, async trong effect (cần try/catch), SSR một số case.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Error Boundary mục đích | +1 |
| Fallback UI thay white screen | +1 |
| `Suspense` + `lazy` fallback | +1 |
| Đặt boundary theo route/feature | +1 |
| Log error Sentry/similar | +1 |
| Reset/recover boundary | +1 |
| Không bắt lỗi event handler | +1 |
| try/catch trong async fetch | +1 |
| User-friendly message không leak stack prod | +1 |
| Ví dụ thực tế | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Nghĩ Boundary bắt mọi lỗi | Hiểu sai |
| Không có fallback UI | UX gap |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Nested boundary granular recovery | +1 |
| Suspense data fetching architecture | +1 |
| Error boundary + router integration | +1 |
| Partial hydration error strategy | +1 |
| Retry + exponential backoff UI | +1 |
| Feature flag kill switch broken widget | +1 |
| Postmortem user-facing outage | +1 |
| Testing throw error component | +1 |
| Design system ErrorState component | +1 |
| Compare Boundary vs global window.onerror | +1 |
| Team incident runbook | +1 |
| a11y fallback accessible | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **Lỗi trong `onClick` — Boundary bắt không?** → không, try/catch
2. **Suspense nhiều level — waterfall?** → parallel fetch, single boundary
3. **React Query suspense mode trade-off?** → UX vs error handling complexity

---

### Câu 18 — TypeScript với React — patterns cơ bản

#### Mục tiêu đánh giá

- Typing props, children, events
- Generic component
- infer từ schema/API
- Tránh `any` abuse

#### Đáp án kỳ vọng tổng quát

```tsx
type Product = { id: string; name: string; price: number };

type ProductCardProps = {
  product: Product;
  onSelect?: (id: string) => void;
  children?: React.ReactNode;
};

function ProductCard({ product, onSelect, children }: ProductCardProps) {
  return (
    <article>
      <h2>{product.name}</h2>
      <button onClick={() => onSelect?.(product.id)}>Chọn</button>
      {children}
    </article>
  );
}

// Event typing
function SearchInput({ onChange }: { onChange: (value: string) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  return <input onChange={handleChange} />;
}

// Generic list
function List<T>({ items, renderItem }: { items: T[]; renderItem: (item: T) => React.ReactNode }) {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>}</ul>;
}
```

**Patterns:** `ComponentPropsWithoutRef<'button'>`, `z.infer<typeof schema>`, discriminated union cho variant props.

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Type props interface/type | +1 |
| `React.ReactNode` children | +1 |
| Event type `ChangeEvent`, `MouseEvent` | +1 |
| Optional prop `?` | +1 |
| Union type variant (`variant: 'primary' | 'secondary'`) | +1 |
| Tránh `any` — dùng `unknown` + narrow | +1 |
| Type custom hook return | +1 |
| `FC` vs function declaration (team preference) | +1 |
| Share type với API response | +1 |
| Ví dụ project TS | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| `@ts-ignore` khắp nơi | Type safety fail |
| `any` mọi props | Thiếu TS discipline |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Generic component `<T,>` | +1 |
| Discriminated union exhaustive check | +1 |
| `satisfies` operator usage | +1 |
| OpenAPI/zod generate types pipeline | +1 |
| Strict null check production | +1 |
| Polymorphic `as` prop pattern | +1 |
| Type test `expectTypeOf` | +1 |
| Migration JS → TS incremental | +1 |
| Team TS guideline (no enum vs union) | +1 |
| Performance heavy types (avoid deep infer) | +1 |
| Library `.d.ts` publish | +1 |
| Code review type safety checklist | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

#### Follow-up

1. **`useRef<HTMLInputElement>(null)` — access value?** → optional chaining, effect after mount
2. **Props spread từ DOM — type?** → `ComponentPropsWithoutRef`
3. **API type drift — giải pháp?** → codegen, contract test

---
