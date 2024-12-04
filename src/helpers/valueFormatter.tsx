// valueFormatter.tsx
type ValueFormatterProps = {
    value: number | null;
    locale: string;
    currency: string;
};

// Format the value as a currency
export function valueFormatter(props: ValueFormatterProps): string {
    // Check if the value is not null and format it as a currency
    return props.value !== null ? new Intl.NumberFormat(props.locale, { style: 'currency', currency: props.currency }).format(props.value).toString() : 'N/A';
}