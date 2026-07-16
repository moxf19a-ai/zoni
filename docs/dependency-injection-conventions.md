# قواعد حقن الاعتماديات (Dependency Injection Conventions)

هذا المستند يوضح إزاي المشروع بيطبّق **Dependency Inversion** من غير استخدام أي DI Container
(زي InversifyJS أو tsyringe). القرار المعماري: التأجيل — لو المشروع احتاج Container فعليًا في
مرحلة لاحقة، القرار هيُتخذ ويُوثَّق وقتها بسبب واضح، مش يُفرض من الأول من غير حاجة فعلية (YAGNI).

## القاعدة الأساسية

**أي Service أو Repository في أي موديول مستقبلي لازم يعتمد على تجريد (Interface أو Type)، مش على
تنفيذ ملموس (Concrete Implementation) مباشر.** الاعتماديات تُمرَّر عبر الـ Constructor، مش
تُستورَد وتُستخدم مباشرة جوه الكلاس نفسه.

### مثال توضيحي (نمط، وليس كود فعلي في المشروع)

بدل:
```ts
import { prisma } from '../../infrastructure/database/prisma-client';

class UserService {
  async findUser(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
}
```

المتبع في هذا المشروع:
```ts
import type { DatabaseClient } from '../../application/interfaces/database-client.type';

class UserService {
  constructor(private readonly db: DatabaseClient) {}

  async findUser(id: string) {
    return this.db.user.findUnique({ where: { id } });
  }
}
```

الفرق: `UserService` هنا مبيعرفش ولا مهتم إن التنفيذ الفعلي هو Prisma تحديدًا — لو الطبقة التحتية
اتغيرت مستقبلًا، الكلاس نفسه مش هيتلمس.

## الاستثناء الوحيد: نقطة التركيب (Composition Root)

مكان واحد بس مسموح له يستورد التنفيذ الملموس مباشرة (`prisma` من `prisma-client.ts`) وهو **نقطة
التركيب** — دلوقتي ده `server.ts`. هو المسؤول عن "تركيب" الاعتماديات الملموسة وتمريرها للطبقات
اللي فوقه (Services → Controllers) وقت الإقلاع. لما تُبنى الموديولات الفعلية (بداية من الموديول
اللي يقدّم أول Repository حقيقي)، التركيب ده ممكن يتنقل لملف/دالة Factory مخصصة، لكنه هيفضل مبدأ
واحد: **تنفيذ ملموس واحد بيتبنى في مكان واحد، وكل حاجة تانية بتستقبله جاهز**.

## ليه من غير Container دلوقتي

- عدد الاعتماديات الحالي (عميل قاعدة بيانات واحد، إعدادات بيئة واحدة) بسيط جدًا وميستحقش تعقيد
  إضافي (مبدأ KISS وYAGNI).
- التمرير اليدوي عبر الـ Constructor بيدي نفس فايدة الـ Dependency Inversion من غير أي مكتبة
  إضافية أو Decorators أو Reflection.
- لو عدد الموديولات والاعتماديات المتشابكة زاد بشكل كبير مستقبلًا (خاصة مع Event Bus وPlugin
  System)، القرار يُعاد تقييمه وقتها بناءً على حاجة فعلية موثّقة — مش افتراضًا الآن.

## الالتزام المطلوب من أي Milestone قادم

كل Repository أو Service جديد لازم:
1. يستقبل اعتمادياته (قاعدة البيانات، إعدادات، أي خدمة تانية) عبر الـ Constructor.
2. يعتمد على النوع/الواجهة التجريدية (زي `DatabaseClient`) في تعريف الـ Constructor، مش على
   الكلاس الملموس.
3. لا يستورد أي Singleton ملموس (`prisma`, إلخ) مباشرة إلا لو كان هو نفسه نقطة التركيب.
