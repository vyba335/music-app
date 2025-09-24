export function artistNameToSlug(artistName: string): string {
    return artistName
        .toLowerCase()
        .trim()
        .replace(/-/g, "|||DASH|||")
        .replace(/\s+/g, "-")
        .replace(/\|\|\|DASH\|\|\|/g, "--")
        .replace(/^-+|-+$/g, "")
        .replace(/-{3,}/g, "--");
}

export function slugToArtistName(slug: string): string {
    return slug
        .toLowerCase()
        .replace(/--/g, "|||DASH|||")
        .replace(/-/g, " ")
        .replace(/\|\|\|DASH\|\|\|/g, "-")
        .split(" ")
        .map((word) => {
            if (word.length === 0) return word;

            if (word.includes("-")) {
                return word
                    .split("-")
                    .map(
                        (part) =>
                            part.charAt(0).toUpperCase() +
                            part.slice(1).toLowerCase()
                    )
                    .join("-");
            }

            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ")
        .trim();
}
