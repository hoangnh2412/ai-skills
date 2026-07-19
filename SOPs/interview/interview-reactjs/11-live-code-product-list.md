# Live code — Thiết kế React Product List

> **Yêu cầu:** Ứng viên thiết kế màn hình **danh sách sản phẩm** với search, filter, pagination ở mức **pseudocode / skeleton component** — không cần implement chi tiết từng dòng CSS.  
> **Thời gian gợi ý:** 25–40 phút.
>
> **Dành cho Mid và Senior** — chỉ chấm band Mid/Senior.

---

## Đề bài (đọc cho ứng viên)

Trang e-commerce cần hiển thị **danh sách sản phẩm** với:

- **Search** theo tên sản phẩm (gõ liên tục, không gọi API mỗi keystroke)
- **Filter** theo danh mục (category) và khoảng giá (min/max)
- **Pagination** (page size cố định, ví dụ 20 item/trang)
- Data lấy từ REST API: `GET /api/products?q=&category=&minPrice=&maxPrice=&page=&pageSize=`

**Yêu cầu:**

1. Vẽ cấu trúc component và luồng dữ liệu
2. Thiết kế state (local vs URL vs server state)
3. Pseudocode component/hook chính
4. Xử lý **loading**, **error**, **empty result**
5. (Mid+) Debounce search, sync filter với query API
6. (Senior+) Race condition, cache, accessibility, test strategy

---

## Mục lục

> **Mid và Senior only.**

| Band | Điểm tối đa | Ngưỡng đạt (gợi ý) |
|------|:-----------:|:-------------------:|
| Mid | 10 | 9 |
| Senior (tích lũy) | 22 | 18 |
| *Form* | *16* | |

## Mục tiêu đánh giá

- Component structure & separation of concerns
- State design (search, filter, pagination)
- API integration & debounce
- Loading / error / empty UX
- Production mindset (race, a11y, test)

---

## Đáp án kỳ vọng tổng quát

### Cấu trúc component gợi ý

```text
ProductListPage (container)
├── ProductFilters          — category select, price range, nút Apply/Reset
├── ProductSearchInput      — input + debounce
├── ProductList             — map ProductCard
│   └── ProductCard
├── ProductPagination       — prev/next, page numbers
└── ProductListStatus       — loading spinner, error banner, empty message
```

### State design

| State | Nơi lưu | Ghi chú |
|-------|---------|---------|
| `search`, `category`, `minPrice`, `maxPrice`, `page` | URL query (`useSearchParams`) hoặc `useState` + sync URL | Share link, back button |
| `products`, `totalCount` | Server state — React Query / SWR hoặc `useEffect`+fetch | Không duplicate server data vào global store không cần thiết |
| `debouncedSearch` | Derived từ search + debounce hook | Tránh API spam |

### Pseudocode

```tsx
// hooks/useDebounce.ts
function useDebounce<T>(value: T, delay = 300): T { /* ... */ }

// hooks/useProducts.ts
function useProducts(params: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: ({ signal }) =>
      fetch(`/api/products?${toQueryString(params)}`, { signal })
        .then(r => r.ok ? r.json() : Promise.reject(r)),
    keepPreviousData: true, // optional — UX pagination
  });
}

// ProductListPage.tsx
function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? 1);
  const search = searchParams.get('q') ?? '';
  const debouncedQ = useDebounce(search, 300);

  const { data, isLoading, isError, error } = useProducts({
    q: debouncedQ,
    category: searchParams.get('category') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    page,
    pageSize: 20,
  });

  // Reset page về 1 khi filter/search đổi
  useEffect(() => {
    if (page !== 1) setSearchParams(prev => { prev.set('page', '1'); return prev; });
  }, [debouncedQ, /* other filters */]);

  if (isLoading) return <ProductListSkeleton />;
  if (isError) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data?.items.length) return <EmptyState />;

  return (
    <>
      <ProductSearchInput value={search} onChange={...} />
      <ProductFilters ... />
      <ProductList products={data.items} />
      <ProductPagination page={page} total={data.totalCount} pageSize={20} />
    </>
  );
}
```

**Điểm cần nhắc:**

- Debounce search 300ms; filter giá/category có thể Apply button hoặc debounce riêng
- Reset `page=1` khi tiêu chí tìm kiếm đổi
- `AbortController` / React Query `signal` tránh race khi gõ nhanh
- Loading: skeleton list; Error: message + retry; Empty: gợi ý clear filter
- `key={product.id}` ổn định, không dùng index

---

## Tiêu chí chấm điểm — Mid (tổng: 10 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Tách component rõ (list, filter, search, pagination) | +1 |
| State design hợp lý (query params hoặc local + API params) | +1 |
| Debounce search | +1 |
| Gọi API với đủ query param (q, filter, page) | +1 |
| Loading state | +1 |
| Error state + retry (concept) | +1 |
| Empty state khi không có kết quả | +1 |
| Pagination tính total/page đúng | +1 |
| Reset page khi filter/search đổi | +1 |
| `key` ổn định cho list item | +1 |

**Red flags Mid**

| Dấu hiệu | Đánh giá |
|----------|----------|
| Gọi API mỗi keystroke không debounce | Perf/API abuse |
| Một component 300 dòng chứa hết logic | Thiếu structure |
| Không xử lý loading/error | UX gap |

---

## Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

> **Điều kiện tiên quyết:** Đạt Mid

| Tiêu chí | Điểm |
|----------|------|
| Abort / cancel request tránh race condition | +1 |
| React Query hoặc SWR (cache, stale, refetch) | +1 |
| URL sync — shareable link, browser back | +1 |
| `keepPreviousData` / skeleton khi chuyển trang | +1 |
| Custom hook tách data fetching (`useProducts`) | +1 |
| a11y: label search, live region loading, keyboard pagination | +1 |
| Test strategy (RTL mock fetch, filter interaction) | +1 |
| Optimistic UI hoặc prefetch page tiếp (bonus trade-off) | +1 |
| Phân tích client filter vs server filter | +1 |
| TypeScript types `Product`, `ProductQueryParams` | +1 |
| Error boundary vs inline error | +1 |
| Performance: memo `ProductCard`, virtualize nếu list lớn (concept) | +1 |

**Pass criteria:** Mid 9/10 · Senior 18/22

---

## Follow-up

1. **User gõ "phone" rồi xóa nhanh — API response về sai thứ tự — xử lý?** → abort signal, ignore stale response, React Query dedupe
2. **Filter 10 category — load category từ API riêng?** → parallel query, loading cascade tránh
3. **Deep link `/products?q=laptop&page=3` — implement?** → `useSearchParams` init state từ URL

---
