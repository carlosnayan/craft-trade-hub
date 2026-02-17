import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RouterProvider, createBrowserRouter, redirect } from "react-router";
import { Index } from "./pages/Index";

const router = createBrowserRouter([
	{ path: "/", index: true, Component: Index },
	{ path: "*", loader: redirect.bind(null, "/") },
]);

const App = () => (
	<TooltipProvider>
		<Toaster />
		<Sonner />
		<RouterProvider router={router} />
	</TooltipProvider>
);

export default App;
