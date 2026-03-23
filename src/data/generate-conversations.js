// Generator: tạo 42 templates × 20 rows cho mockConversations.js
// Run: node src/data/generate-conversations.js > output.js

const _ = {
  pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
  pickN: (arr, n) => Array.from({length: n}, () => arr[Math.floor(Math.random() * arr.length)]),
};

const male = ['Trần Văn Minh','Nguyễn Đức Hoàng','Lê Hoàng Nam','Phạm Đức Tùng','Vũ Minh Tuấn','Đặng Hoàng Anh','Bùi Văn Cường','Cao Minh Đức','Dương Hoàng Nam','Trịnh Đức Minh','Lê Đức Phong','Nguyễn Văn Hùng','Phạm Hoàng Đức','Trần Đức Anh'];
const female = ['Trần Thị Lan','Nguyễn Thị Hương','Lê Thu Hà','Phạm Minh Yến','Vũ Thị Lan Anh','Đặng Thị Mai','Bùi Hoàng Yến','Cao Thị Lan','Dương Thu Hà','Trịnh Thị Lan','Nguyễn Thị Mai','Lê Thu Phương','Phạm Thị Hương','Vũ Hoàng Yến'];

const fb = ['facebook','zalo'];

const data = {
  'fsh-1': { cols:['product','size','temperature','painPoint'], fields:{ product:['Áo thun oversize','Đầm maxi hoa nhí','Quần jeans wide leg','Áo len dày','Giày sneaker','Áo sơ mi nam','Váy hoa nhí','Áo khoác nhẹ','Balo nữ','Túi xách','Khăn len','Găng tay','Mũ nón'], size:['S','M','L','XL','XXL','28','29','30','31','32','Freesize'], temperature:['Nóng','Nóng','Nóng','Ấm','Ấm','Ấm','Lạnh'], painPoint:['Tìm đầm đi tiệc','Cần mua gấp','Mua quà tặng','Tìm size lạnh','Hỏi giá rồi không rep','Mùa đông cần áo len','Cần đầm công sở','Tìm giày nam','Hỏi cho biết','Mua cho bạn']}},
  'fsh-2': { cols:['isJunk','phoneStatus','objection','adsSource'], fields:{ isJunk:[false,false,false,false,true], phoneStatus:['Đã cho SĐT','Đã cho SĐT','Đã cho SĐT','Chưa cho','Khách từ chối'], objection:['Không có rào cản','Chê giá đắt','Phí ship cao','Chưa tin tưởng chất lượng','Đang cân nhắc nhiều shop','Hỏi cho biết'], adsSource:['Facebook Ads','Facebook Ads','Zalo Ads','Tiktok Ads','Facebook Ads']}},
  'fsh-3': { cols:['attitude','mistake'], fields:{ attitude:['Tốt','Tốt','Tốt','Trung bình','Kém'], mistake:['Không có lỗi','Không có lỗi','Trả lời cộc lốc','Không tư vấn size','Bỏ quên khách','Không tư vấn màu','Gây hoang mang']}},
  'fsh-4': { cols:['gender','location','budget','segment'], fields:{ gender:['Nam','Nữ','Nữ','Nam','Nữ'], location:['TP. HCM','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Bình Dương','Biên Hòa','Vũng Tàu','Nha Trang','Cà Mau'], budget:['Dưới 300k','300k-500k','500k-1 triệu','1-2 triệu','Không đề cập'], segment:['Khách mới','Khách mới','Khách quen','Khách hoàn tiền','Khách mới']}},
  'fsh-5': { cols:['hasCompetitor','competitorName','criteria'], fields:{ hasCompetitor:[false,false,false,true,true,false], competitorName:['Không có','Zara','H&M','Uniqlo','Shein','Shopee','Pull&Bear'], criteria:['Không có','Giá cả','Chất lượng','Phí giao hàng','Uy tín thương hiệu']}},
  'fsh-6': { cols:['messageType','satisfaction','canRefer'], fields:{ messageType:['Hỏi về đơn hàng','Hỏi về đơn hàng','Xin đổi trả','Hỏi sản phẩm mới','Hỏi sản phẩm mới','Hỏi về đơn hàng'], satisfaction:['Hài lòng','Hài lòng','Trung bình','Không hài lòng','Trung bình','Hài lòng'], canRefer:[true,false,true,false,true,false]}},

  'mbb-1': { cols:['product','babyAge','temperature','painPoint'], fields:{ product:['Sữa công thức','Tã quần','Đồ ăn dặm','Bỉm tã','Sữa tươi','Dầu tắm bé','Kem dưỡng da','Bình sữa','Khăn ướt','Máy hâm sữa','Bánh ăn dặm','Sữa NAN'], babyAge:['3 tháng','6 tháng','9 tháng','12 tháng','15 tháng','18 tháng','2 tuổi','24 tháng','8 tháng','10 tháng'], temperature:['Nóng','Nóng','Nóng','Ấm','Ấm','Ấm','Lạnh'], painPoint:['Con bị táo bón','Cần giao gấp','Da bé bị hăm','Tìm sữa tăng cân','Hỏi cho biết','Mua sỉ cho nhà thuốc','Hỏi giá rồi không rep','Con dị ứng đạm bò','Tìm tã cho bé chạy nhiều','Cần sữa cho bé 6 tháng']}},
  'mbb-2': { cols:['isJunk','phoneStatus','objection','isBulk'], fields:{ isJunk:[false,false,false,false,true], phoneStatus:['Đã cho SĐT','Đã cho SĐT','Đã cho SĐT','Chưa cho','Khách từ chối'], objection:['Không có rào cản','Lo ngại an toàn / chất lượng','Chê giá đắt','Cần hỏi chồng','Phí ship cao','Hỏi cho biết'], isBulk:[true,false,false,true,false]}},
  'mbb-3': { cols:['attitude','mistake'], fields:{ attitude:['Tốt','Tốt','Tốt','Trung bình','Kém'], mistake:['Không có lỗi','Không giải đáp lo ngại an toàn','Trả lời cộc lốc','Bỏ quên khách']}},
  'mbb-4': { cols:['gender','babyAge','location','budget'], fields:{ gender:['Mẹ','Mẹ','Bố','Người thân','Mẹ','Mẹ'], babyAge:['6 tháng','12 tháng','18 tháng','3 tháng','2 tuổi','9 tháng'], location:['TP. HCM','Hà Nội','Đà Nẵng','Hải Phòng','Cần Thơ','Bình Dương'], budget:['Dưới 500k','500k-1 triệu','1-2 triệu','2-3 triệu','Không đề cập']}},
  'mbb-5': { cols:['hasCompetitor','competitorName','criteria'], fields:{ hasCompetitor:[false,false,true,true,false,false], competitorName:['Không có','Friso','Bobby','Pampers','Merries','Moony','Giapik'], criteria:['Không có','Giá cả','An toàn','Chất lượng','Giao hàng']}},
  'mbb-6': { cols:['messageType','isNegative'], fields:{ messageType:['Hỏi giao hàng','Hỏi giao hàng','Xin đổi trả','Khiếu nại lỗi-an toàn','Khiếu nại lỗi-an toàn','Xin hướng dẫn sử dụng'], isNegative:[false,false,true,true,false]}},

  'cos-1': { cols:['product','skinType','temperature','painPoint'], fields:{ product:['Serum trị mụn','Kem dưỡng ẩm','Sữa rửa mặt','Kem chống nắng','Tinh chất Vitamin C','Son môi','Toner','Kem trị nám','Kem trị mụn','Mặt nạ','Kem nền','Phấn má'], skinType:['Da dầu nhờn','Da nhạy cảm','Da hỗn hợp','Da nám','Da khô','Da mụn ẩn','Da thường'], temperature:['Nóng','Nóng','Nóng','Ấm','Ấm','Ấm','Lạnh'], painPoint:['Da dầu nhờn mụn ẩn','Trị nám lâu năm','Cần serum giá bình dân','Da nhạy cảm hay kích ứng','Hỏi giá rồi không rep','Tìm kem dưỡng mùa đông']}},
  'cos-2': { cols:['isJunk','phoneStatus','objection','askReal'], fields:{ isJunk:[false,false,false,false,true], phoneStatus:['Đã cho SĐT','Đã cho SĐT','Đã cho SĐT','Chưa cho','Khách từ chối'], objection:['Không có rào cản','Lo ngại hàng fake','Chê giá đắt','Phí ship cao','Hỏi cho biết','Hỏi thêm về thành phần'], askReal:[false,false,true,false,true]}},
  'cos-3': { cols:['attitude','mistake'], fields:{ attitude:['Tốt','Tốt','Tốt','Trung bình','Kém'], mistake:['Không có lỗi','Không giải đáp lo ngại hàng fake','Trả lời cộc lốc','Bỏ quên khách']}},
  'cos-4': { cols:['gender','skinType','location','budget'], fields:{ gender:['Nữ','Nữ','Nữ','Nam','Nữ'], skinType:['Da dầu','Da nhạy cảm','Da nám','Da khô','Da mụn'], location:['TP. HCM','Hà Nội','Đà Nẵng','Hải Phòng','Cần Thơ','Bình Dương'], budget:['Dưới 300k','300k-500k','500k-1 triệu','1-2 triệu','Không đề cập']}},
  'cos-5': { cols:['hasCompetitor','competitorName','criteria'], fields:{ hasCompetitor:[false,false,true,true,false,false], competitorName:['Không có','Some By Mi','La Roche-Posay','Dr. G','Cocoon','Klum'], criteria:['Không có','Hàng real','Thành phần','Giá cả','Hiệu quả']}},
  'cos-6': { cols:['messageType','isNegative'], fields:{ messageType:['Khiếu nại dị ứng','Khiếu nại dị ứng','Hỏi giao hàng','Xin hướng dẫn sử dụng','Khiếu nại khác'], isNegative:[true,true,false,false,false]}},

  'spa-1': { cols:['service','issue','temperature','painPoint'], fields:{ service:['Triệt lông laser','Nâng mũi filler','Facial deep clean','Massage body','Trị nám laser','Điều trị mụn','Tẩy tế bào chết','Nâng mũi','Trị thâm mắt','Massage foot spa','Điều trị rụng tóc','Kem dưỡng da'], issue:['Lông chân nhiều','Sống mũi thấp','Da nhiều mụn ẩn','Đau lưng mỏi vai','Nám sau sinh','Mụn ẩn trán','Thâm mắt','Da xuống tông','Rụng tóc','Dưỡng da nhạy cảm'], temperature:['Nóng','Nóng','Nóng','Ấm','Ấm','Ấm','Lạnh'], painPoint:['Cần làm gấp','Muốn không đau','Da mụn ẩn lâu năm','Hỏi 1 câu rồi không rep','Tìm giá rẻ nhất','Muốn điều trị dứt điểm']}},
  'spa-2': { cols:['isJunk','phoneStatus','bookingIntent','objection'], fields:{ isJunk:[false,false,false,false,true], phoneStatus:['Đã cho SĐT','Đã cho SĐT','Đã cho SĐT','Chưa cho','Khách từ chối'], bookingIntent:['Đã đặt','Có ý định','Thăm dò','Thăm dò','Không rõ'], objection:['Không có rào cản','Sợ đau / không an toàn','Giá đắt','Cần xem review trước','Hỏi người thân','Thời gian không phù hợp']}},
  'spa-3': { cols:['attitude','mistake'], fields:{ attitude:['Tốt','Tốt','Tốt','Trung bình','Kém'], mistake:['Không có lỗi','Không tư vấn đúng số buổi','Trả lời cộc lốc về giá','Gây hoang mang về độ an toàn','Không trả lời kịp thời']}},
  'spa-4': { cols:['gender','age','location','budget'], fields:{ gender:['Nữ','Nữ','Nam','Nữ','Nữ'], age:['Trẻ','Trung niên','Trẻ','Trung niên','Trẻ'], location:['TP. HCM','Hà Nội','Đà Nẵng','Hải Phòng','Cần Thơ','Bình Dương'], budget:['500k-1 triệu','1-2 triệu','2-3 triệu','3-5 triệu','Không đề cập']}},
  'spa-5': { cols:['hasCompetitor','competitorName','criteria'], fields:{ hasCompetitor:[false,false,true,true,false,false], competitorName:['Không có','Clinic A','Spa B','Clinic C','J肤色','Melo Spa','Dr. Spa'], criteria:['Không có','Giá cả','Bác sĩ có tay nghề','Review thực tế','Công nghệ']}},
  'spa-6': { cols:['messageType','isNegative'], fields:{ messageType:['Báo phản ứng bất lợi','Báo phản ứng bất lợi','Hỏi chăm sóc sau','Hẹn lịch buổi tiếp','Khiếu nại'], isNegative:[true,true,false,false]}},

  'rls-1': { cols:['propertyType','location','temperature','painPoint'], fields:{ propertyType:['Chung cư','Nhà phố','Đất nền','Biệt thự','Căn hộ studio','Shophouse','Chung cư','Nhà phố','Đất nền'], location:['Quận 7','Thủ Đức','Bình Dương','Quận 9','Quận 2','Quận 4','Gò Vấp','Bình Thạnh','Tân Phú','Quận 12'], temperature:['Nóng','Nóng','Nóng','Ấm','Ấm','Ấm','Lạnh'], painPoint:['Cần mua gấp','Tìm đầu tư','Muốn mua nhà cho con','Hỏi 1 câu rồi không rep','Cần đi thăm gấp','Đầu tư tăng giá']}},
  'rls-2': { cols:['isJunk','phoneStatus','budgetConfirmed','siteVisitIntent','objection'], fields:{ isJunk:[false,false,false,false,true], phoneStatus:['Đã cho SĐT','Đã cho SĐT','Đã cho SĐT','Chưa cho','Khách từ chối'], budgetConfirmed:['Đã xác nhận ngân sách','Ngân sách chung chung','Chưa đề cập','Không có nhu cầu mua'], siteVisitIntent:['Đã hẹn đi thăm','Có ý định','Thăm dò','Không rõ'], objection:['Không có rào cản','Pháp lý chưa rõ ràng','Giá đắt','Cần hỏi vợ','Đang so sánh nhiều dự án','Hỏi cho biết']}},
  'rls-3': { cols:['attitude','mistake'], fields:{ attitude:['Tốt','Tốt','Tốt','Trung bình','Kém'], mistake:['Không có lỗi','Không gửi thông tin pháp lý','Hẹn đi thăm rồi bỏ lỡ','Báo giá không chính xác']}},
  'rls-4': { cols:['gender','segment','location','budget'], fields:{ gender:['Nam','Nam','Nữ','Nam','Nữ'], segment:['Mua để ở','Đầu tư tăng giá','Đầu tư cho thuê','Không rõ','Mua để ở'], location:['Quận 7','Thủ Đức','Quận 9','Bình Dương','Quận 2','Quận 12'], budget:['5-7 tỷ','2-3 tỷ','3-5 tỷ','1.5-2 tỷ','Không đề cập']}},
  'rls-5': { cols:['hasCompetitor','competitorName','criteria'], fields:{ hasCompetitor:[false,false,true,true,false,false], competitorName:['Không có','Vinhomes','Rever','Novaland','Propzy','Akaraka'], criteria:['Không có','Pháp lý','Giá cả','Hỗ trợ vay ngân hàng','Tiện ích']}},
  'rls-6': { cols:['messageType','isNegative','canRefer'], fields:{ messageType:['Hỏi tiến độ thanh toán','Hỏi tiến độ xây dựng','Khiếu nại chất lượng','Hỏi pháp lý - sổ','Hỏi tiến độ thanh toán'], isNegative:[false,false,true,false], canRefer:[true,false,true,false,true]}},

  'fb-1': { cols:['food','serviceType','temperature','painPoint'], fields:{ food:['Cơm tấm','Bún bò','Bánh mì','Cà phê','Trà sữa','Phở','Bún chả','Cá viên chiên','Bánh flan','Nước ép','Bánh ngọt','Cơm rang'], serviceType:['Giao hàng','Ăn tại quán','Đặt bàn','Giao hàng','Ăn tại quán'], temperature:['Nóng','Nóng','Nóng','Ấm','Ấm','Ấm','Lạnh'], painPoint:['Cần giao gấp','Tìm quán gần','Đặt bàn cho 10 người','Hỏi 1 câu rồi không rep','Giao cho cả nhà','Mua tặng bạn','Cần giao trưa nay']}},
  'fb-2': { cols:['isJunk','phoneStatus','bookingStatus','objection'], fields:{ isJunk:[false,false,false,false,true], phoneStatus:['Đã cho SĐT','Đã cho SĐT','Đã cho SĐT','Chưa cho','Khách từ chối'], bookingStatus:['Đã đặt','Có ý định','Thăm dò','Không rõ'], objection:['Không có rào cản','Quá xa','Giá đắt','Phí giao hàng cao','Không giao được','Đang cân nhắc nhiều nơi']}},
  'fb-3': { cols:['attitude','mistake'], fields:{ attitude:['Tốt','Tốt','Tốt','Trung bình','Kém'], mistake:['Không có lỗi','Không hỗ trợ đặt bàn nhanh','Không thông báo hết món kịp','Trả lời chậm 30 phút+']}},
  'fb-4': { cols:['gender','group','purpose','budget'], fields:{ gender:['Nam','Nữ','Nam','Nữ','Nam'], group:['Công sở','Cặp đôi','Nhóm bạn','Gia đình có con nhỏ','Công sở'], purpose:['Ăn thường ngày','Hẹn hò','Liên hoan','Sinh nhật','Ăn thường ngày'], budget:['100-200k','200-300k','300-500k','500k-1 triệu','1-2 triệu']}},
  'fb-5': { cols:['hasCompetitor','competitorName','criteria'], fields:{ hasCompetitor:[false,false,true,true,false,false], competitorName:['Không có','KFC','GrabFood','Lotteria','Starbucks','Baemin','ShopeeFood'], criteria:['Không có','Giá cả','Tốc độ giao hàng','Chất lượng món ăn','Không gian quán']}},
  'fb-6': { cols:['messageType','isNegative','canRefer'], fields:{ messageType:['Phản hồi tích cực','Phản hồi tích cực','Khiếu nại giao hàng','Khiếu nại món ăn','Hỏi về khuyến mãi'], isNegative:[false,false,true,true,false], canRefer:[true,false,false,true,true]}},

  'trv-1': { cols:['destination','travelType','temperature','painPoint'], fields:{ destination:['Đà Nẵng','Phú Quốc','Nha Trang','Hàn Quốc','Nhật Bản','Đà Lạt','Hội An','Sapa','Phú Quốc','Đà Nẵng','Bali','Thái Lan'], travelType:['Tour trọn gói','Du lịch nghỉ dưỡng','Tự túc','Tour trọn gói','Du lịch mạo hiểm'], temperature:['Nóng','Nóng','Nóng','Ấm','Ấm','Ấm','Lạnh'], painPoint:['Cần đi gấp','Tìm tour tiết kiệm','Muốn đi mùa hoa anh đào','Hỏi 1 câu rồi không rep','Tìm resort cho gia đình','Đi mùa low season']}},
  'trv-2': { cols:['isJunk','phoneStatus','objection','depositIntent'], fields:{ isJunk:[false,false,false,false,true], phoneStatus:['Đã cho SĐT','Đã cho SĐT','Đã cho SĐT','Chưa cho','Khách từ chối'], objection:['Không có rào cản','So sánh với OTA (Traveloka/Agoda)','Giá đắt','Phí phụ thu / visa','Hỏi cho biết','Cần hỏi người đi cùng'], depositIntent:['Đã đặt cọc','Hỏi đặt cọc','Thăm dò','Không rõ']}},
  'trv-3': { cols:['attitude','mistake'], fields:{ attitude:['Tốt','Tốt','Tốt','Trung bình','Kém'], mistake:['Không có lỗi','Giá báo khác với thực tế','Không gửi lịch trình chi tiết','Bỏ quên khách 2 ngày']}},
  'trv-4': { cols:['favoriteDest','region','travelers','budget'], fields:{ favoriteDest:['Đà Nẵng','Hàn Quốc','Nhật Bản','Nha Trang','Đà Lạt','Phú Quốc','Bali'], region:['Trong nước','Nước ngoài','Trong nước','Nước ngoài'], travelers:['2 người','4 người (cả gia đình)','2 người lớn 1 trẻ em','5 người','Solo','3 người'], budget:['5-8 triệu','10-15 triệu','30-50 triệu','Không giới hạn','Không đề cập']}},
  'trv-5': { cols:['hasCompetitor','competitorName','criteria'], fields:{ hasCompetitor:[false,false,true,true,false,false], competitorName:['Không có','Traveloka','Klook','Agoda','Mytour','Vntrip'], criteria:['Không có','Giá cả','Lịch trình','Khách sạn','Visa']}},
  'trv-6': { cols:['messageType','isNegative','canRefer'], fields:{ messageType:['Phản hồi tích cực','Phản hồi tích cực','Khiếu nại dịch vụ','Hỏi hoàn tiền / Xin bồi thường','Hỏi đặt tour mới'], isNegative:[false,false,true,true,false], canRefer:[true,false,false,true,true]}},
};

