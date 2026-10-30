/**
 * Fallback Embedded XML Data
 * Ensures resilient offline / non-network loading if fetch is restricted or blocked.
 */

export const DEFAULT_MESSAGES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<messages version="1.0">
  <message id="msg-001">
    <content>Ước gì ngày tốt nghiệp hôm ấy, mình đã đủ dũng khí bước đến nói với cậu một câu: Cảm ơn vì đã là một phần thanh xuân rực rỡ nhất của mình.</content>
    <category>miss_you</category>
    <categoryName>Nỗi nhớ</categoryName>
    <emotion>🌙</emotion>
    <alias>Một người bạn cùng bàn</alias>
    <createdAt>2026-10-14T08:15:00Z</createdAt>
    <status>published</status>
    <design>
      <template>night-sky</template>
      <background>#182035</background>
      <textColor>#F4E8CE</textColor>
      <font>serif</font>
      <pattern>stars</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="✨" x="78" y="16" scale="1.1" rotation="12"/>
        <sticker emoji="🌙" x="18" y="22" scale="1.2" rotation="-10"/>
      </stickers>
    </design>
  </message>

  <message id="msg-002">
    <content>Con xin lỗi mẹ vì những lần gắt gỏng sau một ngày làm việc mệt mỏi bên ngoài. Mẹ luôn để phần canh ấm, còn con chỉ để lại cho mẹ những lời cộc lốc.</content>
    <category>family</category>
    <categoryName>Gia đình</categoryName>
    <emotion>🤍</emotion>
    <alias>Đứa con vụng về</alias>
    <createdAt>2026-10-14T14:30:00Z</createdAt>
    <status>published</status>
    <design>
      <template>letter-vintage</template>
      <background>#FAF4EB</background>
      <textColor>#2E231C</textColor>
      <font>serif</font>
      <pattern>ruled</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="🕊️" x="82" y="80" scale="1.0" rotation="0"/>
        <sticker emoji="🌷" x="15" y="15" scale="1.1" rotation="8"/>
      </stickers>
    </design>
  </message>

  <message id="msg-003">
    <content>Hôm nay trời Hà Nội mưa to lắm. Mình đi ngang qua quán cà phê góc phố quen, bất giác gọi hai ly như thói quen cũ. Mong ở nơi phương xa, cậu luôn được bình yên.</content>
    <category>love</category>
    <categoryName>Tình yêu</categoryName>
    <emotion>🌧️</emotion>
    <alias>Người ở lại góc phố</alias>
    <createdAt>2026-10-13T19:40:00Z</createdAt>
    <status>published</status>
    <design>
      <template>postcard-travel</template>
      <background>#EAF0F6</background>
      <textColor>#172635</textColor>
      <font>handwriting</font>
      <pattern>none</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="📮" x="80" y="14" scale="1.2" rotation="6"/>
        <sticker emoji="🌧️" x="22" y="78" scale="1.0" rotation="-8"/>
      </stickers>
    </design>
  </message>

  <message id="msg-004">
    <content>Gửi tôi của tuổi 25: Bạn đã vất vả nhiều rồi. Dù đoạn đường vừa qua có chông chênh thế nào, đừng quên rằng bạn đã cố gắng hết sức từng ngày.</content>
    <category>healing</category>
    <categoryName>Chữa lành</categoryName>
    <emotion>🌻</emotion>
    <alias>Chính mình</alias>
    <createdAt>2026-10-13T22:10:00Z</createdAt>
    <status>published</status>
    <design>
      <template>sunset-cloud</template>
      <background>#FDEEE5</background>
      <textColor>#421F17</textColor>
      <font>serif</font>
      <pattern>dots</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="🌻" x="82" y="75" scale="1.2" rotation="15"/>
        <sticker emoji="☁️" x="16" y="20" scale="1.1" rotation="0"/>
      </stickers>
    </design>
  </message>

  <message id="msg-005">
    <content>Cảm ơn anh bác sĩ trực ca đêm ở viện K năm ngoái. Nụ cười và lời động viên "Cố lên cô bé, mọi chuyện rồi sẽ ổn" lúc 3 giờ sáng đã cứu rỗi cả tâm hồn em khi ấy.</content>
    <category>gratitude</category>
    <categoryName>Lời cảm ơn</categoryName>
    <emotion>🙏</emotion>
    <alias>Cô bé phòng 402</alias>
    <createdAt>2026-10-12T10:00:00Z</createdAt>
    <status>published</status>
    <design>
      <template>minimal-paper</template>
      <background>#FAF9F6</background>
      <textColor>#1E2530</textColor>
      <font>serif</font>
      <pattern>none</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="✨" x="80" y="18" scale="1.0" rotation="0"/>
        <sticker emoji="🌿" x="20" y="80" scale="1.1" rotation="-12"/>
      </stickers>
    </design>
  </message>

  <message id="msg-006">
    <content>Chúng mình từng thân thiết đến mức tưởng chừng chẳng thể tách rời. Vậy mà chỉ một hiểu lầm không ai chịu mở lời, chúng ta đã im lặng trôi qua đời nhau ngót nghét 4 năm.</content>
    <category>friends</category>
    <categoryName>Bạn bè</categoryName>
    <emotion>🥹</emotion>
    <alias>Người bạn cũ</alias>
    <createdAt>2026-10-12T16:20:00Z</createdAt>
    <status>published</status>
    <design>
      <template>secret-diary</template>
      <background>#F5EFE6</background>
      <textColor>#33271D</textColor>
      <font>serif</font>
      <pattern>dots</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="📜" x="82" y="20" scale="1.1" rotation="5"/>
        <sticker emoji="🍂" x="18" y="78" scale="1.0" rotation="-15"/>
      </stickers>
    </design>
  </message>

  <message id="msg-007">
    <content>Xin lỗi vì đã rời đi không một lời từ biệt. Không phải vì hết thương, mà vì mình nhận ra sự hiện diện của mình lúc ấy chỉ mang lại cho bạn thêm gánh nặng.</content>
    <category>apology</category>
    <categoryName>Lời xin lỗi</categoryName>
    <emotion>💔</emotion>
    <alias>Kẻ ngốc</alias>
    <createdAt>2026-10-11T21:45:00Z</createdAt>
    <status>published</status>
    <design>
      <template>antique-candle</template>
      <background>#211D22</background>
      <textColor>#F3E5D4</textColor>
      <font>serif</font>
      <pattern>none</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="🕯️" x="50" y="15" scale="1.2" rotation="0"/>
      </stickers>
    </design>
  </message>

  <message id="msg-008">
    <content>Bố à, lưng bố còng thêm nhiều rồi, tóc cũng bạc trắng cả hai bên mai. Con đi làm xa ít khi gọi điện, nhưng lúc nào cũng mong bố ăn ngon ngủ sâu giấc.</content>
    <category>family</category>
    <categoryName>Gia đình</categoryName>
    <emotion>🤍</emotion>
    <alias>Con gái út</alias>
    <createdAt>2026-10-11T11:15:00Z</createdAt>
    <status>published</status>
    <design>
      <template>botanical-garden</template>
      <background>#EEF4EC</background>
      <textColor>#192B1D</textColor>
      <font>serif</font>
      <pattern>ruled</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="🌿" x="82" y="76" scale="1.1" rotation="10"/>
        <sticker emoji="🍵" x="18" y="18" scale="1.0" rotation="0"/>
      </stickers>
    </design>
  </message>

  <message id="msg-009">
    <content>Nếu ngày mai không còn gặp lại nữa, mình chỉ muốn cậu biết: Được quen biết và làm việc cùng cậu trong những tháng ngày khó khăn nhất là may mắn lớn của mình.</content>
    <category>unsaid</category>
    <categoryName>Những điều khó nói</categoryName>
    <emotion>💌</emotion>
    <alias>Đồng nghiệp bàn kế bên</alias>
    <createdAt>2026-10-10T18:05:00Z</createdAt>
    <status>published</status>
    <design>
      <template>gentle-love</template>
      <background>#FDF2F4</background>
      <textColor>#4D1C27</textColor>
      <font>handwriting</font>
      <pattern>none</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="💌" x="50" y="80" scale="1.2" rotation="5"/>
        <sticker emoji="🌸" x="80" y="18" scale="1.0" rotation="-12"/>
      </stickers>
    </design>
  </message>

  <message id="msg-010">
    <content>Tôi đã từng nghĩ mình không thể vượt qua nổi kỳ thi ấy và sự kỳ vọng của cả gia đình. Cảm ơn những ngày giông bão đã tôi luyện nên một tôi vững vàng như hôm nay.</content>
    <category>hope</category>
    <categoryName>Hy vọng</categoryName>
    <emotion>🌈</emotion>
    <alias>Người đang bước tiếp</alias>
    <createdAt>2026-10-10T09:30:00Z</createdAt>
    <status>published</status>
    <design>
      <template>healing-glow</template>
      <background>#E7F3F5</background>
      <textColor>#13343C</textColor>
      <font>sans</font>
      <pattern>dots</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="🌈" x="82" y="16" scale="1.1" rotation="0"/>
        <sticker emoji="☀️" x="18" y="78" scale="1.1" rotation="10"/>
      </stickers>
    </design>
  </message>

  <message id="msg-011">
    <content>Tớ thích cậu từ những chiều mùa thu đạp xe chung đường về. Cậu cứ mải mê ngắm hoàng hôn, còn tớ thì mải ngắm nhìn nụ cười của cậu.</content>
    <category>love</category>
    <categoryName>Tình yêu</categoryName>
    <emotion>💗</emotion>
    <alias>Mối tình đầu áo trắng</alias>
    <createdAt>2026-10-09T17:15:00Z</createdAt>
    <status>published</status>
    <design>
      <template>sunset-cloud</template>
      <background>#FDEEE5</background>
      <textColor>#451D16</textColor>
      <font>handwriting</font>
      <pattern>none</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="🚲" x="18" y="76" scale="1.1" rotation="-6"/>
        <sticker emoji="💗" x="82" y="18" scale="1.1" rotation="12"/>
      </stickers>
    </design>
  </message>

  <message id="msg-012">
    <content>Xin lỗi chính bản thân mình vì đã ép uổng mình vào những tiêu chuẩn của người khác, sống để làm vừa lòng tất cả mọi người trừ chính trái tim mình.</content>
    <category>healing</category>
    <categoryName>Chữa lành</categoryName>
    <emotion>🕊️</emotion>
    <alias>Tự thức tỉnh</alias>
    <createdAt>2026-10-08T23:50:00Z</createdAt>
    <status>published</status>
    <design>
      <template>minimal-paper</template>
      <background>#FAF9F6</background>
      <textColor>#221D18</textColor>
      <font>serif</font>
      <pattern>ruled</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="🕊️" x="78" y="18" scale="1.2" rotation="0"/>
      </stickers>
    </design>
  </message>

  <message id="msg-013">
    <content>Cảm ơn bà nội vì nồi cháo đậu xanh thơm lừng những chiều con sốt cao thời thơ ấu. Bây giờ con lớn rồi, nhưng không nơi nào cho con cảm giác bình yên như căn bếp của bà.</content>
    <category>family</category>
    <categoryName>Gia đình</categoryName>
    <emotion>🤍</emotion>
    <alias>Cháu nội của bà</alias>
    <createdAt>2026-10-07T15:20:00Z</createdAt>
    <status>published</status>
    <design>
      <template>letter-vintage</template>
      <background>#FAF4EB</background>
      <textColor>#33251A</textColor>
      <font>serif</font>
      <pattern>ruled</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="🌾" x="82" y="78" scale="1.1" rotation="8"/>
        <sticker emoji="🍵" x="16" y="20" scale="1.0" rotation="0"/>
      </stickers>
    </design>
  </message>

  <message id="msg-014">
    <content>Chúng ta từng hứa sẽ cùng nhau đi xem cực quang ở Bắc Âu. Bây giờ cả hai đều đã có cuộc sống riêng, nhưng mỗi lần nhìn ảnh tuyết trắng, tôi vẫn nhớ lời hẹn năm 22 tuổi.</content>
    <category>miss_you</category>
    <categoryName>Nỗi nhớ</categoryName>
    <emotion>❄️</emotion>
    <alias>Người giữ lời hẹn</alias>
    <createdAt>2026-10-06T20:10:00Z</createdAt>
    <status>published</status>
    <design>
      <template>night-sky</template>
      <background>#141E2E</background>
      <textColor>#EDF4FA</textColor>
      <font>serif</font>
      <pattern>stars</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="❄️" x="80" y="18" scale="1.1" rotation="0"/>
        <sticker emoji="🌌" x="18" y="76" scale="1.2" rotation="-5"/>
      </stickers>
    </design>
  </message>

  <message id="msg-015">
    <content>Cảm ơn người tài xế công nghệ tốt bụng đã quay xe lại gần 5 cây số giữa trời trưa nắng gắt để trả lại cho mình chiếc ví đánh rơi có hồ sơ bệnh án.</content>
    <category>gratitude</category>
    <categoryName>Lời cảm ơn</categoryName>
    <emotion>✨</emotion>
    <alias>Vị khách may mắn</alias>
    <createdAt>2026-10-05T13:40:00Z</createdAt>
    <status>published</status>
    <design>
      <template>postcard-travel</template>
      <background>#F1F5E8</background>
      <textColor>#1A2B14</textColor>
      <font>sans</font>
      <pattern>none</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="🛵" x="18" y="78" scale="1.1" rotation="0"/>
        <sticker emoji="✨" x="82" y="16" scale="1.1" rotation="10"/>
      </stickers>
    </design>
  </message>

  <message id="msg-016">
    <content>Có những nỗi đau không thể cất thành tiếng, chỉ có thể nuốt ngược vào trong. Nhưng tin mình đi, sau cơn mưa rào dai dẳng, bầu trời nhất định sẽ lại xanh trong.</content>
    <category>hope</category>
    <categoryName>Hy vọng</categoryName>
    <emotion>🌱</emotion>
    <alias>Một linh hồn kiên cường</alias>
    <createdAt>2026-10-04T07:50:00Z</createdAt>
    <status>published</status>
    <design>
      <template>healing-glow</template>
      <background>#EAF3EE</background>
      <textColor>#142F1E</textColor>
      <font>serif</font>
      <pattern>dots</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="🌱" x="50" y="18" scale="1.2" rotation="0"/>
        <sticker emoji="🕊️" x="82" y="76" scale="1.0" rotation="10"/>
      </stickers>
    </design>
  </message>

  <message id="msg-017">
    <content>Ba năm ngồi sau lưng cậu, tớ thuộc lòng cả cái cách cậu xoay bút mỗi khi làm bài khó. Ngày bế giảng cậu quay xuống mượn tớ cây bút ký lưu bút, tớ đã định viết "tớ thích cậu", nhưng cuối cùng chỉ dám ghi "chúc cậu thi tốt". Cây bút ấy cậu quên trả, tớ cũng chẳng bao giờ đòi.</content>
    <category>love</category>
    <categoryName>Tình yêu</categoryName>
    <emotion>📝</emotion>
    <alias>Bàn sau lưng cậu</alias>
    <createdAt>2026-10-29T14:10:00Z</createdAt>
    <status>published</status>
    <design>
      <template>tmpl-letter-01</template>
      <background>#FFFBF2</background>
      <textColor>#3B2F4A</textColor>
      <font>handwriting</font>
      <pattern>ruled</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="🖊️" x="82" y="80" scale="1.1" rotation="-12"/>
        <sticker emoji="🌸" x="16" y="16" scale="1.0" rotation="8"/>
      </stickers>
    </design>
  </message>

  <message id="msg-018">
    <content>Mỗi sáng anh đều ghé quán đó lúc bảy giờ kém mười, chỉ vì biết em sẽ đến lúc bảy giờ. Anh gọi ly bạc xỉu dù chẳng thích ngọt, để có cớ ngồi lâu hơn một chút. Em không biết anh tên gì, cũng chẳng sao. Được thấy em cười với cô chủ quán là một ngày của anh đã đủ đẹp rồi.</content>
    <category>love</category>
    <categoryName>Tình yêu</categoryName>
    <emotion>☕</emotion>
    <alias>Người ngồi bàn cạnh cửa sổ</alias>
    <createdAt>2026-10-29T00:05:00Z</createdAt>
    <status>published</status>
    <design>
      <template>tmpl-pastel-03</template>
      <background>#FDF3E9</background>
      <textColor>#4A2A1A</textColor>
      <font>serif</font>
      <pattern>none</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="☕" x="18" y="80" scale="1.1" rotation="-6"/>
        <sticker emoji="🤍" x="82" y="80" scale="0.9" rotation="10"/>
      </stickers>
    </design>
  </message>

  <message id="msg-019">
    <content>Tụi mình là bạn thân mười năm. Cậu kể tớ nghe về mọi người cậu từng thích, tớ là người đầu tiên cậu gọi mỗi khi buồn. Tớ sợ lắm, sợ nếu nói ra thì đến cả cái danh "bạn thân" tớ cũng mất. Nên thôi, tớ cứ giữ cậu theo cách này vậy, gần đến mức chạm tay được, mà xa đến mức không bao giờ nói được.</content>
    <category>love</category>
    <categoryName>Tình yêu</categoryName>
    <emotion>🤫</emotion>
    <alias>Bạn thân của cậu</alias>
    <createdAt>2026-10-29T16:40:00Z</createdAt>
    <status>published</status>
    <design>
      <template>tmpl-pastel-02</template>
      <background>#F3EEF8</background>
      <textColor>#3A2750</textColor>
      <font>serif</font>
      <pattern>dots</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="🌙" x="82" y="80" scale="1.1" rotation="8"/>
        <sticker emoji="💜" x="18" y="78" scale="1.0" rotation="-10"/>
      </stickers>
    </design>
  </message>

  <message id="msg-020">
    <content>Em biết anh đọc tin nhắn rồi, dấu "đã xem" vẫn nằm đó từ hôm qua. Em không trách đâu. Chỉ là em đã quen nhắn cho anh trước, hỏi anh ăn chưa, dặn anh mang áo mưa, rồi tự trả lời thay anh trong đầu. Có lẽ đến lúc em học cách thôi chờ một người chưa từng định quay lại nhìn em.</content>
    <category>love</category>
    <categoryName>Tình yêu</categoryName>
    <emotion>📱</emotion>
    <alias>Người luôn nhắn trước</alias>
    <createdAt>2026-10-28T15:15:00Z</createdAt>
    <status>published</status>
    <design>
      <template>tmpl-minimal-01</template>
      <background>#EEF2F6</background>
      <textColor>#1F2A37</textColor>
      <font>sans</font>
      <pattern>none</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="💭" x="82" y="80" scale="1.1" rotation="6"/>
      </stickers>
    </design>
  </message>

  <message id="msg-021">
    <content>Cậu từng nói cậu thích người dịu dàng. Thế là tớ tập nói nhỏ, tập kiên nhẫn, tập trở thành một ai đó khác. Đến hôm cậu nắm tay người ấy đi ngang qua tớ, tớ mới hiểu: không phải tớ chưa đủ tốt, chỉ là tớ chưa bao giờ là người cậu tìm. Giờ tớ sẽ học cách làm lại chính mình.</content>
    <category>love</category>
    <categoryName>Tình yêu</categoryName>
    <emotion>🌻</emotion>
    <alias>Đóa hướng dương lặng lẽ</alias>
    <createdAt>2026-10-28T11:30:00Z</createdAt>
    <status>published</status>
    <design>
      <template>tmpl-pastel-05</template>
      <background>#FAF7ED</background>
      <textColor>#3D3418</textColor>
      <font>serif</font>
      <pattern>none</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="🌻" x="18" y="80" scale="1.2" rotation="-8"/>
        <sticker emoji="🍂" x="82" y="80" scale="1.0" rotation="14"/>
      </stickers>
    </design>
  </message>

  <message id="msg-022">
    <content>Thương một người không thương mình giống như đứng dưới mưa chờ một chuyến xe không đi qua con đường này. Ai cũng bảo mình về đi, mình cũng biết thế. Nhưng tối nay cho mình đứng thêm một chút nữa thôi, rồi mình sẽ tự mở ô, tự đi về.</content>
    <category>love</category>
    <categoryName>Tình yêu</categoryName>
    <emotion>🌧️</emotion>
    <alias>Người đứng dưới mưa</alias>
    <createdAt>2026-10-28T13:45:00Z</createdAt>
    <status>published</status>
    <design>
      <template>tmpl-pastel-06</template>
      <background>#DCE3EA</background>
      <textColor>#1C2833</textColor>
      <font>handwriting</font>
      <pattern>ruled</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="☂️" x="82" y="80" scale="1.1" rotation="10"/>
        <sticker emoji="💧" x="16" y="18" scale="0.9" rotation="0"/>
      </stickers>
    </design>
  </message>

  <message id="msg-023">
    <content>Hôm nay em dọn nhà, tìm thấy tấm vé xem phim đầu tiên của tụi mình kẹp trong cuốn sổ. Mực đã nhòe gần hết, như cách tụi mình dần nhòe trong nhau. Em không giận anh nữa đâu. Em chỉ cất tấm vé vào hộp, đóng nắp lại, và cảm ơn anh vì đã từng là cả một mùa thanh xuân của em.</content>
    <category>love</category>
    <categoryName>Tình yêu</categoryName>
    <emotion>🥀</emotion>
    <alias>Người cất kỷ niệm vào hộp</alias>
    <createdAt>2026-10-27T08:20:00Z</createdAt>
    <status>published</status>
    <design>
      <template>tmpl-vintage-01</template>
      <background>#F3E7E4</background>
      <textColor>#4A1E24</textColor>
      <font>serif</font>
      <pattern>none</pattern>
      <textAlign>left</textAlign>
      <stickers>
        <sticker emoji="🎟️" x="82" y="80" scale="1.1" rotation="-10"/>
        <sticker emoji="🥀" x="16" y="80" scale="1.0" rotation="8"/>
      </stickers>
    </design>
  </message>

  <message id="msg-024">
    <content>Mình chia tay không phải vì hết thương, mà vì cả hai đều mệt. Anh muốn đi xa, em muốn ở lại. Không ai sai cả. Ở thành phố mới, nhớ ăn sáng đầy đủ, đừng thức khuya, đừng lạnh lùng với người sẽ đến sau em. Em mong anh hạnh phúc, thật lòng, kể cả khi hạnh phúc đó không có em.</content>
    <category>love</category>
    <categoryName>Tình yêu</categoryName>
    <emotion>🕊️</emotion>
    <alias>Người ở lại sân ga</alias>
    <createdAt>2026-10-27T02:00:00Z</createdAt>
    <status>published</status>
    <design>
      <template>tmpl-sky-01</template>
      <background>#F2F7FB</background>
      <textColor>#173047</textColor>
      <font>serif</font>
      <pattern>none</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="🕊️" x="82" y="80" scale="1.2" rotation="6"/>
        <sticker emoji="🚉" x="18" y="80" scale="1.0" rotation="-6"/>
      </stickers>
    </design>
  </message>

  <message id="msg-025">
    <content>Ba tháng sau chia tay, lần đầu tiên tớ đi qua con phố cũ mà không thấy nghẹn. Tớ vẫn nhớ cậu, nhưng là kiểu nhớ một bài hát cũ, nghe lại thấy hay chứ không còn muốn khóc. Trái tim tớ từng vỡ, giờ đang lành dần từng chút. Cảm ơn cậu đã dạy tớ yêu, và cảm ơn chính tớ đã không bỏ cuộc.</content>
    <category>love</category>
    <categoryName>Tình yêu</categoryName>
    <emotion>💔</emotion>
    <alias>Người đang lành lại</alias>
    <createdAt>2026-10-27T12:55:00Z</createdAt>
    <status>published</status>
    <design>
      <template>tmpl-healing-01</template>
      <background>#241A1E</background>
      <textColor>#F8E7C8</textColor>
      <font>serif</font>
      <pattern>stars</pattern>
      <textAlign>center</textAlign>
      <stickers>
        <sticker emoji="🩹" x="82" y="80" scale="1.1" rotation="12"/>
        <sticker emoji="✨" x="16" y="80" scale="1.0" rotation="0"/>
      </stickers>
    </design>
  </message>
</messages>`;
