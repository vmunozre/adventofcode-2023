// https://adventofcode.com/2023/day/1#part2 - part 2
import fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/01/input.txt'
const OUTPUT_2_FILE_PATH = 'src/01/output2.txt'

async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
  let total: number = 0

  for await (const line of file.readLines()) {
      const number = getNumberFromLine(line)
      console.log(`number: ${number} from line: ${line}`)
      total += number
  }

  console.log(`total: ${total}`)
  fs.writeFile(OUTPUT_2_FILE_PATH, total.toString())
}

// Example input - output
// input: xtwone3four
// output: 24
function getNumberFromLine (line: string): number {
  // replace all words with numbers
  // same text number and same text to mantain the same start and end
  // This solved case like: oneight. The word "one" is inside "eight" -> 1 and 8
  // Not only 1
  const realLine = line
    .replace(/one/g, 'one1one')
    .replace(/two/g, 'two2two')
    .replace(/three/g, 'three3three')
    .replace(/four/g, 'four4four')
    .replace(/five/g, 'five5five')
    .replace(/six/g, 'six6six')
    .replace(/seven/g, 'seven7seven')
    .replace(/eight/g, 'eight8eight')
    .replace(/nine/g, 'nine9nine')
    const numbers = realLine.match(/\d+/g)
    if (!numbers?.length) return 0
  
    const digits = numbers.join('').split("")
    const first = digits.at(0)
    const last = digits.at(-1)
    return Number(`${first}${last}`)
}

main()