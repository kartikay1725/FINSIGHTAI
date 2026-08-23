# 💰 FinSight – AI-Powered Financial Statement Analyzer

FinSight is a smart fintech web application that helps users **analyze PDF bank statements**, detect suspicious transactions, summarize EMIs, estimate credit scores, and even receive **personalized AI-based loan recommendations** — all powered by server-side OCR, NLP, and intelligent heuristics.

---

## 🚀 Features

✅ Upload PDF bank statements  
✅ OCR fallback for scanned statements  
✅ Auto-detection of EMIs and fraud flags  
✅ AI-based loan advisor with monthly savings estimation  
✅ Dynamic credit score simulator  
✅ Beautiful and readable PDF report download  
✅ Secure JWT-based user authentication  
✅ Report history & individual report viewer  
✅ Built using Next.js, MongoDB, TailwindCSS, Tesseract.js, and React-PDF

---


## 🧠 How It Works

1. **User uploads a bank statement PDF**
2. The app:
   - Tries to extract text using `pdf2json`
   - Falls back to OCR using `tesseract.js` if needed
3. Text is parsed to:
   - Extract **EMIs and loan info**
   - Detect **fraud patterns or anomalies**
4. Calculates a **credit score estimate**
5. Suggests **alternative banks and lower EMI options**
6. Saves the result to MongoDB and emails the user
7. Provides a **beautiful dashboard and PDF report**

---

## 📂 Folder Structure

/src
/app
/dashboard
/report
/[id]
/api
/report
/upload ← Upload and parse report
/[id] ← View/delete report
/reports ← Fetch all reports
/components
FinReportPDF.tsx ← React-PDF component for downloadable report
EMITrendChart.tsx
FraudHeatmapChart.tsx
/models
Report.ts
User.ts
/lib
db.ts
auth.ts
resend.ts
email/


---

## 🛠️ Tech Stack

- **Frontend:** Next.js App Router + TailwindCSS  
- **Backend:** API Routes + JWT Auth  
- **Database:** MongoDB + Mongoose  
- **PDF Parsing:** `pdf2json`, `tesseract.js`  
- **PDF Export:** `@react-pdf/renderer`  
- **Charts:** Custom React charts (D3.js or Chart.js compatible)  
- **Auth:** Secure JWT-based login system  
- **Emailing:** `resend` + HTML email templates

---

## ⚙️ Setup Instructions

### 1. Clone and install

```bash
git clone https://github.com/kartikay_1725/finsight-ai.git
cd finsight-ai
npm install
