/*
 * Copyright D3 Ledger, Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// https://github.com/bpampuch/pdfmake/issues/1374

function fetchFont (fontURL) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', fontURL, true)
    request.responseType = 'arraybuffer'

    request.onload = function (e) {
      resolve(request.response)
    }

    request.onerror = reject

    request.send()
  })
}

class PdfFontLoader {
  constructor () {
    this.fontDefs = []
    this.vfs = {}
  }
  addFont (fontDef) {
    this.fontDefs.push(fontDef)
  }

  load () {
    return new Promise((resolve, reject) => {
      if (this.loaded) {
        resolve()
      } else {
        const fetches = this.fontDefs.map(fontDef => {
          return fetchFont(fontDef.URL).then((data) => {
            this.vfs[fontDef.name] = data
          })
        })
        Promise.all(fetches).then(() => {
          this.loaded = true
          resolve()
        }).catch(reject)
      }
    })
  }
}

export const fontLoader = new PdfFontLoader()
