export function generatePDF ({ date, wallet }) {
  return new Promise((resolve, reject) => {
    const content = 'pdf'
    const blob = new Blob(
      [content],
      { type: 'application/pdf;charset=utf-8' }
    )

    resolve(blob)
  })
}

export function generateCSV ({ date, wallet }) {
  return new Promise((resolve, reject) => {
    const content = 'csv'
    const blob = new Blob(
      [content],
      { type: 'text/csv;charset=utf-8' }
    )

    resolve(blob)
  })
}
