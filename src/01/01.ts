import fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/01/input.txt'
const OUTPUT_FILE_PATH = 'src/01/output.txt'

async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
  // const numberByLines: number[] = []
  let total: number = 0
  for await (const line of file.readLines()) {
      const number = getNumberFromLine(line)
      console.log(`number: ${number} from line: ${line}`)
      // numberByLines.push(number)
      total += number
  }

  console.log(`total: ${total}`)
  fs.writeFile(OUTPUT_FILE_PATH, total.toString())
}

// Example input - output
// input: a1b2c3d4e5f
// output: 15
function getNumberFromLine (line: string): number {
  const numbers = line.match(/\d+/g)
  if (!numbers?.length) return 0

  const digits = numbers.join('').split("")
  const first = digits.at(0)
  const last = digits.at(-1)
  return Number(`${first}${last}`)
}

main()