function genRows(tplId, cfg) {
  const rows = [];
  for (let i = 1; i <= 20; i++) {
    const gender = _.pick(['Nam','Nữ']);
    const row = {
      id: `${tplId.replace('-','')}${String(i).padStart(2,'0')}`,
      customer: _.pick(gender === 'Nữ' ? female : male),
      platform: _.pick(fb),
    };
    for (const col of cfg.cols) {
      row[col] = _.pick(cfg.fields[col]);
    }
    rows.push(row);
  }
  return rows;
}

function formatRows(rows) {
  return rows.map(r => {
    const parts = [`id: '${r.id}'`, `customer: '${r.customer}'`];
    for (const [k, v] of Object.entries(r)) {
      if (k === 'id' || k === 'customer' || k === 'platform') continue;
      if (typeof v === 'boolean') parts.push(`${k}: ${v}`);
      else parts.push(`${k}: '${v}'`);
    }
    parts.push(`platform: '${r.platform}'`);
    return `      { ${parts.join(', ')} }`;
  }).join(',\n');
}

// Build output
let output = `// =====================================================================
// Mock conversations — auto-generated: 42 templates × 20 rows
// Run: node src/data/generate-conversations.js
// =====================================================================

export const mockConversations = {
`;

const order = ['fsh','mbb','cos','spa','rls','fb','trv'];
for (const prefix of order) {
  const keys = Object.keys(data).filter(k => k.startsWith(prefix));
  const industryLabel = {
    fsh:'NGÀNH 1: THỜI TRANG',mbb:'NGÀNH 2: MẸ VÀ BÉ',cos:'NGÀNH 3: MỸ PHẨM',
    spa:'NGÀNH 4: SPA / THẨM MỸ',rls:'NGÀNH 5: BẤT ĐỘNG SẢN',fb:'NGÀNH 6: F&B',
    trv:'NGÀNH 7: DU LỊCH'
  }[prefix];

  output += `\n  // ═══════════════════════════════════════════════════════════════════\n  // ${industryLabel}\n  // ═══════════════════════════════════════════════════════════════════\n`;

  for (const tplId of keys) {
    const cfg = data[tplId];
    const rows = genRows(tplId, cfg);
    output += `\n  '${tplId}': {\n    columns: [\n`;
    for (const col of cfg.cols) {
      const colName = {product:'Sản phẩm',size:'Size',temperature:'Mức độ quan tâm',painPoint:'Nhu cầu cốt lõi',isJunk:'Khách hàng rác',phoneStatus:'Trạng thái thu thập SĐT',objection:'Rào cản chốt đơn',adsSource:'Nguồn Ads',attitude:'Đánh giá Thái độ tư vấn',mistake:'Lỗi mất khách do Sale',gender:'Giới tính',location:'Khu vực',budget:'Khoảng ngân sách',segment:'Phân loại KH',hasCompetitor:'Có nhắc đến đối thủ?',competitorName:'Tên đối thủ',criteria:'Tiêu chí so sánh',messageType:'Phân loại mục đích tin nhắn',satisfaction:'Mức độ hài lòng',canRefer:'Khách có giới thiệu được?',babyAge:'Độ tuổi bé',isBulk:'Quan tâm mua sỉ / Combo',skinType:'Loại da',askReal:'Yêu cầu chứng minh real',service:'Dịch vụ / Liệu trình quan tâm',issue:'Vấn đề cần giải quyết',bookingIntent:'Ý định đặt lịch',age:'Độ tuổi dự đoán',propertyType:'Loại BĐS quan tâm',budgetConfirmed:'Ngân sách xác nhận',siteVisitIntent:'Ý định đi thăm',favoriteDest:'Điểm đến yêu thích',region:'Quốc gia / Vùng',travelers:'Số người đi',depositIntent:'Nhu cầu đặt cọc',food:'Món ăn',serviceType:'Loại hình phục vụ',group:'Nhóm đối tượng',purpose:'Mục đích ăn uống',isNegative:'Mức độ bức xúc'}[col] || col;
      output += `      { id: '${tplId}-${col}', name: '${colName}', field: '${col}' },\n`;
    }
    output += `    ],\n    rows: [\n${formatRows(rows)}\n    ],\n  },\n`;
  }
}

output += `};\n\nexport function getConversationsByTemplateId(templateId) {\n  return mockConversations[templateId] || null;\n}\n`;

console.log(output);
