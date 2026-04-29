import SideBar from "./_components/side-bar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-row h-screen w-full overflow-hidden">

            {/* القسم الأيسر: الـ Sidebar (يأخذ نصف الشاشة) */}
            <div className="w-1/2 h-full">
                <SideBar />
            </div>

            {/* القسم الأيمن: المحتوى (Login / Register) */}
            <main className="w-1/2 h-full flex items-center justify-center bg-white">
                {children}
            </main>

        </div>
    )
}