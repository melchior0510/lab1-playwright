# Lab01 — UI автомат тест (Playwright)

F.CSA313 — Программ хангамжийн чанарын баталгаа ба тест (2026)

**Оюутан:** Мөнх-Оргил
**Код:** B242270130

## Юу хийсэн

- `npm init playwright@latest` командаар Playwright TypeScript төсөл үүсгэсэн.
- Дадлагын сайт [saucedemo.com](https://www.saucedemo.com) дээр `tests/mytest.spec.ts`
  файлд 3 тест бичсэн:
  1. **Амжилттай нэвтрэх** — `standard_user` / `secret_sauce`-ээр нэвтэрч, Products
     хуудас руу шилжсэнийг шалгасан.
  2. **Амжилтгүй нэвтрэх** — буруу нууц үгээр оролдож, алдааны мессеж гарч буйг
     шалгасан.
  3. **Нэвтэрсний дараах үйлдэл** — бараа сагслаж (`Add to cart`), сагсны тоолуур
     болон сагсны агуулгыг шалгасан.
- Бүх тестэд орчин үеийн locator (`getByRole`, `getByPlaceholder`, `getByText`)
  ашигласан, XPath ашиглаагүй.
- Тест бүр `logout`-оор төгсдөг бөгөөд бие даан (isolated) ажилладаг — учир нь
  Playwright тест бүрд шинэ browser context үүсгэдэг тул тестүүд хоорондоо
  session/cookie хуваалцдаггүй.

## Ажиллуулах

```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

Trace-тэй ажиллуулах:

```bash
npx playwright test --trace on
npx playwright show-trace test-results/.../trace.zip
```

Codegen туршиж үзэх:

```bash
npx playwright codegen saucedemo.com
```

## Тестийн үр дүн

3 тест бүгд амжилттай (3 passed). Бодит HTML тайлан `playwright-report/`
фолдерт, зөв trace-үүд `test-results/` фолдерт байна.

Алхам 4-ийн шаардлагын дагуу нэг assertion-ийг (`toHaveText('1')` →
`toHaveText('99')`) санаатайгаар буруу болгож ажиллуулаад, гарсан алдааны
trace-ийг `evidence/failing-trace-toHaveText99.zip` файлд тусад нь хадгалав.
Уг trace-ийг `npx playwright show-trace evidence/failing-trace-toHaveText99.zip`
командаар нээж болно — алдаа гарсан `Expect "toHaveText"` алхам дээр
`expectedText: "99"` гэж бодит утгатай зөрчилдсөнийг харуулна.

## Playwright ба Selenium-ийн ялгааны талаарх ажиглалт

Playwright-ийн хамгийн мэдрэгдсэн давуу тал бол **auto-wait** механизм —
Selenium дээр `WebDriverWait` болон `expected_conditions`-ийг гараар бичих
шаардлагатай байдаг бол Playwright элемент бэлэн болтол автоматаар хүлээдэг тул
код хамаагүй богино, тогтвортой (flaky биш) болдог. Мөн бүх хөтөч (Chromium,
Firefox, WebKit) нэг `npx playwright install` командаар суудаг нь Selenium-ий
хөтөч бүрд тусад нь driver татаж хувилбар тохируулах шаардлагатайтай харьцуулахад
илт хялбар. **Trace viewer** нь алдаа гарсан тестийг мөшгихөд маш үр дүнтэй —
алхам бүрийн screenshot, DOM snapshot, сүлжээний хүсэлтийг хамт харуулдаг тул
Selenium-ий энгийн screenshot/лог-оос илүү мэдээлэлтэй. **Codegen** функц нь
хэрэглэгчийн үйлдлийг шууд код болгон бичдэг тул анхлан суралцагчид ялангуяа
хэрэгтэй, Selenium IDE-тэй адилхан зорилготой ч илүү орчин үеийн код гаргадаг.
Лицензийн хувьд хоёулаа Apache 2.0 үнэгүй, нээлттэй эх тул энэ талаараа ялгаагүй.
Хэл дэмжлэгийн хувьд Selenium илүү өргөн (Java, Python, C#, Ruby, JS гэх мэт)
боловч Playwright-ийн дэмждэг JS/TS, Python, Java, C# ихэнх төсөлд хангалттай.
Ерөнхийдөө Playwright нь илүү шинэ, "batteries-included" арга барилтай тул
цөөн тохиргоогоор илүү тогтвортой тест бичих боломж олгодог гэж дүгнэлээ.