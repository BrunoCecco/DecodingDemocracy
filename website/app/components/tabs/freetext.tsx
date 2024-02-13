'use client';

import { useEffect, useState } from 'react';
import Button from '@/app/components/button';
import SearchBar from '@/app/components/searchbar';
import { getResponses, searchResponses } from '@/app/api';
import Responses from '@/app/components/responses';
import React from 'react';
import { IResponse } from '@/app/api/interfaces';

export default function FreeText({ questionid }: { questionid: string }) {
  const [responses, setResponses] = useState<IResponse[]>([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [filteredResponses, setFilteredResponses] = useState<IResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      if (searchTerm.trim().length > 0) {
        getSearchResults();
      } else {
        const responsesData: any = await getResponses(
          questionid,
          offset,
          limit
        );
        setResponses(responsesData);
        setFilteredResponses(responsesData);
      }
    };
    fetchData();
  }, [offset, limit]);

  const getSearchResults = async () => {
    if (searchTerm === '') {
      setFilteredResponses(responses);
    } else {
      // if searchTerm has question marks, it will confuse the request arguments so we remove them
      var term = searchTerm.replace(/\?/g, '');
      const responsesData: any = await searchResponses(
        questionid,
        searchTerm,
        offset,
        limit
      );
      setFilteredResponses(responsesData);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 items-center justify-center">
      <SearchBar
        placeholder="Search responses..."
        value={searchTerm}
        onChange={(e: any) => setSearchTerm(e.target.value)}
        onSearch={getSearchResults}
      />
      {filteredResponses?.length > 0 && (
        <Responses responses={filteredResponses} />
      )}
      {filteredResponses?.length === 0 && (
        <div className="text-center text-gray-500">No responses found</div>
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
