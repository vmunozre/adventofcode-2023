// https://adventofcode.com/2023/day/5 - part 1
import * as fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/06/input.txt'
const OUTPUT_FILE_PATH = 'src/06/output.txt'

async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
 
  let races: Race[] = []
  let times: number[] = []
  let distances: number[] = []
  for await (const line of file.readLines()) {
    if (line.includes('Time:')) {
      times = line.match(/\d+/g).map(Number)
    }
    if (line.includes('Distance:')) {
      distances = line.match(/\d+/g).map(Number)
    }
  }

  races = times.map((time, index) => {
    return {
      time,
      distance: distances[index]
    }
  })

  console.log(races)
  const total = races.reduce((prev, curr) => {
    return prev * calculateOptions(curr)
  }, 1)

  console.log(`total: ${total}`)
  fs.writeFile(OUTPUT_FILE_PATH, total.toString())
}

function calculateOptions (race: Race) {
  let result = 0
  for (let i = 0; i < race.time; i++) {
    const timeLeft = race.time - i
    const distance = i * timeLeft
    if (distance > race.distance) {
      result++
    }
  }
  return result
}

interface Race {
  time: number
  distance: number
}

main()