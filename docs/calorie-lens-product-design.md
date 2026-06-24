# CalorieLens / 轻缺口 / Deficit Cam 产品设计书

## 1. 产品定位

「轻缺口」是一款面向减脂人群的拍照式热量记录、Apple Watch 消耗数据整合与体重趋势预测应用。用户每天只需要完成三个动作：拍食物、同步消耗、查看趋势。

产品帮助用户回答三个问题：

- 我今天大概吃了多少？
- 我今天大概消耗了多少？
- 按照最近趋势，我下周大概会到多少体重？

核心设计原则是：所有热量和体重预测都必须显示不确定性。产品不伪装成精确计算器，而是作为「减脂趋势雷达」。

## 2. 目标用户

### 核心用户

- 正在减脂，但不想每天手动称重、查热量、输入克数的人。
- 有明确目标体重与目标日期的人。
- 平时上班、饮食场景多为早餐、商圈午饭、训练后晚饭的人。
- 有 Apple Watch 或类似设备，愿意拍照但不愿意复杂记账的人。
- 关心「我这样做到底有没有效果」的人。

### 非目标用户

第一版暂不服务：

- 专业健美备赛用户。
- 需要精确营养素计算的人。
- 糖尿病、肾病、进食障碍等需要医学饮食管理的人。
- 只想看菜谱、不想记录数据的人。

## 3. 核心价值与闭环

传统减脂 App 的问题是太重，用户需要输入食物、重量、烹饪方式、品牌、运动、体重、饮水量，几天后容易放弃。

本产品的核心价值是：让用户每天 10 秒完成饮食记录，并用体重趋势反向校准真实热量缺口。

核心闭环：

1. 拍摄食物。
2. AI 估算摄入。
3. 同步 Apple Watch 消耗或手动输入消耗。
4. 生成当日缺口。
5. 预测体重趋势。
6. 次日称重校准。
7. 修正模型。

最关键的一步是用真实体重校准估算系统。产品不应只做简单相减，而应加入可信度和校准系数。

## 4. 主要页面设计

### 4.1 首页 / 相机页

页面目标：让用户一打开就知道当前只需要「拍一下」。

页面结构：

- 顶部显示今日状态，例如「今日缺口：预计 -620 kcal」。
- 中央为圆角矩形相机窗口，深色背景与柔和光晕。
- 底部为拍摄按钮与餐次选择：早餐、午餐、晚餐、加餐。
- 右侧悬浮「分析」入口按钮，可设计成数据星球。

拍照后展示识别卡片：

- 识别结果：牛肉饭 1 份、青菜 1 份、汤 1 碗。
- 估算摄入：720 kcal。
- 可信度：中。
- 快速修正：饭量少 / 正常 / 多，油量少 / 正常 / 重油，肉量少 / 正常 / 多，是否喝汤，是否吃完。

产品不要求用户输入克数，而是提供轻量修正按钮，以提高准确性并降低记录负担。

### 4.2 今日数据页

页面目标：让用户看到今天是否在正确方向。

核心卡片：

- 今日热量缺口：-780 kcal。
- 摄入：1,580 kcal。
- 静息：1,980 kcal。
- 活动：390 kcal。
- 净缺口：790 kcal。
- 可信度：中。

展示方式采用三段式：吃进来、消耗掉、剩下的。页面需提示：「今天的数据适合看趋势，不建议当作精确值。」

### 4.3 趋势分析页

页面目标：回答「我照这样下去，会不会瘦？」

核心模块：

- 7 天平均体重。
- 7 天平均热量缺口。
- 预测体重曲线。
- 目标达成概率。
- 本周建议。

表达方式应避免单点承诺，例如不要写「下周你会瘦 0.8 kg」，而应写「按最近 7 天趋势，下周体重可能下降 0.5–1.0 kg。当前节奏：接近目标，但波动较大。」

### 4.4 食物记录页

页面目标：让用户复盘自己是怎么吃胖或吃瘦的。

每餐展示为一张卡片：

- 餐次与时间。
- 食物名称。
- 估算热量与蛋白质。
- 可信度。
- 低可信度原因。
- 轻建议，例如「蛋白质偏低，建议加一份酸奶、牛奶、豆腐或鸡胸」。

## 5. 数据来源设计

### 5.1 食物照片

