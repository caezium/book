import { Input } from "@/components/ui/input";
import { SearchResults } from "@/components/SearchResults";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { searchBooks, Book } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await searchBooks(searchQuery, page);
      setResults(response.results);
      setTotalPages(response.total_pages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch search results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, page]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-playfair font-bold">Find Resources</h1>
          <p className="text-muted-foreground font-inter">
            Search across multiple libraries and databases
          </p>
        </div>

        <div className="relative bg-card border shadow-sm rounded-lg p-4">
          <Input
            type="search"
            placeholder="Search for books, articles, and more..."
            className="w-full h-12 pl-4 pr-12 text-lg bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <SearchResults results={results} />
            {totalPages > 0 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span>Page {page} of {totalPages}</span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
