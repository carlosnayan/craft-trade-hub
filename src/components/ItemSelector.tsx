import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { BaseItem, searchBaseItems } from "@/lib/base-items";
import { CATEGORY_TREE, CategoryNode } from "@/lib/categories";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useLanguage } from "@/stores/language";
import { useShallow } from "zustand/shallow";

interface Props {
	selectedItem: BaseItem | null;
	customItemId: string;
	onSelectItem: (item: BaseItem | null) => void;
	onCustomIdChange: (id: string) => void;
}

export function ItemSelector({
	selectedItem,
	customItemId,
	onSelectItem,
	onCustomIdChange,
}: Props) {
	const [t, lang] = useLanguage(useShallow((s) => [s.t, s.lang]));
	const [search, setSearch] = useState("");
	const [open, setOpen] = useState(false);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null,
	);
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set(),
	);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node))
				setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const toggleCategory = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const newExpanded = new Set(expandedCategories);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		setExpandedCategories(newExpanded);
	};

	const filtered = useMemo(() => {
		const items = searchBaseItems(
			search,
			lang,
			selectedCategoryId || undefined,
		);
		return items.slice(0, 50);
	}, [search, selectedCategoryId, lang]);

	useImagePreloader(filtered);

	const displayValue = selectedItem
		? selectedItem.name[lang]
		: customItemId || "";

	const renderCategory = (node: CategoryNode, depth = 0) => {
		const isExpanded = expandedCategories.has(node.id);
		const isSelected = selectedCategoryId === node.id;
		const hasChildren = node.children && node.children.length > 0;

		return (
			<div key={node.id}>
				<div
					className={`flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-secondary transition-colors ${
						isSelected ? "bg-secondary font-medium" : ""
					}`}
					style={{ paddingLeft: `${depth * 12 + 8}px` }}
					onClick={(e) => {
						if (hasChildren) {
							toggleCategory(node.id, e);
						} else {
							setSelectedCategoryId(
								node.id === selectedCategoryId ? null : node.id,
							);
						}
					}}
				>
					{hasChildren ? (
						<div className="mr-1 text-muted-foreground">
							{isExpanded ? (
								<ChevronDown className="h-4 w-4" />
							) : (
								<ChevronRight className="h-4 w-4" />
							)}
						</div>
					) : (
						<span className="w-5" />
					)}
					<span className="truncate">{node.name[lang]}</span>
				</div>
				{hasChildren && isExpanded && (
					<div>
						{node.children!.map((child) => renderCategory(child, depth + 1))}
					</div>
				)}
			</div>
		);
	};

	return (
		<div ref={ref} className="relative w-full">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<input
					type="text"
					placeholder={t("searchItem")}
					value={open ? search : displayValue}
					onChange={(e) => {
						setSearch(e.target.value);
						if (!open) setOpen(true);
					}}
					onFocus={() => {
						setOpen(true);
						setSearch("");
					}}
					className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
				/>
			</div>

			{open && (
				<div className="absolute z-50 mt-1 w-full sm:min-w-[600px] rounded-lg border border-border bg-popover shadow-xl animate-fade-in max-h-[500px] flex flex-col sm:flex-row overflow-hidden">
					{/* Categories Sidebar */}
					<div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-border overflow-y-auto bg-card/50 max-h-40 sm:max-h-full">
						<div className="p-2 border-b border-border bg-card sticky top-0 z-10">
							<button
								onClick={() => setSelectedCategoryId(null)}
								className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-secondary transition-colors ${
									!selectedCategoryId ? "bg-secondary font-medium" : ""
								}`}
							>
								All Categories
							</button>
						</div>
						<div className="py-1">
							{CATEGORY_TREE.map((node) => renderCategory(node))}
						</div>
					</div>

					{/* Items List */}
					<div className="flex-1 flex flex-col overflow-hidden max-h-60 sm:max-h-full">
						{/* Custom ID input */}
						<div className="border-b border-border p-2 bg-card">
							<input
								type="text"
								placeholder={t("customItemId")}
								value={customItemId}
								onChange={(e) => {
									onCustomIdChange(e.target.value.toUpperCase());
									onSelectItem(null);
								}}
								className="w-full rounded bg-secondary px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
							/>
						</div>

						<div className="flex-1 overflow-y-auto p-1">
							{filtered.map((item) => (
								<button
									key={item.id}
									onClick={() => {
										onSelectItem(item);
										onCustomIdChange("");
										setOpen(false);
									}}
									className={`flex w-full items-center justify-between px-3 py-2 text-sm rounded hover:bg-row-hover transition-colors ${
										selectedItem?.id === item.id ? "bg-secondary" : ""
									}`}
								>
									<span className="text-foreground text-left mr-2">
										{item.name[lang]}
									</span>
								</button>
							))}
							{filtered.length === 0 && (
								<div className="px-3 py-8 text-center text-sm text-muted-foreground">
									{t("noData")}
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
