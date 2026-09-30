# Lộ trình DevOps nâng cao

Làm lộ trình này sau khi tự hoàn thành [lộ trình DevOps cơ bản](lo-trinh-devops-co-ban.md). Mỗi bước dưới đây ghi bước cơ bản đang được nối tiếp. AI chỉ dùng để hỏi khi kẹt.

Stack giữ nguyên: .NET, .NET Framework, PostgreSQL, MSSQL, Redis, RabbitMQ, Kafka, MinIO, Nginx, HAProxy, Docker, Docker Compose, Git, GitLab. Thêm Ansible, Terraform, Kubernetes và Helm khi một máy chạy Compose không còn đủ.

| Bước nâng cao | Bổ sung | Cơ sở ở lộ trình cơ bản |
| --- | --- | --- |
| 1. Git | Rebase, revert, cherry-pick, nhánh được bảo vệ | Bước 5. Git |
| 2. Máy chủ Linux | SSH, firewall, I/O đĩa, OOM | Bước 6. Linux và thông số máy |
| 3. Mạng | TLS, nhiều backend, NAT, bản ghi DNS | Bước 7. Mạng: Nginx và HAProxy |
| 4. Dữ liệu và hàng đợi | Backup, dung lượng, DLQ, retention, lag | Bước 4. Dịch vụ mà ứng dụng gọi |
| 5. Image và máy chủ | Multi-stage, healthcheck, giới hạn CPU/RAM, chạy trên server | Bước 1, bước 8, bước 10 |
| 6. GitLab CI/CD | Tự viết pipeline, môi trường, quét image, rollback | Bước 9. GitLab và bước 11. CI/CD |
| 7. Quan sát sự cố | Metric, log tập trung, cảnh báo | Bước 6 và bước 12. Xử lý sự cố |
| 8. Ansible và Terraform | Dựng lại máy bằng mã | Bước 6 và bước 10 |
| 9. Kubernetes và Helm | Cùng cụm service trên nhiều máy | Bước 8 và bước 10 |
| 10. Sơ đồ | Vẽ sơ đồ kiến trúc ứng dụng (C1, C2) và sơ đồ kiến trúc hạ tầng | Bước 2 và bước 3 |
| 11. Cài đặt, HA, LB, DC-DR | Cài bằng repo và bằng Docker; dựng HA, cân tải, chuyển DC-DR | Bước 4, bước 7, bước 8 |

## 1. Git

> **Cơ sở:** bước 5. Ở mức cơ bản đã clone, branch, commit, pull, push, merge, tag và xử lý conflict. Phần này thêm các lệnh sửa lịch sử nhánh và quy ước nhánh trên GitLab.

- Rebase một nhánh feature lên `main`, revert một commit đã đẩy, cherry-pick một commit sang nhánh release.
- Nhánh được bảo vệ: ai được merge, ai được đẩy tag.
- Tag gắn với bản image sẽ deploy ở bước 6.

## 2. Máy chủ Linux

> **Cơ sở:** bước 6. Ở mức cơ bản đã sửa quyền file, xem process, đọc `df`, `du`, `top` lúc một service đang chạy. Phần này chuyển từ máy cá nhân sang một máy chủ Linux và đọc thêm các trạng thái làm service chết.

- Đăng nhập bằng SSH key. Tách user chạy service khỏi user quản trị.
- Firewall: chỉ mở cổng Nginx hoặc HAProxy, cổng cơ sở dữ liệu không mở ra ngoài.
- Đĩa: I/O và latency khi volume PostgreSQL, MSSQL hoặc MinIO chậm. RAM: swap và OOM killer khi Redis hoặc Kafka chiếm bộ nhớ.
- Nói được số vừa đọc làm request chậm, query chậm hay container bị kill.

## 3. Mạng

> **Cơ sở:** bước 7. Ở mức cơ bản đã đọc cấu hình Nginx và HAProxy, phân biệt `connection refused`, timeout, lỗi DNS, lỗi chứng chỉ và HTTP 502. Phần này thêm nhiều máy phía sau một cổng vào.

