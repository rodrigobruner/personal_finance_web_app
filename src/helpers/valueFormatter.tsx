// valueFormatter.tsx
type ValueFormatterProps = {
    value: number | null;
    locale: string;
    currency: string;
};

export function valueFormatter(props: ValueFormatterProps): string {
    return props.value !== null ? new Intl.NumberFormat(props.locale, { style: 'currency', currency: props.currency }).format(props.value).toString() : 'N/A';
}