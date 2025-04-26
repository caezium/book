import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Book } from "@/lib/api";

interface SearchResult extends Book { }

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-playfair">Title</TableHead>
            <TableHead className="font-playfair">Author(s)</TableHead>
            <TableHead className="font-playfair">Year</TableHead>
            <TableHead className="font-playfair">Language</TableHead>
            <TableHead className="font-playfair">Format</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index} className="border-b border-muted">
              <TableCell className="font-medium">{result.name}</TableCell>
              <TableCell>{result.authors?.join(", ") || "Unknown"}</TableCell>
              <TableCell>{result.year || "N/A"}</TableCell>
              <TableCell>{result.language || "N/A"}</TableCell>
              <TableCell>{result.extension || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
