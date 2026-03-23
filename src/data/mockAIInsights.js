export const mockAIInsights = {
  'camp-1': {
    type: 'warning',
    icon: '⚠️',
    title: 'Chiến dịch có tỉ lệ chuyển đổi thấp hơn trung bình',
    description:
      'Sau khi phân tích 234 hội thoại, AI nhận thấy 45% là khách hỏi chơi, 18% spam. Tỉ lệ lead chất lượng chỉ đạt 29%, thấp hơn mức trung bình kênh (52%).',
    confidence: 89,
    action: 'keep',
    actionLabel: 'Giữ nguyên',
    actionColor: 'warning',
    comparison: {
      campaignLead: 29,
      channelAvg: 52,
      diff: -23,
    },
    metrics: {
      junkRate: 45,
      qualityRate: 29,
      spamRate: 18,
      hotLeads: 8,
      warmLeads: 15,
      coldLeads: 11,
    },
    recommendation:
      'Nên tạm giữ ngân sách, tối ưu lại audience targeting và bổ sung thêm UTM parameters để lọc khách rác từ đầu.',
  },
  'camp-2': {
    type: 'success',
    icon: '🎯',
    title: 'Chiến dịch hiệu quả vượt trội!',
    description:
      'Tỉ lệ chuyển đổi 31.5% — cao nhất trong tháng. Khách hàng chủ yếu hỏi sâu về sản phẩm và có dấu hiệu chốt đơn rõ ràng.',
    confidence: 94,
    action: 'increase',
    actionLabel: 'Tăng ngân sách',
    actionColor: 'success',
    comparison: {
      campaignLead: 31.5,
      channelAvg: 23.4,
      diff: 8.1,
    },
    metrics: {
      junkRate: 12,
      qualityRate: 78,
      spamRate: 2,
      hotLeads: 28,
      warmLeads: 14,
      coldLeads: 7,
    },
    recommendation:
      'Nên tăng ngân sách thêm 30-50% vì ROAS đang rất tốt. Chiến dịch Click-to-Zalo đang mang lại khách hàng có nhu cầu thật.',
  },
  'camp-3': {
    type: 'danger',
    icon: '🚨',
    title: 'CẢNH BÁO: Chiến dịch kém hiệu quả nghiêm trọng',
    description:
      'Phân tích 89 hội thoại cho thấy 71% là khách rác hoặc không có mục đích rõ ràng. Chỉ 2 lead chất lượng từ 8.2 triệu đã chi tiêu.',
    confidence: 97,
    action: 'decrease',
    actionLabel: 'Giảm ngân sách',
    actionColor: 'danger',
    comparison: {
      campaignLead: 8.2,
      channelAvg: 23.4,
      diff: -15.2,
    },
    metrics: {
      junkRate: 71,
      qualityRate: 8,
      spamRate: 23,
      hotLeads: 1,
      warmLeads: 2,
      coldLeads: 4,
    },
    recommendation:
      'NÊN TẮT chiến dịch này ngay. Tỉ lệ khách rác quá cao. Nếu cần retargeting, hãy tạo chiến dịch mới với audience đã được filter kỹ hơn từ campaign 2.',
  },
  'camp-4': {
    type: 'warning',
    icon: '⚡',
    title: 'Chiến dịch tạm dừng — cần xem xét lại',
    description:
      'Đã tạm dừng sau 2 tuần. Phân tích cho thấy tỉ lệ tương tác thấp nhưng chất lượng lead trung bình. Cần A/B test creative mới.',
    confidence: 76,
    action: 'pause',
    actionLabel: 'Đã tạm dừng',
    actionColor: 'warning',
    comparison: {
      campaignLead: 41,
      channelAvg: 52,
      diff: -11,
    },
    metrics: {
      junkRate: 38,
      qualityRate: 41,
      spamRate: 8,
      hotLeads: 2,
      warmLeads: 3,
      coldLeads: 3,
    },
    recommendation:
      'Xem xét creative mới và thử nghiệm với audience nhỏ hơn trước khi scale lại.',
  },
  'camp-5': {
    type: 'success',
    icon: '🚀',
    title: 'Chiến dịch Product Launch — đang tăng trưởng tốt',
    description:
      'Launch sản phẩm mới đạt 81 điểm chất lượng. Khách hỏi nhiều về thành phần, giá cả, và shipping. 25% lead có dấu hiệu mua ngay.',
    confidence: 91,
    action: 'increase',
    actionLabel: 'Tăng ngân sách',
    actionColor: 'success',
    comparison: {
      campaignLead: 81,
      channelAvg: 52,
      diff: 29,
    },
    metrics: {
      junkRate: 9,
      qualityRate: 81,
      spamRate: 1,
      hotLeads: 31,
      warmLeads: 28,
      coldLeads: 19,
    },
    recommendation:
      'Chiến dịch đang trong giai đoạn vàng — tăng budget để capture thêm demand trước khi đối thủ phản ứng.',
  },
  'camp-6': {
    type: 'success',
    icon: '🌤️',
    title: 'Chiến dịch ổn định — có room để scale',
    description:
      'Quality score 76, conversion 31.6%. Chiến dịch Zalo Summer đang hoạt động tốt với tỉ lệ khách quan tâm thật cao.',
    confidence: 88,
    action: 'keep',
    actionLabel: 'Giữ nguyên',
    actionColor: 'success',
    comparison: {
      campaignLead: 76,
      channelAvg: 62,
      diff: 14,
    },
    metrics: {
      junkRate: 18,
      qualityRate: 76,
      spamRate: 4,
      hotLeads: 14,
      warmLeads: 10,
      coldLeads: 7,
    },
    recommendation:
      'Giữ ngân sách hiện tại, theo dõi thêm 1 tuần. Nếu trend tiếp tục tăng, có thể tăng nhẹ 20%.',
  },
  'camp-7': {
    type: 'danger',
    icon: '🚨',
    title: 'CẢNH BÁO: Retargeting không hiệu quả',
    description:
      'Từ 10 triệu chi tiêu, chỉ 2 lead chất lượng. AI phát hiện 85% audience đã nhìn thấy quảng cáo 5+ lần nhưng không tương tác — dấu hiệu của targeting quá rộng.',
    confidence: 98,
    action: 'decrease',
    actionLabel: 'Tắt chiến dịch',
    actionColor: 'danger',
    comparison: {
      campaignLead: 15,
      channelAvg: 23.4,
      diff: -8.4,
    },
    metrics: {
      junkRate: 85,
      qualityRate: 5,
      spamRate: 15,
      hotLeads: 0,
      warmLeads: 1,
      coldLeads: 1,
    },
    recommendation:
      'TẮT chiến dịch ngay. Không nên retargeting audience đã "burnt out". Chờ 14 ngày rồi tạo lookalike từ các campaign có lead chất lượng cao.',
  },
  'camp-8': {
    type: 'success',
    icon: '💎',
    title: 'Chiến dịch khách hàng cũ Zalo — BẬT MÀU VÀNG',
    description:
      'Đây là chiến dịch tốt nhất! 89 điểm chất lượng, 35.4% conversion rate. Khách hàng cũ phản hồi tích cực, tỉ lệ mua lại cao.',
    confidence: 96,
    action: 'increase',
    actionLabel: 'Tăng mạnh ngân sách',
    actionColor: 'success',
    comparison: {
      campaignLead: 89,
      channelAvg: 62,
      diff: 27,
    },
    metrics: {
      junkRate: 5,
      qualityRate: 89,
      spamRate: 0,
      hotLeads: 41,
      warmLeads: 18,
      coldLeads: 8,
    },
    recommendation:
      'Scale mạnh chiến dịch này! Tạo thêm các nhóm khách hàng cũ khác nhau và chạy riêng để optimize. ROAS ước tính cao nhất toàn tài khoản.',
  },
};
