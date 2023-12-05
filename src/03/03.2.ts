// https://adventofcode.com/2023/day/3#part2 - part 2
import * as fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/03/input.txt'
const OUTPUT_FILE_PATH = 'src/03/output2.txt'

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
  const paredLine = line.replace(/[.]/g, '_')
  const row = paredLine.split('')
  return row
}

function calculateMatrix (matrix: string[][]): number {
  const numbers: string[][] = []
  let total: number = 0
  for (let i = 0; i < matrix.length; i++) {
    numbers.push([])
    const row = matrix[i]

    for (let j = 0; j < row.length; j++) {
      const value = row[j]
      if (value === '*') {
        const nearby = getNearby(matrix, i, j)
        if (nearby.length === 2) {
          const result = nearby[0].value * nearby[1].value
          total += result
          numbers[i].push(`${nearby[0].value} * ${nearby[1].value} = ${result};  `)
        }
      }
    }
    console.log(`row: ${row} - numbers: ${numbers[i]}`)
  }

  return total
}

interface Position {
  row: number
  column: number
  value: string
}

interface CompleteNumber {
  value: number
  id: string // row + column
}

function getCompleteNumberByPosition(matrix: string[][], position: Position): CompleteNumber {
  const { row, column, value } = position
  const isLeftColumn = column === 0
  const isRightColumn = column === matrix[0].length - 1

  let aux = value
  let auxColumnLeft = column
  let auxColumnRight = column

  // left
  let count = 1
  while (!isLeftColumn && column - count >= 0 && matrix[row][column - count].match(/[0-9.]/g)) {
    auxColumnLeft = column - count
    aux = `${matrix[row][column - count]}${aux}`
    count++
  }

  // right
  count = 1
  while (!isRightColumn && column + count < matrix[0].length && matrix[row][column + count].match(/[0-9.]/g)) {
    auxColumnRight = column + count
    aux = `${aux}${matrix[row][column + count]}`
    count++
  }

  const id = `${row}-${auxColumnLeft}-${auxColumnRight}`

  return {
    value: Number(aux),
    id,
  }
}

function getNearby (matrix: string[][], row: number, column: number): CompleteNumber[] {
  const isTopRow = row === 0
  const isBottomRow = row === matrix.length - 1

  const isLeftColumn = column === 0
  const isRightColumn = column === matrix[0].length - 1

  const auxArray: Position[] = []

  if (!isTopRow) {
    auxArray.push({
      row: row - 1,
      column,
      value: matrix[row - 1][column]
    })
    if (!isLeftColumn) {
      auxArray.push({
        row: row - 1,
        column: column - 1,
        value: matrix[row - 1][column - 1]
      })
    }
    if (!isRightColumn) {
      auxArray.push({
        row: row - 1,
        column: column + 1,
        value: matrix[row - 1][column + 1]
      })
    }
  }

  if (!isBottomRow) {
    auxArray.push({
      row: row + 1,
      column,
      value: matrix[row + 1][column]
    })
    if (!isLeftColumn) {
      auxArray.push({
        row: row + 1,
        column: column - 1,
        value: matrix[row + 1][column - 1]
      })
    }
    if (!isRightColumn) {
      auxArray.push({
        row: row + 1,
        column: column + 1,
        value: matrix[row + 1][column + 1]
      })
    }
  }

  if (!isLeftColumn) {
    auxArray.push({
      row,
      column: column - 1,
      value: matrix[row][column - 1]
    })
  }

  if (!isRightColumn) {
    auxArray.push({
      row,
      column: column + 1,
      value: matrix[row][column + 1]
    })
  }
  const result: CompleteNumber[] = []
  auxArray.forEach((position) => {
    if (/[0-9.]/.test(position.value)) {
      const completeNumber = getCompleteNumberByPosition(matrix, position)

      const some = result.some((element) => element.id === completeNumber?.id)
      if (completeNumber.value && !some) {
        result.push(completeNumber)
      }
    }
  })
  return result
}

main()