- **Nginx:** chứng chỉ TLS, gia hạn chứng chỉ, chuyển `http` sang `https`.
- **HAProxy:** nhiều backend, thuật toán cân tải, session dính một backend, health check dùng endpoint của ứng dụng .NET.
- NAT khi máy chủ nằm sau một địa chỉ public. Bản ghi DNS trỏ tên miền tới cổng vào.
- Vẽ lại được đường: client → DNS → Nginx hoặc HAProxy → ứng dụng → PostgreSQL, MSSQL, Redis, RabbitMQ, Kafka hoặc MinIO.

## 4. Dữ liệu và hàng đợi

> **Cơ sở:** bước 4. Ở mức cơ bản đã gọi đúng tên dịch vụ, đúng cổng, và biết dữ liệu nằm trong volume. Phần này giữ dữ liệu còn sau sự cố và biết khi nào dịch vụ đầy.

- **PostgreSQL:** backup và restore. Kiểm tra kết nối từ ứng dụng sau khi restore.
- **MSSQL:** backup và restore. Biết file dữ liệu nằm trên đĩa nào.
- **Redis:** `maxmemory` và chính sách khi bộ nhớ đầy. Phân biệt cache mất (ứng dụng vẫn chạy, chỉ chậm hơn) với phiên làm việc mất (người dùng bị đăng xuất).
- **RabbitMQ:** queue bền, dead-letter queue khi message xử lý thất bại. Đọc được queue đang đầy.
- **Kafka:** retention của topic, replication giữa broker, xử lý consumer lag tăng.
- **MinIO:** lifecycle và versioning của bucket. Dung lượng volume khi file tăng.

## 5. Image và chạy trên máy chủ

> **Cơ sở:** bước 1, bước 8 và bước 10. Ở mức cơ bản đã `dotnet publish`, phân biệt image với container, và `docker compose up` trên máy cá nhân với mSMI rồi eInvoice 2.0. Phần này đóng image gọn và chạy cụm đó trên một máy chủ Linux.

- **.NET:** Dockerfile nhiều tầng, image chạy không kèm SDK, process trong container không dùng user root. Ứng dụng có endpoint health để Nginx, HAProxy và sau này Kubernetes gọi.
- **.NET Framework:** giữ trên Windows và IIS. Không đưa app này vào cùng đường container với .NET.
- Giới hạn CPU và RAM của từng container. Healthcheck trong Compose.
- Volume tách khỏi container cho PostgreSQL, MSSQL và MinIO. Mất container không mất dữ liệu.
- Cụm trên server gồm những service có trong Compose của đúng hệ: API, cơ sở dữ liệu, Redis, RabbitMQ hoặc Kafka, MinIO, Nginx hoặc HAProxy.

## 6. GitLab CI/CD

> **Cơ sở:** bước 9 và bước 11. Ở mức cơ bản đã dùng project, merge request, registry, runner, biến bí mật, và đọc một pipeline có sẵn của mSMI để sửa một lỗi cấu hình. Phần này tự viết pipeline và đưa bản đã build qua nhiều môi trường.

- Pipeline: build .NET, test, quét image, đẩy GitLab Container Registry, deploy bằng Docker Compose trên máy đích.
- Biến protected và masked cho chuỗi kết nối, mật khẩu Redis, access key MinIO. Mỗi môi trường một bộ biến.
- Tag Git ở bước 1 chọn đúng image để deploy. Rollback là deploy lại tag image trước đó.
- Runner có tag, chỉ job đúng môi trường chạy trên đúng máy.

## 7. Quan sát sự cố

> **Cơ sở:** bước 6 và bước 12. Ở mức cơ bản đã đọc `top`, `df` và log container để chỉ ra một lỗi cố tình (sai chuỗi kết nối, Redis tắt, queue không có consumer, lag Kafka, sai key MinIO, HTTP 502, đĩa đầy, container restart). Phần này xem cùng lúc nhiều service, không còn ngồi trên từng máy.

