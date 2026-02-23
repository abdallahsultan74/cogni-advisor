import ReactQueryProvider from "./_components/react-query.provider";
import NextAuthProvider from "./_components/next-auth.provider";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function SharedProviders({ children }: { children: React.ReactNode }) {
    return (
        <ReactQueryProvider>
            {/* React Query DevTools */}
            <ReactQueryDevtools />
            <NextAuthProvider>
                {children}
            </NextAuthProvider>
        </ReactQueryProvider>
    )
}