
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navigation />
			<main className="flex-grow flex flex-col">
				{children}
			</main>
			<Footer />
		</>
	);
}
