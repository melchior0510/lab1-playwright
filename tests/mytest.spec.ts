import { test, expect } from '@playwright/test';

/**
 * Lab01 — UI автомат тест (Playwright)
 *
 * Гурван тест:
 *   1. Амжилттай нэвтрэх (standard_user / secret_sauce)
 *   2. Амжилтгүй нэвтрэх (буруу нууц үг — алдааны мессеж шалгах)
 *   3. Нэвтэрсний дараах үйлдэл — бараа сагслах (add to cart)
 *
 * Тест бүр бие даан (isolated) ажиллана — өмнөх тестээс хамаарахгүй,
 * учир нь Playwright тест бүрд шинэ browser context үүсгэдэг.
 */

const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';
const INVALID_PASS = 'wrong_password';

test.describe('SauceDemo — нэвтрэх ба сагслах', () => {

  test('амжилттай нэвтрэх', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    // Орчин үеийн locator ашиглах: getByPlaceholder / getByRole
    // XPath-аас зориуд зайлсхийсэн — учир нь XPath нь DOM-ын бүтцээс
    // (элементийн байрлал, вложенность) шууд хамааралтай тул HTML бага зэрэг
    // өөрчлөгдөхөд амархан эвдэрдэг. getByRole/getByLabel/getByPlaceholder
    // нь хэрэглэгчийн харж, туслах технологи (accessibility tree) хэрхэн
    // ойлгож буйтай нь илүү ойролцоо тул тогтвортой, унших боломжтой.
    await page.getByPlaceholder('Username').fill(VALID_USER);
    await page.getByPlaceholder('Password').fill(VALID_PASS);
    await page.getByRole('button', { name: 'Login' }).click();

    // Нэвтэрсний баталгаажуулалт: Products хуудас руу шилжсэн эсэх
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page).toHaveURL(/inventory\.html/);

    // Тест бүрийг зөв төгсгөх — logout хийж дараагийн тестэд нөлөөлөхгүй байлгах
    // Тайлбар: Logout элемент өмнө нь "link" role-той байсан бол сайт
    // шинэчлэгдсэнээс хойш "button" role-той болсныг debug хийх явцад мэдэрсэн.
    await page.locator('#react-burger-menu-btn').click();
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('амжилтгүй нэвтрэх — буруу нууц үг', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    await page.getByPlaceholder('Username').fill(VALID_USER);
    await page.getByPlaceholder('Password').fill(INVALID_PASS);
    await page.getByRole('button', { name: 'Login' }).click();

    // Алдааны мессеж гарч буйг шалгах — Products хуудас руу орохгүй
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/Username and password do not match/i);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('нэвтэрсний дараа бараа сагслах', async ({ page }) => {
    // Тест бие даан ажиллах ёстой тул энд дахин нэвтэрнэ
    await page.goto('https://www.saucedemo.com');
    await page.getByPlaceholder('Username').fill(VALID_USER);
    await page.getByPlaceholder('Password').fill(VALID_PASS);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Products')).toBeVisible();

    // Нэг барааг сагслах (жишээ: Sauce Labs Backpack)
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    // Сагсны тоолуур 1 болсныг шалгах
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    // Сагс руу орж, барааг жагсаалтад байгааг баталгаажуулах
    // Тайлбар: эхэндээ CSS class (.shopping_cart_link) болон role-based
    // locator (getByRole('button', {name: /Cart/i})) ашигласан боловч сайт
    // шинэчлэгдсэнээс "Add to cart" товчнуудтай давхцаж strict mode
    // violation өгсөн тул илүү тогтвортой data-test attribute-д шилжүүлэв.
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();

    // Төгсгөх алхам — logout
    await page.locator('#react-burger-menu-btn').click();
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

});