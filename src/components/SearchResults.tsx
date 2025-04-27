import { useState } from "react";
import { downloadBook } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Book } from "@/lib/api";

interface SearchResultsProps {
  results: Book[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async (id: string) => {
    setIsDownloading(true);
    try {
      await downloadBook(id);
      toast({
        title: "Download Started",
        description: "Your download should begin in a new tab.",
      });
    } catch (error) {
      console.error('Failed to download book:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download book",
      });
    } finally {
      setIsDownloading(false);
    }
  };

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
            <TableRow
              key={index}
              className="border-b border-muted cursor-pointer hover:bg-muted/50"
              onClick={() => {
                setSelectedBook(result);
                setDialogOpen(true);
              }}
            >
              <TableCell className="font-medium">{result.name}</TableCell>
              <TableCell>{result.authors?.join(", ") || "Unknown"}</TableCell>
              <TableCell>{result.year || "N/A"}</TableCell>
              <TableCell>{result.language || "N/A"}</TableCell>
              <TableCell>{result.extension || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedBook && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-playfair">{selectedBook.name}</DialogTitle>
                <DialogDescription>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <p><span className="font-semibold">Authors:</span> {selectedBook.authors?.join(", ") || "Unknown"}</p>
                      <p><span className="font-semibold">Year:</span> {selectedBook.year || "N/A"}</p>
                      <p><span className="font-semibold">Publisher:</span> {selectedBook.publisher || "N/A"}</p>
                      <p><span className="font-semibold">Language:</span> {selectedBook.language || "N/A"}</p>
                      <p><span className="font-semibold">Format:</span> {selectedBook.extension || "N/A"}</p>
                      <p><span className="font-semibold">Size:</span> {selectedBook.size || "N/A"}</p>
                      <p><span className="font-semibold">Rating:</span> {selectedBook.rating || "N/A"}</p>
                    </div>
                    {selectedBook.cover && (
                      <div className="flex justify-center items-start">
                        <img
                          src={selectedBook.cover}
                          alt={`Cover of ${selectedBook.name}`}
                          className="max-w-[200px] rounded-md shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => handleDownload(selectedBook.id)}
                  disabled={isDownloading}
                >
                  {isDownloading ? "Downloading..." : `Download ${selectedBook.extension}`}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
