from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from zlibrary import AsyncZlib
import os
from dotenv import load_dotenv

load_dotenv()

from typing import Optional, List
from pydantic import BaseModel, ConfigDict
import asyncio

app = FastAPI(title="ZLibrary API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only - configure appropriately in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize zlibrary client
lib = AsyncZlib()

class SearchResult(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[str]
    name: str
    authors: Optional[List[str]]
    cover: Optional[str]
    url: Optional[str]
    year: Optional[str]
    language: Optional[str]
    extension: Optional[str]
    size: Optional[str]
    rating: Optional[str]
    publisher: Optional[str]

@app.on_event("startup")
async def startup_event():
    print("ZLOGIN:", os.environ.get('ZLOGIN'))  # Debug print
    print("ZPASSW:", os.environ.get('ZPASSW'))  # Debug print
    await lib.login(os.environ.get('ZLOGIN'), os.environ.get('ZPASSW'))

# Store search results for later use in download
search_results = {}

@app.get("/api/search")
async def search(q: str, page: int = 1, count: int = 10):
    try:
        # create a new paginator for each search
        paginator = await lib.search(q=q, count=count)
        
        # Get initial results
        results = await paginator.next()
        
        # Navigate to requested page if needed
        if page > 1:
            for _ in range(page - 1):
                next_results = await paginator.next()
                if not next_results:  # Check if we hit the end
                    break
                results = next_results

        # Store raw results in memory
        search_results[page] = results

        formatted_results = []
        for book in results:
            formatted_results.append({
                "id": book.get("id"),
                "name": book.get("name", ""),
                "authors": book.get("authors", []),
                "cover": book.get("cover"),
                "url": book.get("url"),
                "year": book.get("year"),
                "language": book.get("language"),
                "extension": book.get("extension"),
                "size": book.get("size"),
                "rating": book.get("rating"),
                "publisher": book.get("publisher")
            })

        # Calculate total pages based on total results and count per page
        total_results = paginator.total
        total_pages = (total_results + count - 1) // count if total_results > 0 else 0
        
        response_data = {
            "results": formatted_results,
            "total_pages": total_pages,
            "current_page": page
        }
        print("[DEBUG] Sending response to frontend:", response_data)  # Debug print
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/book/{book_id}")
async def get_book(book_id: str):
    try:
        book = await lib.get_by_id(book_id)
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        return book
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/download/{book_id}")
async def download_book(book_id: str):
    try:
        # Find the book in our stored search results
        book_to_download = None
        for results in search_results.values():
            for book in results:
                if book.get('id') == book_id:
                    book_to_download = book
                    break
            if book_to_download:
                break
                
        if not book_to_download:
            raise HTTPException(status_code=404, detail="Book not found in search results")
            
        # Get detailed book info including download URL
        detailed_book = await book_to_download.fetch()
        if not detailed_book or 'download_url' not in detailed_book:
            raise HTTPException(status_code=404, detail="Download URL not found")
            
        return {"download_url": detailed_book['download_url']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
