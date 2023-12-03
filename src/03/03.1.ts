// https://adventofcode.com/2023/day/2 - part 1
import fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/03/input.txt'
const OUTPUT_FILE_PATH = 'src/03/output.txt'

async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
  const matrix: string[][] = []
  for await (const line of file.readLines()) {
      const row = getParsedMatrixByLine(line)
      matrix.push(row)
  }

  const total = calculateMatrix(matrix)

  console.log(`total: ${total}`)
  fs.writeFile(OUTPUT_FILE_PATH, total.toString())
}

// line -> array
function getParsedMatrixByLine (line: string): string[] {
  const paredLine = line.replace(/[.]/g, ' ')
  const row = paredLine.split('')
  return row
}

function calculateMatrix (matrix: string[][]): number {
  const numbers: number[][] = []
  const symbols = getSymbols(matrix)
  let total: number = 0
  for (let i = 0; i < matrix.length; i++) {
    numbers.push([])
    const row = matrix[i]

    let aux = ''
    let nearSymbol = false
    for (let j = 0; j < row.length; j++) {
      const column = row[j]
      if (column.match(/\d+/g)) {
        aux += column
        if (!nearSymbol) {
          nearSymbol = isCloseToSymbol(matrix, i, j, symbols)
        }
      } else {
        if (aux.length > 0) {
          const number = Number(aux)
          if (number > 0 && nearSymbol) {
            total += number
            numbers[i].push(number)
          }
          aux = ''
          nearSymbol = false
        }
      }

      if (j === row.length - 1 && aux.length > 0) {
        const number = Number(aux)
        if (number > 0 && nearSymbol) {
          total += number
          numbers[i].push(number)
        }
        aux = ''
        nearSymbol = false
      }
    }
    console.log(`row: ${row} - numbers: ${numbers[i]}`)
  }
  console.log('symbols: ', symbols)
  return total
}

function isCloseToSymbol (matrix: string[][], row: number, column: number, symbols: Set<string>): boolean {
  const isTopRow = row === 0
  const isBottomRow = row === matrix.length - 1

  const isLeftColumn = column === 0
  const isRightColumn = column === matrix[0].length - 1

  const auxArray: string[] = []

  if (!isTopRow) {
    auxArray.push(matrix[row - 1][column])
    if (!isLeftColumn) {
      auxArray.push(matrix[row - 1][column - 1])
    }
    if (!isRightColumn) {
      auxArray.push(matrix[row - 1][column + 1])
    }
  }

  if (!isBottomRow) {
    auxArray.push(matrix[row + 1][column])
    if (!isLeftColumn) {
      auxArray.push(matrix[row + 1][column - 1])
    }
    if (!isRightColumn) {
      auxArray.push(matrix[row + 1][column + 1])
    }
  }

  if (!isLeftColumn) {
    auxArray.push(matrix[row][column - 1])
  }

  if (!isRightColumn) {
    auxArray.push(matrix[row][column + 1])
  }
  let result = false
  auxArray.forEach((value) => {
    if (symbols.has(value)) {
      result = true
    }
  })
  return result
}

function getSymbols (matrix: string[][]): Set<string> {
  let oneLine = ''
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i].join('')
    oneLine += row
  }
  const symbols = oneLine.replace(/[\w]/g, '').replace(/ /g, '').split('')
  return new Set(symbols)
}

main()