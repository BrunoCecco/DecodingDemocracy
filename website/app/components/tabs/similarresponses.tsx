'use client';

import { useEffect, useState } from 'react';
import Button from '@/app/components/button';
import SearchBar from '@/app/components/searchbar';
import { getResponses, searchSimilarResponses } from '@/app/api';
import React from 'react';
import { IResponse } from '@/app/api/interfaces';

const Response = ({ response }: { response: IResponse }) => {
  return (
    <tr className="text-sm">
      <td>{response.id}</td>
      <td>{response.response}</td>
      <td>{response.similarity_score?.toFixed(2)}</td>
    </tr>
  );
};

const Responses = ({ responses }: { responses: IResponse[] }) => {
  console.log(responses);
  return (
    <table className="w-full border-separate border-spacing-2 table-fixed">
      <thead>
        <tr className="border-b border-black">
          <th className="text-left w-[15%]">Response ID</th>
          <th className="text-left w-[70%]">Ressponse</th>
          <th className="text-left w-[15%]">Similarity Score</th>
        </tr>
      </thead>
      <tbody>
        {responses?.map((response: IResponse, i) => {
          return <Response key={i} response={response} />;
        })}
      </tbody>
    </table>
  );
};

export default function SimilarResponses({
  questionid,
}: {
  questionid: string;
}) {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [filteredResponses, setFilteredResponses] = useState<IResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (searchTerm.trim().length > 0) {
      getSearchResults();
    }
  }, [offset, limit]);

  const getSearchResults = async (reset = false) => {
    const newOffset = reset ? 0 : offset;
    if (searchTerm.trim().length > 0) {
      const responsesData: any = await searchSimilarResponses(
        questionid,
        searchTerm,
        newOffset,
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
        onSearch={() => getSearchResults(true)}
      />
      {filteredResponses?.length > 0 && (
        <Responses responses={filteredResponses} />
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
