---
title: HEX-кодування кольору
description: У графічних редакторах і коді вебсайтів кольори часто позначаються якось на кшталт #ffd600, #с158f5 або #fff. Оцей формат опису кольору якраз і називають HEX.
lang: uk
category: uk
source:
    name: cases.media
    url: https://cases.media/article/hex-koduvannya-koloru
author:
    name: cases.media
    url: https://cases.media/article/hex-koduvannya-koloru
image:
    path: https://i.imgur.com/AzI32fH.jpg
    width: 800
    height: 400
---

У графічних редакторах і коді вебсайтів кольори часто позначаються якось на кшталт #ffd600, #с158f5 або #fff. 
Оцей формат опису кольору якраз і називають HEX.

Завдяки лише 6 символам кодуються всі кольори, які ви бачите на вебсайтах. Відповідно, всім вебдизайнерам та дизайнерам, 
що створюють інтерфейси, не завадить розуміти, як саме це кодування влаштоване та навіть знати деякі типові комбінації.

Про все це розповімо у цьому матеріалі! А почнемо з того, що з’ясуємо, що взагалі означає той ваш HEX.

{% include imgur src="00CC5CX.png" alt="Photo courtesy of olivia mew(CC No Derivatives)" %}

### Що таке HEX

HEX — це перші літери англійського слова hexadecimal, яке походить від грецького έξ (hex), що означає «шість», і частки 
«-decimal», що походить від латинського слова «десятий». Тобто «шістнадцятковий». Тож HEX-кодування кольору — ніщо інше, 
як запис числа у шістнадцятковій системі числення. Звучить страшно? Не лякайтесь, зараз все розкладемо по поличках.

Системи обчислення — це своєрідні математичні мови. Наприклад, є один предмет, який в різних мовах буде називатись по-різному. 
Скажімо, те саме «яйце» англійською називається «egg», а французькою — «œuf».

{% include imgur src="T1jlCnK.png" alt="Photo courtesy of olivia mew(CC No Derivatives)" %}

Схожим чином працюють системи числення — це просто різні способи описування чисел. Таких систем протягом історії людства 
створювалось чимало: єгипетська система числення, арабська, старослов’янська, двійкова, вісімкова, десяткова тощо.

До речі, найліпше нам знайома десяткова система. В ній будь-яке число можна записати за допомогою десяти цифр, від 0 до 9. 
Ви, напевно, чули, що існує також двійкова система (її ще називають «бінарна»). В ній будь-яке число можна записати лише 
двома символами — нулем та одиницею.

Ну а в шістнадцятковій системі, як ви вже здогадалися, цифр 16. Перші — ті ж самі, від 0 до 9. А далі використовуються 
перші 6 літер латинського алфавіту: A, B, C, D, E, F. Тобто число 10 у шістнадцятковій системі записується як 
А, 11 — B, 15 — F, 16 — 10. І так далі.

{% include imgur src="bjq9GWB.png" alt="Photo courtesy of olivia mew(CC No Derivatives)" %}

### Як влаштовано HEX-кодування

Чим більше в системі числення знаків, тим компактнішим виходить запис числа.

Наприклад, щоб записати число 15, у десятковій системі треба 2 розряди (одиниці та десятки), у двійковій — 4 (1111), 
а у шістнадцятковій — всього один (F).

{% include imgur src="SongquN.png" alt="Photo courtesy of olivia mew(CC No Derivatives)" %}

А для великих чисел економія ще помітніша.

{% include imgur src="4OtVkC4.png" alt="Photo courtesy of olivia mew(CC No Derivatives)" %}

Якщо розібратися, переводити числа з однієї системи до іншої зовсім нескладно. Але необов'язково робити це вручну — в 
інтернеті є багато онлайн-калькуляторів, з якими це зробити набагато простіше.

{% include imgur src="ml65OTX.png" alt="Photo courtesy of olivia mew(CC No Derivatives)" %}

Але насправді, за допомогою систем числення можна описувати (тобто, «кодувати») не лише числа, але й… Власне, майже будь-що. 
У тому числі й кольори. З’ясуймо, як саме.

### HEX-кодування кольорів 

Перш ніж пояснювати, як кодують кольори в HEX, треба уточнити, що це кодування базується на моделі RGB.

Тож, якщо ви вже розумієте, як працює модель RGB, вам буде нескладно зрозуміти й принцип HEX-кодування. Докладно ми про 
неї розповідали в статті «Колірна модель RGB».

А в цій статті просто нагадаємо, що у моделі RGB кольори отримують змішуванням трьох основних кольорів — червоного, 
зеленого і синього. Відповідно, кожен колір можна описати трьома числами. По суті, кожне з цих чисел буде описувати 
яскравість кожного з основних кольорів. В десятковій системі яскравість має 256 градацій — від 0 до 255. Тут 0 — це 
найслабша яскравість, а 255 — найсильніша. Якщо яскравість за всіма трьома шкалами мінімальна (0, 0, 0) — виходить чорний 
колір. Якщо максимальна (255, 255, 255) — білий.

{% include imgur src="RNr3arY.png" alt="Photo courtesy of olivia mew(CC No Derivatives)" %}

Давайте за допомогою того ж калькулятора переведемо їх в шістнадцяткову систему.

255 = ff

Значить, у шістнадцятковій системі (255, 255, 255) виглядатиме як (ff,ff,ff). Чорний буде (00,00,00), а наш бордовий — #7C1A76. 
А в форматі HEX-кодування не використовують круглі дужки й коми. Натомість записують 6 знаків послідовно і додають попереду 
решітку.

Виходить отакий компактний запис: #ffffff.

Це і є HEX-код білого кольору.

Компактненько! Всього 6 знаків замість дев’яти. Але можна ще компактніше. В деяких випадках, якщо одному параметру відповідають 
дві однакові літери, як от в білому, то їх скорочують до одної літери на один колір #ffffff → #fff

До початку дев'яностих таке кодування майже не використовувалось. Поширення воно набуло саме з появою вебсайтів. 
Власне, через це кодовані через hex кольори часто ще через це ще називають вебкольорами.

### Деякі типові кольори

Для закріплення — ось ще кілька прикладів запису кольорів у десятковій та шістнадцятковій системах.

{% include imgur src="pK0rr1c.png" alt="Photo courtesy of olivia mew(CC No Derivatives)" %}

### Використання HEX на практиці

Якщо вам в цілому все зрозуміло, але все ще трохи лячно, що не зможете запам’ятати всі ці коди, маємо хорошу новину 
— робити це не обов’язково.

Запис у форматі HEX-кодування існує в усіх редакторах — і в Photoshop, і в Illustrator, і у Figma. І тепер ви знаєте, 
що означають цифри в цьому коді.











