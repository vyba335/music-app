import { ObjectId } from "mongodb";

/**
 * Represents a song within an album
 */
interface Song {
    title: string;
    length: string;
    lyrics: string;
}

/**
 * Represents an album with its songs
 */
interface Album {
    title: string;
    released: number;
    cover: string;
    songs: Song[];
}

interface ArtistOid {
    _id: { $oid: string };
    name: string;
    birthday: string;
    nationality: string;
    image: string;
    albums: Album[];
}

/**
 * Represents the MongoDB document structure for an artist
 */
interface ArtistDocument {
    _id: ObjectId;
    name: string;
    birthday: string;
    nationality: string;
    image: string;
    albums: Album[];
}

/**
 * Alternative interface without MongoDB ObjectId for frontend/API use
 */
interface Artist {
    _id: string;
    name: string;
    birthday: string;
    nationality: string;
    image: string;
    albums: Album[];
}

interface ArtistResult {
    type: "artist";
    artist: ArtistOid;
}

interface SongResult {
    type: "song";
    artist: ArtistOid;
    album: Album;
    song: Song;
}

interface AlbumResult {
    type: "album";
    artist: ArtistOid;
    album: Album;
}

interface LyricsResult {
    type: "lyrics";
    artist: ArtistOid;
    album: Album;
    song: Song;
    matchedText: string;
}

type SearchResult = ArtistResult | SongResult | AlbumResult | LyricsResult;

/**
 * Type for creating a new artist (without _id)
 */
interface CreateArtistInput {
    name: string;
    birthday: string;
    nationality: string;
    image: string;
    albums: Album[];
}

/**
 * Type for updating an artist (all fields optional except _id)
 */
interface UpdateArtistInput {
    _id: string | ObjectId;
    name?: string;
    birthday?: string;
    nationality?: string;
    image?: string;
    albums?: Album[];
}

/**
 * Type for creating a new song
 */
interface CreateSongInput {
    title: string;
    length: string;
    lyrics: string;
}

/**
 * Type for creating a new album
 */
interface CreateAlbumInput {
    title: string;
    released: number;
    cover: string;
    songs: CreateSongInput[];
}

export interface RecommendationRequest {
    preferences: string;
    mood?: string;
    artists?: Artist[];
}

export interface RecommendationResponse {
    recommendations: {
        artist: string;
        reason: string;
        confidence: number;
    }[];
    explanation: string;
}

export interface SmartSearchRequest {
    query: string;
    artists: Artist[];
}

export interface SmartSearchResult {
    type: "artist" | "song" | "album" | "mood";
    matches: any[];
    interpretation: string;
    filters: {
        mood?: string;
        genre?: string;
        energy?: string;
        year?: string;
    };
}

export interface ArtistInsight {
    musicalDNA: string;
    careerHighlights: string[];
    hiddenGems: string[];
    influences: string[];
    funFacts: string[];
}

export interface SongAnalysis {
    sentiment: "positive" | "negative" | "neutral" | "mixed";
    themes: string[];
    musicalStyle: string;
    lyricalMeaning?: string;
    songStory: string;
    emotionalImpact: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatContext {
  messages: ChatMessage[];
  artistDatabase: Artist[];
}

export interface ChatResponse {
    message: string;
    suggestions?: string[];
    relatedArtists?: string[];
    actionType?: "recommendation" | "search" | "info" | "general";
}

export type {
    Song,
    Album,
    ArtistDocument,
    ArtistOid,
    Artist,
    ArtistResult,
    SongResult,
    AlbumResult,
    LyricsResult,
    SearchResult,
    CreateArtistInput,
    UpdateArtistInput,
    CreateSongInput,
    CreateAlbumInput,
};
