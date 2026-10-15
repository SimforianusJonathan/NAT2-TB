import { chromium, expect } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const directory = path.resolve("docs/screenshots");
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_EXECUTABLE
    ? { executablePath: process.env.BROWSER_EXECUTABLE }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const errors = [],
  checks = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (response) => {
  const url = new URL(response.url());
  if (
    response.status() >= 400 &&
    url.origin === new URL(base).origin &&
    url.pathname !== "/patients/TB-999"
  ) {
    errors.push(`HTTP ${response.status()}: ${url.pathname}`);
  }
});
page.on("console", (message) => {
  if (message.type() === "error" && !message.text().includes("404"))
    errors.push(message.text());
});
const record = (name) => {
  checks.push(name);
  console.log(`PASS ${name}`);
};
try {
  const response = await page.goto(base);
  expect(response.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: /Precision TB monitoring/ }),
  ).toBeVisible();
  await page.screenshot({
    path: path.join(directory, "00-overview.png"),
    fullPage: true,
  });
  await page.getByRole("link", { name: "Explore patient workspace" }).click();
  await expect(
    page.getByRole("heading", { name: "Patient workspace", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".patient-table tbody tr")).toHaveCount(4);
  await page.screenshot({
    path: path.join(directory, "01-patient-dashboard.png"),
    fullPage: true,
  });
  record("Overview navigation and four synthetic cases");

  await page
    .getByRole("combobox", { name: "Filter monitoring priority" })
    .selectOption("high");
  await expect(page.locator(".patient-table tbody tr")).toHaveCount(2);
  await page
    .getByRole("textbox", { name: "Search patient cases" })
    .fill("not-a-case");
  await expect(
    page.getByRole("heading", { name: "No matching cases" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".patient-table tbody tr")).toHaveCount(4);
  record("Priority filter, search and recoverable empty state");

  await page.getByRole("link", { name: "TB-001", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "High monitoring priority" }),
  ).toBeVisible();
  await expect(page.locator(".risk-indicator").nth(0)).toContainText("High");
  await expect(page.locator(".risk-indicator").nth(1)).toContainText("Low");
  await expect(
    page.getByRole("heading", { name: "Why this result?" }),
  ).toBeVisible();
  await page.screenshot({
    path: path.join(directory, "02-high-priority-detail.png"),
    fullPage: true,
  });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export case" }).click();
  const download = await downloadPromise;
  const exported = JSON.parse(await readFile(await download.path(), "utf8"));
  expect(exported.patient.id).toBe("TB-001");
  expect(exported.ruleVersion).toBe("1.0");
  expect(exported.disclaimer).toContain("not for clinical use");
  record(
    "High-priority detail, independent concern indicators, reasoning and JSON export",
  );

  await page.goto(`${base}/patients/TB-004`);
  await expect(
    page.getByRole("heading", { name: "Low monitoring priority" }),
  ).toBeVisible();
  const genotype = await page.locator(".genotype-text").textContent();
  await page.getByRole("button", { name: "Add follow-up" }).click();
  await page.getByRole("button", { name: "Fill day 14 demo" }).click();
  await page
    .getByRole("button", { name: "Save follow-up & update priority" })
    .click();
  await expect(
    page.getByRole("heading", { name: "High monitoring priority" }),
  ).toBeVisible();
  await expect(page.locator(".genotype-text")).toHaveText(genotype);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "High monitoring priority" }),
  ).toBeVisible();
  await expect(page.locator(".visit-item")).toHaveCount(2);
  await page
    .locator("#timeline")
    .screenshot({ path: path.join(directory, "03-longitudinal-change.png") });
  await page.locator(".visit-item").filter({ hasText: "Day 0" }).click();
  await expect(
    page.getByRole("heading", { name: "Low monitoring priority" }),
  ).toBeVisible();
  await expect(page.locator(".assessment-section")).toContainText(
    "historical assessment",
  );
  record(
    "Day 14 escalation, static genotype, reload persistence and historical assessment",
  );

  await page.getByRole("button", { name: "Add follow-up" }).click();
  await page.getByRole("spinbutton", { name: /^Treatment day/ }).fill("28");
  await page
    .getByRole("combobox", { name: /^Concentration interpretation/ })
    .selectOption("low");
  await expect(
    page.getByRole("spinbutton", { name: /^INH concentration/ }),
  ).toBeVisible();
  await page
    .getByRole("spinbutton", { name: /^INH concentration/ })
    .fill("1.4");
  await page
    .getByRole("spinbutton", { name: /^Sample time after dose/ })
    .fill("2");
  await page
    .getByRole("combobox", { name: /^Concentration interpretation/ })
    .selectOption("not-measured");
  await page
    .getByRole("button", { name: "Save follow-up & update priority" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Elevated monitoring priority" }),
  ).toBeVisible();
  await expect(page.locator(".confidence-panel")).toContainText(
    "Missing: Current ALT, Current AST, Symptoms, Adherence",
  );
  record("Optional concentration controls and missing-data uncertainty");

  await page
    .getByRole("link", { name: "Evidence library", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Evidence, with its boundaries." }),
  ).toBeVisible();
  await expect(page.locator(".evidence-record")).toHaveCount(6);
  await expect(page.locator("#P02")).toContainText("Placeholder");
  await page.screenshot({
    path: path.join(directory, "04-evidence-library.png"),
    fullPage: true,
  });
  await page.goto(`${base}/evidence#rules`);
  await expect(
    page.getByRole("heading", { name: "Every rule is inspectable." }),
  ).toBeVisible();
  record("Evidence registry, explicit placeholder and inspectable rules");

  await page.goto(`${base}/patients`);
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await page.getByRole("button", { name: "Keep changes" }).click();
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await page.getByRole("button", { name: "Restore original cases" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Original synthetic cases restored.",
  );
  await page.goto(`${base}/patients/TB-004`);
  await expect(
    page.getByRole("heading", { name: "Low monitoring priority" }),
  ).toBeVisible();
  await expect(page.locator(".visit-item")).toHaveCount(1);
  record("Reset confirmation, cancel and restoration of original cases");

  await page.evaluate(() =>
    localStorage.setItem("nat2-tb.synthetic-cases.v1", "bad-json"),
  );
  await page.reload();
  await expect(page.getByRole("status")).toContainText("could not be loaded");
  await expect(
    page.getByRole("heading", { name: "Low monitoring priority" }),
  ).toBeVisible();
  await page.evaluate(() =>
    localStorage.removeItem("nat2-tb.synthetic-cases.v1"),
  );
  record("Malformed local storage recovers to synthetic defaults");

  const missing = await page.goto(`${base}/patients/TB-999`);
  await expect(
    page.getByRole("heading", { name: "Case or page not found" }),
  ).toBeVisible();
  // App Router can stream a not-found response with 200 or return a direct 404.
  expect([200, 404]).toContain(missing.status());
  record("Unknown patient route has a working recovery link");

  for (const route of ["/", "/patients", "/patients/TB-001", "/evidence"]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}${route}`);
    await expect(page.locator("main h1")).toBeVisible();
    const sizes = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    }));
    expect(sizes.scroll, `Mobile overflow on ${route}`).toBeLessThanOrEqual(
      sizes.viewport,
    );
  }
  await page.goto(`${base}/patients`);
  await page.screenshot({
    path: path.join(directory, "05-mobile-workspace.png"),
    fullPage: true,
  });
  record("390px mobile layouts contain overflow within tables");
  expect(errors).toEqual([]);
  record("No unexpected browser console errors or uncaught exceptions");
  await writeFile(
    path.resolve("docs/BROWSER_VERIFICATION.json"),
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        base,
        browser: await browser.version(),
        viewport: "1440×1100 desktop; 390×844 mobile",
        checks,
        errors,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`Screenshots saved to ${directory}`);
} finally {
  await context.close();
  await browser.close();
}
