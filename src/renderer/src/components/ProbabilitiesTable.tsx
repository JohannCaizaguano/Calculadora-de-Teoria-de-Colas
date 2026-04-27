import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQueueStore } from '@/store/useQueueStore'
import { translations } from '@/lib/i18n'
import { ListOrdered, Search } from 'lucide-react'

function ProbCard({
  label,
  value,
}: {
  label: string
  value: number
}): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 bg-muted/30 p-3 gap-1.5 text-center">
      <span className="text-xs text-muted-foreground leading-tight">{label}</span>
      <span className="font-mono text-lg font-bold tabular-nums">
        {value.toFixed(6)}
      </span>
      <span className="text-[11px] text-muted-foreground font-normal">
        ({(value * 100).toFixed(2)}%)
      </span>
    </div>
  )
}

export function ProbabilitiesTable(): React.JSX.Element {
  const { probabilities, probQueryResult, selectedModel, metrics, language, N } = useQueueStore()
  const t = translations[language]

  const nValue = N === '' ? 10 : N

  // Helper to replace {n} placeholder in translation strings
  const fmt = (str: string): string => str.replace(/\{n\}/g, String(probQueryResult?.n ?? nValue))

  return (
    <div className="space-y-4">
      {/* Probability Query Results */}
      {probQueryResult && metrics !== null && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Search className="h-4 w-4 text-chart-1" />
              {t.probQueryTitle}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {t.probQueryDesc} {probQueryResult.n} — {t.model}: {selectedModel}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <ProbCard
                label={fmt(t.probExact)}
                value={probQueryResult.Pn_exact}
              />
              <ProbCard
                label={fmt(t.probAtMost)}
                value={probQueryResult.Pn_at_most}
              />
              <ProbCard
                label={fmt(t.probAtLeast)}
                value={probQueryResult.Pn_at_least}
              />
              <ProbCard
                label={fmt(t.probMoreThan)}
                value={probQueryResult.Pn_more_than}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Probabilities Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ListOrdered className="h-4 w-4 text-chart-2" />
            {t.probDistribution}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {t.model}: {selectedModel} — {t.probDesc}
          </p>
        </CardHeader>
        <CardContent>
          {probabilities.length > 0 && metrics !== null ? (
            <div className="max-h-[480px] overflow-y-auto rounded-md border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-[80px] text-center font-semibold">n</TableHead>
                    <TableHead className="text-center font-semibold">{t.state}</TableHead>
                    <TableHead className="text-right font-semibold">Pn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {probabilities.map((row) => (
                    <TableRow
                      key={row.n}
                      className={row.n === 0 ? 'bg-primary/5' : ''}
                    >
                      <TableCell className="text-center font-mono font-semibold">
                        {row.n}
                      </TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {row.n === 0
                          ? t.emptySystem
                          : `${row.n} ${row.n > 1 ? t.customerPlural : t.customerSingular} ${t.inSystem}`}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {row.Pn.toFixed(6)}
                        <span className="ml-1 text-[11px] text-muted-foreground font-normal">
                          ({(row.Pn * 100).toFixed(2)}%)
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
              {t.calculatePrompt}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
