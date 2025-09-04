import { ObjectId } from 'mongodb';

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

export type {
  Song,
  Album,
  ArtistDocument,
  Artist,
  CreateArtistInput,
  UpdateArtistInput,
  CreateSongInput,
  CreateAlbumInput
};