# Bộ câu hỏi React — Cơ bản

> 9 câu: JSX/Virtual DOM, props/state, hooks, effect, controlled/uncontrolled, keys, events, styling, fetch data.
>
> **Dành cho Junior, Mid và Senior** — chỉ chấm band rubric tương ứng.
>
> **Format mỗi câu:** Mục tiêu đánh giá → Đáp án kỳ vọng → Tiêu chí Junior/Mid/Senior (+1 điểm) → Red flags → Pass criteria → Follow-up.
>
> **Tham chiếu:** [brainstoming-reactjs.md](../brainstoming-reactjs.md) · [14-form-phong-van.md](./14-form-phong-van.md)

---

## Mục lục

> **Junior, Mid và Senior.** Điểm Mid/Senior = tích lũy/câu.

| # | Câu hỏi | Junior (max) | Mid (max) | Senior (max) |
|---|--------|:------------:|:---------:|:------------:|
| 1 | [JSX và Virtual DOM hoạt động như thế nào?](#câu-1-jsx-và-virtual-dom-hoạt-động-như-thế-nào) | 8 | 18 | 30 |
| 2 | [Props và State khác nhau thế nào?](#câu-2-props-và-state-khác-nhau-thế-nào) | 8 | 18 | 30 |
| 3 | [`useState` và `useReducer` — khi nào dùng gì?](#câu-3-usestate-và-usereducer--khi-nào-dùng-gì) | 8 | 18 | 30 |
| 4 | [`useEffect` và dependency array](#câu-4-useeffect-và-dependency-array) | 8 | 18 | 30 |
| 5 | [Controlled vs Uncontrolled components](#câu-5-controlled-vs-uncontrolled-components) | 8 | 18 | 30 |
| 6 | [List keys trong React](#câu-6-list-keys-trong-react) | 8 | 18 | 30 |
| 7 | [Synthetic events trong React](#câu-7-synthetic-events-trong-react) | 8 | 18 | 30 |
| 8 | [Styling: CSS Modules, Tailwind, CSS-in-JS](#câu-8-styling-css-modules-tailwind-css-in-js) | 8 | 18 | 30 |
| 9 | [Fetch data cơ bản (`useEffect`, loading/error)](#câu-9-fetch-data-cơ-bản-useeffect-loadingerror) | 8 | 18 | 30 |
| | **Tổng điểm tối đa** | **72** | **162** | **270** |
| | **Tổng ngưỡng đạt (gợi ý)** | **45** | **126** | **216** |
| | *Điểm tối đa trên [form](./14-form-phong-van.md)* | *72* | | |

---

### Câu 1 — JSX và Virtual DOM hoạt động như thế nào?

#### Mục tiêu đánh giá

- Hiểu JSX không phải HTML thuần
- Nắm khái niệm Virtual DOM và reconciliation
- Giải thích được luồng render cơ bản
- Phân biệt declarative UI vs thao tác DOM trực tiếp

#### Đáp án kỳ vọng tổng quát

**JSX** là cú pháp mở rộng (syntactic sugar) mô tả cấu trúc UI; build tool (Babel/SWC) biên dịch thành lời gọi `React.createElement` (hoặc JSX runtime mới).

```jsx
// JSX
function Greeting({ name }) {
  return <h1 className="title">Xin chào, {name}</h1>;
}

// Tương đương (đơn giản hóa)
React.createElement('h1', { className: 'title' }, `Xin chào, ${name}`);
```

**Virtual DOM:** biểu diễn cây UI trong bộ nhớ (plain object). Khi state/props đổi, React tạo Virtual DOM mới, **diff** với bản trước, rồi **commit** thay đổi tối thiểu lên DOM thật (reconciliation).

**Lợi ích:** code declarative, batch update, tối ưu patch DOM. **Không phải:** Virtual DOM luôn nhanh hơn thao tác DOM tay trong mọi case.

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết JSX trông giống HTML nhưng là JavaScript | +1 |
| Biết `className` thay cho `class` | +1 |
| Biết expression trong `{}` | +1 |
| Biết component phải return một root (hoặc Fragment) | +1 |
| Giải thích Virtual DOM là “bản sao UI trong memory” | +1 |
| Biết React so sánh và cập nhật DOM thật | +1 |
| Đưa ví dụ component đơn giản | +1 |
| Giải thích được cho người non-tech | +1 |

**Ví dụ trả lời đạt Junior:** JSX giống “bản thảo UI” — bạn mô tả giao diện mong muốn; React lo việc sửa DOM thật khi dữ liệu đổi.

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Nghĩ JSX chạy trực tiếp trên browser không build | Thiếu nền tảng tooling |
| Nghĩ Virtual DOM = DOM thật | Sai concept |
| Không biết Fragment `<>...</>` | Hạn chế cấu trúc |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Biết JSX compile sang `createElement`/JSX runtime | +1 |
| Hiểu reconciliation và “diff” ở mức khái niệm | +1 |
| Biết key ảnh hưởng reorder list (liên hệ Câu 6) | +1 |
| Phân biệt render phase vs commit phase (khái niệm) | +1 |
| Biết Strict Mode double render dev (React 18+) | +1 |
| Hiểu `dangerouslySetInnerHTML` rủi ro XSS | +1 |
| Biết một component re-render khi state/props đổi | +1 |
| Đưa ví dụ thực tế trong project | +1 |
| Hiểu tại sao không nên mutate DOM ngoài React | +1 |
| Nêu trade-off declarative vs imperative | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| “Virtual DOM luôn nhanh hơn mọi framework” | Hiểu hời hợt |
| Sửa DOM trực tiếp bằng `document.querySelector` trong component | Anti-pattern |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Hiểu Fiber architecture ở mức overview (concurrent) | +1 |
| Biết batching updates (React 18 automatic batching) | +1 |
| Phân tích khi nào re-render “đắt” | +1 |
| Liên hệ React Compiler / memoization tương lai (nếu biết) | +1 |
| So sánh khái niệm với Svelte/Vue (không cần sâu) | +1 |
| Impact hydration SSR/CSR | +1 |
| Debug render với React DevTools | +1 |
| Guideline team: tránh anti-pattern DOM | +1 |
| Refactor case: tách component giảm re-render | +1 |
| Trade-off micro-frontend nhiều React root | +1 |
| Onboarding: giải thích JSX cho junior | +1 |
| Architectural note trong ADR | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Tại sao không dùng `index` làm key?** → identity list, reorder bug (Câu 6)
2. **Fragment có tạo node DOM không?** → không, chỉ grouping
3. **SSR: HTML server + hydrate client — JSX liên quan thế nào?** → same tree, mismatch risk

---

### Câu 2 — Props và State khác nhau thế nào?

#### Mục tiêu đánh giá

- Data flow một chiều (parent → child)
- Immutability props
- Local state ownership
- Tránh anti-pattern “sửa props”

#### Đáp án kỳ vọng tổng quát

| | **Props** | **State** |
|---|-----------|-----------|
| Nguồn | Parent truyền xuống | Khai báo trong component (`useState`, …) |
| Mutate | **Không** sửa trực tiếp (read-only) | Cập nhật qua setter (`setState`) |
| Mục đích | Cấu hình, dữ liệu hiển thị, callback | Trạng thái nội bộ UI tương tác |

```jsx
function Counter({ initial = 0, onChange }) {
  const [count, setCount] = useState(initial);

  return (
    <button onClick={() => {
      const next = count + 1;
      setCount(next);
      onChange?.(next);
    }}>
      {count}
    </button>
  );
}
```

**Lifting state up:** state dùng chung nhiều sibling → đưa lên parent chung.

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết props do parent truyền | +1 |
| Biết state thuộc component | +1 |
| Biết không gán `props.x = ...` | +1 |
| Biết `useState` cập nhật state | +1 |
| Phân biệt props vs state bằng ví dụ | +1 |
| Biết default props / default parameter | +1 |
| Đưa ví dụ form/button đơn giản | +1 |
| Giải thích một chiều parent → child | +1 |

**Ví dụ trả lời đạt Junior:** Props như “cài đặt từ ngoài vào”; state như “bộ nhớ riêng của component” (ví dụ ô input đang gõ).

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Mutate object trong props | Bug khó trace |
| Mọi thứ đều state global không cần | Thiếu tư duy phạm vi |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Lifting state up có ví dụ | +1 |
| Controlled component: value từ props/state | +1 |
| Biết derived state (tính từ props) cẩn thận | +1 |
| Tránh sync props → state không cần (`useEffect` copy props) | +1 |
| Children as function / render props (khái niệm) | +1 |
| Prop drilling và hướng giải (context — nhắc Câu 11 file 04) | +1 |
| Immutable update object/array state | +1 |
| TypeScript props interface (nếu dùng TS) | +1 |
| Đưa ví dụ project | +1 |
| Phân tích maintainability | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Duplicate state: props + state cùng field sync bằng effect | Bug classic |
| Truyền quá 5–6 tầng props không refactor | Prop drilling |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết kế state ownership rõ (container/presentational) | +1 |
| Colocation state: đặt gần nơi dùng | +1 |
| Server state vs UI state (nhắc React Query — file 04) | +1 |
| Refactor prop drilling → context/hook | +1 |
| Impact testing (mock props, user event) | +1 |
| Performance: tránh pass object mới mỗi render vô tội vạ | +1 |
| Composition thay vì config props khổng lồ | +1 |
| Guideline team về public API component | +1 |
| Versioning breaking props change | +1 |
| Trade-off global store sớm vs local state | +1 |
| Mentor junior nhận diện duplicate state | +1 |
| ADR state placement | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **`initial` props đổi sau mount — count có đổi không?** → uncontrolled initial vs controlled key remount
2. **Khi nào state nên ở URL (router)?** → shareable bookmark state
3. **Object/function props gây re-render child?** → reference equality, memo (file 04)

---

### Câu 3 — `useState` và `useReducer` — khi nào dùng gì?

#### Mục tiêu đánh giá

- Chọn hook phù hợp độ phức tạp state
- Update functional, immutability
- Tư duy predictable state transitions
- Liên hệ form/state machine

#### Đáp án kỳ vọng tổng quát

**`useState`:** state đơn giản, ít field liên quan, update độc lập.

**`useReducer`:** state phức tạp, nhiều sub-field, logic update tập trung, transition rõ (`action` → `state`).

```jsx
function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.name]: action.value };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function Form() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  // dispatch({ type: 'SET_FIELD', name: 'email', value: 'a@b.com' })
}
```

**Quy tắc thực dụng:** bắt đầu `useState`; khi có nhiều `setState` liên quan hoặc logic phân nhánh → cân nhắc `useReducer`.

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết `useState` khai báo local state | +1 |
| Biết setter `setCount` / `setState` | +1 |
| Biết update dựa state trước: `setCount(c => c + 1)` | +1 |
| Biết `useReducer` có `state` + `dispatch` | +1 |
| Đưa ví dụ counter hoặc toggle | +1 |
| Biết không mutate state trực tiếp | +1 |
| Giải thích đơn giản khi nào dùng reducer | +1 |
| Ví dụ form 2–3 field | +1 |

**Ví dụ trả lời đạt Junior:** `useState` cho bật/tắt modal; `useReducer` khi form có nhiều field + validate + reset cùng lúc.

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| `setState(state.value + 1)` closure stale trong loop | Bug async state |
| Mutate `state.items.push()` | React không re-render đúng |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| So sánh rõ useState vs useReducer | +1 |
| Reducer pure function, không side effect | +1 |
| Lazy init: `useReducer(reducer, init, initFn)` | +1 |
| Kết hợp Context + reducer (pattern) | +1 |
| Tránh reducer quá lớn — tách domain | +1 |
| Testing reducer độc lập | +1 |
| So sánh với Zustand/Redux khi scale (khái niệm) | +1 |
| Đưa ví dụ production | +1 |
| Immutable update nested object | +1 |
| Trade-off boilerplate reducer | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Mọi component đều useReducer “cho chuẩn” | Over-engineering |
| Side effect trong reducer | Sai pattern |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| State machine / XState khi nào (overview) | +1 |
| Colocation vs global: quyết định kiến trúc | +1 |
| Performance: tránh unnecessary dispatch | +1 |
| Migrate useState → reducer có kế hoạch | +1 |
| Concurrent updates + transition (React 18) | +1 |
| Guideline team chọn hook | +1 |
| Refactor case study | +1 |
| Impact a11y (form error state tập trung) | +1 |
| Trade-off Redux Toolkit vs local reducer | +1 |
| Code review checklist state | +1 |
| Onboarding ví dụ [brainstoming-reactjs.md](../brainstoming-reactjs.md) | +1 |
| Document pattern trong wiki nội bộ | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Gọi `setState` 3 lần liên tiếp trong một event — kết quả?** → batching
2. **Reducer vs Zustand store — ranh giới?** → app-wide vs feature-local
3. **Form 20 field — reducer hay React Hook Form?** → file 04 Câu 15

---

### Câu 4 — `useEffect` và dependency array

#### Mục tiêu đánh giá

- Side effect sau render
- Dependency array đúng/sai
- Cleanup function
- Tránh effect thừa, race condition fetch

#### Đáp án kỳ vọng tổng quát

`useEffect(fn, deps)` chạy **sau** paint (thường dùng sync DOM bên ngoài, subscription, fetch legacy). `deps` rỗng `[]` ≈ mount/unmount; không truyền deps → mỗi render (hiếm khi cần).

```jsx
useEffect(() => {
  const controller = new AbortController();
  async function load() {
    const res = await fetch(`/api/users/${id}`, { signal: controller.signal });
    const data = await res.json();
    setUser(data);
  }
  load();
  return () => controller.abort(); // cleanup
}, [id]);
```

**Quy tắc:** mọi giá trị từ component dùng trong effect nên có trong deps (hoặc eslint `react-hooks/exhaustive-deps`). **Cleanup:** hủy subscription, timer, abort fetch.

**Lưu ý React 18+:** data fetching nên cân nhắc React Query / `use` — effect vẫn cần hiểu cho maintenance.

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết effect chạy sau render | +1 |
| Biết `[]` chạy một lần mount (và cleanup unmount) | +1 |
| Biết deps có `id` thì chạy lại khi `id` đổi | +1 |
| Biết return cleanup function | +1 |
| Ví dụ fetch hoặc `document.title` | +1 |
| Biết effect không phải “lifecycle class” 1:1 | +1 |
| Tránh vòng lặp setState trong effect không deps | +1 |
| Giải thích đơn giản | +1 |

**Ví dụ trả lời đạt Junior:** Đổi `userId` → effect chạy lại → gọi API user mới; rời trang → cleanup hủy request.

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Effect không deps + setState → infinite loop | Bug kinh điển |
| Quên cleanup interval | Memory leak |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| `exhaustive-deps` và khi disable có lý do | +1 |
| Race condition: response cũ ghi đè mới | +1 |
| AbortController / flag `ignore` | +1 |
| Phân biệt `useEffect` vs `useLayoutEffect` | +1 |
| Không dùng effect sync props → state (anti-pattern) | +1 |
| `useEffectEvent` / tách logic (React 19+ nếu biết) | +1 |
| Strict Mode double invoke dev — hiểu | +1 |
| Đưa ví dụ bug deps thiếu | +1 |
| Khi nào **không** cần effect (derived render) | +1 |
| Event handler thay vì effect cho user action | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Mọi logic đều nhét vào effect | Thiếu tư duy |
| Copy object vào deps gây chạy liên tục | Reference instability |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Data fetching chuyển React Query — lý do | +1 |
| Effect vs event: architectural rule | +1 |
| SSR: effect không chạy server — hydration pitfall | +1 |
| Performance: effect chạy quá nhiều — đo Profiler | +1 |
| WebSocket/subscription pattern chuẩn | +1 |
| Team eslint rule + review | +1 |
| Refactor loại bỏ effect thừa case study | +1 |
| Testing effect với RTL `waitFor` | +1 |
| Trade-off imperative animation + effect | +1 |
| Document “effect checklist” | +1 |
| Mentor nhận diện infinite loop | +1 |
| Liên hệ [12-review-code](./12-review-code.md) lỗi effect | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Fetch trong effect vs React Query — chọn nào?** → cache, dedupe, stale time
2. **`useLayoutEffect` cho tooltip đo kích thước?** → tránh flicker
3. **Object dep `[options]` mỗi render mới — fix?** → `useMemo`, stable ref

---

### Câu 5 — Controlled vs Uncontrolled components

#### Mục tiêu đánh giá

- Single source of truth cho form input
- Ref với uncontrolled
- Khi nào chọn từng hướng
- Liên hệ React Hook Form (file 04)

#### Đáp án kỳ vọng tổng quát

**Controlled:** giá trị input do React state (`value` + `onChange`). React là source of truth.

```jsx
function EmailField() {
  const [email, setEmail] = useState('');
  return (
    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  );
}
```

**Uncontrolled:** DOM giữ giá trị; đọc qua `ref` khi submit (`defaultValue`).

```jsx
function EmailField() {
  const inputRef = useRef(null);
  const handleSubmit = () => console.log(inputRef.current?.value);
  return <input ref={inputRef} defaultValue="" />;
}
```

| | Controlled | Uncontrolled |
|---|------------|--------------|
| Validate realtime | Dễ | Khó hơn |
| Reset programmatic | `setState('')` | DOM/ref |
| Performance form lớn | Có thể nhiều re-render | Ít re-render hơn (một phần) |

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết controlled = `value` + `onChange` | +1 |
| Biết uncontrolled dùng `ref` / `defaultValue` | +1 |
| Ví dụ input text đơn giản | +1 |
| Biết checkbox `checked` vs `defaultChecked` | +1 |
| Giải thích “React kiểm soát giá trị” | +1 |
| Biết không mix `value` + `defaultValue` | +1 |
| Select `<select value={}>` controlled | +1 |
| Đưa ví dụ form login | +1 |

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Input có `value` không `onChange` — warning | Read-only bug |
| Không biết ref | Hạn chế uncontrolled |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| File input thường uncontrolled | +1 |
| Validate on blur vs on change | +1 |
| Controlled textarea | +1 |
| Tránh re-render: React Hook Form register (nhắc) | +1 |
| `key` remount reset uncontrolled | +1 |
| A11y: label `htmlFor`, `aria-invalid` | +1 |
| Đưa ví dụ project | +1 |
| So sánh trade-off form lớn | +1 |
| Native form `onSubmit` preventDefault | +1 |
| Composition controlled wrapper component | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| 50 field controlled tự viết không tối ưu | Performance |
| Không `preventDefault` submit reload page | Bug cơ bản |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Thiết kế form library nội bộ / RHF | +1 |
| Schema validation Zod + controlled | +1 |
| Multi-step wizard state strategy | +1 |
| i18n input format (số, ngày) | +1 |
| Test RTL `userEvent.type` controlled | +1 |
| Guideline team: default controlled | +1 |
| Migration uncontrolled → controlled | +1 |
| Trade-off a11y custom component | +1 |
| Security: không tin client validate alone | +1 |
| ADR form approach | +1 |
| Review [11-live-code](./11-live-code-product-list.md) pattern | +1 |
| Mentor junior nhận warning controlled | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **File upload controlled được không?** → khó, thường uncontrolled
2. **RHF `register` — controlled hay uncontrolled?** → ref-based, ít re-render
3. **Reset form sau submit — cách nào sạch?** → `reset()` RHF vs key remount

---

### Câu 6 — List keys trong React

#### Mục tiêu đánh giá

- Identity element trong list
- Reconciliation khi reorder
- Tránh index làm key khi list động
- Performance và bug UI state

#### Đáp án kỳ vọng tổng quát

**Key** giúp React nhận diện item qua các lần render — đặc biệt khi **reorder, insert, delete**.

```jsx
// Tốt: id ổn định từ server
{users.map((user) => (
  <UserRow key={user.id} user={user} />
))}

// Rủi ro: index khi list thay đổi thứ tự / filter
{items.map((item, index) => (
  <Row key={index} item={item} /> // bug state input khi xóa giữa list
))}
```

**Key phải:** unique trong siblings, **stable** (không đổi giữa render nếu cùng entity). **Không** truyền key xuống component con qua props — React dùng nội bộ.

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết list cần `key` | +1 |
| Biết key unique trong list | +1 |
| Biết dùng `id` từ data | +1 |
| Biết index key rủi ro khi reorder | +1 |
| Ví dụ `map` render list | +1 |
| Biết key không phải attribute DOM | +1 |
| Giải thích đơn giản | +1 |
| Fragment list `key` trên Fragment | +1 |

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không key — warning | Thiếu cơ bản |
| `key={Math.random()}` | Re-mount mỗi render |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Bug: input state nhảy khi xóa row dùng index key | +1 |
| Key khi filter list — entity id vẫn đúng | +1 |
| Không key trên component bọc sai chỗ | +1 |
| `key` force remount khi đổi user ( intentional ) | +1 |
| Nested list: key scope sibling | +1 |
| Virtualized list (react-window) key | +1 |
| Đưa ví dụ bug production | +1 |
| UUID client-side khi chưa có id | +1 |
| Anti-pattern random/uuid mỗi render | +1 |
| Liên hệ reconciliation Câu 1 | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Index key trên sortable table | UX bug |
| Generate uuid trong render làm key | Performance + state loss |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Drag-drop reorder + key strategy | +1 |
| Animation list `layout` + key | +1 |
| Server pagination: key stable across pages | +1 |
| Impact test snapshot list | +1 |
| Profiler: unnecessary unmount do key | +1 |
| Guideline code review key | +1 |
| Refactor index → id migration | +1 |
| Trade-off composite key `(type-id)` | +1 |
| Multi-tenant list collision awareness | +1 |
| Document trong [12-review-code](./12-review-code.md) | +1 |
| Mentor demo bug index key | +1 |
| Architectural list component API | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Hai item cùng id duplicate — hậu quả?** → reconciliation lỗi
2. **Key trên `<>...</>` — được không?** → `Fragment` với `key`
3. **Table expand row — key ở đâu?** → row id, không index

---

### Câu 7 — Synthetic events trong React

#### Mục tiêu đánh giá

- Event delegation và pooling (lịch sử)
- `preventDefault`, `stopPropagation`
- Khác biệt với native event
- Handler và performance cơ bản

#### Đáp án kỳ vọng tổng quát

React bọc native event thành **SyntheticEvent** — cùng API (`preventDefault`, `target`, `currentTarget`) nhưng cross-browser normalized. React 17+ gắn listener ở **root** container (không document) — delegation hiện đại.

```jsx
function Form() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // gửi API
  };
  return <form onSubmit={handleSubmit}>...</form>;
}

function List() {
  return (
    <ul onClick={(e) => {
      if (e.target.matches('button[data-id]')) {
        const id = e.target.dataset.id;
        // event delegation pattern
      }
    }}>
      ...
    </ul>
  );
}
```

**Lưu ý:** `e.persist()` hầu như không cần (React 17+ không pool). Async handler: lấy `value` trước hoặc dùng `e.currentTarget`.

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết `onClick`, `onChange` camelCase | +1 |
| Biết `preventDefault` form submit | +1 |
| Biết `stopPropagation` cơ bản | +1 |
| Pass handler reference hoặc inline | +1 |
| Biết SyntheticEvent là wrapper | +1 |
| Ví dụ button click | +1 |
| `onSubmit` form vs `onClick` button type submit | +1 |
| Giải thích đơn giản | +1 |

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| `onclick` lowercase trong JSX | Sai JSX |
| Quên preventDefault form reload | Bug |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| Event delegation trên parent | +1 |
| `currentTarget` vs `target` | +1 |
| Keyboard `onKeyDown` Enter accessibility | +1 |
| Không bind arrow function mới mỗi render nếu gây re-render child memo | +1 |
| Passive listener scroll (native addEventListener) | +1 |
| React 17+ event root thay đổi (khái niệm) | +1 |
| Custom event native vs React | +1 |
| Đưa ví dụ project | +1 |
| Touch/mobile click delay (historical) | +1 |
| stopPropagation vs preventDefault khác nhau rõ | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Đọc `e.target.value` async sau await không lưu | Stale |
| Inline handler phức tạp trong list 10k row | Perf |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| `useEffectEvent` cho stable handler (nếu biết) | +1 |
| Portal event bubbling (`react-dom`) | +1 |
| Capture phase `onClickCapture` | +1 |
| A11y: synthetic vs native focus management | +1 |
| Performance: delegated vs per-item handler | +1 |
| Testing `userEvent` vs `fireEvent` | +1 |
| Global listener cleanup pattern | +1 |
| Guideline handler extraction `useCallback` | +1 |
| Security: clickjacking UI overlay (awareness) | +1 |
| Refactor remove unnecessary bind | +1 |
| Cross-browser bug case | +1 |
| Document event conventions team | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **List 1000 item — onClick từng item hay delegate?** → delegation + key
2. **`e.stopPropagation()` trong modal overlay?** → close behavior
3. **React event vs `addEventListener` window scroll?** → effect + native

---

### Câu 8 — Styling: CSS Modules, Tailwind, CSS-in-JS

#### Mục tiêu đánh giá

- Biết các hướng style phổ biến trong React
- Trade-off scope, bundle, DX
- Tránh style toàn cục conflict
- Team consistency

#### Đáp án kỳ vọng tổng quát

| Cách | Đặc điểm | Trade-off |
|------|----------|-----------|
| **Global CSS / SCSS** | Đơn giản, quen | Dễ conflict class, khó scale |
| **CSS Modules** | `import styles from './X.module.css'` — class hash local | Cần build; ít dynamic theme runtime |
| **Tailwind** | Utility class, design token | HTML dài; cần discipline; purge tree-shake |
| **CSS-in-JS** (styled-components, Emotion) | Style gần component, dynamic props | Runtime cost (giảm dần với zero-runtime như Linaria/Vanilla Extract) |

```jsx
// CSS Modules
import styles from './Card.module.css';
export function Card() {
  return <div className={styles.root}>...</div>;
}

// Tailwind
export function Card() {
  return <div className="rounded-lg border p-4 shadow">...</div>;
}
```

**Chọn:** theo team, design system, performance budget, SSR (CSS-in-JS cần cấu hình extract SSR).

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết `className` thay `class` | +1 |
| Biết import file CSS vào component | +1 |
| Biết CSS Modules scope local | +1 |
| Nhận diện Tailwind utility class | +1 |
| Biết inline `style={{}}` cho giá trị động đơn giản | +1 |
| Tránh inline style mọi thứ | +1 |
| Ví dụ component có style | +1 |
| Giải thích ưu nhược 1 cách | +1 |

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| `style="..."` string trong JSX | Sai React |
| Global class trùng tên phá layout | Thiếu scope |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| So sánh ít nhất 2 hướng (Modules vs Tailwind) | +1 |
| Tailwind `cn()` / merge conflict | +1 |
| CSS-in-JS dynamic prop theme | +1 |
| Design token / variables CSS | +1 |
| Dark mode strategy | +1 |
| SSR flash FOUC với CSS-in-JS | +1 |
| Co-locate style với component | +1 |
| Đưa ví dụ project stack | +1 |
| BEM với SCSS (nếu legacy) | +1 |
| Accessibility: không chỉ màu | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Mix 3 hệ thống không lý do | Inconsistent |
| Tailwind arbitrary value lạm dụng | Unmaintainable |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Bundle impact: CSS-in-JS runtime | +1 |
| Micro-frontend style isolation | +1 |
| Design system (Storybook, tokens) | +1 |
| Critical CSS / performance | +1 |
| Migration global → Modules plan | +1 |
| Trade-off [06-cau-hoi-phan-tich](./06-cau-hoi-phan-tich.md) CSS vs CSS-in-JS | +1 |
| Team ADR chọn stack | +1 |
| Linaria/Vanilla Extract zero-runtime | +1 |
| Component library (MUI/Chakra) theming | +1 |
| Print stylesheet / email template khác stack | +1 |
| Review aesthetic + consistency | +1 |
| Liên hệ Core Web Vitals CLS | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Tailwind + CSS Modules cùng project — ổn không?** → convention layer
2. **Theme runtime đổi màu brand — cách nào?** → CSS variables
3. **styled-components SSR Next.js — chú ý gì?** → registry, extract

---

### Câu 9 — Fetch data cơ bản (`useEffect`, loading/error)

#### Mục tiêu đánh giá

- Async trong component
- UI state loading/error/empty
- Race condition cơ bản
- Nền tảng trước React Query (file 04)

#### Đáp án kỳ vọng tổng quát

```jsx
function UserProfile({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/users/${userId}`, { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err);
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [userId]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;
  if (!data) return <p>Không có dữ liệu</p>;
  return <div>{data.name}</div>;
}
```

**Best practice:** tách custom hook `useUser(userId)`; production ưu tiên **React Query** (cache, retry, stale).

#### Tiêu chí chấm điểm — Junior (tổng: 8 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Biết gọi `fetch` hoặc axios trong effect | +1 |
| Có state `loading` | +1 |
| Có state `error` | +1 |
| Hiển thị UI theo 3 trạng thái | +1 |
| `userId` trong dependency | +1 |
| `res.ok` hoặc check status | +1 |
| Ví dụ list/detail đơn giản | +1 |
| Giải thích luồng | +1 |

**Red flags Junior**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không loading → flash empty | UX kém |
| Fetch không deps → stale data | Bug |
| Không handle error | Crash UX |

#### Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

> **Điều kiện tiên quyết:** Đạt phần Junior

| Tiêu chí | Điểm |
|----------|------|
| AbortController cleanup | +1 |
| Race: request cũ không ghi đè | +1 |
| Tách `useUser` custom hook | +1 |
| Auth header / base URL env | +1 |
| JSON parse error handling | +1 |
| Empty array vs null distinction | +1 |
| Retry button UX | +1 |
| Không fetch trong render body | +1 |
| Đưa ví dụ thực tế | +1 |
| Nhắc React Query thay thế (file 04) | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Lưu token trong localStorage không biết XSS risk | Security gap (file 10) |
| Fetch mỗi render | Infinite request |

#### Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| React Query: staleTime, cache, invalidate | +1 |
| Optimistic update concept | +1 |
| Pagination fetch pattern | +1 |
| Error boundary cho render error vs fetch error | +1 |
| Suspense data fetching (React 19 / framework) | +1 |
| SSR data load (loader) | +1 |
| Observability: log correlation id | +1 |
| Type-safe API client (OpenAPI/tRPC) | +1 |
| Guideline: không duplicate fetch logic | +1 |
| Refactor effect → Query case | +1 |
| Trade-off SWR vs React Query | +1 |
| Liên hệ [brainstoming-reactjs.md](../brainstoming-reactjs.md) server state | +1 |

**Pass criteria:** Junior 5/8 · Mid 14/18 · Senior 24/30

#### Follow-up

1. **Double fetch Strict Mode — có sao không?** → dev only, Abort/cleanup
2. **POST sau fetch list — refresh data?** → invalidate query
3. **WebSocket vs polling — khi nào?** → realtime requirement

---
