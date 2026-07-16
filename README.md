# SaaS Automation Platform

منصة أتمتة رسائل على مستوى Enterprise (مستوحاة من ManyChat وليست نسخة منها)، تدعم مستقبلًا: Instagram،
Facebook Messenger، WhatsApp، Telegram، TikTok، والبريد الإلكتروني. مصممة لدعم 100,000+ مستخدم.

## البنية العامة (Monorepo)

```
project/
├── apps/
│   ├── web/        # React + TypeScript + Vite (Auth flow متصل بالـ API — Milestone 7)
│   └── api/         # Express + TypeScript (Auth + Security مكتملين — Milestone 6)
├── packages/
│   ├── ui/           # مكونات React مشتركة
│   ├── types/        # TypeScript types مشتركة بين web و api
│   ├── config/        # ثوابت وإعدادات مشتركة
│   └── utils/          # دوال مساعدة مشتركة
├── database/          # ملفات وأدوات مرتبطة بقاعدة البيانات خارج Prisma
├── docker/            # إعدادات الحاويات (Milestone 14)
├── docs/              # توثيق تقني إضافي
└── scripts/            # سكريبتات مساعدة للتطوير والنشر
```

> ملاحظة: المجلدات المذكورة أعلاه (`apps/*`, `packages/*`, `database/`, `docker/`, `docs/`, `scripts/`)
> تُنشأ تدريجيًا فقط عند الوصول إلى الـ Milestone الذي يحتاجها فعليًا، التزامًا بمبدأ
> "لا تنشئ أي Placeholder لا يخدم المرحلة الحالية".

## أدوات إدارة الحزم

المشروع يستخدم **pnpm workspaces**. قرار هندسي: تم اختيار pnpm بدلاً من Turborepo في هذه المرحلة
لتقليل التعقيد المبدئي (مبدأ KISS)، مع إمكانية إضافة Turborepo لاحقًا بإضافة `turbo.json` واحد
فقط دون إعادة هيكلة.

## خارطة الطريق (Milestones)

| # | Milestone | المحتوى |
|---|---|---|
| M1 | تأسيس الـ Monorepo | إعدادات الجذر: workspaces, ESLint, Prettier, EditorConfig, gitignore, env, tsconfig base |
| M2 | تهيئة التطبيقات | هيكل Express (`apps/api`) وReact+Vite (`apps/web`) والحزم المشتركة الفاضية |
| M3 | قاعدة البيانات | Prisma init، قواعد الجداول (UUID, timestamps, soft delete)، أول migration |
| M4 | البنية العرضية | Logger، معالج أخطاء مركزي، نظام Config لكل بيئة، شكل استجابة موحد، هيكل Event Bus |
| M5 | موديول Auth | JWT + Refresh Tokens، Users الأساسي |
| M6 | تحصين الأمان | Helmet، Rate Limiting، CORS، CSRF، Zod pipeline، Sanitization |
| M7 | واجهة الفرونت الأساسية | Router، Layout، صفحات Login/Register، Zustand، React Query، Protected Routes |
| M8 | Plugin System + Instagram | Provider abstraction للقنوات + أول provider فعلي (Instagram OAuth + Webhook) |
| M9 | Core الرسائل | Contacts، Conversations، Message ingestion، ربط الأحداث |
| M10 | طبقة الذكاء الاصطناعي | AI Provider abstraction (Gemini/Claude/OpenAI) + محرك Flows الأساسي |
| M11 | Queue & Cache | Redis، BullMQ، معالجة غير متزامنة للـ webhooks والـ AI |
| M12 | موديولات العمل التجارية | Billing، Notifications، Analytics |
| M13 | الاختبارات | Vitest، اختبارات Unit/Integration تتراكم بدءًا من M5 |
| M14 | DevOps والنشر | Docker، Docker Compose، Nginx، PM2، CI/CD، Health Checks، Monitoring |
| M15 | المراجعة النهائية | مراجعة أمان شاملة، تحسين أداء، توثيق نهائي |

**الحالة الحالية: Milestone 15 مكتمل — كل الـ Roadmap (M1–M15) مُنفَّذ. راجع `docs/deployment.md` للنشر.**

## قواعد التطوير الثابتة طوال المشروع

- خارطة الطريق أعلاه هي المرجع الرسمي؛ لا ننتقل لمرحلة جديدة قبل اكتمال الحالية.
- كل Batch يُنفَّذ كوحدة منطقية متكاملة، وليس بعدد ملفات ثابت.
- لا تُعاد كتابة ملفات كاملة عند تعديل جزء صغير فقط.
- لا يُنشأ أي كود أو Placeholder لا يخدم الـ Milestone الحالية.
- Production-ready من اليوم الأول: بدون حلول مؤقتة أو Demo Code.
