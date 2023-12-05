// https://adventofcode.com/2023/day/5 - part 1
import * as fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/05/input.txt'
const OUTPUT_FILE_PATH = 'src/05/output.txt'

async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
  let listOfSeeds: number[] = []

  let dataIndex = -1
  const collections: BaseData[][] = []
  for await (const line of file.readLines()) {
    if (line.includes('seeds:')) {
      listOfSeeds = getListSeeds(line)
      listOfSeeds = listOfSeeds.sort((a, b) => a - b)
      continue
    }
    if (line.includes('map:')) {
      dataIndex++
      collections[dataIndex] = []
      continue
    }
  
    if (line.match(/[0-9]/)) {
      const data = getDataLine(line)
      collections[dataIndex].push(data)
    }
  }

  let lower = Number.MAX_SAFE_INTEGER
  listOfSeeds.forEach((seed) => {
    let transform = 0
    transform = seed
    collections.forEach((collection) => {
      const find = collection.find((item) => {
        return item.sourceStart <= transform && transform <= item.sourceStart + item.range
      })
      if (find) {
        transform = find.destination + (transform - find.sourceStart)
      }
    })
    console.log(`For seed ${seed} the last array check is ${transform}`)
    if (transform < lower) {
      lower = transform
    }
  })

  const total = lower

  console.log(`total: ${total}`)
  fs.writeFile(OUTPUT_FILE_PATH, total.toString())
}

function getListSeeds (line: string): number[] {
  const parts = line.replace('seeds: ', '').trim().split(' ')
  const seeds = parts.map((part) => Number(part))
  return seeds
}

function getDataLine (line: string): BaseData {
  const parts = line.split(' ')
  return {
    destination: Number(parts[0]),
    sourceStart: Number(parts[1]),
    range: Number(parts[2])
  }
}

interface MapValue {
  seed: number
  attribute: number
}

interface BaseData {
  destination: number
  sourceStart: number
  range: number
}

main()