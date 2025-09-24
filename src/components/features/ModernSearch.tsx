"use client";
import React, { useState, useRef, useCallback, useMemo } from "react";
import { 
  Search, 
  Music, 
  User, 
  Disc3, 
  Clock, 
  Sparkles, 
  BrainCircuit, 
  X,
  TrendingUp,
  History
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { SearchResult, Artist } from "@/lib/types";
import { Card, Input, Badge, Button } from '@/src/components/ui';
import { SearchSkeleton } from '@/src/components/ui/LoadingStates';
import { useMusicContext } from '@/src/contexts/MusicContext';
import { useDebounce } from '@/src/hooks/useDebounce';
import { useClickOutside } from '@/src/hooks/useClickOutside';
import { useKeyboardShortcuts } from '@/src/hooks/useKeyboardShortcuts';
import { artistNameToSlug } from "@/src/utils/urlUtils";

interface ModernSearchProps {
  className?: string;
}

export const ModernSearch: React.FC<ModernSearchProps> = ({ className = "" }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [smartResults, setSmartResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'regular' | 'ai'>('regular');
  const [artists, setArtists] = useState<Artist[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const router = useRouter();
  
  const { 
    addToSearchHistory, 
    searchHistory, 
    clearSearchHistory,
    setCurrentArtist 
  } = useMusicContext();
  
  const debouncedQuery = useDebounce(query, 300);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrlKey: true,
      callback: () => {
        inputRef.current?.focus();
        setIsOpen(true);
      }
    },
    {
      key: '/',
      callback: () => {
        if (document.activeElement !== inputRef.current) {
          inputRef.current?.focus();
          setIsOpen(true);
        }
      }
    }
  ]);

  // Load artists data
  const loadArtists = useCallback(async () => {
    try {
      const response = await fetch('/api/artists');
      if (response.ok) {
        const artistData = await response.json();
        setArtists(artistData);
      }
    } catch (error) {
      console.error('Failed to load artists:', error);
    }
  }, []);

  React.useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  // Search functions
  const performRegularSearch = useCallback((searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const searchResults: SearchResult[] = [];
    const queryLower = searchQuery.toLowerCase();

    artists.forEach(artist => {
      // Search artists
      if (artist.name.toLowerCase().includes(queryLower)) {
        searchResults.push({ type: 'artist', artist });
      }

      // Search albums and songs
      artist.albums.forEach(album => {
        if (album.title.toLowerCase().includes(queryLower)) {
          searchResults.push({ type: 'album', artist, album });
        }

        album.songs.forEach(song => {
          if (song.title.toLowerCase().includes(queryLower)) {
            searchResults.push({ type: 'song', artist, album, song });
          }

          // Search lyrics
          if (song.lyrics && 
              song.lyrics !== "fě" && 
              song.lyrics.toLowerCase().includes(queryLower)) {
            const lyricsPreview = song.lyrics.substring(0, 100) + "...";
            searchResults.push({ 
              type: 'lyrics', 
              artist, 
              album, 
              song,
              matchedText: lyricsPreview 
            });
          }
        });
      });
    });

    return searchResults.slice(0, 8); // Limit results
  }, [artists]);

  const performAISearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 5) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setSmartResults(data.results || []);
      }
    } catch (error) {
      console.error('AI search failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search
  React.useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setSmartResults([]);
      return;
    }

    if (searchMode === 'ai') {
      performAISearch(debouncedQuery);
      setResults([]);
    } else {
      const searchResults = performRegularSearch(debouncedQuery);
      setResults(searchResults);
      setSmartResults([]);
    }

    setSelectedIndex(-1);
  }, [debouncedQuery, searchMode, performRegularSearch, performAISearch]);

  // Handle selection
  const handleResultSelect = useCallback((result: SearchResult | any) => {
    if (!result) return;

    addToSearchHistory(query);
    setIsOpen(false);
    setQuery("");

    // Handle AI results
    if (result.name && result.type) {
      // Find the actual artist from the database
      const foundArtist = artists.find(a => 
        a.name.toLowerCase() === result.name.toLowerCase()
      );
      if (foundArtist) {
        setCurrentArtist(foundArtist);
        const slug = foundArtist.name.toLowerCase().replace(/\s+/g, "-");
        router.push(`/artist/${slug}`);
      }
      return;
    }

    // Handle regular search results
    if ('artist' in result) {
      setCurrentArtist(result.artist);
      const slug = artistNameToSlug(result.artist.name);
      
      switch (result.type) {
        case 'artist':
          router.push(`/artist/${slug}`);
          break;
        case 'album':
          const albumIndex = result.artist.albums.indexOf(result.album);
          router.push(`/artist/${slug}?album=${albumIndex}`);
          break;
        case 'song':
        case 'lyrics':
          const songAlbumIndex = result.artist.albums.indexOf(result.album);
          router.push(`/artist/${slug}?album=${songAlbumIndex}`);
          break;
      }
    }
  }, [query, addToSearchHistory, artists, setCurrentArtist, router]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const currentResults = searchMode === 'ai' ? smartResults : results;
    const maxIndex = currentResults.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < maxIndex ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : maxIndex);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && currentResults[selectedIndex]) {
          handleResultSelect(currentResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, searchMode, smartResults, results, selectedIndex, handleResultSelect]);

  // Render result item
  const renderResultItem = useCallback((result: SearchResult | any, index: number) => {
    const isSelected = index === selectedIndex;
    const isAIResult = 'confidence' in result;

    if (isAIResult) {
      return (
        <div
          key={index}
          className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
            isSelected ? 'bg-purple-500/20' : 'hover:bg-gray-800/50'
          }`}
          onClick={() => handleResultSelect(result)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">{result.name}</p>
              <p className="text-sm text-gray-400">{result.reason}</p>
            </div>
          </div>
          <Badge variant="success" size="sm">
            {result.confidence}%
          </Badge>
        </div>
      );
    }

    // Regular search result
    const getResultIcon = () => {
      switch (result.type) {
        case 'artist': return <User className="w-4 h-4 text-blue-400" />;
        case 'album': return <Disc3 className="w-4 h-4 text-green-400" />;
        case 'song': return <Music className="w-4 h-4 text-purple-400" />;
        case 'lyrics': return <Search className="w-4 h-4 text-orange-400" />;
        default: return <Music className="w-4 h-4 text-gray-400" />;
      }
    };

    return (
      <div
        key={`${result.type}-${index}`}
        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-500/20' : 'hover:bg-gray-800/50'
        }`}
        onClick={() => handleResultSelect(result)}
      >
        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
          {getResultIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-white truncate">
              {result.type === 'artist' ? result.artist.name : 
               result.type === 'album' ? result.album.title :
               result.type === 'song' ? result.song.title :
               `"${result.song.title}" lyrics`}
            </p>
            <Badge variant="default" size="sm" className="flex-shrink-0">
              {result.type}
            </Badge>
          </div>
          <p className="text-sm text-gray-400 truncate">
            {result.type !== 'artist' && 
              `${result.artist.name}${result.type !== 'album' ? ` • ${result.album.title}` : ''}`}
          </p>
        </div>
      </div>
    );
  }, [selectedIndex, handleResultSelect]);

  const currentResults = searchMode === 'ai' ? smartResults : results;
  const hasResults = currentResults.length > 0;
  const showHistory = !query.trim() && searchHistory.length > 0;

  return (
    <div className={`relative ${className}`} ref={resultsRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={searchMode === 'ai' 
            ? "AI search: 'upbeat songs for working out'" 
            : "Search artists, songs, albums... (Ctrl+K)"
          }
          icon={<Search className="w-4 h-4" />}
          className="pr-20"
        />
        
        {/* Mode toggle */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            onClick={() => setSearchMode(searchMode === 'ai' ? 'regular' : 'ai')}
            className={`p-1.5 rounded-lg transition-colors ${
              searchMode === 'ai' 
                ? 'bg-purple-500/20 text-purple-400' 
                : 'text-gray-400 hover:text-purple-400'
            }`}
            title={`Switch to ${searchMode === 'ai' ? 'regular' : 'AI'} search`}
          >
            {searchMode === 'ai' ? 
              <BrainCircuit className="w-4 h-4" /> : 
              <Sparkles className="w-4 h-4" />
            }
          </button>
          
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setSmartResults([]);
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50">
          {loading && <SearchSkeleton />}
          
          {!loading && showHistory && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent Searches
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearchHistory}
                  className="text-gray-400 hover:text-white"
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-1">
                {searchHistory.slice(0, 5).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(item);
                      inputRef.current?.focus();
                    }}
                    className="w-full text-left p-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {!loading && hasResults && (
            <div>
              {searchMode === 'ai' && (
                <div className="p-3 bg-purple-900/20 border-b border-purple-700/30">
                  <div className="flex items-center gap-2 text-sm text-purple-200">
                    <Sparkles className="w-4 h-4" />
                    <span>AI-powered results</span>
                  </div>
                </div>
              )}
              
              <div className="max-h-80 overflow-y-auto">
                {currentResults.map((result, index) => renderResultItem(result, index))}
              </div>
            </div>
          )}
          
          {!loading && !hasResults && query.trim() && (
            <div className="p-6 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">
                Try {searchMode === 'ai' ? 'regular' : 'AI'} search or different keywords
              </p>
            </div>
          )}
          
          {/* Footer */}
          <div className="p-3 border-t border-gray-700/50 bg-gray-800/30">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                {searchMode === 'ai' ? 'AI Search' : 'Regular Search'} • 
                {currentResults.length} result{currentResults.length !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">↑↓</kbd>
                <span>navigate</span>
                <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">↵</kbd>
                <span>select</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};