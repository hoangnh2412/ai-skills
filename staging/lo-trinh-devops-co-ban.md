# Lộ trình DevOps cơ bản

Để học DevOps với stack này, đi lần lượt mười hai bước dưới đây, chia thành hai phần. Xong phần kiến thức nền tảng rồi mới sang thực hành.

Stack: .NET, .NET Framework, PostgreSQL, MSSQL, Redis, RabbitMQ, Kafka, MinIO, Nginx, HAProxy, Docker, Docker Compose, Git, GitLab.

---

## Tóm tắt lộ trình

Lộ trình gồm mười hai bước, chia hai phần: nền tảng rồi thực hành.

Phần A (bước 1–9) đọc hiểu trước khi dựng cụm.

- Nhận diện ứng dụng .NET / .NET Framework và cách build.
- Đọc sơ đồ kiến trúc ứng dụng (C1, C2) và sơ đồ hạ tầng.
- Gọi đúng tên dịch vụ ứng dụng cần: DB, cache, queue, object storage.
- Dùng Git lấy source; nắm Linux, đĩa, CPU, RAM.
- Đi một request qua Nginx / HAProxy tới ứng dụng.
- Ghép cụm bằng Docker Compose; nối source với GitLab Registry và Runner.

Phần B (bước 10–12) làm trên hệ thống đang thực hành.

- `compose up`, mở cổng, kiểm tra từng service.
- Chạy pipeline CI/CD: build, image, registry, deploy.
- Cố tình gây lỗi rồi chỉ ra nguyên nhân từ log và thông số máy.

Chuẩn đầu ra: từ sơ đồ → source → build → image → Compose → log → sửa được lỗi cấu hình hoặc pipeline.

---

## Phần A — Kiến thức nền tảng

Đọc hiểu, gọi đúng tên và biết lệnh cơ bản. Chưa yêu cầu dựng cả cụm.

### 1. Ứng dụng: .NET và .NET Framework

Đọc source và cấu hình, kể được ứng dụng cần gì để chạy.

- **.NET:** lệnh `dotnet restore`, `dotnet build`, `dotnet publish`. File `appsettings` và biến môi trường. Cổng ứng dụng đang lắng nghe. Log ghi ra đâu.
- **.NET Framework:** ứng dụng chạy trên Windows / IIS. Nhận ra qua `Web.config` hoặc `App.config`, `packages.config`, và `TargetFrameworkVersion` trong `.csproj`. Biết restore (`nuget`), build (`msbuild`), xem site / app pool (`appcmd`), và chỗ đọc chuỗi kết nối cùng log IIS.

### 2. Sơ đồ kiến trúc ứng dụng — tầng C1 và C2

Đọc sơ đồ kiến trúc ứng dụng của hệ thống đang làm, ở tầng C1 và C2, rồi kể lại đúng bằng lời, trước khi đụng máy chủ hay Compose.

- **C1 · System Context:** ai dùng hệ thống (người dùng hoặc hệ thống khác), hệ thống của mình là hộp nào, quan hệ với bên ngoài là gì. Nói được hệ thống này phụ thuộc hệ thống bên ngoài nào và ngược lại.
- **C2 · Container:** trong hệ thống có những container nào (API .NET hoặc site IIS, cơ sở dữ liệu, cache, hàng đợi, object storage, reverse proxy). Mỗi container chạy bằng gì, nói chuyện với container nào, qua giao thức và cổng nào.
- Đối chiếu sơ đồ với cấu hình thật: tên service trong Compose hoặc IIS, chuỗi kết nối, `proxy_pass` / backend HAProxy khớp với mũi tên trên C2.
- Chưa yêu cầu tự vẽ sơ đồ kiến trúc ứng dụng. Chưa yêu cầu vẽ C3 (Component) hay C4 (Code). Chỉ cần đọc hiểu và giải thích C1, C2 cho người khác nghe được.