输入来源包括用户拍照、AI 食物识别、AI 份量估算、用户轻修正以及营养数据库匹配。

需要记录的数据字段：

- `meal_id`
- `user_id`
- `time`
- `image_url`
- `food_items`
- `estimated_calories`
- `estimated_protein`
- `estimated_carbs`
- `estimated_fat`
- `confidence_level`
- `user_adjustment`
- `final_calories`

可信度规则：

- 高：包装食品、标准食物、单一食物，例如鸡蛋、香蕉、牛奶。
- 中：常见套餐，例如包子、牛肉饭、鸡胸饭。
- 低：混合菜、火锅、麻辣香锅、自助餐、重油商圈餐。

### 5.2 Apple Watch / HealthKit 数据

需要读取：

- Basal Energy Burned：静息能量。
- Active Energy Burned：活动能量。
- Workout：运动记录。
- Heart Rate：心率。
- Step Count：步数。
- Body Mass：体重。

重要限制：普通网页不能像 iOS 原生 App 那样直接读取 Apple Health / HealthKit。MVP 可选择三种方案：

1. 网页 MVP：拍照记录、手动输入静息与活动消耗、上传健康截图、手动输入体重。
2. 网页 + iOS 伴随 App：iOS 负责 HealthKit 读取与上传，网页负责拍照、分析和可视化。
3. 直接做 iOS App：最适合长期产品，因为拍照、HealthKit、通知与体重趋势都天然适合移动端。

## 6. 预测与校准算法

基础公式：

```text
总消耗 = 静息消耗 + 活动消耗
热量缺口 = 总消耗 - 摄入热量
预测减重 = 热量缺口 / 7700
```

`7700 kcal ≈ 1 kg 脂肪`只能作为粗略换算，产品不应把它表达为精确规则。

示例展示：

- 理论脂肪变化：-0.10 kg。
- 明日体重变化：可能 -0.4 kg ~ +0.3 kg。
- 7 天趋势：预计 -0.6 kg ~ -1.0 kg。

### 校准逻辑

如果系统估算用户每天缺口 1000 kcal，但 14 天平均体重只下降 0.7 kg，说明真实缺口可能没那么大。系统应提示：

- 记录缺口：平均 -950 kcal/天。
- 体重趋势推算：约 -550 kcal/天。
- 可能原因：食物热量被低估、运动消耗被高估、水分波动较大。

系统随后可生成个人校准系数，例如：

- Apple Watch 活动消耗按 65% 计入预测。
- 商圈套餐默认热量上调 15%。

算法伪代码：

```text
daily_burn = basal_energy + active_energy
raw_deficit = daily_burn - food_intake

adjusted_active_energy = active_energy * user.activity_bias_factor
adjusted_food_intake = food_intake * user.food_bias_factor

adjusted_burn = basal_energy + adjusted_active_energy
adjusted_deficit = adjusted_burn - adjusted_food_intake

fat_loss_kg = adjusted_deficit / 7700
predicted_weight = current_7day_avg_weight - fat_loss_kg

observed_weight_loss = weight_avg_14_days_ago - weight_avg_today
observed_deficit = observed_weight_loss * 7700 / 14
estimated_deficit = average(adjusted_deficit_last_14_days)
calibration_ratio = observed_deficit / estimated_deficit
```

## 7. 可信度系统

每天生成一个数据可信度评分，例如「今日可信度：72 / 100」。

影响因素：

- 是否拍完整三餐。
- 是否存在加餐遗漏风险。
- 是否有 Apple Watch 数据。
- 是否有体重记录。
- 食物是否复杂。
- 是否有用户确认份量。
- 是否和最近体重趋势一致。

示例说明：「今天可信度偏低：午餐是混合菜，油量不确定；晚餐没有确认是否吃完；Apple Watch 活动消耗波动较大。」

## 8. MVP 范围

### MVP 必须有

- 首页相机拍照。
- AI 识别食物。
- 用户简单修正份量。
- 每日摄入热量统计。
- 手动输入静息与活动消耗。
- 手动输入体重。
- 今日热量缺口。
- 7 天体重趋势。
- 下周体重预测。
- 数据可信度提示。

### MVP 暂不做

- 社区。
- 菜谱。
- 复杂营养素管理。
- 会员体系。
- 教练聊天。
- 精准克重计算。
- 多设备生态。
- 医疗建议。

