// https://adventofcode.com/2023/day/5 - part 1
import * as fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/05/input.txt'
const OUTPUT_FILE_PATH = 'src/05/output.txt'

async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
  let listOfSeeds: number[] = []

  let dataIndex = -1
  const collections: MapValue[][] = []
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
      const seeds = dataParsed(data)
      collections[dataIndex].push(...seeds)
    }
  }


  let lower = Number.MAX_SAFE_INTEGER
  listOfSeeds.forEach((seed) => {
    let transform = 0
    transform = seed
    collections.forEach((collection, index) => {
      const find = collection.find((item) => item.seed === transform)
      if (find) {
        transform = find.attribute
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

function dataParsed (lineData: BaseData): MapValue[] {
  const { destination, sourceStart, range } = lineData
  const sourceEnd = sourceStart + range
  const seeds: MapValue[] = []

  let count = 0
  for (let i = sourceStart; i < sourceEnd; i++) {
    const seed = {
      seed: i,
      attribute: destination + count
    }
    count++
    seeds.push(seed)
  }
  return seeds
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