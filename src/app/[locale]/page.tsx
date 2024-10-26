import {redirect} from 'next/navigation';

export default function IndexPage(
  { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
  redirect(`${locale}/login`);
}