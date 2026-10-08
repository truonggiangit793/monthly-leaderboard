# Monthly Leaderboard

Bảng xếp hạng thành viên theo tháng.

Stack: Next.js 16 (App Router) · React 19 · tRPC 11 · TanStack Query 5 · Zod 4 · Tailwind CSS 4 · shadcn/Base UI.

## Cài đặt và chạy

Yêu cầu: Node.js 20+ và `pnpm` (repo khai báo `packageManager: pnpm@11.25.0`).

```bash
pnpm install
pnpm dev      # chạy dev tại http://localhost:3000
pnpm build    # build production
pnpm start    # chạy bản đã build
pnpm lint     # kiểm tra eslint
pnpm format   # format bằng prettier
```

Luồng chính: `app/page.tsx` (Tabs + Card) gọi `trpc.public.boards.list` (`page`, `limit`, `month`) qua `/api/trpc`, dữ liệu mock nằm ở `trpc/server/routers/public/boards.ts`.

## Cấu trúc dự án

- `app/page.tsx` — UI duy nhất: Tabs tháng + Card leaderboard + phân trang.
- `app/api/trpc/` — endpoint tRPC.
- `trpc/server/routers/public/boards.ts` — procedure `boards.list` + mock data (30 users, 4 tháng `2024-08` → `2024-11`, 25–28 users/board, điểm `random 0–999`, sort giảm dần).
- `schemas/` — `user`, `board`, `common` (paging: `page ≥ 1`, `limit 1–10`).
- `components/ui/` — `tabs`, `card`, `button`, `pagination` (shadcn/Base UI).

## Vấn đề phát hiện từ yêu cầu và thiết kế

**Dữ liệu**

- API không trả `total` số dòng: client chỉ đoán "còn trang sau" bằng `users.length === limit`. Khi tổng số user chia hết cho `limit` (ví dụ đúng 20 users, limit 10), nút "Sau" vẫn sáng và dẫn tới 1 trang trống.
- Response trả về mảng `Board[]` thay vì object `{ board, total }` nên khó mở rộng (thêm tổng số trang, rank của user hiện tại...).
- Response thực tế có kèm `totalUsers` nhưng field này không tồn tại trong `boardSchema` — contract client/server đang lệch (hiện chỉ "chạy được" vì không validate output bằng Zod).
- `month` là `string` tự do, không validate định dạng `YYYY-MM`; nhập sai chỉ lặng lẽ trả về rỗng.
- Không có endpoint "danh sách tháng": `MONTHS` bị hardcode ở client (`app/page.tsx`), thêm/bớt tháng ở server mà quên client sẽ lệch Tabs.
- Điểm mock sinh bằng `Math.random()` ở module-level: đổi mỗi lần restart server. Demo thì tiện nhưng không tái lập được giữa các môi trường.
- Sort chỉ theo `score`, không có tie-break khi bằng điểm → thứ tự các user đồng điểm là không xác định.
- Delay giả lập 1s đặt trong từng `map` với `Promise.all`: hiện tại chỉ query 1 tháng nên vô hại, nhưng nếu bỏ filter tháng (query nhiều board) sẽ sleep song song rồi trả cùng lúc, không phản ánh latency DB thật.

**Nghiệp vụ**

- Người dùng truy cập trang, chọn danh sách bảng xếp hạng theo tháng ở Tabs Tháng.
- Mỗi danh sách tháng trả về danh sách users có phân trang.
- Người dùng chọn phân trang cho danh sách theo tháng hiện tại tương ứng.
- Kết quả danh sách xếp hạng giảm dần từ rank cao nhất (Top 3 nằm đầu danh sách ở trang đầu tiên).

**Trải nghiệm**

- Tabs hardcode 4 tháng, không có chọn năm, không scroll nếu nhiều tháng.
- Chưa có skeleton cho từng record — chỉ có spinner fullscreen.
- Lỗi chỉ hiện chữ chung chung, chưa làm retry.

