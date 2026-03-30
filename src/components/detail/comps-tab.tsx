"use client";

import type { Property } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { fmt } from "./shared";

interface CompsTabProps {
  p: Property;
}

export function CompsTab({ p }: CompsTabProps) {
  const subjectPriceSqm =
    p.internalSqm > 0 ? Math.round(p.price / p.internalSqm) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparable Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Sqm</TableHead>
                  <TableHead className="text-right">$/sqm</TableHead>
                  <TableHead>Config</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Similarity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Subject property row */}
                <TableRow className="bg-amber-400/10 border-amber-400/30">
                  <TableCell className="font-medium text-amber-400">
                    {p.address} (Subject)
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmt(p.price)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {p.internalSqm}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {subjectPriceSqm > 0 ? `$${subjectPriceSqm.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell>
                    {p.beds}/{p.baths}/{p.cars}
                  </TableCell>
                  <TableCell className="text-muted-foreground">—</TableCell>
                  <TableCell className="text-muted-foreground">—</TableCell>
                </TableRow>

                {/* Comparable rows */}
                {p.comparables.map((c) => (
                  <TableRow key={c.address}>
                    <TableCell className="font-medium">{c.address}</TableCell>
                    <TableCell className="text-right font-mono">
                      {fmt(c.price)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {c.sqm > 0 ? c.sqm : "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {c.priceSqm > 0 ? `$${c.priceSqm.toLocaleString()}` : "—"}
                    </TableCell>
                    <TableCell>
                      {c.beds}/{c.baths}/{c.cars}
                    </TableCell>
                    <TableCell>{c.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={c.similarity} className="w-16">
                          <span className="sr-only">{c.similarity}%</span>
                        </Progress>
                        <span className="font-mono text-xs text-muted-foreground">
                          {c.similarity}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
