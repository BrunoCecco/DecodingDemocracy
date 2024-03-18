'use client';

import { useEffect, useState } from 'react';
import Button from '@/app/components/button';
import SearchBar from '@/app/components/searchbar';
import { getResponses, searchSimilarResponses } from '@/app/api';
import React from 'react';
import { IResponse } from '@/app/api/interfaces';
import Responses from '@/app/components/responses';

export default function SimilarResponses({
  questionid,
}: {
  questionid: string;
}) {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [filteredResponses, setFilteredResponses] = useState<IResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (searchTerm.trim().length > 0) {
      getSearchResults();
    }
  }, [offset, limit]);

  const getSearchResults = async (reset = false) => {
    const newOffset = reset ? 0 : offset;
    if (searchTerm.trim().length > 0) {
      setLoading(true);
      // if searchTerm has question marks, it will confuse the request arguments so we remove them
      var term = searchTerm.replace(/\?/g, '');
      const responsesData: any = await searchSimilarResponses(
        questionid,
        term,
        newOffset,
        limit
      );
      setLoading(false);
      setFilteredResponses(responsesData);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 items-center justify-center">
      <SearchBar
        placeholder="Enter a search term to find similar responses..."
        value={searchTerm}
        onChange={(e: any) => setSearchTerm(e.target.value)}
        onSearch={() => getSearchResults(true)}
      />
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {filteredResponses?.length > 0 && (
        <Responses responses={filteredResponses} />
      )}
      {filteredResponses?.length === 0 && !loading && (
        <div className="text-center text-gray-500">
          No similar responses found
        </div>
      )}

      <div className="flex justify-center items-center w-full gap-4">
        <Button onClick={() => setOffset(Math.max(offset - limit, 0))}>
          Previous
        </Button>
        <Button onClick={() => setOffset(offset + limit)}>Next</Button>
      </div>
    </div>
  );
}
