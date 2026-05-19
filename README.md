# Weather Dashboard 🌤️

Ứng dụng web theo dõi thời tiết hiện đại, cung cấp thông tin chi tiết và trực quan về điều kiện thời tiết cho các thành phố trên toàn thế giới.

![Weather Dashboard Banner](public/weather-dashboard.png)

## 🌟 Tính năng nổi bật

*   **🔍 Tìm kiếm thông minh**: Tra cứu thời tiết cho bất kỳ thành phố nào trên thế giới.
*   **🌡️ Thông tin chi tiết**: Hiển thị nhiệt độ hiện tại, độ ẩm, tốc độ gió, tầm nhìn, và xác suất mưa.
*   **📈 Biểu đồ trực quan**:
    *   **Biểu đồ 24h**: Theo dõi diễn biến nhiệt độ và thời tiết từng giờ trong ngày.
    *   **Dự báo 7 ngày**: Lên kế hoạch với thông tin dự báo thời tiết cho cả tuần.
*   **🍃 Chỉ số sức khỏe**: Theo dõi Chất lượng không khí (AQI) và chu kỳ Mặt trời (Bình minh/Hoàng hôn).
*   **🎨 Giao diện Glassmorphism**: Thiết kế hiện đại, hiệu ứng kính mờ đẹp mắt và trải nghiệm người dùng mượt mà.
*   **📱 Responsive**: Tương thích hoàn hảo trên cả máy tính, máy tính bảng và điện thoại di động.

## 🛠 Công nghệ sử dụng

Dự án được xây dựng dựa trên các công nghệ web hiện đại:

*   **Frontend Framework**: [React](https://react.dev/) (v19)
*   **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Data Visualization**: [Recharts](https://recharts.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Styling**: Bootstrap 5 & Custom CSS 

## 🚀 Cài đặt và Chạy ứng dụng

Làm theo các bước sau để chạy dự án trên máy cục bộ của bạn:

1.  **Clone repository**:
    ```bash
    git clone https://github.com/mnt25/Weather-Dashboard.git
    cd Weather-Dashboard
    ```

2.  **Cài đặt dependencies**:
    ```bash
    npm install
    ```

3.  **Chạy ứng dụng (Development mode)**:
    ```bash
    npm run dev
    ```
    Mở trình duyệt và truy cập vào địa chỉ `http://localhost:5173` (hoặc cổng được hiển thị trên terminal).

## 📂 Cấu trúc dự án

```
weather-dashboard/
├── src/
│   ├── components/    # Các thành phần giao diện (Chart, vv)
│   ├── services/      # Xử lý gọi API
│   ├── types/         # Định nghĩa kiểu dữ liệu (TypeScript Interfaces)
│   ├── App.tsx        # Component chính
│   └── main.tsx       # Entry point
├── public/            # Assets tĩnh
└── package.json       # Khai báo dependencies
```

---
Được phát triển bởi Phạm Sơn.