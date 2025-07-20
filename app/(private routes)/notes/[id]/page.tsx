import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNoteByIdServer } from '@/lib/api/serverApi';
import NoteDetailsClient from './NoteDetails.client';

interface PageProps {

  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Note details – NoteHub',
};

export default async function NoteDetailsPage({ params }: PageProps) {

  const { id } = await params;


  if (!id) {
    return notFound();
  }

  const qc = new QueryClient();

  try {

    const note = await fetchNoteByIdServer(id);

    qc.setQueryData(['note', id], note);
  } catch (err: unknown) {
   
    let status: number | undefined;
    if (err && typeof err === 'object' && 'status' in err) {
      status = (err as { status?: number }).status;
    }

    if (status === 401) {

      redirect('/sign-in');
    }
    if (status === 404) {

      return notFound();
    }

    console.error('Note load error (page):', err);
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
}