- Metric: CPU, RAM, đĩa, cổng kết nối của từng container trong cụm.
- Log tập trung của ứng dụng .NET, Nginx, HAProxy và các dịch vụ ở bước 4.
- Một cảnh báo cho các ngưỡng đã gặp ở mức cơ bản: đĩa volume sắp đầy, container restart liên tục, lag Kafka tăng, HAProxy báo backend down.
- Với một sự cố, chỉ ra thời điểm metric đổi, dòng log tương ứng và service gây lỗi.

## 8. Ansible và Terraform

> **Cơ sở:** bước 6 và bước 10. Ở mức cơ bản và ở bước 5 của lộ trình này, máy chủ được cài tay. Phần này dựng lại đúng máy đó từ mã, để máy mới ra cùng một kết quả.

- **Terraform:** tạo máy chủ và mạng tối thiểu (địa chỉ, security group hoặc firewall của nền tảng). Chạy xong thì có một máy trống để SSH vào.
- **Ansible:** cài Docker, đưa file Compose, cấu hình Nginx hoặc HAProxy, mở đúng cổng, tạo user chạy service.
- Chạy lại playbook trên một máy mới và cụm mSMI hoặc eInvoice 2.0 lên như máy đã làm ở bước 5.

## 9. Kubernetes và Helm

> **Cơ sở:** bước 8 và bước 10. Ở mức cơ bản một file Compose trên một máy đã chạy đủ cụm. Phần này dùng khi cụm cần nhiều máy, tự khởi động lại Pod, và chia tải phía sau Nginx hoặc HAProxy.

- Ánh xạ khái niệm đã biết: container thành Pod, Compose service thành Deployment, volume thành PersistentVolume, ánh xạ cổng thành Service, biến môi trường thành ConfigMap và Secret.
- **Helm:** một chart cho ứng dụng .NET kèm PostgreSQL hoặc MSSQL, Redis, RabbitMQ hoặc Kafka, MinIO.
- Probe dùng health endpoint đã làm ở bước 5. Ingress hoặc service đứng trước ứng dụng, cùng vai trò với Nginx và HAProxy đã học.
- **.NET Framework** trên IIS không đưa vào chart này.
- Đọc được Pod restart, volume đầy, Service không có endpoint. Các lỗi này tương ứng container restart, đĩa đầy và HTTP 502 ở bước 12 của lộ trình cơ bản.

## 10. Sơ đồ kiến trúc ứng dụng và sơ đồ kiến trúc hạ tầng

> **Cơ sở:** bước 2 và bước 3. Ở mức cơ bản đã đọc sơ đồ có sẵn và kể lại được sơ đồ kiến trúc ứng dụng (C1, C2) cùng sơ đồ kiến trúc hạ tầng. Phần này tự vẽ được các sơ đồ đó cho hệ thống đang làm.

- **C1:** người dùng và hệ thống bên ngoài, hệ thống của mình, mũi tên quan hệ hai chiều.
- **C2:** API .NET hoặc site IIS, cơ sở dữ liệu, cache, hàng đợi, object storage, reverse proxy. Mỗi mũi tên ghi giao thức và cổng.
- **Sơ đồ kiến trúc hạ tầng:** máy chủ, vùng mạng, cổng mở ra ngoài, chỗ đặt từng dịch vụ. Đường request đi từ người dùng tới Nginx hoặc HAProxy, tới ứng dụng, rồi tới PostgreSQL, MSSQL, Redis, RabbitMQ, Kafka hoặc MinIO.
- Ba sơ đồ khớp với nhau và khớp với Compose, site IIS, cấu hình Nginx hoặc HAProxy đang chạy.
- Khi hệ thống có HA và DC-DR, sơ đồ hạ tầng vẽ được các node trong cụm, chỗ đặt cân tải, site DC, site DR và chiều nhân bản dữ liệu.
- Chưa yêu cầu vẽ C3 (Component) hay C4 (Code).

## 11. Cài đặt dịch vụ, HA, LB và DC-DR

> **Cơ sở:** bước 4, bước 7 và bước 8 của lộ trình cơ bản. Ở mức cơ bản đã gọi đúng tên dịch vụ và đúng cổng, đọc cấu hình Nginx và HAProxy, chạy Docker Compose trên một máy. Bước 3, 4 và 5 của lộ trình này đã có nhiều backend, backup và container trên một máy chủ. Phần này tự cài từng dịch vụ theo hai cách, rồi dựng cụm sẵn sàng cao, cân tải và chuyển được giữa hai site.

