## AI-enhanced MusicApp - Next.js 15, App Router, TypeScript, Tailwind CSS, MongoDB
MusicApp with it's own database of artists. Database very limited - generating using Claude.ai (limits).

Integrated OpenAI for all of it's AI Features:
1) AI Search 
    - Find songs by genre, mood, energy. Supports queries like "upbeat songs for workout" etc.
2) AI Music Recommendation 
    - Works pretty much the same but the result format is different.
3) AI Playlist Generator 
    - Supports queries like "chill study session with ambient and lo-fi tracks", "workout motivation with high-energy electronic music" etc.
    - Generates a playlist. (If deployed, it could serve as a Spotify Web API data source for creating playlists.)
    - Downloadable text file or share functionality.
4) Discover music by mood 
    - AI generated suggestions of interprets, their albums and songs with reasoning.
5) AI Chat Bot 
    - Interacts with user and answers question about music. Recommends artists from MusicApp's database only.
    - Preserves history through localStorage.
6) Artist Compatibility Matcher
    - AI generated comparison of two artists. Provides similarities and differences. 
7) AI Artist Insights
    - Provides AI insights about given artist on their page.
    - Opens a modal with general overview of the artist, carrer highlights, musical influences and fun facts.

Other features:
1) Regular Search
    - Provides ability to search by artist, album, song and matched lyrics if available.
2) Smart Dashboard 
    - Dummy data for now. Could be used if user logins are added and some tracking.
3) Performance Monitor 
    - Just a visual representation filled with dummy data.
4) Accessibility features 
    - Added high contrast, large text and reduced motion options.
5) Skeleton components
    - Used only in the Smart Dashboard to showcase.
6) Toast notifications
    - Only added to sharing fuctionality in the AI Playlist Generator