## Giả định và quy tắc nghiệp vụ đang áp dụng

1. Xếp hạng = sort `score` giảm dần; rank bắt đầu từ 1 trên toàn board (không phải trên từng trang).
2. `page` đếm từ 1, `limit` tối đa 10 (do `pagingSchema`).
3. Đổi `month` thì reset `page` về 1.
4. `month` bỏ trống nghĩa là "lấy tất cả các tháng" (filter `!month || board.month === month`).
5. Điểm là số nguyên không âm; mock hiện tại nằm trong `0–999`.

## Tính nhất quán của dữ liệu khi phân trang và cập nhật

Dữ liệu mock data của `boardsData` được build 1 lần khi module server load, sort sẵn rồi mới slice theo `page/limit`. Trong cùng 1 phiên server, mọi request thấy cùng 1 snapshot nên phân trang nhất quán; `queryKey = ["public-boards", month, page]` của React Query đảm bảo cache đúng theo tháng/trang.

## Quyết định kỹ thuật và đánh đổi

| Quyết định | Lý do | Đánh đổi |
|---|---|---|
| tRPC thay vì REST | Type-safe end-to-end (input `pagingSchema`, type `Board` suy ra tự động), ít boilerplate cho CRUD nội bộ | Lock-in vào hệ tRPC; client ngoài (mobile/open API) khó dùng lại, cần thêm adapter REST |
| TanStack Query + `createTRPCProxyClient` gọi thủ công trong `queryFn` | Đơn giản, không cần setup provider tRPC-React; `queryKey` tự kiểm soát | Mất các helper `trpc.xxx.useQuery`, dedupe/batch và SSR prefetch kém tối ưu hơn integration chính thức (`@trpc/tanstack-react-query` đã có trong deps nhưng chưa dùng) |
| Zod validate input `page/limit/month` | Chặn `page = 0`, `limit` quá lớn ngay ở server | Thêm 1 lớp runtime validation, nhưng đáng giá và rẻ |
| Mock data trong module server | Không cần DB vẫn demo được Tabs + phân trang + sort | Không bền vững, random khi restart, không test được đồng thời/cập nhật |
| shadcn/Base UI `Tabs` + `Card` | Có sẵn variant, a11y, dark-mode; nhanh ra UI | Phụ thuộc design token của bộ UI; custom sâu sẽ tốn công override |

## Chưa xử lý và việc cần làm ở production

> **Phạm vi chưa làm: phần "Xếp hạng của tôi" chưa được thực hiện.** Hiện tại app chỉ có leaderboard chung theo tháng, không có khái niệm user đăng nhập, không có API/highlight/điều hướng tới vị trí của "tôi".

Các việc khác chưa xử lý:

- **Auth & "Xếp hạng của tôi":** thêm đăng nhập, endpoint `boards.myRank({ month })` trả `{ rank, score, page }`, highlight dòng của tôi, nút "Xem vị trí của tôi" tự nhảy tới đúng trang.
- **Persistence:** thay mock bằng Postgres (index `(month, score DESC, user_id ASC)`), seed riêng cho dev/test để tái lập.
- **API:** trả `{ board, total, page, totalPages }`, validate `month` theo `YYYY-MM`, thêm endpoint `months.list`, định nghĩa tie-break chính thức (ví dụ điểm bằng nhau thì `user_id` nhỏ hơn xếp trên).
- **Phân trang:** chuyển sang cursor-based cho tháng live; giữ `limit ≤ 10` hoặc nâng theo yêu cầu kèm rate-limit.
- **Realtime:** subscription tRPC/websocket cho tháng hiện tại; tháng cũ cache immutable.
- **UX:** skeleton từng dòng thay cho spinner fullscreen, retry khi lỗi, empty-state riêng cho "tháng chưa có dữ liệu" vs "lỗi mạng", responsive Tabs khi nhiều tháng (scroll/select năm).
