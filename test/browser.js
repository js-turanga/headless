/*
 * This file is part of the Pdf-Renderer package.
 *
 * (c) Mark Fluehmann <js.turanga@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

let expect = require( "chai" ).expect;

// const Browser  = require( "../src" );
const Browser  = require( "../src" );


/** Test Specification */

describe( "browser -", function() {

    this.timeout(0);

    it( 'should browse page', async() => {

        const browser = await Browser.launch('/Users/mark.fluehmann/Downloads');

        await browser.visit('www.tagesanzeiger.ch');

        await browser.fitContent();

        await browser.pdf('tagesanzeiger.pdf')

        browser.quit()

        // expect( 1 ).to.eql(1);
    });


});
