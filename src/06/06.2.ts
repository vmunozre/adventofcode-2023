// https://adventofcode.com/2023/day/5 - part 1
import * as fs from 'node:fs/promises'

const INPUT_FILE_PATH = 'src/06/input.txt'
const OUTPUT_FILE_PATH = 'src/06/output2.txt'

async function main (): Promise<void> {
  // read file
  const file = await fs.open(INPUT_FILE_PATH)
 
  let race: Race = {
    time: 0,
    distance: 0
  }
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

  times.forEach((time, index) => {
    race = {
      time: Number(`${race.time}${time}`),
      distance: Number(`${race.distance}${distances[index]}`)
    }
  })

  console.log(race)
  const total = calculateOptions(race)

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