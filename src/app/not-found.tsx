import ActionButton from "@/components/ui/ActionButton";

export const metadata = { title: "Page not found — InvoicesNest" };

export default function NotFoundPage() {
  return (
    <main className="utility-page-wrap">
      <div className="utility-page-content">
        <p>404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for is no longer here.</p>
        <ActionButton href="/">Back to home</ActionButton>
      </div>
    </main>
  );
}
