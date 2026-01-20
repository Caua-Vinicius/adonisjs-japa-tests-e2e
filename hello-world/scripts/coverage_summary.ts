import * as fs from 'node:fs'
import * as path from 'node:path'

const coveragePath = path.join(process.cwd(), 'coverage/coverage-final.json')
const LOW_THRESHOLD = 40
const HIGH_THRESHOLD = 80

interface Totals {
  total: number
  covered: number
  pct: number
}

interface CoverageTotals {
  statements: Totals
  branches: Totals
  functions: Totals
  lines: Totals
}

interface FileCoverage {
  statementMap: Record<string, unknown>
  s: Record<string, number>
  branchMap: Record<string, { locations: unknown[] }>
  b: Record<string, number[]>
  fnMap: Record<string, unknown>
  f: Record<string, number>
}

type CoverageMap = Record<string, FileCoverage>

function percent(covered: number, total: number): number {
  return total === 0 ? 100 : (covered / total) * 100
}

function formatPercentage(pct: number): string {
  return pct.toFixed(2) + '%'
}
const EMOJIS = ['🔴', '🚫', '⚙️', '🛠️', '💡', '🔨', '📦', '📈', '🚀', '🌟', '🏆', '🎯']

function getStatusEmoji(pct: number): string {
  const range = Math.floor(pct / 10)
  let color = '🔴'
  if (pct > LOW_THRESHOLD) color = '🟡'
  if (pct > HIGH_THRESHOLD) color = '🟢'

  return `${color} ${EMOJIS[range]}`
}

function calculateTotals(data: CoverageMap): CoverageTotals {
  const totals = {
    statements: { total: 0, covered: 0 },
    branches: { total: 0, covered: 0 },
    functions: { total: 0, covered: 0 },
    lines: { total: 0, covered: 0 },
  }

  for (const file of Object.values(data)) {
    totals.statements.total += Object.keys(file.statementMap).length
    totals.statements.covered += Object.values(file.s).filter((v) => v > 0).length

    totals.branches.total += Object.values(file.branchMap).reduce(
      (acc, branch) => acc + branch.locations.length,
      0
    )
    totals.branches.covered += Object.values(file.b).reduce(
      (acc, hits) => acc + hits.filter((count) => count > 0).length,
      0
    )

    totals.functions.total += Object.keys(file.fnMap).length
    totals.functions.covered += Object.values(file.f).filter((v) => v > 0).length

    totals.lines.total += Object.keys(file.statementMap).length
    totals.lines.covered += Object.entries(file.statementMap).filter(
      ([key]) => file.s[key] > 0
    ).length
  }

  return {
    statements: {
      ...totals.statements,
      pct: percent(totals.statements.covered, totals.statements.total),
    },
    branches: {
      ...totals.branches,
      pct: percent(totals.branches.covered, totals.branches.total),
    },
    functions: {
      ...totals.functions,
      pct: percent(totals.functions.covered, totals.functions.total),
    },
    lines: {
      ...totals.lines,
      pct: percent(totals.lines.covered, totals.lines.total),
    },
  }
}

try {
  const raw: CoverageMap = JSON.parse(fs.readFileSync(coveragePath, 'utf-8'))
  const summary = calculateTotals(raw)

  const message = `
## 🧪 Code Coverage Report

| Metric     | Status | %     | Covered / Total |
|------------|--------|-------|------------------|
| Statements | ${getStatusEmoji(summary.statements.pct)} | ${formatPercentage(summary.statements.pct)} | ${summary.statements.covered}/${summary.statements.total} |
| Branches   | ${getStatusEmoji(summary.branches.pct)} | ${formatPercentage(summary.branches.pct)} | ${summary.branches.covered}/${summary.branches.total} |
| Functions  | ${getStatusEmoji(summary.functions.pct)} | ${formatPercentage(summary.functions.pct)} | ${summary.functions.covered}/${summary.functions.total} |
| Lines      | ${getStatusEmoji(summary.lines.pct)} | ${formatPercentage(summary.lines.pct)} | ${summary.lines.covered}/${summary.lines.total} |

<details>
<summary>Click to view table</summary>

> | Emoji | Description        |
> |----|-----------------------|
> | 🔴 | 0-10% (Very Bad)      |
> | 🚫 | 11-20% (Bad)          |
> | ⚙️ | 21-30% (Still Bad)    |
> | 🛠️ | 31-40% (Slightly Bad) |
> | 💡 | 41-50% (Neutral)      |
> | 📦 | 51-60% (Progressing)  |
> | 🔨 | 61-70% (Quite There)  |
> | 📈 | 71-80% (Ok)           |
> | 🚀 | 81-85% (Good)         |
> | 🌟 | 86-90% (Very Good)    |
> | 🏆 | 91-95% (Excellent)    |
> | 🎯 | 96-100% (Outstanding) |

> read more about [code coverage](https://medium.com/walmartglobaltech/understanding-the-jest-coverage-report-a-complete-guide-966733d6f730).
</details>
`

  console.log(message.trim())
} catch (error: any) {
  console.error('❌ Error generating coverage comment:', error.message)
  process.exit(1)
}
