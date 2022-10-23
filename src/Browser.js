'use strict';

/*
 * This file is part of the Headless package.
 *
 * (c) Mark Fluehmann <js.turanga@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const puppeteer = require( 'puppeteer' );
const fs = require('fs');
const os = require('os');
const path = require('path');
const elements = require('./elementsMixin');

/**
 * Default configuration options
 */ 
const config = {
    defaultViewport: null
}

/**
 * Default browser arguments
 */ 
const browserArgs = [

    // disable undesired features        
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-hang-monitor',
    '--disable-popup-blocking',
    '--disable-prompt-on-repost',
    '--disable-sync',
    '--disable-translate',
    '--metrics-recording-only',
    '--no-first-run',
    '--safebrowsing-disable-auto-update',

    //password settings
    '--password-store=basic',
    '--use-mock-keychain', // osX only

    // headless mode    
    '--headless',
    '--disable-gpu',
    '--incognito',
    '--font-render-hinting=none',
    '--hide-scrollbars',
    '--mute-audio',

    // set default window size
    // '--window-size=1920,1080',
];


class Browser {

    /**
     * Create class instance
     *
     * @param {string} outputDir
     * @param {object} browser
     * @param {object} page
     * @param {object} viewport
     * @return void
     */
    constructor( outputDir, browser, page, viewport ) {

        // set temporary directory
        this.tmpDir = this.setTmpDirectory();

        // default output directory
        this.outputDir = this.setOutputDir(outputDir);

        // default console output directory
        this.consoleOutput = this.outputDir;

        // set browser object
        this.browser = browser 

        // set page object
        this.page = page

        // set initial page viewport
        this.viewport = viewport
    }


    /**
     * Set temporary directory
     *
     * @param {string}  prefix
     * @return {string}
     */
    setTmpDirectory( prefix = '' ) {

        try {

            let tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));

            return tmpDir;

        } finally {}

        return null;
    }


    /**
     * Set output directory
     *
     * @param {string}  outputDir
     * @return {string}
     */
    setOutputDir( outputDir = '' ) {

        if ( fs.existsSync(outputDir) )
            return outputDir;

        return this.tmpDir;
    }


    /**
     * Decoupled async class launcher
     *
     * @param {string} outputDir
     * @param {object} options
     * @return {object}
     */
    static async launch( outputDir = '', options = {} ) {

        // merge default config with custom options 
        options = Object.assign({}, config, options)

        // merge browse args
        options.args = browserArgs;

        // defaults viewport to null for maximum size
        const browser = await puppeteer.launch(options);

        const page = await browser.newPage();

        const viewport = await page.viewport();

        return new Browser(outputDir, browser, page, viewport)
    }


    /**
     * Get browser version
     *
     * @return {string}
     */
    async version() {

        return await this.browser.version();
    }


    /**
     * Get Page Viewport
     *
     * @param {string}  url
     * @return {object}
     */
    async viewport() {

        return await this.page.viewport();
    }


    /**
     * Browse to the given URL.
     *
     * @param {string}  url
     * @return this
     */
    async visit( url ) {

        if ( !url.includes('http://') && !url.includes('https://') )
            url = 'https://' + url;

        this.url = url;

        const response = await this.page.goto(url);

        return this;
    }


    /**
     * Browse to the blank page.
     *
     * @return this
     */
    async blank() {

        await this.page.goto('about:blank');

        return this;
    }


    /**
     * Refresh the page.
     *
     * @return this
     */
    async refresh() {

        await this.page.reload();

        return this;
    }


    /**
     * Navigate to the previous page.
     *
     * @return this
     */
    back() {

        this.page.goBack();

        return this;
    }


    /**
     * Navigate to the next page.
     *
     * @return this
     */
    async forward() {

        await this.page.goForward();

        return this;
    }


    /**
     * Maximize the browser window.
     *
     * @return this
     */
    async maximize() {

        await this.page.setViewport({ width: 1600, height: 1200})

        return this;
    }


    /**
     * Resize the browser window.
     *
     * @param  {int}  width
     * @param  {int}  height
     * @return this
     */
    async resize( width, height ) {

        await this.page.setViewport({ width: width, height: height})

        return this;
    }


    /**
     * Make the browser window as large as the content.
     *
     * @return this
     */
    async fitContent() {

        const body = await this.page.$('body');

        if ( body !== undefined && body !== null ) {

            const box = await body.boundingBox();

            console.log('box: ', box)

            this.page.setViewport({ width: box.width, height: box.width })
        }

        return this;
    }


    /**
     * Get page title
     *
     * @return void
     */
    async title() {
        
        const title = await this.page.title();

        return title;
    }


    /**
     * Get page content
     *
     * @return void
     */
    async content() {
        
        const content = await this.page.content();

        return content;
    }


    /**
     * Set html content in page
     *
     * @param {string} html
     * @return void
     */
    async html( html ) {
        
        this.page.setContent(html)

        return this;
    }


    /**
     * Get page content
     *
     * @param {string} file
     * @param {string} format
     * @return void
     */
    async pdf( file = 'download.pdf', format = 'A4' ) {
        
        await this.page.pdf({
            path: this.outputDir + '/' + file,
            format: format,
        });

        return this.outputDir + '/' + file;
    }


    /**
     * Get page screenshot
     *
     * @param {string} file
     * @param {boolean} fullpage
     * @return void
     */
    async screenshot( file = 'screenshot.png', fullpage = true ) {
        
        await this.page.screenshot({
            path: this.outputDir + '/' + file,
            fullPage: fullpage,
        });

        return this.outputDir + '/' + file;
    }


    /**
     * Close the browser.
     *
     * @return void
     */
    quit() {

        this.browser.close();

        if (this.tmpDir) {

            try {
                fs.rmSync(this.tmpDir, { recursive: true });
            } finally {}
        }
    }

};


// Add mixins
Object.assign(Browser.prototype, elements);

module.exports = Browser;

