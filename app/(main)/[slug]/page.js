"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Inter } from "next/font/google";
import DOMPurify from "dompurify";

const inter = Inter({ subsets: ["latin"] });

export default function DynamicPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPage() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/pages/${slug}`
        );
        if (!response.ok) {
          throw new Error("Page not found");
        }
        const data = await response.json();
        setPage(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Page not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(page.content),
        }}
      />
    </div>
  );
}
