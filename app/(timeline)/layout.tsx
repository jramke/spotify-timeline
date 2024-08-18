import Link from "next/link";
import Github from "@/components/github-logo";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{/* No navigation */}
			<main className="flex-grow flex flex-col">
				{children}
			</main>
			{/* No footer */}
		</>
	);
}