### 3. Sơ đồ kiến trúc hạ tầng

Đọc sơ đồ kiến trúc hạ tầng của hệ thống đang làm và kể lại đúng bằng lời. Sơ đồ này chỉ chỗ đặt máy và mạng. Sơ đồ kiến trúc ứng dụng chỉ các thành phần của ứng dụng.

- Máy nào đang chạy (máy cá nhân, máy Windows với IIS, máy Linux), vùng mạng nào, cổng nào mở ra ngoài.
- Từng dịch vụ nằm trên máy nào: ứng dụng .NET hoặc site IIS, PostgreSQL hoặc MSSQL, Redis, RabbitMQ hoặc Kafka, MinIO, Nginx hoặc HAProxy.
- Đường đi của một request trên sơ đồ khớp với C2: từ người dùng tới reverse proxy, tới ứng dụng, rồi tới cơ sở dữ liệu và các dịch vụ còn lại.
- Chưa yêu cầu tự vẽ. Việc vẽ sơ đồ này nằm ở lộ trình nâng cao.

### 4. Dịch vụ mà ứng dụng gọi

Nhìn chuỗi kết nối trong cấu hình và gọi đúng tên dịch vụ. Cổng dưới đây là cổng mặc định. File cấu hình có thể đổi.

- **PostgreSQL:** cơ sở dữ liệu quan hệ, cổng `5432`. Dữ liệu nằm trên đĩa, trong volume khi chạy bằng container.
- **MSSQL:** cơ sở dữ liệu quan hệ, cổng `1433`. Dữ liệu nằm trong file trên đĩa.
- **Redis:** bộ nhớ tạm cho cache hoặc phiên làm việc, cổng `6379`. Nắm chuyện gì xảy ra với ứng dụng khi Redis không lên.
- **RabbitMQ:** hàng đợi, cổng `5672`, trang quản lý `15672`. Message nằm trong queue cho đến khi service khác lấy đi. Kiểm tra được user và vhost.
- **Kafka:** luồng sự kiện, broker cổng `9092`. Message nằm trong topic, mỗi consumer group tự đọc. Lag tăng nghĩa là nhóm đó đang xử lý chậm.
- **MinIO:** kho file dạng object, API cổng `9000`, console `9001`. Ứng dụng cần đúng bucket và access key. File nằm trên volume.

### 5. Git

Lấy và ghi source trước khi đụng máy chủ.

- Clone, branch, commit, pull, push, merge, tag.
- Tự xử lý được conflict trên một nhánh.

### 6. Linux và thông số máy

Phần lớn service chạy trên Linux. Windows dùng để mở WSL2 và Docker Desktop.

- File, quyền (`chmod`, `chown`), process, service, log.
- Đĩa: `df`, `du`. CPU và RAM: `top`. Đọc các số này khi một service trong stack đang chạy, và nói được số đó ảnh hưởng gì tới ứng dụng.

### 7. Mạng: Nginx và HAProxy

Đi một request từ ngoài vào tới ứng dụng, rồi từ ứng dụng tới cơ sở dữ liệu hoặc hàng đợi.

- **Nginx:** cổng vào HTTP/HTTPS. Đọc được `listen`, `server_name`, `proxy_pass` và chỗ đặt chứng chỉ. HTTP 502 nghĩa là Nginx còn sống, ứng dụng phía sau không trả lời.
- **HAProxy:** chia request ra nhiều backend và kiểm tra backend còn sống. Đọc được frontend, backend, health check, và chỉ ra được backend nào đang down.
- Tự phân biệt được `connection refused`, timeout, lỗi DNS và lỗi chứng chỉ.

### 8. Docker và Docker Compose

Ghép ứng dụng với các dịch vụ ở bước 4 và cổng vào ở bước 7 thành một cụm trên máy cá nhân.