MVP 的目标是验证：用户是否愿意每天拍照记录，并相信趋势预测能帮助自己坚持减脂。

## 9. 后端模块设计

### 9.1 图像识别模块

输入：`food_image`、`meal_time`、`user_context`。

输出：`food_items`、`portion_estimate`、`calories_estimate`、`macros_estimate`、`confidence`、`reason`。

### 9.2 健康数据模块

输入：`basal_energy`、`active_energy`、`workout_energy`、`steps`、`heart_rate`、`body_weight`。

输出：`daily_energy_burned`、`activity_score`、`watch_data_confidence`。

注意：`active_energy` 不应和 `workout_energy` 重复计算。若 workout 已包含在 active energy 中，不能再加一次。

### 9.3 缺口计算模块

输出：`daily_intake`、`daily_burn`、`daily_deficit`、`deficit_confidence`。

### 9.4 体重预测模块

输出：`tomorrow_weight_range`、`next_week_weight_range`、`target_probability`、`trend_comment`。

### 9.5 校准模块

输出：`food_bias_factor`、`watch_activity_factor`、`user_adherence_score`、`prediction_accuracy`。

## 10. 技术架构建议

### 网页 MVP

前端：

- React / Next.js。
- Tailwind CSS。
- PWA。
- Web Camera API。

后端：

- Node.js 或 Python FastAPI。
- 图片上传服务。
- AI 食物识别服务。
- 用户数据数据库。
- 趋势预测服务。

数据库与存储：

- PostgreSQL。
- Redis 可选。
- 对象存储保存图片。

AI：

- 多模态模型识别食物。
- 营养数据库匹配。
- 用户历史偏好校准。

### 正式版

建议采用 iOS App + Web Dashboard。iOS App 负责拍照、HealthKit、通知和本地体验，Web Dashboard 负责长期趋势分析、报告和可视化。

## 11. 数据表设计示例

```text
users(id, height, current_weight, target_weight, target_date, sex, age, created_at)
meals(id, user_id, meal_type, image_url, estimated_calories, final_calories, protein, carbs, fat, confidence, created_at)
daily_health(id, user_id, date, basal_energy, active_energy, steps, workout_minutes, body_weight, sleep_hours)
daily_summary(id, user_id, date, intake_calories, burned_calories, deficit, predicted_weight, actual_weight, confidence_score)
calibration(id, user_id, food_bias_factor, activity_bias_factor, weight_trend_factor, updated_at)
```

## 12. 产品差异化与风险

### 差异化

1. 不确定性可视化：展示「今天大概吃了 1500–1800 kcal，可信度 72%」。
2. 体重趋势反向校准：用用户真实体重修正公式。
3. 目标达成预警：提示是否偏离目标，并给出午餐减少、增加有氧等可执行建议。
4. 最小输入：用户不用记克数或查食物库，只需要拍照和轻确认。

### 风险与应对

- 热量估算不准：显示可信度、允许轻修正、用体重趋势校准、对重油餐默认保守上调。
- Apple Watch 消耗被误用：活动消耗加入折扣系数，不重复计算 workout 与 active energy。
- 用户忘记记录：提供轻提醒、补拍、快速估算一餐，不因漏记一天打击用户。
- 用户追求极端缺口：提供安全提醒、蛋白质过低提醒、连续大缺口提醒、体重下降过快提醒。

## 13. 第一版页面清单

必做页面：

- 登录 / 注册页。
- 用户目标设置页。
- 相机首页。
- 食物识别确认页。
- 今日缺口页。
- 趋势分析页。
- 体重录入页。
- 历史记录页。
- 设置页。

第二版页面：

- Apple Health 授权页。
- 食物偏好页。
- 营养素分析页。
- 目标达成概率页。
- 周报页。
- 异常波动解释页。

## 14. 核心文案

产品不要被定义为「卡路里计算器」，而应被定义为「减脂趋势伴随应用」。

可选核心文案：

- 拍下今天，预测趋势。
- 不是记录热量，是看见变化。
- 今天的缺口，从这一餐开始。
- 拍下这一餐，我来帮你记住趋势。

## 15. 一句话定义

一款通过拍照记录饮食、手动或自动同步消耗，并用 7 天体重趋势校准热量缺口的减脂伴随应用。
