import { DocsSidebar } from "@/components/docs-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TableOfContents } from "@/components/table-of-contents";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="border-b">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr_200px] md:gap-6 lg:grid-cols-[240px_1fr_280px]">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <ScrollArea className="py-6 pr-4 lg:py-8">
            <DocsSidebar />
          </ScrollArea>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
          <div className="mx-auto w-full min-w-0">{children}</div>
          <div className="hidden text-sm xl:block">
            <div className="sticky top-16 -mt-10 pt-4">
              <ScrollArea className="pb-10">
                <TableOfContents />
              </ScrollArea>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
