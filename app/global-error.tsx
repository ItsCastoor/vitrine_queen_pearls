"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FDFBF7",
          color: "#1B1B1B",
          fontFamily: "Georgia, 'Times New Roman', serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <p
            style={{
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              color: "#C9A66B",
            }}
          >
            Queen Pearls
          </p>
          <h1 style={{ fontSize: "2.5rem", margin: "1rem 0", fontWeight: 400 }}>
            Une ombre sur la perle
          </h1>
          <p style={{ color: "#555", lineHeight: 1.6 }}>
            Une erreur inattendue est survenue. Vous pouvez réessayer ou revenir
            à l&apos;accueil.
          </p>
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                cursor: "pointer",
                borderRadius: "9999px",
                border: "1px solid #C9A66B",
                backgroundColor: "#C9A66B",
                color: "#fff",
                padding: "0.6rem 1.6rem",
                fontSize: "0.95rem",
              }}
            >
              Réessayer
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error rend son propre <html> hors du routeur : un <a> natif est requis */}
            <a
              href="/"
              style={{
                borderRadius: "9999px",
                border: "1px solid #C9A66B",
                color: "#A8854A",
                padding: "0.6rem 1.6rem",
                fontSize: "0.95rem",
                textDecoration: "none",
              }}
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