Cài được từng dịch vụ theo cả hai cách. Cổng dịch vụ trùng với cổng đã học ở lộ trình cơ bản. Dữ liệu nằm trên đĩa hoặc trong volume, tắt process không làm mất dữ liệu.

- **Repo:** gói hoặc bản phát hành chính thức của dịch vụ trên máy chủ. PostgreSQL, Redis, RabbitMQ, Nginx, HAProxy cài từ repo gói. MSSQL cài từ gói Microsoft trên Windows hoặc Linux. Kafka và MinIO cài từ bản phát hành chính thức.
- **Docker:** image chính thức, khai báo trong Docker Compose với cổng, volume và biến môi trường.
- Dịch vụ cần cài được: PostgreSQL, MSSQL, Redis, RabbitMQ, Kafka, MinIO, Nginx, HAProxy. Ứng dụng .NET chạy bằng image đã build. Ứng dụng .NET Framework chạy trên IIS của Windows.

**HA.** Mỗi dịch vụ đang dùng có từ hai node trở lên. Tắt một node, dịch vụ còn nhận kết nối.

- **PostgreSQL:** primary và standby, streaming replication. Khi chuyển, standby được promote thành primary.
- **MSSQL:** log shipping hoặc availability group. Secondary nhận vai trò ghi khi chuyển.
- **Redis:** replica và Sentinel. Sentinel bầu primary mới khi primary mất.
- **RabbitMQ:** cluster với quorum queue. Một node mất, queue còn phục vụ.
- **Kafka:** từ hai broker trở lên, replication factor từ 2. Một broker mất, partition còn leader.
- **MinIO:** nhiều node với erasure coding. Một node mất, bucket còn đọc và ghi.
- **Ứng dụng .NET:** từ hai instance trở lên. **.NET Framework:** từ hai site IIS trở lên.

**LB.** Nginx hoặc HAProxy đứng trước các instance ứng dụng. Health check loại backend đã chết. Một backend down, request sang backend còn sống.

**DC-DR.** Hai site. DC đang phục vụ ghi. DR giữ bản sao bằng replication hoặc bằng backup chuyển sang. Ứng dụng trỏ tới site đang là chính bằng DNS hoặc chuỗi kết nối.

Ba kịch bản chuyển đổi phải tự làm được:

1. **Mất một node trong site.** Cân tải bỏ node đó. Cụm HA vẫn phục vụ. Chưa chuyển sang site kia.
2. **Switchover có kế hoạch.** Ngừng ghi ở DC, chờ DR bắt kịp, chuyển ứng dụng sang DR, kiểm tra đọc và ghi, rồi failback về DC.
3. **Failover khi mất DC.** DR thành site chính. Ứng dụng kết nối sang DR. Khi DC trở lại, đồng bộ ngược rồi failback về DC.

Sau mỗi lần chuyển, kiểm tra PostgreSQL hoặc MSSQL nhận ghi, Redis trả lời, queue RabbitMQ hoặc topic Kafka còn consumer, MinIO mở được bucket, health check của Nginx hoặc HAProxy xanh.

Xong lộ trình nâng cao khi làm được chuỗi này: vẽ được sơ đồ kiến trúc ứng dụng (C1, C2) và sơ đồ kiến trúc hạ tầng của hệ thống đang làm, cài được một dịch vụ bằng repo và bằng Docker, dựng được cân tải trước cụm HA, thực hiện được switchover và failover giữa DC và DR, rebase và tag một bản, pipeline GitLab build rồi đẩy image, Ansible hoặc Helm đưa bản đó lên môi trường, backup cơ sở dữ liệu restore được, và một sự cố (lag Kafka, backend HAProxy down, volume đầy, Pod restart) được chỉ ra từ metric cùng log.

Service mesh, Istio, Operator và nội dung bên trong của Git (object, packfile) làm sau bước 9, khi cụm Kubernetes của mSMI hoặc eInvoice 2.0 đã tự vận hành được.
