import type { PageHeaderProps } from "@/types/components";

export const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 fade-in">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {actions && (
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {actions}
                </div>
            )}
        </div>
    );
};