- **Docker:** phân biệt được image và container. Dùng được volume, network, ánh xạ cổng, biến môi trường và `docker logs`.
- **Docker Compose:** một file mô tả cả cụm, ví dụ API .NET, PostgreSQL hoặc MSSQL, Redis, RabbitMQ hoặc Kafka, MinIO, Nginx. Kể được từng service phụ thuộc service nào. Tắt và xóa sạch được cụm đó.
- **DNS trong Compose:** các service cùng network gọi nhau bằng tên service. Ứng dụng nối `postgres:5432`, `redis:6379`, `rabbitmq:5672`, `minio:9000`, không dùng `localhost` của máy cá nhân. Tên service là bản ghi DNS nội bộ do Docker cấp. Từ trình duyệt trên máy cá nhân thì gọi `localhost` cùng cổng đã ánh xạ, hoặc tên trong `server_name` của Nginx. Chuỗi kết nối sai tên service thì lỗi là lỗi DNS, service vẫn đang chạy.

Volume là chỗ dữ liệu của PostgreSQL, MSSQL và MinIO còn lại sau khi container tắt.

### 9. GitLab

Nối source Git với chỗ chứa image và chỗ chạy pipeline.

- Project, nhánh, merge request, tag.
- Container Registry để chứa image vừa build.
- Runner để máy nào được phép chạy pipeline.
- Biến bí mật của project: chuỗi kết nối, mật khẩu Redis, access key MinIO. Các giá trị này không ghi trong source.

---

## Phần B — Thực hành

Dựng cụm, chạy pipeline và cố tình gây lỗi trên hệ thống đang làm.

### 10. Triển khai trên máy cá nhân

Mỗi hệ thống chỉ bật những dịch vụ có trong Compose và file cấu hình của chính hệ thống đó.

- Đọc lại sơ đồ kiến trúc ứng dụng (C1, C2) và sơ đồ kiến trúc hạ tầng của hệ thống đang triển khai trước khi `compose up`, rồi đối chiếu với các service trong Compose.
- Build được ứng dụng .NET hoặc nhận ra ứng dụng .NET Framework chạy trên IIS.
- `docker compose up`, xem log từng service, mở được cổng ứng dụng qua Nginx hoặc HAProxy.
- Kiểm tra PostgreSQL hoặc MSSQL nhận kết nối, Redis trả lời, queue RabbitMQ hoặc topic Kafka có consumer, MinIO mở được bucket.

### 11. CI/CD

Đọc pipeline có sẵn trên GitLab và chạy được trên hệ thống đang thực hành.

- Các bước: lấy code, build .NET, chạy test, đóng Docker image, đẩy lên GitLab Container Registry, máy đích kéo image và chạy bằng Docker Compose.
- Chỉ ra được job nào lỗi và sửa được một lỗi cấu hình hoặc một biến bí mật.

### 12. Xử lý sự cố

Mỗi lần cố tình một lỗi trên cụm đang chạy, rồi tự chỉ ra nguyên nhân từ log và thông số máy.

- Sai chuỗi kết nối PostgreSQL hoặc MSSQL.
- Redis không lên.
- Queue RabbitMQ không có consumer, hoặc lag Kafka tăng.
- Sai access key hoặc sai bucket MinIO.
- Nginx trả 502, HAProxy báo backend down.
- Hai service giành cùng một cổng.
- Volume đầy đĩa, container tự restart.

## Chuẩn đầu ra

Xong lộ trình khi làm được đủ chuỗi sau với hệ thống đang thực hành.

1. Đọc hiểu sơ đồ kiến trúc ứng dụng (C1, C2) và sơ đồ kiến trúc hạ tầng của hệ thống.
2. Lấy source code từ Git.
3. Build ứng dụng.
4. Đóng Docker image.
5. Đẩy image lên GitLab Container Registry.
6. Chạy ứng dụng bằng Docker Compose.
7. Đọc log của từng service.
8. Chỉ ra đúng service bị lỗi.
9. Sửa cấu hình hoặc sửa pipeline.
