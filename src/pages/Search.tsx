import { Input } from "@/components/ui/input";
import { SearchResults } from "@/components/SearchResults";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { searchBooks, Book } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const { toast } = useToast();

  const handleSearch = async (pageNum: number = page) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await searchBooks(searchQuery, pageNum);
      setResults(response.results);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
      setLastSearchQuery(searchQuery);
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

  // Effect to handle only page changes
  useEffect(() => {
    if (lastSearchQuery && lastSearchQuery === searchQuery) {
      handleSearch(page);
    }
  }, [page]);

  // Reset pagination when search query changes
  useEffect(() => {
    if (searchQuery !== lastSearchQuery) {
      setPage(1);
      setTotalPages(0);
      setTotalResults(0);
      setResults([]);
    }
  }, [searchQuery]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-playfair font-bold">Find Resources</h1>
          <p className="text-muted-foreground font-inter">
            Search across multiple libraries and databases
          </p>
        </div>

        <div className="flex gap-2 bg-card border shadow-sm rounded-lg p-4">
          <Input
            type="search"
            placeholder="Search for books, articles, and more..."
            className="h-12 pl-4 text-lg bg-background/50 flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <Button
            className="h-12 px-8"
            onClick={() => handleSearch()}
          >
            Search
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {totalResults > 0 && (
              <div className="text-sm text-muted-foreground mb-4">
                Found approximately {totalResults.toLocaleString()} results
              </div>
            )}
            <SearchResults results={results} />
            {totalPages > 0 && (
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPage(p => Math.max(1, p - 1));
                  }}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span>Page {page} of {totalPages}</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPage(p => Math.min(totalPages, p + 1));
                  }}
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
