export function generatePDF ({ date, wallet }) {
  return new Promise((resolve, reject) => {
    const pdfContent = 'pdf'
    resolve(pdfContent)
  })
}

export function generateCSV ({ date, wallet }) {
  return new Promise((resolve, reject) => {
    const csvContent = 'csv'
    resolve(csvContent)
  })
}
