/**
 * @module KopsRecordsService
 * @description Service for scraping and caching Kops Records new vinyl inventory.
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

/**
 * @class KopsRecordsService
 * @classdesc Handles fetching, scraping, and caching the new vinyl inventory from Kops Records.
 */
class KopsRecordsService {
  /**
   * Creates an instance of KopsRecordsService.
   * @constructor
   * @param {number} [cacheExpirationMs=3600000] - Duration in milliseconds to cache inventory before refreshing.
   */
  constructor() {
    this.baseUrl = 'https://www.kopsrecords.ca';
    this.newVinylUrl = `${this.baseUrl}/shop-by-kategory/new-vinyl/`;
    this.inventoryCache = null;
    this.lastFetchTime = null;
    this.cacheExpirationMs = 3600000; // 1 hour
  }

  // Returns inventory either from cache or freshly scraped
  /**
   * Retrieves the new vinyl inventory, using cached data if valid.
   * @async
   * @param {boolean} [forceRefresh=false] - If true, bypass cache and fetch fresh inventory.
   * @returns {Promise<Array<Object>>} Array of inventory items currently in stock.
   * @throws Will throw an error if scraping fails and no cache is available.
   */
  async getInventory(forceRefresh = false) {
    if (
      !forceRefresh && 
      this.inventoryCache && 
      this.lastFetchTime && 
      Date.now() - this.lastFetchTime < this.cacheExpirationMs
    ) {
      console.log('Returning cached Kops inventory data');
      return this.inventoryCache;
    }

    try {
      const newVinyl = await this.scrapeNewVinyl();
      this.inventoryCache = newVinyl;
      this.lastFetchTime = Date.now();
      return newVinyl;
    } catch (error) {
      console.error('Error scraping Kops Records:', error);
      if (this.inventoryCache) {
        console.log('Returning cached inventory due to fetch error');
        return this.inventoryCache;
      }
      throw new Error('Failed to retrieve inventory from Kops Records');
    }
  }

  /**
   * Uses Puppeteer to scrape the new vinyl listing page and filter in-stock items.
   * @async
   * @returns {Promise<Array<Object>>} Array of product objects with url, artist, title, fullTitle, and imageUrl.
   */
  async scrapeNewVinyl() {
    console.log('Starting Puppeteer to scrape Kops new vinyl page...');
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const delay = ms => new Promise(r => setTimeout(r, ms));
  
    try {
      const page = await browser.newPage();
      await page.goto(this.newVinylUrl, { waitUntil: 'networkidle2' });
      await page.waitForSelector('li.product-index', { timeout: 10000 });
  
      // scroll fewer times
      let more = true, tries = 0;
      while (more && tries++ < 20) {
        const prevH = await page.evaluate(() => document.body.scrollHeight);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await delay(2000);
        const newH = await page.evaluate(() => document.body.scrollHeight);
        more = newH > prevH;
      }
  
      const products = await page.evaluate(() =>
        Array.from(document.querySelectorAll('li.product-index')).map(el => {
          const titleEl = el.querySelector('.product-card__title');
          const fullTitle = titleEl?.textContent.trim() || '';
          let [artist, title] = fullTitle.includes(' - ')
            ? fullTitle.split(' - ', 2)
            : fullTitle.split(': ', 2);
          const img = el.querySelector('.prod-card__img-wrapper img');
          return {
            url: titleEl?.href || '',
            artist: artist || '',
            title: title || fullTitle,
            fullTitle,
            imageUrl: img?.src || img?.dataset.src || null
          };
        })
      );
  
      console.log(`Extracted ${products.length} products, checking stock…`);
      const detailPage = await browser.newPage();
      detailPage.setDefaultNavigationTimeout(10000);
  
      const inStock = [];
      for (const { url, artist, title, imageUrl, fullTitle } of products) {
        try {
          await detailPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
  
          // NEW stock check:
          const isInStock = await detailPage.evaluate(() => {
            const addBtn = document.querySelector('form[action*="/cart/add"] button[type="submit"]');
            return Boolean(addBtn && !addBtn.disabled);
          });
  
          if (isInStock) {
            inStock.push({ url, artist, title, imageUrl, fullTitle });
          }
        } catch (err) {
          console.warn(`  ⚠️ skip ${url}: ${err.message.split('\n')[0]}`);
        }
      }
  
      await detailPage.close();
      console.log(`Filtered down to ${inStock.length} in‑stock items.`);
      return inStock;
    } finally {
      await browser.close();
      console.log('Puppeteer browser closed');
    }
  }

  /**
   * Scrapes detailed product information from an individual product page.
   * @async
   * @param {import('puppeteer').Page} page - The Puppeteer page instance to use.
   * @param {string} url - The URL of the product detail page.
   * @returns {Promise<Object>} Object containing description (and optionally genres, format, condition, year).
   */
  async scrapeProductDetails(page, url) {
    await page.goto(url, { waitUntil: 'networkidle2' });
    const details = await page.evaluate(() => {
      const descriptionEl = document.querySelector('.product__description');
      const description = descriptionEl?.textContent.trim() || '';
      // … your existing genre/format/condition/year parsing …
      return { description /*, genres, format, condition, year */ };
    });
    return details;
  }
}

module.exports = KopsRecordsService;