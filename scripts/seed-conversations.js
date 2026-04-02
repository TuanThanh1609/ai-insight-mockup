// =====================================================================
// Script: Tạo bảng ai_insight_conversations + insert random records
// 42 templates × 50–100 conversations (random per template)
// Mỗi template có field pools riêng theo industry
// =====================================================================

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const MCP_URL = "https://db.cdp.vn/mcp";

// ── Seeded pseudo-random (deterministic per template+index) ──────────────
function sr(seed) {
  let s = Math.abs(seed | 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function pickN(arr, n, rng) {
  const out = []; const a = [...arr];
  for (let i = 0; i < n; i++) out.push(a.splice(Math.floor(rng() * a.length), 1)[0]);
  return out;
}

// ── Field pools per template ──────────────────────────────────────────────
const POOLS = {
  // ─── FASHION ───────────────────────────────────────────────────────────
  'fsh-1': {
    customers: ['Nguyen Thi Mai','Tran Thi Lan','Le Thu Huong','Pham Thi Hoa','Vu Thi Yen','Dang Hoang Anh','Cao Minh Duc','Bui Hoang Yen','Trinh Duc Minh','Nguyen Van Hung','Le Thu Phuong','Pham Duc Tung','Tran Van Nam','Vu Hoang Yen','Dang Thi Lan','Cao Thi Mai','Pham Hoang Duc','Le Hoang Nam','Dương Thu Ha','Tran Đức Minh'],
    products:  ['Áo len day','Quần jeans wide leg','Áo sơ mi nam','Balo nữ','Khăn len','Đầm maxi hoa nhí','Áo khoác nhẹ','Túi xách','Mũ nón','Váy hoa nhí','Áo phông','Giày sneaker','Váy công sở','Đầm suông','Quần short','Áo croptop','Áo hoodie','Đầm bodycon','Chân váy','Áo blazer'],
    sizes:     ['S','M','L','XL','XXL','28','29','30','31','32','Freesize'],
    temps:     ['Nóng','Ấm','Lạnh'],
    pains:     ['Tìm giày nam','Mua cho bạn','Hỏi cho biết','Mua quà tặng','Cần đầm công sở','Mùa đông cần áo len','Hỏi giá rồi không rep','Tìm áo đi tiệc','Mua tặng mẹ','Tìm vest nam'],
    platforms: ['facebook','zalo'],
  },

  'fsh-2': {
    customers: ['Pham Duc Tung','Cao Minh Duc','Vu Hoang Yen','Bui Hoang Yen','Le Thu Ha','Pham Thi Huong','Tran Van Minh','Trinh Thi Lan','Nguyen Thi Mai','Dang Thi Mai','Tran Thi Lan','Pham Hoang Yen','Le Thu Hà','Tran Đức Minh','Cao Thị Lan','Vũ Minh Tuấn','Nguyễn Văn Hùng','Dương Hoàng Nam','Lê Đức Phong','Trịnh Đức Minh'],
    junkOpts:  [false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,true,false,false,false,false],
    phoneOpts: ['Đã cho SĐT','Chưa cho','Khách từ chối'],
    objections:['Chê giá đắt','Phí ship cao','Chưa tin tưởng chất lượng','Đang cân nhắc nhiều shop','Không có size','Hỏi cho biết','Cần hỏi ý kiến người thân','Không có rào cản'],
    adsSrcs:   ['Facebook Ads','Zalo Ads','Tiktok Ads'],
    platforms: ['facebook','zalo'],
  },

  'fsh-3': {
    customers: ['Pham Minh Yến','Nguyen Duc Hoang','Le Hoang Nam','Cao Thi Lan','Le Thu Ha','Pham Hoang Duc','Dang Hoang Anh','Pham Thi Huong','Dang Thi Mai','Tran Đức Anh','Trịnh Thi Lan','Bui Hoang Yến','Nguyen Thu Hà','Tran Văn Minh','Lê Thu Phương','Phạm Hoàng Đức','Trần Đức Minh','Vũ Minh Tuấn','Đặng Hoàng Anh','Nguyễn Thị Hương'],
    attitudes: ['Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Trung bình','Trung bình','Kém','Kém','Kém','Kém','Kém','Kém','Kém'],
    mistakes:  ['Không có lỗi','Không có lỗi','Bỏ quên khách','Không tư vấn màu','Không tư vấn size','Gây hoang mang','Sale gửi sai size','Sale không rep đúng giờ','Sale nói không đúng sp','Không chốt đơn được'],
    scenarios: ['Tư vấn chi phí','Khai thác thông tin','Ưu đãi cá nhân hóa','Giải quyết vấn đề'],
    chot_don:  [false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,false,false,false,false],
    missed_conv:[false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],
    silent_cust:[false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false],
    platforms: ['facebook','zalo'],
  },

  'fsh-4': {
    customers: ['Bui Van Cuong','Vu Hoang Yến','Nguyen Duc Hoang','Nguyen Van Hung','Duong Thu Ha','Dang Thi Mai','Duong Hoang Nam','Pham Hoang Duc','Tran Thi Lan','Le Thu Phuong','Pham Thi Huong','Tran Van Nam','Vu Minh Tuan','Cao Minh Duc','Trinh Thi Lan','Nguyen Thi Hương','Lê Thu Hà','Trịnh Đức Minh','Dương Văn Nam','Phạm Hoàng Yến'],
    genders:   ['Nam','Nam','Nữ','Nữ','Nam','Nữ','Nam','Nữ','Nữ','Nữ','Nữ','Nam','Nữ','Nam','Nam','Nữ','Nữ','Nam','Nam','Nữ'],
    locations: ['TP.HCM','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Nha Trang','Biên Hòa','Vũng Tàu','Cà Mau','Bình Dương'],
    budgets:   ['Dưới 300k','300k-500k','500k-1M','1-2 triệu','2-5 triệu','Không đề cập'],
    segments:  ['Khách mới','Khách quen','Khách hoàn tiền'],
    platforms: ['facebook','zalo'],
  },

  'fsh-5': {
    customers: ['Le Thu Phuong','Tran Đức Anh','Vu Hoang Yến','Pham Hoang Duc','Nguyen Thi Mai','Pham Thi Huong','Pham Minh Yến','Nguyen Thi Huong','Trinh Đức Minh','Dang Hoang Anh','Le Thu Ha','Vu Minh Tuan','Le Hoang Nam','Lê Đức Phong','Nguyen Van Hung','Tran Thi Lan','Dang Thi Lan','Trịnh Thi Lan','Cao Thị Mai','Phạm Hoàng Đức'],
    hasComp:   [true,false,false,false,false,true,true,false,false,false,false,true,true,false,false,false,true,false,false,true],
    compNames: ['Shein','H&M','Zara','Uniqlo','Pull&Bear','Shopee','Massimo Dutti','Benetton'],
    criteria:  ['Giá cả','Chất lượng','Uy tín thương hiệu','Phí giao hàng','Không có'],
    platforms: ['facebook','zalo'],
  },

  'fsh-6': {
    customers: ['Le Thu Phuong','Pham Duc Tung','Trinh Đức Minh','Cao Minh Duc','Duong Hoang Nam','Trịnh Thi Lan','Duong Thu Ha','Le Hoang Nam','Tran Đức Anh','Vu Hoang Yến','Nguyen Thi Mai','Nguyen Thi Huong','Tran Van Minh','Pham Thi Huong','Lê Thu Ha','Trịnh Đức Minh','Dương Thu Ha','Vũ Hoàng Yến','Phạm Minh Yến','Trần Văn Nam'],
    msgTypes:  ['Hỏi về đơn hàng','Hỏi sản phẩm mới','Xin đổi trả','Khiếu nại','Hỏi về khuyến mãi','Hỏi về size'],
    satisfactions: ['Hài lòng','Hài lòng','Hài lòng','Hài lòng','Trung bình','Trung bình','Trung bình','Không hài lòng'],
    canRefers: [false,true,true,true,false,false,true,false],
    platforms: ['facebook','zalo'],
  },

  // ─── MOTHER & BABY ─────────────────────────────────────────────────────
  'mbb-1': {
    customers: ['Tran Thi Ha','Le Duc Tuan','Pham Thi Lan','Vu Thi Mai','Dang Hoang Minh','Trịnh Thu Ha','Cao Thi Yến','Nguyen Thi Hương','Tran Van Nam','Phạm Hoàng Yến','Lê Thu Phương','Dương Hoàng Nam','Trịnh Đức Minh','Vũ Thị Lan','Nguyễn Văn Hùng','Đặng Thu Lan','Phạm Hoàng Đức','Trần Đức Minh','Lê Hoàng Nam','Vũ Minh Tuấn'],
    products:  ['Tã quần','Sữa công thức','Bình sữa','Bánh ăn dặm','Dầu gội cho bé','Kem chống hăm','Xe tập đi','Balo mẹ và bé','Máy hâm sữa','Khăn ướt','Yến mạch','Nước rửa tay','Son dưỡng môi','Dung dịch vệ sinh','Bàn chải cho bé'],
    babyAges:  ['0-3 tháng','3-6 tháng','6-12 tháng','1-2 tuổi','2-3 tuổi','Trên 3 tuổi'],
    temps:     ['Nóng','Ấm','Lạnh'],
    pains:     ['Cần tã thấm hút tốt cho bé ngủ đêm','Tìm sữa cho bé dị ứng đạm bò','Cần bình sữa chống đầy hơi','Bé cần ăn dặm tự nhiên','Lo ngại da bé bị hăm','Tìm xe tập đi an toàn','Cần mua đồ sơ sinh trọn gói','Tư vấn liều lượng sữa'],
    platforms: ['facebook','zalo'],
  },

  'mbb-2': {
    customers: ['Le Duc Tuan','Tran Thi Ha','Pham Thi Lan','Vu Thi Mai','Dang Hoang Minh','Trịnh Thu Ha','Cao Thi Yến','Nguyen Thi Hương','Tran Van Nam','Phạm Hoàng Yến','Lê Thu Phương','Dương Hoàng Nam','Trịnh Đức Minh','Vũ Thị Lan','Nguyễn Văn Hùng','Đặng Thu Lan','Phạm Hoàng Đức','Trần Đức Minh','Lê Hoàng Nam','Vũ Minh Tuấn'],
    junkOpts:  [false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,true,false,false],
    phoneOpts: ['Đã cho SĐT','Chưa cho','Khách từ chối'],
    objections:['Lo ngại an toàn sản phẩm','Hỏi chồng','Giá cao hơn kỳ vọng','Cần so sánh với brand khác','Không có rào cản','Chưa tin tưởng'],
    bulkOpts:  ['Có','Không','Đang cân nhắc'],
    adsSrcs:   ['Facebook Ads','Zalo Ads','Tiktok Ads'],
    platforms: ['facebook','zalo'],
  },

  'mbb-3': {
    customers: ['Pham Thi Lan','Le Duc Tuan','Tran Thi Ha','Vu Thi Mai','Dang Hoang Minh','Trịnh Thu Ha','Cao Thi Yến','Nguyen Thi Hương','Tran Van Nam','Phạm Hoàng Yến','Lê Thu Phương','Dương Hoàng Nam','Trịnh Đức Minh','Vũ Thị Lan','Nguyễn Văn Hùng','Đặng Thu Lan','Phạm Hoàng Đức','Trần Đức Minh','Lê Hoàng Nam','Vũ Minh Tuấn'],
    attitudes: ['Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Trung bình','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém'],
    mistakes:  ['Không có lỗi','Sale tư vấn sai độ tuổi sử dụng','Không giải đáp được lo ngại an toàn','Bỏ quên khách','Sale gửi sai sản phẩm','Không follow up sau 3 ngày','Tư vấn thiếu thông tin dinh dưỡng','Không xác nhận đơn'],
    scenarios: ['Tư vấn chi phí','Khai thác thông tin','Ưu đãi cá nhân hóa','Giải quyết vấn đề'],
    chot_don:  [false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,false,false,false,false],
    missed_conv:[false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],
    silent_cust:[false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false],
    platforms: ['facebook','zalo'],
  },

  'mbb-4': {
    customers: ['Vu Thi Mai','Tran Thi Ha','Pham Thi Lan','Le Duc Tuan','Dang Hoang Minh','Trịnh Thu Ha','Cao Thi Yến','Nguyen Thi Hương','Tran Van Nam','Phạm Hoàng Yến','Lê Thu Phương','Dương Hoàng Nam','Trịnh Đức Minh','Vũ Thị Lan','Nguyễn Văn Hùng','Đặng Thu Lan','Phạm Hoàng Đức','Trần Đức Minh','Lê Hoàng Nam','Vũ Minh Tuấn'],
    parentGenders: ['Nữ','Nữ','Nữ','Nữ','Nam','Nam','Nữ','Nữ','Nam','Nữ'],
    babyAges:  ['0-3 tháng','3-6 tháng','6-12 tháng','1-2 tuổi','2-3 tuổi','Trên 3 tuổi'],
    locations: ['TP.HCM','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Nha Trang','Biên Hòa','Vũng Tàu'],
    budgets:   ['Dưới 500k','500k-1M','1M-3M','3M-5M','5M-10M','Không đề cập'],
    platforms: ['facebook','zalo'],
  },

  'mbb-5': {
    customers: ['Dang Hoang Minh','Tran Thi Ha','Le Duc Tuan','Pham Thi Lan','Vu Thi Mai','Trịnh Thu Ha','Cao Thi Yến','Nguyen Thi Hương','Tran Van Nam','Phạm Hoàng Yến','Lê Thu Phương','Dương Hoàng Nam','Trịnh Đức Minh','Vũ Thị Lan','Nguyễn Văn Hùng','Đặng Thu Lan','Phạm Hoàng Đức','Trần Đức Minh','Lê Hoàng Nam','Vũ Minh Tuấn'],
    hasComp:   [true,true,false,false,true,false,false,true,false,false,false,true,false,false,false,true,false,false,false,false],
    compNames: ['Con Cưng','BiboMart','Kids Plaza','Mothercare','Shopee Kids','Lazada Kids'],
    criteria:  ['An toàn / Chất lượng','Giá cả','Đa dạng sản phẩm','Không có'],
    platforms: ['facebook','zalo'],
  },

  'mbb-6': {
    customers: ['Trịnh Thu Ha','Vu Thi Mai','Tran Thi Ha','Pham Thi Lan','Le Duc Tuan','Dang Hoang Minh','Cao Thi Yến','Nguyen Thi Hương','Tran Van Nam','Phạm Hoàng Yến','Lê Thu Phương','Dương Hoàng Nam','Trịnh Đức Minh','Vũ Thị Lan','Nguyễn Văn Hùng','Đặng Thu Lan','Phạm Hoàng Đức','Trần Đức Minh','Lê Hoàng Nam','Vũ Minh Tuấn'],
    msgTypes:  ['Khiếu nại','Hỏi về sản phẩm','Hỏi về đơn hàng','Xin đổi trả','Hỏi về khuyến mãi','Xin tư vấn'],
    frustrations: [true,false,false,false,false,false,false,false,false,false,true,true,true,true,false,false,false,false,false],
    urgencies: ['Cao','Trung bình','Thấp'],
    platforms: ['facebook','zalo'],
  },

  // ─── COSMETICS ──────────────────────────────────────────────────────────
  'cos-1': {
    customers: ['Nguyen Thi Yến','Le Thi Hoa','Tran Minh Anh','Pham Thu Huong','Vu Duc Manh','Dang Thi Lan','Cao Thi Mai','Trinh Thi Ha','Nguyen Van Nam','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Thị Lan','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Thi Lan','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    products:  ['Kem dưỡng ẩm','Kem chống nắng','Serum vitamin C','Kem trị mụn','Son môi','Phấn nước','Sữa rửa mặt','Tẩy tế bào chết','Kem nền','Mascara','Dưỡng tóc','Nước hoa','Kem làm sáng da','Mặt nạ','Xịt khoáng'],
    skinTypes: ['Da dầu','Da khô','Da hỗn hợp','Da nhạy cảm'],
    temps:     ['Nóng','Ấm','Lạnh'],
    pains:     ['Da khô bong tróc mùa đông','Mụn ẩn sau sinh','Tìm kem chống nắng cho da nhạy cảm','Da xỉn màu cần dưỡng trắng','Tìm serum trị thâm nám','Lo ngại hàng fake','Da dầu cần kem kiềm dầu'],
    platforms: ['facebook','zalo'],
  },

  'cos-2': {
    customers: ['Le Thi Hoa','Nguyen Thi Yến','Tran Minh Anh','Pham Thu Huong','Vu Duc Manh','Dang Thi Lan','Cao Thi Mai','Trinh Thi Ha','Nguyen Van Nam','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Thị Lan','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Thi Lan','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    junkOpts:  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false],
    phoneOpts: ['Đã cho SĐT','Chưa cho','Khách từ chối'],
    objections:['Lo ngại hàng fake','Chê giá đắt','Da nhạy cảm không dùng được','Không có rào cản','Cần xem review trước','Muốn thử trước'],
    adsSrcs:   ['Facebook Ads','Zalo Ads','Tiktok Ads'],
    platforms: ['facebook','zalo'],
  },

  'cos-3': {
    customers: ['Tran Minh Anh','Le Thi Hoa','Nguyen Thi Yến','Pham Thu Huong','Vu Duc Manh','Dang Thi Lan','Cao Thi Mai','Trinh Thi Ha','Nguyen Van Nam','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Thị Lan','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Thi Lan','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    attitudes: ['Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Trung bình','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém'],
    mistakes:  ['Không có lỗi','Sale khoe sp chưa được kiểm định','Bỏ qua da nhạy cảm của khách','Tư vấn sai sp cho loại da','Không cập nhật thông tin khuyến mãi','Sale không rep đúng giờ','Gợi ý sp giá cao không phù hợp'],
    scenarios: ['Tư vấn chi phí','Khai thác thông tin','Ưu đãi cá nhân hóa','Giải quyết vấn đề'],
    chot_don:  [false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,false,false,false,false],
    missed_conv:[false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],
    silent_cust:[false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false],
    platforms: ['facebook','zalo'],
  },

  'cos-4': {
    customers: ['Pham Thu Huong','Tran Minh Anh','Le Thi Hoa','Nguyen Thi Yến','Vu Duc Manh','Dang Thi Lan','Cao Thi Mai','Trinh Thi Ha','Nguyen Van Nam','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Thị Lan','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Thi Lan','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    genders:   ['Nữ','Nữ','Nữ','Nữ','Nam','Nữ','Nữ','Nữ','Nam','Nữ','Nữ','Nam','Nữ','Nữ','Nam','Nam','Nữ','Nữ','Nam','Nam'],
    locations: ['TP.HCM','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Nha Trang','Biên Hòa','Vũng Tàu'],
    budgets:   ['Dưới 300k','300k-500k','500k-1M','1M-3M','Không đề cập'],
    segments:  ['Sinh viên','Nhân viên văn phòng','Mẹ bỉm','Doanh nhân','Khách quen'],
    platforms: ['facebook','zalo'],
  },

  'cos-5': {
    customers: ['Vu Duc Manh','Nguyen Thi Yến','Le Thi Hoa','Tran Minh Anh','Pham Thu Huong','Dang Thi Lan','Cao Thi Mai','Trinh Thi Ha','Nguyen Van Nam','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Thị Lan','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Thi Lan','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    hasComp:   [true,true,false,false,true,false,false,true,false,false,false,true,false,false,false,false,false,true,false,false],
    compNames: ['The Ordinary','Paula\'s Choice','Some By Mi','Innisfree','Kiehl\'s','Laneige','Sulwhasoo'],
    criteria:  ['Thành phần','Giá cả','Hiệu quả','Độ an toàn','Không có'],
    platforms: ['facebook','zalo'],
  },

  'cos-6': {
    customers: ['Dang Thi Lan','Pham Thu Huong','Tran Minh Anh','Le Thi Hoa','Nguyen Thi Yến','Vu Duc Manh','Cao Thi Mai','Trinh Thi Ha','Nguyen Van Nam','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Thị Lan','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Thi Lan','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    msgTypes:  ['Hỏi về dị ứng','Hỏi về sản phẩm','Khiếu nại','Xin đổi trả','Hỏi về đơn hàng','Hỏi về khuyến mãi'],
    satisfactions: ['Hài lòng','Hài lòng','Trung bình','Không hài lòng'],
    canRefers: [false,false,true,true,false],
    platforms: ['facebook','zalo'],
  },

  // ─── SPA / BEAUTY SALON ─────────────────────────────────────────────────
  'spa-1': {
    customers: ['Tran Thi Lan','Le Duc Tuan','Pham Hoang Yến','Nguyen Thu Ha','Vu Thi Mai','Dang Duc Hoang','Trịnh Thu Lan','Cao Thi Yến','Phạm Thi Lan','Nguyễn Thi Hương','Trần Đức Minh','Lê Thu Phương','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    treatments:['Triệt lông laser','Nâng cơ mặt','Trị nám laser','Tắm trắng','Massage body','Đắp mặt nạ','Triệt lông','Trị mụn','Dưỡng da','Trị thâm quầng mắt'],
    temps:     ['Nóng','Ấm','Lạnh'],
    pains:     ['Muốn triệt lông vĩnh viễn da nhạy cảm','Tìm liệu trình trị nám hiệu quả','Cần nâng cơ không phẫu thuật','Muốn da trắng đều','Tìm spa gần nhà giá hợp lý','Da mụn cần liệu trình khẩn cấp'],
    platforms: ['facebook','zalo'],
  },

  'spa-2': {
    customers: ['Le Duc Tuan','Tran Thi Lan','Pham Hoang Yến','Nguyen Thu Ha','Vu Thi Mai','Dang Duc Hoang','Trịnh Thu Lan','Cao Thi Yến','Phạm Thi Lan','Nguyễn Thi Hương','Trần Đức Minh','Lê Thu Phương','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    junkOpts:  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false],
    phoneOpts: ['Đã cho SĐT','Chưa cho','Khách từ chối'],
    objections:['Booking intent thấp','Giá liệu trình cao','Cần xem review trước','Lo ngại bác sĩ không giỏi','Không có chi nhánh gần'],
    adsSrcs:   ['Facebook Ads','Zalo Ads','Tiktok Ads'],
    platforms: ['facebook','zalo'],
  },

  'spa-3': {
    customers: ['Pham Hoang Yến','Tran Thi Lan','Le Duc Tuan','Nguyen Thu Ha','Vu Thi Mai','Dang Duc Hoang','Trịnh Thu Lan','Cao Thi Yến','Phạm Thi Lan','Nguyễn Thi Hương','Trần Đức Minh','Lê Thu Phương','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    attitudes: ['Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Trung bình','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém'],
    mistakes:  ['Không có lỗi','Sale không xác nhận lịch hẹn KH đến không có người đón','Tư vấn sai liệu trình','Không báo trước thay đổi giờ hẹn','Sale không gửi hướng dẫn sau điều trị','Bỏ qua phản ứng bất lợi của khách'],
    scenarios: ['Tư vấn chi phí','Khai thác thông tin','Ưu đãi cá nhân hóa','Giải quyết vấn đề'],
    chot_don:  [false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,false,false,false,false],
    missed_conv:[false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],
    silent_cust:[false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false],
    platforms: ['facebook','zalo'],
  },

  'spa-4': {
    customers: ['Nguyen Thu Ha','Tran Thi Lan','Le Duc Tuan','Pham Hoang Yến','Vu Thi Mai','Dang Duc Hoang','Trịnh Thu Lan','Cao Thi Yến','Phạm Thi Lan','Nguyễn Thi Hương','Trần Đức Minh','Lê Thu Phương','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    genders:   ['Nữ','Nữ','Nam','Nữ','Nữ','Nữ','Nữ','Nữ','Nữ','Nữ','Nam','Nữ','Nam','Nam','Nam','Nam','Nữ','Nam','Nam','Nam'],
    locations: ['TP.HCM','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Nha Trang','Biên Hòa'],
    budgets:   ['Dưới 500k','500k-1M','1M-3M','3M-5M','5M-10M','10M+'],
    segments:  ['Nhân viên văn phòng','Mẹ bỉm','Doanh nhân','Sinh viên','Khách quen'],
    platforms: ['facebook','zalo'],
  },

  'spa-5': {
    customers: ['Vu Thi Mai','Tran Thi Lan','Le Duc Tuan','Pham Hoang Yến','Nguyen Thu Ha','Dang Duc Hoang','Trịnh Thu Lan','Cao Thi Yến','Phạm Thi Lan','Nguyễn Thi Hương','Trần Đức Minh','Lê Thu Phương','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    hasComp:   [true,false,false,false,true,true,false,false,true,false,false,true,false,false,false,false,false,true,false,false],
    compNames: ['Shynh Premium','Skinbar','Spa L\'Apotheca','Cocoon','L Derm','Glow Skin Clinic'],
    criteria:  ['Bác sĩ thực hiện','Giá cả','Vị trí','Công nghệ','Không có'],
    platforms: ['facebook','zalo'],
  },

  'spa-6': {
    customers: ['Dang Duc Hoang','Tran Thi Lan','Le Duc Tuan','Pham Hoang Yến','Nguyen Thu Ha','Vu Thi Mai','Trịnh Thu Lan','Cao Thi Yến','Phạm Thi Lan','Nguyễn Thi Hương','Trần Đức Minh','Lê Thu Phương','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng'],
    msgTypes:  ['Khiếu nại','Hỏi về dịch vụ','Yêu cầu xem nhà','Hỏi về đơn hàng','Hỏi về khuyến mãi'],
    satisfactions: ['Hài lòng','Trung bình','Không hài lòng'],
    canRefers: [true,true,false,false,false],
    platforms: ['facebook','zalo'],
  },

  // ─── REAL ESTATE ────────────────────────────────────────────────────────
  'rls-1': {
    customers: ['Trịnh Văn Minh','Nguyen Thi Lan','Pham Duc Hoang','Le Thu Phuong','Vu Hoang Minh','Tran Đức Anh','Dương Thu Ha','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến','Nguyen Van Nam'],
    products:  ['Căn hộ chung cư','Nhà phố','Đất nền','Căn hộ duplex','Shophouse','Biệt thự','Officetel','Condotel'],
    legalStatuses: ['Sổ hồng','Sổ đỏ','Hợp đồng mua bán','Đang chờ sổ'],
    temps:     ['Nóng','Ấm','Lạnh'],
    pains:     ['Tim căn hộ 2PN khu vực Thủ Đức tầm 2-3 tỷ','Cần nhà phố gần trường học','Tìm đất nền pháp lý sạch Bình Dương','Muốn đầu tư cho thuê','Cần shophouse mặt tiền','Tìm biệt thự view sông'],
    platforms: ['facebook','zalo'],
  },

  'rls-2': {
    customers: ['Nguyen Thi Lan','Trịnh Văn Minh','Pham Duc Hoang','Le Thu Phuong','Vu Hoang Minh','Tran Đức Anh','Dương Thu Ha','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến','Nguyen Van Nam'],
    junkOpts:  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false],
    phoneOpts: ['Đã cho SĐT','Chưa cho','Khách từ chối'],
    objections:['Pháp lý chưa rõ','Ngân sách không xác nhận','Cần xem nhà trước','Đang cân nhắc dự án khác','Cần hỏi vợ/chồng','Giá cao hơn kỳ vọng'],
    adsSrcs:   ['Facebook Ads','Zalo Ads'],
    platforms: ['facebook','zalo'],
  },

  'rls-3': {
    customers: ['Pham Duc Hoang','Nguyen Thi Lan','Trịnh Văn Minh','Le Thu Phuong','Vu Hoang Minh','Tran Đức Anh','Dương Thu Ha','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến','Nguyen Van Nam'],
    attitudes: ['Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Trung bình','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém'],
    mistakes:  ['Không có lỗi','Sale không gửi file brochure KH phải hỏi lại','Sale gọi liên tục gây phiền','Không cập nhật tiến độ pháp lý','Tư vấn sai quy hoạch khu vực','Sale hứa không giữ được giá'],
    scenarios: ['Tư vấn chi phí','Khai thác thông tin','Ưu đãi cá nhân hóa','Giải quyết vấn đề'],
    chot_don:  [false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,false,false,false,false],
    missed_conv:[false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],
    silent_cust:[false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false],
    platforms: ['facebook','zalo'],
  },

  'rls-4': {
    customers: ['Le Thu Phuong','Vu Hoang Minh','Trịnh Văn Minh','Nguyen Thi Lan','Pham Duc Hoang','Tran Đức Anh','Dương Thu Ha','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến','Nguyen Van Nam'],
    genders:   ['Nữ','Nam','Nam','Nữ','Nam','Nam','Nữ','Nữ','Nữ','Nam','Nam','Nam','Nam','Nam','Nữ','Nam','Nam','Nam','Nữ','Nam'],
    locations: ['TP.HCM','Hà Nội','Đà Nẵng','Bình Dương','Biên Hòa','Thủ Đức','Quận 7','Quận 2'],
    budgets:   ['Dưới 1 tỷ','1-2 tỷ','2-5 tỷ','5-10 tỷ','10 tỷ+','Không đề cập'],
    segments:  ['Gia đình trẻ','Đầu tư','Người mua ở thực','Người mua xa gốc'],
    platforms: ['facebook','zalo'],
  },

  'rls-5': {
    customers: ['Vu Hoang Minh','Le Thu Phuong','Trịnh Văn Minh','Nguyen Thi Lan','Pham Duc Hoang','Tran Đức Anh','Dương Thu Ha','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến','Nguyen Van Nam'],
    hasComp:   [true,false,false,false,true,false,false,true,false,false,false,true,false,false,false,false,false,true,false,false],
    compNames: ['Vingroup','Novaland','Khải Hoàn Land','Invest','Dat Xanh','CEO Group'],
    criteria:  ['Tiện ích','Vị trí','Giá cả','Pháp lý','Không có'],
    platforms: ['facebook','zalo'],
  },

  'rls-6': {
    customers: ['Tran Đức Anh','Vu Hoang Minh','Le Thu Phuong','Trịnh Văn Minh','Nguyen Thi Lan','Pham Duc Hoang','Dương Thu Ha','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến','Nguyen Van Nam'],
    msgTypes:  ['Yêu cầu xem nhà','Hỏi về tiến độ','Khiếu nại','Hỏi về pháp lý','Hỏi về chính sách'],
    urgencies: ['Cao','Trung bình','Thấp'],
    canRefers: [false,false,true,true],
    platforms: ['facebook','zalo'],
  },

  // ─── F&B ───────────────────────────────────────────────────────────────
  'fb-1': {
    customers: ['Nguyen Van Tung','Tran Thi Huong','Le Minh Hoang','Pham Thu Lan','Vu Duc Minh','Dang Thi Hoa','Cao Thi Mai','Trịnh Văn Minh','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    products:  ['Com ga','Bun bo Hue','Banh mi','Pho bo','Ca phe','Tra sua','Nuoc ep','Banh flan','Com tam','Lau'],
    temps:     ['Nóng','Ấm','Lạnh'],
    pains:     ['Tim quan com ga ngon gan truong DH giao nhanh','Tìm bún bò nguyên chất giá hợp lý','Cần đặt bàn nhóm 10 người cuối tuần','Muốn đặt giao tận văn phòng','Tìm quán không gian đẹp chụp ảnh','Cần combo tiệc sinh nhật'],
    platforms: ['facebook','zalo'],
  },

  'fb-2': {
    customers: ['Tran Thi Huong','Nguyen Van Tung','Le Minh Hoang','Pham Thu Lan','Vu Duc Minh','Dang Thi Hoa','Cao Thi Mai','Trịnh Văn Minh','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    junkOpts:  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false],
    phoneOpts: ['Đã cho SĐT','Chưa cho','Khách từ chối'],
    objections:['Quá xa không có chi nhánh gần','Giá cao hơn app delivery','Chờ giao hơn 1 tiếng','Không có món khách muốn','Không gian không phù hợp','Không có rào cản'],
    adsSrcs:   ['Facebook Ads','Zalo Ads'],
    platforms: ['facebook','zalo'],
  },

  'fb-3': {
    customers: ['Le Minh Hoang','Tran Thi Huong','Nguyen Van Tung','Pham Thu Lan','Vu Duc Minh','Dang Thi Hoa','Cao Thi Mai','Trịnh Văn Minh','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    attitudes: ['Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Trung bình','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém'],
    mistakes:  ['Không có lỗi','Sale không xác nhận đơn giao hàng','Không báo trước hết món','Order sai món','Không đối soát đơn khi giao','Sale không xử lý khiếu nại nhiệt độ đồ uống'],
    scenarios: ['Tư vấn chi phí','Khai thác thông tin','Ưu đãi cá nhân hóa','Giải quyết vấn đề'],
    chot_don:  [false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,false,false,false,false],
    missed_conv:[false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],
    silent_cust:[false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false],
    platforms: ['facebook','zalo'],
  },

  'fb-4': {
    customers: ['Pham Thu Lan','Le Minh Hoang','Tran Thi Huong','Nguyen Van Tung','Vu Duc Minh','Dang Thi Hoa','Cao Thi Mai','Trịnh Văn Minh','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    genders:   ['Nữ','Nam','Nữ','Nam','Nam','Nữ','Nữ','Nam','Nữ','Nữ','Nam','Nam','Nam','Nam','Nam','Nữ','Nam','Nam','Nam','Nữ'],
    locations: ['TP.HCM','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Nha Trang','Biên Hòa','Quận 1','Quận 3'],
    budgets:   ['Dưới 100k','100k-300k','300k-500k','500k-1M','1M+','Không đề cập'],
    segments:  ['Sinh viên','Nhân viên văn phòng','Gia đình','Khách du lịch','Khách quen'],
    platforms: ['facebook','zalo'],
  },

  'fb-5': {
    customers: ['Vu Duc Minh','Pham Thu Lan','Le Minh Hoang','Tran Thi Huong','Nguyen Van Tung','Dang Thi Hoa','Cao Thi Mai','Trịnh Văn Minh','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    hasComp:   [true,false,false,false,true,false,false,false,true,false,false,false,true,false,false,false,false,false,false,true],
    compNames: ['GrabFood','Beamin','ShopeeFood','Gojek','Loship','Baemin'],
    criteria:  ['Giá cả','Tốc độ giao','Chất lượng','Không có'],
    platforms: ['facebook','zalo'],
  },

  'fb-6': {
    customers: ['Dang Thi Hoa','Vu Duc Minh','Pham Thu Lan','Le Minh Hoang','Tran Thi Huong','Nguyen Van Tung','Cao Thi Mai','Trịnh Văn Minh','Lê Thu Hà','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    msgTypes:  ['Review xấu','Khiếu nại','Hỏi về đơn hàng','Hỏi về khuyến mãi','Đặt bàn'],
    satisfactions: ['Hài lòng','Trung bình','Không hài lòng'],
    canRefers: [true,true,false,false],
    platforms: ['facebook','zalo'],
  },

  // ─── TRAVEL ────────────────────────────────────────────────────────────
  'trv-1': {
    customers: ['Trịnh Thi Lan','Nguyen Duc Hoang','Le Thu Ha','Pham Hoang Minh','Vu Thi Lan','Tran Duc Tuan','Dang Thi Mai','Cao Van Nam','Lê Thu Phương','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    destinations: ['Đà Nẵng','Phú Quốc','Nha Trang','Hội An','Sa Pa','Hà Nội','TP.HCM','Vũng Tàu','Cần Thơ','Bà Nà'],
    otaComps:  ['Traveloka','Agoda','Booking.com','Vntrip','Tripadvisor'],
    temps:     ['Nóng','Ấm','Lạnh'],
    pains:     ['Book khách sạn 4 sao view biển ngày 28-30/03 2 người lớn','Tìm tour Đà Nẵng 3N2Đ giá tốt','Cần visa Hàn Quốc gấp','Tìm vé máy bay TP.HCM - Đà Nẵng khứ hồi','Book resort gia đình 4 người Phú Quốc','Tìm xe máy thuê Sa Pa giá rẻ'],
    platforms: ['facebook','zalo'],
  },

  'trv-2': {
    customers: ['Nguyen Duc Hoang','Trịnh Thi Lan','Le Thu Ha','Pham Hoang Minh','Vu Thi Lan','Tran Duc Tuan','Dang Thi Mai','Cao Van Nam','Lê Thu Phương','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    junkOpts:  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false],
    phoneOpts: ['Đã cho SĐT','Chưa cho','Khách từ chối'],
    objections:['So sánh với Agoda','Giá cao hơn OTA','Cần xem review trước','Đang chờ bạn đồng hành','Không có rào cản'],
    adsSrcs:   ['Facebook Ads','Zalo Ads'],
    platforms: ['facebook','zalo'],
  },

  'trv-3': {
    customers: ['Le Thu Ha','Nguyen Duc Hoang','Trịnh Thi Lan','Pham Hoang Minh','Vu Thi Lan','Tran Duc Tuan','Dang Thi Mai','Cao Van Nam','Lê Thu Phương','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    attitudes: ['Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Tốt','Trung bình','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém','Kém'],
    mistakes:  ['Không có lỗi','Sale không cung cấp thông tin visa kịp thời','Không gửi itinerary đúng hẹn','Booking sai ngày khách','Không hỗ trợ đổi lịch bay','Sale không thông báo phí phụ thu'],
    scenarios: ['Tư vấn chi phí','Khai thác thông tin','Ưu đãi cá nhân hóa','Giải quyết vấn đề'],
    chot_don:  [false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,false,false,false,false],
    missed_conv:[false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false],
    silent_cust:[false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false],
    platforms: ['facebook','zalo'],
  },

  'trv-4': {
    customers: ['Pham Hoang Minh','Le Thu Ha','Nguyen Duc Hoang','Trịnh Thi Lan','Vu Thi Lan','Tran Duc Tuan','Dang Thi Mai','Cao Van Nam','Lê Thu Phương','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    genders:   ['Nam','Nữ','Nam','Nữ','Nữ','Nam','Nữ','Nam','Nữ','Nữ','Nam','Nam','Nam','Nam','Nam','Nữ','Nam','Nam','Nam','Nữ'],
    locations: ['TP.HCM','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Biên Hòa','Thủ Đức'],
    budgets:   ['Dưới 5M','5M-10M','10M-20M','20M-50M','50M+','Không đề cập'],
    segments:  ['Couple','Gia đình','Bạn bè','Một mình','Nhóm'],
    platforms: ['facebook','zalo'],
  },

  'trv-5': {
    customers: ['Vu Thi Lan','Pham Hoang Minh','Le Thu Ha','Nguyen Duc Hoang','Trịnh Thi Lan','Tran Duc Tuan','Dang Thi Mai','Cao Van Nam','Lê Thu Phương','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    hasComp:   [true,false,false,false,true,false,false,false,true,false,false,false,true,false,false,false,false,false,false,false],
    compNames: ['Agoda','Traveloka','Booking.com','Vntrip','Tripadvisor','Klook'],
    criteria:  ['Giá cả','Điểm đánh giá','Tiện ích kèm theo','Không có'],
    platforms: ['facebook','zalo'],
  },

  'trv-6': {
    customers: ['Tran Duc Tuan','Vu Thi Lan','Pham Hoang Minh','Le Thu Ha','Nguyen Duc Hoang','Trịnh Thi Lan','Dang Thi Mai','Cao Van Nam','Lê Thu Phương','Phạm Hoàng Yến','Trần Đức Minh','Vũ Hoàng Yến','Dương Hoàng Nam','Trịnh Đức Minh','Lê Hoàng Nam','Đặng Thu Lan','Phạm Hoàng Đức','Vũ Minh Tuấn','Nguyễn Văn Hùng','Cao Thi Yến'],
    msgTypes:  ['Khiếu nại','Yêu cầu hoàn tiền','Hỏi về bảo hiểm','Hỏi về đơn hàng','Hỏi về khuyến mãi'],
    urgencies: ['Cao','Trung bình','Thấp'],
    canRefers: [false,false,true,true],
    platforms: ['facebook','zalo'],
  },
};

// ─── Extended Field Pools (universal — available in all rows) ───────────────

const SATISFACTION_POOL = [
  'Hài lòng', 'Hài lòng', 'Hài lòng', 'Hài lòng',
  'Trung bình', 'Trung bình',
  'Không hài lòng',
  'Rất hài lòng',
];

const COMPETITOR_POOL = [
  null, null, null, null, null, null, null,
  'Shein', 'Shopee', 'Lazada', 'Zara', 'H&M', 'Nike', 'Adidas',
];
const COMPETITOR_NAME_POOL = ['Shein', 'Shopee', 'Lazada', 'Zara', 'H&M', 'Nike', 'Adidas', 'Uniqlo', 'Maybelline', 'Innisfree'];
const CRITERIA_POOL = ['Giá cả', 'Chất lượng', 'Mẫu mã', 'Uy tín', 'Phí ship', 'Giao hàng nhanh'];

const PAIN_POINT_POOL = [
  'Giá cao hơn kỳ vọng', 'Không có size', 'Sợ hàng không chất lượng',
  'Hàng không giống ảnh', 'Lo ngại an toàn', 'Phí ship đắt',
  'Không biết chọn size nào', 'Chất lượng không đồng đều', 'Mẫu mã cũ',
];

const OBJECTION_POOL = [
  'Giá đắt', 'Hỏi chồng', 'Cần suy nghĩ thêm', 'So sánh với chỗ khác',
  'Không có chi nhánh gần', 'Lo ngại hàng fake', 'Chưa cần ngay',
  'Pháp lý chưa rõ', 'Ngân sách không xác nhận',
];

const ATTITUDE_POOL = [
  'Tốt', 'Tốt', 'Tốt', 'Tốt',
  'Trung bình', 'Trung bình',
  'Kém',
];

const MISTAKE_POOL = [
  null, null, null, null,
  'Trả lời trễ', 'Tư vấn sai', 'Bỏ sót khách', 'Không follow-up',
  'Không chốt đơn được', 'Thái độ chưa tốt',
];

const SCENARIO_POOL = [
  'Tư vấn chi phí', 'Khai thác thông tin', 'Ưu đãi cá nhân hóa', 'Giải quyết vấn đề',
];

const DISSATISFACTION_REASON_POOL = [
  'Sản phẩm không đúng mô tả', 'Giao hàng chậm', 'Chất lượng kém',
  'Không được như ảnh', 'Nhân viên tư vấn không tốt', 'Không hỗ trợ đổi trả',
];

const BUDGET_POOL = [
  'Dưới 500K', '500K - 1 triệu', '1 - 3 triệu', '3 - 5 triệu', 'Trên 5 triệu',
];

const LOCATION_POOL = [
  'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Biên Hòa',
  'Nha Trang', 'Huế', 'Quy Nhơn', 'Vũng Tàu',
];

const SEGMENT_POOL = [
  'Nhóm tuổi 18-25', 'Nhóm tuổi 25-35', 'Nhóm tuổi 35-45', 'Nhóm tuổi 45+',
  'Sinh viên', 'Nhân viên văn phòng', 'Mẹ bỉm', 'Người đi làm',
];

const RETURNING_POOL = [
  false, false, false, false, false, false,
  true, true,
];

const FRUSTRATION_POOL = [
  null, null, null, null, null, null, null, null,
  true,
];

// ── All 42 template IDs ──────────────────────────────────────────────────
const TEMPLATE_IDS = [
  'fsh-1','fsh-2','fsh-3','fsh-4','fsh-5','fsh-6',
  'mbb-1','mbb-2','mbb-3','mbb-4','mbb-5','mbb-6',
  'cos-1','cos-2','cos-3','cos-4','cos-5','cos-6',
  'spa-1','spa-2','spa-3','spa-4','spa-5','spa-6',
  'rls-1','rls-2','rls-3','rls-4','rls-5','rls-6',
  'fb-1','fb-2','fb-3','fb-4','fb-5','fb-6',
  'trv-1','trv-2','trv-3','trv-4','trv-5','trv-6',
];

// ── Random row count per template (50–100) ────────────────────────────────
// Uses Math.random() so each run produces different counts
function getRowCount(templateId) {
  return 50 + Math.floor(Math.random() * 51); // 50–100 inclusive
}

// ── Generate N rows per template ─────────────────────────────────────────
function generateRows(templateId) {
  const pool = POOLS[templateId];
  if (!pool) { console.warn(`No pool for ${templateId}`); return []; }

  const rowCount = getRowCount(templateId);
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const seed = templateId.charCodeAt(0)*10000 + templateId.charCodeAt(2)*100 + i;
    const rng = sr(seed);

    const customer = pool.customers[i % pool.customers.length];
    const platform = pool.platforms[i % pool.platforms.length];
    const rowNum = i + 1;

    let data = { customer, platform, row: rowNum };

    // Template-specific fields
    switch (templateId) {
      case 'fsh-1': Object.assign(data, { product: pick(pool.products, rng), size: pick(pool.sizes, rng), temperature: pick(pool.temps, rng), pain_point: pick(pool.pains, rng) }); break;
      case 'fsh-2': Object.assign(data, { is_junk: pool.junkOpts[i % pool.junkOpts.length], phone_status: pick(pool.phoneOpts, rng), objection: pick(pool.objections, rng), ads_source: pick(pool.adsSrcs, rng) }); break;
      case 'fsh-3': Object.assign(data, { attitude: pool.attitudes[i % pool.attitudes.length], mistake: pick(pool.mistakes, rng), scenario: pick(pool.scenarios, rng), chot_don: pool.chot_don[i % pool.chot_don.length], missed_conv: pool.missed_conv[i % pool.missed_conv.length], silent_cust: pool.silent_cust[i % pool.silent_cust.length] }); break;
      case 'fsh-4': Object.assign(data, { gender: pool.genders[i % pool.genders.length], location: pick(pool.locations, rng), budget: pick(pool.budgets, rng), segment: pick(pool.segments, rng) }); break;
      case 'fsh-5': Object.assign(data, { has_competitor: pool.hasComp[i % pool.hasComp.length], competitor_name: pick(pool.compNames, rng), criteria: pick(pool.criteria, rng) }); break;
      case 'fsh-6': Object.assign(data, { message_type: pick(pool.msgTypes, rng), satisfaction: pick(pool.satisfactions, rng), can_refer: pool.canRefers[i % pool.canRefers.length] }); break;
      case 'mbb-1': Object.assign(data, { product: pick(pool.products, rng), baby_age: pick(pool.babyAges, rng), temperature: pick(pool.temps, rng), pain_point: pick(pool.pains, rng) }); break;
      case 'mbb-2': Object.assign(data, { is_junk: pool.junkOpts[i % pool.junkOpts.length], phone_status: pick(pool.phoneOpts, rng), objection: pick(pool.objections, rng), bulk_interest: pick(pool.bulkOpts, rng), ads_source: pick(pool.adsSrcs, rng) }); break;
      case 'mbb-3': Object.assign(data, { attitude: pool.attitudes[i % pool.attitudes.length], mistake: pick(pool.mistakes, rng), scenario: pick(pool.scenarios, rng), chot_don: pool.chot_don[i % pool.chot_don.length], missed_conv: pool.missed_conv[i % pool.missed_conv.length], silent_cust: pool.silent_cust[i % pool.silent_cust.length] }); break;
      case 'mbb-4': Object.assign(data, { parent_gender: pick(pool.parentGenders, rng), baby_age: pick(pool.babyAges, rng), location: pick(pool.locations, rng), budget: pick(pool.budgets, rng) }); break;
      case 'mbb-5': Object.assign(data, { has_competitor: pool.hasComp[i % pool.hasComp.length], competitor_name: pick(pool.compNames, rng), criteria: pick(pool.criteria, rng) }); break;
      case 'mbb-6': Object.assign(data, { message_type: pick(pool.msgTypes, rng), frustration: pool.frustrations[i % pool.frustrations.length], urgency: pick(pool.urgencies, rng) }); break;
      case 'cos-1': Object.assign(data, { product: pick(pool.products, rng), skin_type: pick(pool.skinTypes, rng), temperature: pick(pool.temps, rng), pain_point: pick(pool.pains, rng) }); break;
      case 'cos-2': Object.assign(data, { is_junk: pool.junkOpts[i % pool.junkOpts.length], phone_status: pick(pool.phoneOpts, rng), objection: pick(pool.objections, rng), ads_source: pick(pool.adsSrcs, rng) }); break;
      case 'cos-3': Object.assign(data, { attitude: pool.attitudes[i % pool.attitudes.length], mistake: pick(pool.mistakes, rng), scenario: pick(pool.scenarios, rng), chot_don: pool.chot_don[i % pool.chot_don.length], missed_conv: pool.missed_conv[i % pool.missed_conv.length], silent_cust: pool.silent_cust[i % pool.silent_cust.length] }); break;
      case 'cos-4': Object.assign(data, { gender: pool.genders[i % pool.genders.length], location: pick(pool.locations, rng), budget: pick(pool.budgets, rng), segment: pick(pool.segments, rng) }); break;
      case 'cos-5': Object.assign(data, { has_competitor: pool.hasComp[i % pool.hasComp.length], competitor_name: pick(pool.compNames, rng), criteria: pick(pool.criteria, rng) }); break;
      case 'cos-6': Object.assign(data, { message_type: pick(pool.msgTypes, rng), satisfaction: pick(pool.satisfactions, rng), can_refer: pick(pool.canRefers, rng) }); break;
      case 'spa-1': Object.assign(data, { treatment: pick(pool.treatments, rng), temperature: pick(pool.temps, rng), pain_point: pick(pool.pains, rng) }); break;
      case 'spa-2': Object.assign(data, { is_junk: pool.junkOpts[i % pool.junkOpts.length], phone_status: pick(pool.phoneOpts, rng), objection: pick(pool.objections, rng), ads_source: pick(pool.adsSrcs, rng) }); break;
      case 'spa-3': Object.assign(data, { attitude: pool.attitudes[i % pool.attitudes.length], mistake: pick(pool.mistakes, rng), scenario: pick(pool.scenarios, rng), chot_don: pool.chot_don[i % pool.chot_don.length], missed_conv: pool.missed_conv[i % pool.missed_conv.length], silent_cust: pool.silent_cust[i % pool.silent_cust.length] }); break;
      case 'spa-4': Object.assign(data, { gender: pool.genders[i % pool.genders.length], location: pick(pool.locations, rng), budget: pick(pool.budgets, rng), segment: pick(pool.segments, rng) }); break;
      case 'spa-5': Object.assign(data, { has_competitor: pool.hasComp[i % pool.hasComp.length], competitor_name: pick(pool.compNames, rng), criteria: pick(pool.criteria, rng) }); break;
      case 'spa-6': Object.assign(data, { message_type: pick(pool.msgTypes, rng), satisfaction: pick(pool.satisfactions, rng), can_refer: pick(pool.canRefers, rng) }); break;
      case 'rls-1': Object.assign(data, { product: pick(pool.products, rng), legal_status: pick(pool.legalStatuses, rng), temperature: pick(pool.temps, rng), pain_point: pick(pool.pains, rng) }); break;
      case 'rls-2': Object.assign(data, { is_junk: pool.junkOpts[i % pool.junkOpts.length], phone_status: pick(pool.phoneOpts, rng), objection: pick(pool.objections, rng), ads_source: pick(pool.adsSrcs, rng) }); break;
      case 'rls-3': Object.assign(data, { attitude: pool.attitudes[i % pool.attitudes.length], mistake: pick(pool.mistakes, rng), scenario: pick(pool.scenarios, rng), chot_don: pool.chot_don[i % pool.chot_don.length], missed_conv: pool.missed_conv[i % pool.missed_conv.length], silent_cust: pool.silent_cust[i % pool.silent_cust.length] }); break;
      case 'rls-4': Object.assign(data, { gender: pool.genders[i % pool.genders.length], location: pick(pool.locations, rng), budget: pick(pool.budgets, rng), segment: pick(pool.segments, rng) }); break;
      case 'rls-5': Object.assign(data, { has_competitor: pool.hasComp[i % pool.hasComp.length], competitor_name: pick(pool.compNames, rng), criteria: pick(pool.criteria, rng) }); break;
      case 'rls-6': Object.assign(data, { message_type: pick(pool.msgTypes, rng), urgency: pick(pool.urgencies, rng), can_refer: pick(pool.canRefers, rng) }); break;
      case 'fb-1': Object.assign(data, { product: pick(pool.products, rng), temperature: pick(pool.temps, rng), pain_point: pick(pool.pains, rng) }); break;
      case 'fb-2': Object.assign(data, { is_junk: pool.junkOpts[i % pool.junkOpts.length], phone_status: pick(pool.phoneOpts, rng), objection: pick(pool.objections, rng), ads_source: pick(pool.adsSrcs, rng) }); break;
      case 'fb-3': Object.assign(data, { attitude: pool.attitudes[i % pool.attitudes.length], mistake: pick(pool.mistakes, rng), scenario: pick(pool.scenarios, rng), chot_don: pool.chot_don[i % pool.chot_don.length], missed_conv: pool.missed_conv[i % pool.missed_conv.length], silent_cust: pool.silent_cust[i % pool.silent_cust.length] }); break;
      case 'fb-4': Object.assign(data, { gender: pool.genders[i % pool.genders.length], location: pick(pool.locations, rng), budget: pick(pool.budgets, rng), segment: pick(pool.segments, rng) }); break;
      case 'fb-5': Object.assign(data, { has_competitor: pool.hasComp[i % pool.hasComp.length], competitor_name: pick(pool.compNames, rng), criteria: pick(pool.criteria, rng) }); break;
      case 'fb-6': Object.assign(data, { message_type: pick(pool.msgTypes, rng), satisfaction: pick(pool.satisfactions, rng), can_refer: pick(pool.canRefers, rng) }); break;
      case 'trv-1': Object.assign(data, { destination: pick(pool.destinations, rng), ota_competitor: pick(pool.otaComps, rng), temperature: pick(pool.temps, rng), pain_point: pick(pool.pains, rng) }); break;
      case 'trv-2': Object.assign(data, { is_junk: pool.junkOpts[i % pool.junkOpts.length], phone_status: pick(pool.phoneOpts, rng), objection: pick(pool.objections, rng), ads_source: pick(pool.adsSrcs, rng) }); break;
      case 'trv-3': Object.assign(data, { attitude: pool.attitudes[i % pool.attitudes.length], mistake: pick(pool.mistakes, rng), scenario: pick(pool.scenarios, rng), chot_don: pool.chot_don[i % pool.chot_don.length], missed_conv: pool.missed_conv[i % pool.missed_conv.length], silent_cust: pool.silent_cust[i % pool.silent_cust.length] }); break;
      case 'trv-4': Object.assign(data, { gender: pool.genders[i % pool.genders.length], location: pick(pool.locations, rng), budget: pick(pool.budgets, rng), segment: pick(pool.segments, rng) }); break;
      case 'trv-5': Object.assign(data, { has_competitor: pool.hasComp[i % pool.hasComp.length], competitor_name: pick(pool.compNames, rng), criteria: pick(pool.criteria, rng) }); break;
      case 'trv-6': Object.assign(data, { message_type: pick(pool.msgTypes, rng), urgency: pick(pool.urgencies, rng), can_refer: pick(pool.canRefers, rng) }); break;
    }

    // ── Universal fields (added to ALL rows) — use rng() for per-row variation ──
    Object.assign(data, {
      satisfaction:          SATISFACTION_POOL[Math.floor(rng() * SATISFACTION_POOL.length)],
      is_returning_customer: RETURNING_POOL[Math.floor(rng() * RETURNING_POOL.length)],
      frustration:           FRUSTRATION_POOL[Math.floor(rng() * FRUSTRATION_POOL.length)],
    });

    // ── Segmentation fields ───────────────────────────────────────────
    Object.assign(data, {
      budget:   BUDGET_POOL[Math.floor(rng() * BUDGET_POOL.length)],
      location: LOCATION_POOL[Math.floor(rng() * LOCATION_POOL.length)],
      segment:  SEGMENT_POOL[Math.floor(rng() * SEGMENT_POOL.length)],
    });

    // ── Competitor fields ─────────────────────────────────────────────
    const hasComp = COMPETITOR_POOL[Math.floor(rng() * COMPETITOR_POOL.length)] === null ? null : true;
    Object.assign(data, {
      competitor_name: hasComp === null ? null : COMPETITOR_NAME_POOL[Math.floor(rng() * COMPETITOR_NAME_POOL.length)],
      criteria:        rng() < 0.3 ? CRITERIA_POOL[Math.floor(rng() * CRITERIA_POOL.length)] : null,
    });

    // ── Staff eval fields ──────────────────────────────────────────────
    Object.assign(data, {
      attitude: ATTITUDE_POOL[Math.floor(rng() * ATTITUDE_POOL.length)],
      mistake:  MISTAKE_POOL[Math.floor(rng() * MISTAKE_POOL.length)],
      scenario: SCENARIO_POOL[Math.floor(rng() * SCENARIO_POOL.length)],
    });

    // ── Pain point / Objection fields ─────────────────────────────────
    Object.assign(data, {
      pain_point: PAIN_POINT_POOL[Math.floor(rng() * PAIN_POINT_POOL.length)],
      objection:  OBJECTION_POOL[Math.floor(rng() * OBJECTION_POOL.length)],
    });

    // Deterministic date within last 30 days
    const daysAgo = (i % 30);
    const date = new Date(Date.now() - daysAgo * 86400000 - Math.floor(rng() * 43200000));
    data.converted_at = date.toISOString();

    rows.push(data);
  }
  return rows;
}

// ── Build multi-row INSERT values (escaped for MCP) ─────────────────────
function buildInsertSQL(templateId, rows) {
  const vals = rows.map((r, idx) => {
    const base = idx * 4;
    return `('${templateId}', '${r.customer.replace(/'/g, "''")}', '${r.platform}', '${JSON.stringify(r).replace(/'/g, "''")}'::jsonb, '${r.converted_at}')`;
  }).join(',\n');
  return `INSERT INTO ai_insight_conversations (template_id, customer_name, platform, data_json, converted_at)\nVALUES\n${vals};`;
}

async function run() {
  const transport = new StdioClientTransport({ command: "npx", args: ["-y", "mcp-remote", MCP_URL] });
  const client = new Client({ name: "seed-conversations", version: "1.0.0" }, { capabilities: {} });

  try {
    await client.connect(transport);
    console.log("Connected to MCP");
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }

  // ── 1. Create / reset table ──────────────────────────────────────────
  console.log("\n1. Resetting table ai_insight_conversations...");
  const createSQL = `
TRUNCATE TABLE ai_insight_conversations RESTART IDENTITY CASCADE;
-- Create only if not exists (safe for re-runs)
CREATE TABLE IF NOT EXISTS ai_insight_conversations (
  id            UUID        DEFAULT gen_random_uuid(),
  template_id   VARCHAR(50) NOT NULL,
  customer_name VARCHAR(100),
  platform      VARCHAR(20),
  data_json     JSONB       NOT NULL,
  converted_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_template_id ON ai_insight_conversations(template_id);
CREATE INDEX IF NOT EXISTS idx_conversations_converted_at ON ai_insight_conversations(converted_at);

COMMENT ON TABLE ai_insight_conversations IS 'Dữ liệu conversation — 42 templates × 50–100 rows (random per template) cho AI Insight';
COMMENT ON COLUMN ai_insight_conversations.template_id IS 'Template ID: fsh-1..fsh-6, mbb-1..mbb-6, cos-1..cos-6, spa-1..spa-6, rls-1..rls-6, fb-1..fb-6, trv-1..trv-6';
`;
  const cr = await client.callTool({ name: "execute_sql", arguments: { query: createSQL } });
  const crOk = cr.content?.[0]?.text?.includes('success') || cr.content?.[0]?.text?.includes('CREATE') || !cr.content?.[0]?.text?.includes('error');
  console.log(crOk ? "✅ Table created" : "⚠️  " + cr.content?.[0]?.text?.substring(0, 200));

  // ── 2. Insert per template ────────────────────────────────────────────
  console.log("\n2. Inserting conversations (random 50–100 rows/template)...");
  let totalInserted = 0;
  let errors = [];

  for (const templateId of TEMPLATE_IDS) {
    const rowCount = getRowCount(templateId);
    const rows = generateRows(templateId);
    const sql = buildInsertSQL(templateId, rows);

    try {
      const r = await client.callTool({ name: "execute_sql", arguments: { query: sql } });
      const txt = r.content?.[0]?.text || '';
      const ok = !txt.includes('error') && !txt.includes('ERROR');
      if (ok) {
        totalInserted += rowCount;
        process.stdout.write(`  ✅ ${templateId} (${rowCount} rows)\n`);
      } else {
        errors.push(templateId);
        process.stdout.write(`  ❌ ${templateId}: ${txt.substring(0, 100)}\n`);
      }
    } catch (e) {
      errors.push(templateId);
      process.stdout.write(`  ❌ ${templateId}: ${e.message.substring(0, 100)}\n`);
    }
  }

  // ── 3. Verify ─────────────────────────────────────────────────────────
  console.log("\n3. Verifying...");
  const vr = await client.callTool({ name: "execute_sql", arguments: { query: "SELECT COUNT(*) as total, COUNT(DISTINCT template_id) as uniq FROM ai_insight_conversations;" } });
  const txt = vr.content?.[0]?.text || '';

  // Parse result from untrusted-data tags
  const match = txt.match(/untrusted-data[^>]*>([^<]+)<\/untrusted-data>/);
  let result = { total: '?', uniq: '?' };
  if (match) {
    try { result = JSON.parse(match[1])[0]; } catch {}
  }

  console.log(`\n📊 Total records: ${result.total}`);
  console.log(`📊 Unique templates: ${result.uniq}`);
  console.log(`📊 Inserted this run: ${totalInserted}`);
  if (errors.length > 0) console.log(`❌ Failed templates: ${errors.join(', ')}`);

  await client.close();
  console.log("\n✅ Done!");
}

run().catch(err => { console.error("Fatal error:", err.message); process.exit(1); });
