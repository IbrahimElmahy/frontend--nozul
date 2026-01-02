# APIs الربط مع الزكاة (ZATCA Integration) - نسخة تفصيلية

📌 **ملاحظات مهمة**
- هذه الـ APIs مسؤولة عن إدارة عملية الربط (Onboarding) ومتابعة الحالة.
- الإبلاغ عن الفواتير (Reporting/Clearance) يتم تلقائياً في الخلفية عند إصدار أي فاتورة، ولا يحتاج لاستدعاء يدوي من الـ Frontend إلا في حالات الاختبار (test-report).
- الـ IDs المستخدمة هي integers.
- المسار الأساسي (Base URL) هو: `/hotel/api/zatca/`

## 1. Onboarding APIs (عملية الربط)

### 🔹 Start Onboarding - بدء الربط
تقوم هذه الـ API ببدء عملية الربط مع هيئة الزكاة والدخل. تتطلب رمز OTP يتم إصداره من بوابة "فاتورة" (Fatoora Portal).

**الـ Endpoint الفعلي:**
`POST /hotel/api/zatca/onboard/`

**Request Body:**
```json
{
  "otp": "123456"
}
```
*   `otp` (string, required): رمز التحقق (One Time Password) المكون من 6 أرقام للصلاحية (Production) أو المحاكاة.

**Validation Rules:**
- يجب أن يكون الفندق مسجلاً ولديه حساب فعال.
- الـ OTP يجب أن يكون صالحاً (غير منتهي الصلاحية).

**Response - Success (200 OK):**
```json
{
  "status": "success",
  "message": "Onboarding completed successfully",
  "csr": "-----BEGIN CERTIFICATE REQUEST-----...",
  "certificate": "-----BEGIN CERTIFICATE-----..."
}
```

**Response - Error Examples:**
- OTP غير صالح أو منتهي:
```json
{
  "status": "error",
  "message": "ZATCA Error: Invalid OTP or expired"
}
```
- خطأ في الإعدادات:
```json
{
  "status": "error",
  "message": "Hotel not found"
}
```

**What Happens After Onboarding:**
1.  يتم توليد مفاتيح التشفير (CSR & Private Key) وتخزينها بأمان.
2.  يتم الحصول على شهادة الامتثال (CSID) من هيئة الزكاة.
3.  يتم تحويل حالة الفندق إلى production (أو sandbox حسب الإعداد).
4.  يصبح النظام جاهزاً لإرسال الفواتير تلقائياً.

---

## 2. Status APIs (التحقق من الحالة)

### 🔹 Get Status - عرض حالة الربط
تستخدم لعرض واجهة الإعدادات ومعرفة ما إذا كان الربط فعالاً أم لا.

**الـ Endpoint الفعلي:**
`GET /hotel/api/zatca/status/`

**Response - Success (200 OK):**
```json
{
  "zatca_subscription": true,
  "zatca_environment": "production",
  "zatca_onboarding_status": "production",
  "is_ready": true,
  "last_icv": 54
}
```

**Response Fields Description:**

| Field | Type | الوصف |
| :--- | :--- | :--- |
| `zatca_subscription` | boolean | هل خدمة الزكاة مفعلة لهذا الفندق؟ |
| `zatca_environment` | string | البيئة الحالية (sandbox, simulation, production) |
| `zatca_onboarding_status` | string | حالة الربط (new, csr_generated, compliant, production) |
| `is_ready` | boolean | هل النظام جاهز لإرسال الفواتير الحقيقية؟ (true إذا كان الحالة production) |
| `last_icv` | integer | رقم تسلسل آخر فاتورة (Invoice Counter Value) تم إرسالها بنجاح |

---

## 3. Testing APIs (أدوات الاختبار)

### 🔹 Test Report - اختبار إرسال فاتورة
تستخدم هذه الـ API للتأكد من أن الربط يعمل بشكل صحيح عن طريق محاولة إرسال فاتورة موجودة يدوياً.

**الـ Endpoint الفعلي:**
`POST /hotel/api/zatca/test-report/`

**Request Body:**
```json
{
  "invoice_id": 105
}
```
*   `invoice_id` (integer, optional): رقم الفاتورة المراد تجربتها. في حال عدم الإرسال، سيقوم النظام بتجربة آخر فاتورة تم إنشاؤها.

**Response - Success (200 OK):**
```json
{
  "status": "success",
  "message": "REPORTED",
  "zatca_status": "REPORTED",
  "warning_message": null,
  "qr_code": "AR... (Base64)",
  "xml_hash": "c4ca4238a0b9..."
}
```

**Response - Error Examples:**
- فشل في التحقق (Validation Error):
```json
{
  "status": "error",
  "message": "REJECTED: Invoice total mismatch",
  "validation_results": { ... }
}
```
- الربط غير مفعل:
```json
{
  "status": "error",
  "message": "ZATCA not enabled. Complete onboarding first."
}
```

---

## 4. Notes for Frontend Developer

- **موقع الإعدادات:** يجب وضع صفحة "إعدادات الزكاة" في Settings -> Integrations -> ZATCA.
- **سير العمل (Workflow):**
    1.  عند الدخول للصفحة، استدعِ `GET /status`.
    2.  إذا كان `is_ready: false`، اعرض حقل إدخال OTP وزر "Connect".
    3.  عند الضغط، استدعِ `POST /onboard`.
    4.  إذا كان `is_ready: true`، اعرض علامة "Connected ✅" مع تفاصيل الحالة البيئية.
- **الفواتير:** لا يحتاج الـ Frontend لفعل أي شيء بخصوص إرسال الفواتير، العملية تتم تلقائياً (Backend Triggered). فقط اعرض حالة الفاتورة (Reported/Rejected) إذا كانت متوفرة في API الفواتير العام.
