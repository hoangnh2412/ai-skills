# Review code — Tìm lỗi trong component React mẫu

> **Yêu cầu:** Đưa đoạn code dưới cho ứng viên (không kèm đáp án). Yêu cầu **chỉ ra từng lỗi/rủi ro**, giải thích và gợi ý sửa.  
> **Thời gian gợi ý:** 20–35 phút.
>
> **Dành cho Senior** — chỉ chấm band Senior.

---

## Mục lục

> **Senior only.**

| Band | Điểm tối đa | Ngưỡng đạt (gợi ý) |
|------|:-----------:|:-------------------:|
| Senior | 12 | 9 |
| *Form* | *15* | |

## Đề bài (đưa cho ứng viên)

Component sau hiển thị danh sách user theo team và cho phép chọn user để xem chi tiết.  
Hãy **review** và liệt kê các vấn đề về:

- `useEffect` dependency
- Stale closure trong event handler
- List `key`
- Fetch race condition / cleanup
- Cleanup khi unmount

```tsx
// UserList.tsx
L1:  import { useState, useEffect } from 'react';
L2:
L3:  type User = { id: string; name: string; teamId: string };
L4:
L5:  export function UserList({ teamId }: { teamId: string }) {
L6:    const [users, setUsers] = useState<User[]>([]);
L7:    const [selectedId, setSelectedId] = useState<string | null>(null);
L8:    const [loading, setLoading] = useState(false);
L9:
L10:    useEffect(() => {
L11:      setLoading(true);
L12:      fetch(`/api/teams/${teamId}/users`)
L13:        .then(res => res.json())
L14:        .then(data => {
L15:          setUsers(data);
L16:          setLoading(false);
L17:        });
L18:    }, []); // fetch once on mount
L19:
L20:    const handleSelect = () => {
L21:      const user = users.find(u => u.id === selectedId);
L22:      console.log('Selected:', user?.name);
L23:    };
L24:
L25:    return (
L26:      <div>
L27:        <button onClick={handleSelect}>Log selected user</button>
L28:        {loading && <p>Loading...</p>}
L29:        <ul>
L30:          {users.map((user, index) => (
L31:            <li
L32:              key={index}
L33:              onClick={() => setSelectedId(user.id)}
L34:              className={selectedId === user.id ? 'active' : ''}
L35:            >
L36:              {user.name}
L37:            </li>
L38:          ))}
L39:        </ul>
L40:      </div>
L41:    );
L42:  }
```

---

## Mục tiêu đánh giá

- Đọc code React production-style
- Phát hiện hooks anti-pattern phổ biến
- Ưu tiên mức độ nghiêm trọng
- Đề xuất sửa cụ thể

---

## Đáp án kỳ vọng (dành cho interviewer)

| # | Dòng | Vấn đề | Loại | Giải thích / Sửa |
|---|------|--------|------|------------------|
| 1 | **L18** | Thiếu `teamId` trong dependency array (`[]`) | useEffect deps | Khi `teamId` prop đổi, list không refetch — data stale. Sửa: `[teamId]` |
| 2 | **L12–L17** | Không abort / cleanup — race condition | fetch race | Request cũ có thể resolve sau request mới → hiển thị sai team. Dùng `AbortController` + cleanup `return () => abort()` |
| 3 | **L12–L17** | Không handle error | error handling | Network fail → loading stuck `true`. Thêm `.catch`, error state |
| 4 | **L13** | Không check `res.ok` | error handling | 404/500 vẫn parse JSON lỗi |
| 5 | **L15–L16** | `setState` sau unmount | missing cleanup | Warning + memory leak tiềm ẩn. Abort fetch hoặc flag `cancelled` |
| 6 | **L20–L23** | Stale closure — `users` và `selectedId` capture cũ | stale closure | Handler không dùng functional update; truyền id: `onClick={() => handleSelect(user.id)}` |
| 7 | **L27**, **L33** | Button log selected nhưng click list set id — flow confusing | logic bug | Handler nên nhận `userId` param; hoặc log ngay trong `onClick` list item |
| 8 | **L32** | Dùng `key={index}` | list keys | Reorder/filter gây re-mount sai, mất state DOM. Dùng `key={user.id}` |
| 9 | **L31–L33** | Click handler on `<li>` — a11y | a11y | Nên `<button>` hoặc role + keyboard |
| 10 | **L22** | `console.log` user name | logging | Dùng logger có level; không log PII production |
| 11 | **L7**, **L18** | Đổi `teamId` vẫn giữ `selectedId` cũ | UX/state | Reset `selectedId` khi `teamId` đổi (trong effect) |
| 12 | **L11**, **L18** | Chỉ set loading lần đầu mount | UX | Clear `users` hoặc skeleton khi refetch |

---

## Tiêu chí chấm điểm — Senior (tổng: 12 điểm)

| Tiêu chí | Điểm |
|----------|------|
| Phát hiện effect deps thiếu `teamId` | +1 |
| Phát hiện fetch race + đề xuất AbortController | +1 |
| Phát hiện missing cleanup on unmount | +1 |
| Phát hiện stale closure trong handler | +1 |
| Phát hiện `key={index}` và impact | +1 |
| Đề xuất React Query / SWR thay raw fetch | +1 |
| Error state + loading edge case | +1 |
| Viết lại code mẫu đúng (snippet) | +1 |
| Code review comment constructive mẫu | +1 |
| a11y keyboard cho list selectable | +1 |
| Test RTL: đổi teamId refetch (concept) | +1 |
| Checklist review hooks cho team | +1 |

**Pass criteria:** Senior 9/12

---

## Red flags

| Dấu hiệu | Đánh giá |
|----------|----------|
| Không thấy deps `[]` sai khi `teamId` đổi | Chưa đủ kinh nghiệm effect |
| Không thấy race condition fetch | Chưa production SPA |
| Không thấy stale closure | Chưa debug event handler React |
| Chỉ nêu naming/formatting | Thiếu depth |

---

## Follow-up

1. **Viết lại `useEffect` với AbortController đầy đủ**
2. **Refactor sang custom hook `useTeamUsers(teamId)`**
3. **Nếu dùng React Query — khác gì so với effect thủ công?**

### Gợi ý code sửa (interviewer tham khảo)

```tsx
// Gợi ý thay L10–L18
L10:    useEffect(() => {
L11:      const controller = new AbortController();
L12:      setLoading(true);
L13:      setUsers([]);
L14:      setSelectedId(null);
L15:
L16:      fetch(`/api/teams/${teamId}/users`, { signal: controller.signal })
L17:        .then(res => {
L18:          if (!res.ok) throw new Error(String(res.status));
L19:          return res.json();
L20:        })
L21:        .then(data => setUsers(data))
L22:        .catch(err => {
L23:          if (err.name !== 'AbortError') setError(err);
L24:        })
L25:        .finally(() => setLoading(false));
L26:
L27:      return () => controller.abort();
L28:    }, [teamId]);
```

---
