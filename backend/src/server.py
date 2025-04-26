from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from zlibrary import AsyncZlib
import os
from dotenv import load_dotenv

# Load environment variables from .env file
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

@app.get("/api/search")
async def search(q: str, page: int = 1, count: int = 10):
    try:
        paginator = await lib.search(q=q, count=count)
        
        # Navigate to requested page
        for _ in range(page - 1):
            await paginator.next()
            
        results = paginator.result
        
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

        return {
            "results": formatted_results,
            "total_pages": paginator.total,
            "current_page": page
        }
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
