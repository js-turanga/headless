'use strict';

/*
 * This file is part of the Headless package.
 *
 * (c) Mark Fluehmann <js.turanga@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const puppeteer = require( './puppeteer.js' );

class Renderer {

    /**
     * Create class instance
     *
     * @param {object} config
     * @return void
     */
    constructor( args = {} ) {

        const config = Object.assign({}, options, args )

        this.doc = new jsPDF(config);
    }


    /**
     * Add page to document
     *
     * @param {string}  format
     * @param {string}  orientation
     * @return {this}
     */
    addPage( format, orientation ) {

        if ( format === undefined )
            format = options.format

        if ( orientation === undefined )
            orientation = options.orientation

        this.doc.addPage(format, orientation);

        return this;
    }


    /**
     * Insert page before page
     *
     * @param {int} beforePage
     * @return {this}
     */
    insertPage( beforePage ) {

        if ( beforePage !== undefined )
            this.doc.insertPage(beforePage);

        return this;
    }


    /**
     * Remove page at current page number
     *
     * @param {int} number
     * @return {this}
     */
    deletePage( number ) {

        if ( number !== undefined )
            this.doc.deletePage(number);

        return this;
    }


    /**
     * Insert HTML
     *
     * @param {string} html
     * @param {object} options
     * @return {this}
     */
    insertHtml( html, options ) {

        const that = this

        this.doc.html(html, options).then(() => that.doc.save('test.pdf'));

        return this;
    }


    /**
     * Insert Image
     *
     * @param {string|HTMLImageElement|HTMLCanvasElement|Uint8Array|RGBAData} imageData
     * @param {string} format  format of file if filetype-recognition fails
     * @param {number} x  x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y  y Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {string} width  width of the image (in units declared at inception of PDF document)
     * @param {string} height  height of the image (in units declared at inception of PDF document)
     * @param {string} alias  alias of the image (if used multiple times)
     * @param {string} compression  compression of the generated JPEG, can have the values 'NONE', 'FAST', 'MEDIUM' and 'SLOW'
     * @param {number} rotation  rotation of the image in degrees (0-359)
     * @return {this}
     */
    insertImage( imageData, format, x, y, width, height, alias, compression, rotation ) {

        this.doc.addImage( imageData, format, x, y, width, height, alias, compression, rotation ) 

        return this;
    }


    /**
     * Finalise the document and return the document as a string
     *
     * @return string    
     */
    stream()
    {
        return this.doc.output('datauristring')
    }


    /**
     * Finalise the document and send the file inline to the browser
     *
     * @param string  filename     filename is used when one selects the “Save as”
     * @return 
     */
    inline( filename = 'document.pdf' )
    {
        return this.doc.output('dataurlnewwindow', filename)
    }


    /**
     * Finalise the document and send to the browser and force a file download
     *
     * @param {string} filename    the name given by filename.
     * @return void
     */
    download( filename = 'document.pdf' )
    {
    }


    /**
     * Finalise the document and save to a local file with the name given by filename
     *
     * @param {string} filename
     * @return static
     */
    save( filename = 'document.pdf' )
    {
        return this.doc.save(filename)
    }
};

module.exports = Renderer;

