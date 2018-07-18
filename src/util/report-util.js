export function generatePDF ({ date, wallet }) {
  return new Promise((resolve, reject) => {
    const pdfContent = 'pdf'
    // TODO: return blob
    resolve(pdfContent)
  })
}

export function generateCSV ({ date, wallet }) {
  return new Promise((resolve, reject) => {
    const csvContent = 'csv'
    // TODO: return blob
    resolve(csvContent)
  })
}
