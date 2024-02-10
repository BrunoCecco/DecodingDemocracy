import React from 'react';

interface IResponse {
  id: number;
  question_id: string;
  responder_id: number;
  response: string;
  consultation_id: number;
  sentiment_value?: number;
  topic_id: string;
  similarity_score?: number;
}

const Response = ({ response }: { response: IResponse }) => {
  return (
    <tr className="text-sm">
      <td className="text-left">{response.id}</td>
      <td className="text-left">{response.responder_id}</td>
      <td className="text-left">{response.response}</td>
      <td className="text-left">{response.sentiment_value || 'n/a'}</td>
      <td className="text-left">{response.topic_id?.split('-')[2] || 'n/a'}</td>
    </tr>
  );
};

const Responses = ({ responses }: { responses: IResponse[] }) => {
  return (
    <table className="w-full border-separate border-spacing-2 table-fixed">
      <thead>
        <tr className="border-b border-black">
          <th className="text-left w-[10%]">No.</th>
          <th className="text-left w-[10%]">Responder</th>
          <th className="text-left w-[50%]">Response</th>
          <th className="text-left w-[15%]">Sentiment</th>
          <th className="text-left w-[15%]">Primary Topic</th>
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

export default Responses;
