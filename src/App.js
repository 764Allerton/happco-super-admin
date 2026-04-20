import { Suspense, lazy, useEffect } from "react";
import ErrorBoundary from "ErrorBoundary";
import LazyLoading from "Utils/LazyLoading";
import Toast from "Utils/Toast";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet";

function App() {
  const AppRouter = lazy(() => import("Routes/Index"));

  useEffect(() => {
    const handleOnline = () => {
      Toast("s", "Internet connection restored!", "top-center");
    };
    const handleOffline = () => {
      Toast("w", "Internet connection lost!", "top-center");
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>HTP : Administrator</title>
        <link rel="canonical" href="https://main.d2u95r6ohmyw9p.amplifyapp.com/static/media/logo.00ccde119c31d226347b.png" />
        <meta property="og:image" content="https://main.d2u95r6ohmyw9p.amplifyapp.com/static/media/logo.00ccde119c31d226347b.png" />
        <meta name="description" content="HTP : Administrator" />
      </Helmet>
      <HelmetProvider>
        <Suspense fallback={<LazyLoading />}>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </Suspense>
      </HelmetProvider>
    </>
  );
}

export default App;
