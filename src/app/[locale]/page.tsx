import {redirect, useRouter} from 'next/navigation';

// This is the root page of the app. It redirects to the login page.
export default function IndexPage(
  { params: { locale } }: Readonly<{ params: { locale: string } }>
) {
  redirect(`${locale}/login`);
}