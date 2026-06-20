import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";


import appCss from "../styles.css?url";
import { CartProvider } from "@/lib/cart-store";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/component/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-foreground">404</h1>
        <h2 className="mt-4 text-xl text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-charcoal px-6 py-3 text-[11px] tracking-luxury uppercase text-charcoal hover:bg-charcoal hover:text-ivory transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Please try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center bg-charcoal px-6 py-3 text-[11px] tracking-luxury uppercase text-ivory hover:bg-gold transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "IRAYA — Indian Luxury, Quietly Made" },
      { name: "description", content: "IRAYA — an Indian luxury maison of heritage textiles, jewellery and objects." },
      { name: "author", content: "IRAYA" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "IRAYA — Indian Luxury, Quietly Made" },
      { name: "twitter:title", content: "IRAYA — Indian Luxury, Quietly Made" },
      { property: "og:description", content: "IRAYA — an Indian luxury maison of heritage textiles, jewellery and objects." },
      { name: "twitter:description", content: "IRAYA — an Indian luxury maison of heritage textiles, jewellery and objects." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.iraya.in" },
      { property: "og:site_name", content: "IRAYA" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.png" },
      { rel: "canonical", href: "https://www.iraya.in" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Inter:wght@100..900&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "IRAYA",
    "url": "https://www.iraya.in",
    "logo": "https://www.iraya.in/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "customer service",
      "email": "support@iraya.in"
    }
  };

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-charcoal focus:text-ivory focus:px-4 focus:py-2 focus:border focus:border-gold"
        >
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AuthSync() {
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);
  return null;
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <AuthSync />
        <main id="main-content">
          <Outlet />
        </main>
        <Toaster position="bottom-right" />
        <HotToaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              color: "#FAF8F5",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              borderRadius: "2px",
            },
          }}
        />
        <Analytics />
      </CartProvider>
    </QueryClientProvider>
  );
}

